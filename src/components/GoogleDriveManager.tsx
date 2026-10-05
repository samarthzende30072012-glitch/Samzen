import React, { useState, useEffect, useRef } from 'react';
import {
  initAuth,
  googleSignIn,
  logoutGoogle,
  getAccessToken
} from '../services/googleDriveAuth';
import {
  listDriveFiles,
  uploadDriveFile,
  createDriveFolder,
  deleteDriveFile,
  DriveFileItem
} from '../services/googleDriveService';
import { User } from 'firebase/auth';
import {
  HardDrive,
  FolderPlus,
  Upload,
  Search,
  RefreshCw,
  Trash2,
  ExternalLink,
  Folder,
  FileText,
  Image as ImageIcon,
  File as FileIcon,
  AlertTriangle,
  CheckCircle2,
  Lock,
  Sparkles,
  X,
  Plus
} from 'lucide-react';

interface GoogleDriveManagerProps {
  onAttachFileToProject?: (file: DriveFileItem) => void;
  className?: string;
}

export const GoogleDriveManager: React.FC<GoogleDriveManagerProps> = ({
  onAttachFileToProject,
  className = '',
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  // Drive state
  const [files, setFiles] = useState<DriveFileItem[]>([]);
  const [isLoadingFiles, setIsLoadingFiles] = useState(false);
  const [fileError, setFileError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<'all' | 'images' | 'documents' | 'folders'>('all');
  const [currentFolderId, setCurrentFolderId] = useState<string | undefined>(undefined);
  const [folderHistory, setFolderHistory] = useState<Array<{ id: string; name: string }>>([]);

  // Uploading state
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Folder creation modal
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('SAMZEN Web Project Assets');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  // Delete confirmation modal (MANDATORY for destructive Workspace API operations)
  const [fileToDelete, setFileToDelete] = useState<DriveFileItem | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Listen to auth
  useEffect(() => {
    const unsubscribe = initAuth(
      (user) => {
        setCurrentUser(user);
        loadFiles();
      },
      () => {
        setCurrentUser(null);
        setFiles([]);
      }
    );
    return () => unsubscribe();
  }, []);

  const handleSignIn = async () => {
    setIsAuthenticating(true);
    setAuthError(null);
    try {
      const res = await googleSignIn();
      setCurrentUser(res.user);
      await loadFiles();
    } catch (err: any) {
      console.error('Sign-in failed:', err);
      setAuthError(err.message || 'Google Drive authentication was cancelled or failed.');
    } finally {
      setIsAuthenticating(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await logoutGoogle();
      setCurrentUser(null);
      setFiles([]);
    } catch (err: any) {
      console.error('Sign out error:', err);
    }
  };

  const loadFiles = async (folderId?: string, search?: string, filter?: 'all' | 'images' | 'documents' | 'folders') => {
    setIsLoadingFiles(true);
    setFileError(null);
    try {
      const res = await listDriveFiles({
        folderId: folderId !== undefined ? folderId : currentFolderId,
        searchQuery: search !== undefined ? search : searchQuery,
        filterType: filter !== undefined ? filter : filterType,
        pageSize: 40,
      });
      setFiles(res.files);
    } catch (err: any) {
      console.error('Failed to load drive files:', err);
      setFileError(err.message || 'Could not fetch Google Drive files.');
    } finally {
      setIsLoadingFiles(false);
    }
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    loadFiles(currentFolderId, searchQuery, filterType);
  };

  const handleFilterChange = (type: 'all' | 'images' | 'documents' | 'folders') => {
    setFilterType(type);
    loadFiles(currentFolderId, searchQuery, type);
  };

  const navigateToFolder = (folder: DriveFileItem) => {
    const newHistory = [...folderHistory, { id: folder.id, name: folder.name }];
    setFolderHistory(newHistory);
    setCurrentFolderId(folder.id);
    loadFiles(folder.id, searchQuery, filterType);
  };

  const navigateBack = (index?: number) => {
    if (index === undefined || index === -1) {
      // Go to root
      setFolderHistory([]);
      setCurrentFolderId(undefined);
      loadFiles(undefined, searchQuery, filterType);
    } else {
      const target = folderHistory[index];
      const newHistory = folderHistory.slice(0, index + 1);
      setFolderHistory(newHistory);
      setCurrentFolderId(target.id);
      loadFiles(target.id, searchQuery, filterType);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadSuccessMsg(null);
    setFileError(null);
    try {
      const uploaded = await uploadDriveFile(file, currentFolderId);
      setUploadSuccessMsg(`Successfully uploaded "${uploaded.name}" to Google Drive!`);
      setTimeout(() => setUploadSuccessMsg(null), 5000);
      await loadFiles();
    } catch (err: any) {
      console.error('Upload failed:', err);
      setFileError(err.message || 'File upload failed. Please try again.');
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    setIsCreatingFolder(true);
    try {
      await createDriveFolder(newFolderName.trim(), currentFolderId);
      setShowFolderModal(false);
      setNewFolderName('SAMZEN Web Project Assets');
      await loadFiles();
    } catch (err: any) {
      console.error('Folder creation failed:', err);
      alert(err.message || 'Failed to create folder.');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleConfirmDelete = async () => {
    if (!fileToDelete) return;
    setIsDeleting(true);
    try {
      await deleteDriveFile(fileToDelete.id);
      setFileToDelete(null);
      await loadFiles();
    } catch (err: any) {
      console.error('Delete failed:', err);
      alert(err.message || 'Failed to delete file.');
    } finally {
      setIsDeleting(false);
    }
  };

  const formatFileSize = (bytes?: string) => {
    if (!bytes) return '--';
    const num = parseInt(bytes, 10);
    if (isNaN(num)) return '--';
    if (num < 1024) return `${num} B`;
    if (num < 1024 * 1024) return `${(num / 1024).toFixed(1)} KB`;
    return `${(num / (1024 * 1024)).toFixed(1)} MB`;
  };

  const getFileIcon = (file: DriveFileItem) => {
    if (file.mimeType === 'application/vnd.google-apps.folder') {
      return <Folder className="w-5 h-5 text-amber-400 flex-shrink-0" />;
    }
    if (file.mimeType.startsWith('image/')) {
      return <ImageIcon className="w-5 h-5 text-[#3da9fc] flex-shrink-0" />;
    }
    if (file.mimeType.includes('pdf') || file.mimeType.includes('document')) {
      return <FileText className="w-5 h-5 text-emerald-400 flex-shrink-0" />;
    }
    return <FileIcon className="w-5 h-5 text-[#9db0c8] flex-shrink-0" />;
  };

  return (
    <section id="drive" className={`py-16 md:py-24 border-b border-[#1d2a3e] bg-[#070b14] relative ${className}`}>
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[700px] bg-[#3da9fc]/5 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10">
        {/* Section Header */}
        <div className="max-w-3xl mb-10 text-left">
          <div className="inline-flex items-center gap-2 text-xs font-semibold tracking-wider uppercase text-[#59e3ff] mb-2 px-3 py-1 rounded-full bg-[#0e1726] border border-[#1d2a3e]">
            <HardDrive className="w-3.5 h-3.5 text-[#3da9fc]" />
            <span>Google Workspace Integration</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold font-heading text-white tracking-tight">
            Google Drive Project Assets Portal
          </h2>
          <p className="mt-3 text-base sm:text-lg text-[#9db0c8] leading-relaxed">
            Connect your Google Drive to seamlessly organize, upload, and browse assets for your website &mdash; logos, banners, product photos, brand documents, and creative briefs.
          </p>
        </div>

        {/* Auth / Status Box */}
        {!currentUser ? (
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-8 sm:p-10 text-center max-w-2xl mx-auto shadow-2xl relative overflow-hidden">
            <div className="w-16 h-16 mx-auto rounded-2xl bg-[#070b14] border border-[#3da9fc]/30 flex items-center justify-center text-[#3da9fc] mb-6 shadow-lg shadow-[#3da9fc]/10">
              <HardDrive className="w-8 h-8" />
            </div>

            <h3 className="text-xl sm:text-2xl font-bold font-heading text-white mb-2">
              Connect Google Drive to SAMZEN
            </h3>
            <p className="text-sm text-[#9db0c8] max-w-md mx-auto mb-8 leading-relaxed">
              With your permission, SAMZEN Web Development securely accesses your Google Drive files and folders so you can share brand logos, website content, and media assets with Samarth Zende directly.
            </p>

            {authError && (
              <div className="mb-6 p-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs text-left flex items-start gap-3">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <span>{authError}</span>
              </div>
            )}

            {/* Official Google Sign-In Button format as required by Workspace Integration guidelines */}
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleSignIn}
                disabled={isAuthenticating}
                className="inline-flex items-center gap-3 px-6 py-3 rounded-lg bg-white hover:bg-slate-100 text-[#1f1f1f] font-semibold text-sm transition-all shadow-md hover:shadow-lg disabled:opacity-60 cursor-pointer"
              >
                {/* Official Google 'G' SVG Logo */}
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
                  <path fill="none" d="M0 0h48v48H0z" />
                </svg>
                <span>{isAuthenticating ? 'Connecting to Google...' : 'Sign in with Google'}</span>
              </button>
            </div>

            <div className="mt-6 flex items-center justify-center gap-2 text-xs text-[#9db0c8]">
              <Lock className="w-3.5 h-3.5 text-emerald-400" />
              <span>Client-side OAuth token held only in memory. No permanent server storage.</span>
            </div>
          </div>
        ) : (
          /* Logged In Google Drive Explorer */
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 sm:p-8 shadow-2xl">
            {/* Top Bar: User Profile & Quick Actions */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-[#1d2a3e]">
              <div className="flex items-center gap-3">
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'Google User'}
                    className="w-12 h-12 rounded-full border-2 border-[#3da9fc] object-cover"
                  />
                ) : (
                  <div className="w-12 h-12 rounded-full bg-[#3da9fc]/20 border border-[#3da9fc] flex items-center justify-center text-[#59e3ff] font-bold text-lg">
                    {(currentUser.displayName || currentUser.email || 'G')[0].toUpperCase()}
                  </div>
                )}
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">
                      {currentUser.displayName || 'Google Account'}
                    </span>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" />
                      <span>Drive Connected</span>
                    </span>
                  </div>
                  <span className="text-xs text-[#9db0c8]">{currentUser.email}</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center gap-2.5">
                {/* Upload File Input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  onChange={handleFileUpload}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#3da9fc] hover:bg-[#2b96e6] text-white font-bold text-xs transition shadow-md shadow-[#3da9fc]/20 cursor-pointer disabled:opacity-60"
                >
                  <Upload className="w-3.5 h-3.5" />
                  <span>{isUploading ? 'Uploading...' : 'Upload Asset to Drive'}</span>
                </button>

                {/* Create Folder Button */}
                <button
                  type="button"
                  onClick={() => setShowFolderModal(true)}
                  className="inline-flex items-center gap-2 px-3.5 py-2 rounded-lg bg-[#070b14] hover:bg-[#152033] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#eef3fa] text-xs font-semibold transition"
                >
                  <FolderPlus className="w-3.5 h-3.5 text-amber-400" />
                  <span>New Folder</span>
                </button>

                {/* Refresh Button */}
                <button
                  type="button"
                  onClick={() => loadFiles()}
                  disabled={isLoadingFiles}
                  title="Refresh Files"
                  className="p-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] text-[#9db0c8] hover:text-white transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingFiles ? 'animate-spin text-[#3da9fc]' : ''}`} />
                </button>

                {/* Disconnect Google Drive */}
                <button
                  type="button"
                  onClick={handleSignOut}
                  className="px-3 py-2 rounded-lg bg-[#070b14] hover:bg-rose-500/10 border border-[#1d2a3e] hover:border-rose-500/40 text-[#9db0c8] hover:text-rose-400 text-xs font-medium transition"
                >
                  Disconnect
                </button>
              </div>
            </div>

            {/* Notification messages */}
            {uploadSuccessMsg && (
              <div className="mt-4 p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
                <span>{uploadSuccessMsg}</span>
              </div>
            )}
            {fileError && (
              <div className="mt-4 p-3 rounded-lg bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 flex-shrink-0" />
                <span>{fileError}</span>
              </div>
            )}

            {/* Folder Breadcrumb & Search Bar */}
            <div className="mt-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
              {/* Breadcrumb Navigation */}
              <div className="flex items-center gap-2 text-xs text-[#9db0c8] overflow-x-auto py-1">
                <button
                  onClick={() => navigateBack(-1)}
                  className={`hover:text-[#59e3ff] transition font-medium ${!currentFolderId ? 'text-white font-bold' : ''}`}
                >
                  My Drive
                </button>
                {folderHistory.map((f, i) => (
                  <React.Fragment key={f.id}>
                    <span className="text-[#1d2a3e]">&gt;</span>
                    <button
                      onClick={() => navigateBack(i)}
                      className={`hover:text-[#59e3ff] transition font-medium truncate max-w-[150px] ${i === folderHistory.length - 1 ? 'text-white font-bold' : ''}`}
                    >
                      {f.name}
                    </button>
                  </React.Fragment>
                ))}
              </div>

              {/* Search Bar */}
              <form onSubmit={handleSearchSubmit} className="flex items-center gap-2 max-w-md w-full">
                <div className="relative flex-1">
                  <Search className="w-4 h-4 text-[#9db0c8] absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Search Drive files..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="w-full pl-9 pr-3 py-1.5 rounded-lg bg-[#070b14] border border-[#1d2a3e] focus:border-[#3da9fc] text-xs text-white placeholder-[#9db0c8]/60 focus:outline-none"
                  />
                  {searchQuery && (
                    <button
                      type="button"
                      onClick={() => {
                        setSearchQuery('');
                        loadFiles(currentFolderId, '', filterType);
                      }}
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9db0c8] hover:text-white"
                    >
                      <X className="w-3 h-3" />
                    </button>
                  )}
                </div>
                <button
                  type="submit"
                  className="px-3 py-1.5 rounded-lg bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc] text-xs text-[#eef3fa] font-medium"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Filter Pills */}
            <div className="mt-4 flex flex-wrap gap-2 text-xs">
              {[
                { label: 'All Files', type: 'all' },
                { label: 'Folders', type: 'folders' },
                { label: 'Images & Logos', type: 'images' },
                { label: 'Docs & PDFs', type: 'documents' },
              ].map((pill) => (
                <button
                  key={pill.type}
                  onClick={() => handleFilterChange(pill.type as any)}
                  className={`px-3 py-1 rounded-full border transition ${
                    filterType === pill.type
                      ? 'bg-[#3da9fc]/20 border-[#3da9fc] text-[#59e3ff] font-semibold'
                      : 'bg-[#070b14] border-[#1d2a3e] text-[#9db0c8] hover:text-white'
                  }`}
                >
                  {pill.label}
                </button>
              ))}
            </div>

            {/* Files Grid / List */}
            <div className="mt-6">
              {isLoadingFiles ? (
                <div className="py-16 text-center text-[#9db0c8]">
                  <RefreshCw className="w-8 h-8 animate-spin mx-auto text-[#3da9fc] mb-3" />
                  <p className="text-sm">Fetching files from Google Drive...</p>
                </div>
              ) : files.length === 0 ? (
                <div className="py-16 text-center border border-dashed border-[#1d2a3e] rounded-xl bg-[#070b14]/50">
                  <HardDrive className="w-12 h-12 text-[#9db0c8]/40 mx-auto mb-3" />
                  <h4 className="text-base font-bold text-white mb-1">No files found</h4>
                  <p className="text-xs text-[#9db0c8] max-w-sm mx-auto mb-4">
                    {searchQuery ? `No files matching "${searchQuery}"` : 'This folder is empty. Upload project assets to get started!'}
                  </p>
                  <button
                    type="button"
                    onClick={() => fileInputRef.current?.click()}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-[#3da9fc] text-white font-bold text-xs shadow"
                  >
                    <Upload className="w-3.5 h-3.5" />
                    <span>Upload First File</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {files.map((file) => {
                    const isFolder = file.mimeType === 'application/vnd.google-apps.folder';

                    return (
                      <div
                        key={file.id}
                        className="p-3.5 rounded-xl bg-[#070b14] border border-[#1d2a3e] hover:border-[#3da9fc]/60 transition flex flex-col justify-between group text-left relative"
                      >
                        {/* Top: Icon + Name */}
                        <div>
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="p-2 rounded-lg bg-[#0e1726] border border-[#1d2a3e]">
                              {getFileIcon(file)}
                            </div>

                            {/* Actions menu */}
                            <div className="flex items-center gap-1 opacity-80 group-hover:opacity-100">
                              {file.webViewLink && (
                                <a
                                  href={file.webViewLink}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  title="Open in Google Drive"
                                  className="p-1 rounded text-[#9db0c8] hover:text-[#59e3ff] hover:bg-[#0e1726]"
                                >
                                  <ExternalLink className="w-3.5 h-3.5" />
                                </a>
                              )}
                              <button
                                type="button"
                                title="Delete from Google Drive"
                                onClick={() => setFileToDelete(file)}
                                className="p-1 rounded text-[#9db0c8] hover:text-rose-400 hover:bg-[#0e1726]"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>

                          {/* File / Folder Name */}
                          {isFolder ? (
                            <button
                              onClick={() => navigateToFolder(file)}
                              className="font-bold text-white text-xs hover:text-[#59e3ff] text-left line-clamp-2 transition leading-snug cursor-pointer"
                            >
                              📁 {file.name}
                            </button>
                          ) : (
                            <span className="font-semibold text-white text-xs block line-clamp-2 leading-snug" title={file.name}>
                              {file.name}
                            </span>
                          )}
                        </div>

                        {/* Bottom: Meta Info & Use Button */}
                        <div className="mt-3 pt-2.5 border-t border-[#1d2a3e]/60 flex items-center justify-between text-[10px] text-[#9db0c8]">
                          <span>{isFolder ? 'Folder' : formatFileSize(file.size)}</span>

                          {onAttachFileToProject && !isFolder && (
                            <button
                              type="button"
                              onClick={() => onAttachFileToProject(file)}
                              className="px-2 py-0.5 rounded bg-[#3da9fc]/10 hover:bg-[#3da9fc]/20 border border-[#3da9fc]/30 text-[#59e3ff] font-semibold transition"
                            >
                              Attach
                            </button>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* CREATE FOLDER MODAL */}
      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1726] border border-[#1d2a3e] rounded-2xl p-6 max-w-md w-full shadow-2xl text-left">
            <div className="flex items-center justify-between mb-4">
              <h4 className="text-lg font-bold font-heading text-white flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-amber-400" />
                <span>Create New Google Drive Folder</span>
              </h4>
              <button onClick={() => setShowFolderModal(false)} className="text-[#9db0c8] hover:text-white">
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder}>
              <div className="mb-4">
                <label className="block text-xs font-semibold text-[#9db0c8] mb-1.5">
                  Folder Name
                </label>
                <input
                  type="text"
                  required
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  placeholder="e.g. SAMZEN Web Project Assets"
                  className="w-full px-3.5 py-2.5 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-white text-sm focus:border-[#3da9fc] focus:outline-none"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  className="px-4 py-2 rounded-lg bg-[#070b14] text-[#9db0c8] hover:text-white text-xs font-semibold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isCreatingFolder}
                  className="px-4 py-2 rounded-lg bg-[#3da9fc] hover:bg-[#2b96e6] text-white text-xs font-bold shadow disabled:opacity-60"
                >
                  {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DESTRUCTIVE ACTION CONFIRMATION MODAL (MANDATORY PER WORKSPACE INTEGRATION POLICY) */}
      {fileToDelete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
          <div className="bg-[#0e1726] border border-rose-500/40 rounded-2xl p-6 max-w-md w-full shadow-2xl text-left">
            <div className="w-12 h-12 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-4">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h4 className="text-lg font-bold font-heading text-white mb-2">
              Confirm Delete from Google Drive?
            </h4>

            <p className="text-xs text-[#9db0c8] leading-relaxed mb-4">
              Are you sure you want to delete <strong className="text-white">"{fileToDelete.name}"</strong>? This will permanently delete or remove the file from your Google Drive account. This action cannot be undone.
            </p>

            <div className="flex items-center justify-end gap-3 pt-2 border-t border-[#1d2a3e]">
              <button
                type="button"
                onClick={() => setFileToDelete(null)}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-[#070b14] border border-[#1d2a3e] text-[#9db0c8] hover:text-white text-xs font-semibold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                disabled={isDeleting}
                className="px-4 py-2 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold shadow-lg shadow-rose-600/20 disabled:opacity-60"
              >
                {isDeleting ? 'Deleting...' : 'Yes, Delete File'}
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
};
