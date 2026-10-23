import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Users,
  Lock,
  Crown,
  Shield,
  Search,
  Sparkles,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { WorkspaceMember, WorkspaceMessage, DirectMessage, WORKSPACE_ROLES_CONFIG } from '../types';
import { maskAccessCode } from '../utils/securityMask';

interface DualMessagingBoxProps {
  currentMember: WorkspaceMember;
  members: WorkspaceMember[];
  groupMessages: WorkspaceMessage[];
  directMessages: DirectMessage[];
  onSendGroupMessage: (content: string) => Promise<boolean>;
  onSendDirectMessage: (recipientId: string, content: string) => Promise<boolean>;
}

export const DualMessagingBox: React.FC<DualMessagingBoxProps> = ({
  currentMember,
  members,
  groupMessages,
  directMessages,
  onSendGroupMessage,
  onSendDirectMessage,
}) => {
  const [activeMode, setActiveMode] = useState<'group' | 'dm'>('group');
  const [selectedRecipientId, setSelectedRecipientId] = useState<string>('');
  const [inputText, setInputText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [memberSearch, setMemberSearch] = useState('');
  const chatScrollRef = useRef<HTMLDivElement>(null);

  // Auto-scroll chat to bottom when new messages arrive
  useEffect(() => {
    if (chatScrollRef.current) {
      chatScrollRef.current.scrollTop = chatScrollRef.current.scrollHeight;
    }
  }, [groupMessages, directMessages, activeMode, selectedRecipientId]);

  // Other members available for direct messaging (exclude self)
  const dmEligibleMembers = members.filter((m) => m.id !== currentMember.id && m.code !== currentMember.code);

  const filteredDMMembers = dmEligibleMembers.filter((m) =>
    m.name.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.position.toLowerCase().includes(memberSearch.toLowerCase()) ||
    m.role.toLowerCase().includes(memberSearch.toLowerCase())
  );

  // Set default recipient if none selected
  useEffect(() => {
    if (activeMode === 'dm' && !selectedRecipientId && dmEligibleMembers.length > 0) {
      // Prefer CEO as default DM recipient
      const ceo = dmEligibleMembers.find((m) => m.role === 'ceo' || m.code === '30072012');
      setSelectedRecipientId(ceo ? ceo.id : dmEligibleMembers[0].id);
    }
  }, [activeMode, dmEligibleMembers, selectedRecipientId]);

  const selectedRecipient = dmEligibleMembers.find((m) => m.id === selectedRecipientId);

  // Filter DMs for the currently selected conversation
  const activeConversationDms = directMessages.filter(
    (dm) =>
      (dm.senderId === currentMember.id && dm.recipientId === selectedRecipientId) ||
      (dm.senderId === selectedRecipientId && dm.recipientId === currentMember.id)
  );

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputText.trim()) return;

    setIsSending(true);
    try {
      if (activeMode === 'group') {
        const ok = await onSendGroupMessage(inputText.trim());
        if (ok) setInputText('');
      } else {
        if (!selectedRecipientId) return;
        const ok = await onSendDirectMessage(selectedRecipientId, inputText.trim());
        if (ok) setInputText('');
      }
    } finally {
      setIsSending(false);
    }
  };

  const getRoleBadge = (roleStr: string) => {
    const config = WORKSPACE_ROLES_CONFIG.find((c) => c.role === roleStr);
    if (config) {
      return (
        <span className={`px-2 py-0.2 rounded-full text-[10px] font-bold border ${config.badgeColor}`}>
          {config.title}
        </span>
      );
    }
    return (
      <span className="px-2 py-0.2 rounded-full text-[10px] font-bold bg-[#1d2a3e] text-[#9db0c8] border border-[#1d2a3e]">
        {roleStr}
      </span>
    );
  };

  return (
    <div className="bg-[#0e1726] border-2 border-[#1d2a3e] rounded-2xl overflow-hidden shadow-2xl flex flex-col h-[650px] animate-fade-in">
      {/* Top Header Strip with Mode Switcher */}
      <div className="p-3.5 sm:p-4 bg-[#0b1220] border-b border-[#1d2a3e] flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className="flex rounded-xl bg-[#070b14] p-1 border border-[#1d2a3e]">
            <button
              type="button"
              onClick={() => setActiveMode('group')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeMode === 'group'
                  ? 'bg-[#3da9fc] text-[#070b14] shadow-sm'
                  : 'text-[#9db0c8] hover:text-white'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              <span>Team Group Chat</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/20">
                {groupMessages.length}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setActiveMode('dm')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition cursor-pointer ${
                activeMode === 'dm'
                  ? 'bg-[#3da9fc] text-[#070b14] shadow-sm'
                  : 'text-[#9db0c8] hover:text-white'
              }`}
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Personal Direct Messages (DM)</span>
              <span className="px-1.5 py-0.2 text-[10px] rounded-full bg-black/20">
                {directMessages.length}
              </span>
            </button>
          </div>
        </div>

        <div className="text-right hidden sm:block">
          <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1 justify-end">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            Live Dual Messaging
          </span>
          <span className="text-[11px] text-[#9db0c8]">
            Logged in: <strong className="text-white">{currentMember.name}</strong> ({currentMember.position})
          </span>
        </div>
      </div>

      {/* Main Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* DM Member Selector Drawer (Visible in DM mode) */}
        {activeMode === 'dm' && (
          <div className="w-64 sm:w-72 bg-[#0b1220] border-r border-[#1d2a3e] flex flex-col flex-shrink-0">
            {/* Search Input */}
            <div className="p-3 border-b border-[#1d2a3e]">
              <div className="relative">
                <input
                  type="text"
                  value={memberSearch}
                  onChange={(e) => setMemberSearch(e.target.value)}
                  placeholder="Filter team members..."
                  className="w-full pl-8 pr-3 py-1.5 bg-[#070b14] border border-[#1d2a3e] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:border-[#3da9fc] focus:outline-none"
                />
                <Search className="w-3.5 h-3.5 text-[#9db0c8] absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Members List for 1-on-1 DM */}
            <div className="flex-1 overflow-y-auto divide-y divide-[#1d2a3e]/50">
              {filteredDMMembers.length === 0 ? (
                <div className="p-4 text-center text-xs text-[#9db0c8]">
                  No members found.
                </div>
              ) : (
                filteredDMMembers.map((mem) => {
                  const isSelected = mem.id === selectedRecipientId;
                  const isCeo = mem.role === 'ceo' || mem.code === '30072012';

                  // Count messages in this conversation
                  const convoCount = directMessages.filter(
                    (dm) =>
                      (dm.senderId === currentMember.id && dm.recipientId === mem.id) ||
                      (dm.senderId === mem.id && dm.recipientId === currentMember.id)
                  ).length;

                  return (
                    <button
                      key={mem.id}
                      type="button"
                      onClick={() => setSelectedRecipientId(mem.id)}
                      className={`w-full text-left p-3 transition flex items-center justify-between gap-2 cursor-pointer ${
                        isSelected
                          ? 'bg-[#111c2e] border-l-4 border-l-[#3da9fc]'
                          : 'hover:bg-[#0e1726]'
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5 mb-0.5">
                          {isCeo && <Crown className="w-3 h-3 text-amber-400 fill-amber-400/30 flex-shrink-0" />}
                          <span className={`text-xs font-bold truncate ${isSelected ? 'text-[#59e3ff]' : 'text-white'}`}>
                            {mem.name}
                          </span>
                        </div>
                        <div className="text-[10px] text-[#9db0c8] truncate">
                          {mem.position}
                        </div>
                      </div>

                      {convoCount > 0 && (
                        <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#070b14] border border-[#1d2a3e] text-[#59e3ff] font-mono">
                          {convoCount}
                        </span>
                      )}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        )}

        {/* Chat Feed */}
        <div className="flex-1 flex flex-col bg-[#070b14]/70">
          {/* DM Active Recipient Header (when in DM mode) */}
          {activeMode === 'dm' && selectedRecipient && (
            <div className="p-3 bg-[#0e1726] border-b border-[#1d2a3e] flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-emerald-400" />
                <div>
                  <div className="text-xs font-bold text-white flex items-center gap-2">
                    <span>{selectedRecipient.name}</span>
                    {getRoleBadge(selectedRecipient.role)}
                  </div>
                  <div className="text-[10px] text-[#9db0c8]">
                    {selectedRecipient.position} &bull; Private Direct Chat
                  </div>
                </div>
              </div>

              <span className="text-[10px] font-mono text-[#59e3ff] px-2 py-0.5 rounded bg-[#070b14] border border-[#1d2a3e]">
                1-on-1 Confidential
              </span>
            </div>
          )}

          {/* Messages Scroll Area */}
          <div ref={chatScrollRef} className="flex-1 p-4 overflow-y-auto space-y-3">
            {activeMode === 'group' ? (
              groupMessages.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs text-[#9db0c8]">
                  <MessageSquare className="w-8 h-8 text-[#1d2a3e] mb-2" />
                  <p>No messages in Team Chat yet. Start the conversation!</p>
                </div>
              ) : (
                groupMessages.map((msg) => {
                  const isMe = msg.senderCode === currentMember.code || msg.senderId === currentMember.id;
                  const isMsgCeo = msg.senderRole === 'ceo' || msg.senderCode === '30072012';

                  return (
                    <div
                      key={msg.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                        {isMsgCeo && <Crown className="w-3 h-3 text-amber-400 fill-amber-400/30" />}
                        <span className="font-bold text-white">{msg.senderName}</span>
                        {getRoleBadge(msg.senderRole)}
                        <span className="text-[10px] text-[#50637a]">
                          {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-[#3da9fc] text-[#070b14] font-medium rounded-br-none shadow-md'
                            : 'bg-[#0e1726] border border-[#1d2a3e] text-white rounded-bl-none shadow-sm'
                        }`}
                      >
                        {msg.content}
                      </div>
                    </div>
                  );
                })
              )
            ) : (
              // Direct Messages View
              !selectedRecipient ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs text-[#9db0c8]">
                  <Lock className="w-8 h-8 text-[#1d2a3e] mb-2" />
                  <p>Select a team member from the left to start a private direct conversation.</p>
                </div>
              ) : activeConversationDms.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center p-6 text-xs text-[#9db0c8]">
                  <Lock className="w-8 h-8 text-[#3da9fc]/30 mb-2" />
                  <p className="font-bold text-white mb-1">Direct Message with {selectedRecipient.name}</p>
                  <p>Send a private message to {selectedRecipient.name}. Messages are only visible to the two of you.</p>
                </div>
              ) : (
                activeConversationDms.map((dm) => {
                  const isMe = dm.senderId === currentMember.id || dm.senderCode === currentMember.code;

                  return (
                    <div
                      key={dm.id}
                      className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}
                    >
                      <div className="flex items-center gap-1.5 mb-1 px-1 text-[11px]">
                        <span className="font-bold text-white">{dm.senderName}</span>
                        {getRoleBadge(dm.senderRole)}
                        <span className="text-[10px] text-[#50637a]">
                          {new Date(dm.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                      <div
                        className={`max-w-md p-3 rounded-2xl text-xs leading-relaxed ${
                          isMe
                            ? 'bg-gradient-to-r from-[#3da9fc] to-[#59e3ff] text-[#070b14] font-medium rounded-br-none shadow-md'
                            : 'bg-[#0e1726] border border-[#1d2a3e] text-white rounded-bl-none shadow-sm'
                        }`}
                      >
                        {dm.content}
                      </div>
                    </div>
                  );
                })
              )
            )}
          </div>

          {/* Input Bar */}
          <form onSubmit={handleSendMessage} className="p-3 bg-[#0b1220] border-t border-[#1d2a3e] flex items-center gap-2">
            <input
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={
                activeMode === 'group'
                  ? `Message the whole team as ${currentMember.name}...`
                  : selectedRecipient
                  ? `Send private message to ${selectedRecipient.name}...`
                  : 'Select a member to direct message...'
              }
              disabled={activeMode === 'dm' && !selectedRecipient}
              className="flex-1 px-4 py-2.5 bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] rounded-xl text-xs text-white placeholder:text-[#50637a] focus:outline-none disabled:opacity-50"
            />
            <button
              type="submit"
              disabled={isSending || !inputText.trim() || (activeMode === 'dm' && !selectedRecipient)}
              className="btn-interactive p-2.5 rounded-xl bg-[#3da9fc] hover:bg-[#59e3ff] text-[#070b14] transition cursor-pointer disabled:opacity-50 flex items-center justify-center flex-shrink-0"
              title="Send"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
