import { getAccessToken } from './googleDriveAuth';

export interface DriveFileItem {
  id: string;
  name: string;
  mimeType: string;
  iconLink?: string;
  hasThumbnail?: boolean;
  thumbnailLink?: string;
  webViewLink?: string;
  webContentLink?: string;
  createdTime?: string;
  modifiedTime?: string;
  size?: string;
  owners?: Array<{ displayName: string; emailAddress: string; photoLink?: string }>;
  shared?: boolean;
}

const DRIVE_API_BASE = 'https://www.googleapis.com/drive/v3';
const DRIVE_UPLOAD_BASE = 'https://www.googleapis.com/upload/drive/v3';

/**
 * List files and folders from Google Drive
 */
export const listDriveFiles = async (params: {
  folderId?: string;
  searchQuery?: string;
  filterType?: 'all' | 'images' | 'documents' | 'folders';
  pageSize?: number;
  pageToken?: string;
}): Promise<{ files: DriveFileItem[]; nextPageToken?: string }> => {
  const token = await getAccessToken();
  if (!token) {
    throw new Error('Authentication required: please connect Google Drive.');
  }

  const queryParts: string[] = ['trashed = false'];

  if (params.folderId) {
    queryParts.push(`'${params.folderId}' in parents`);
  }

  if (params.searchQuery && params.searchQuery.trim().length > 0) {
    const escaped = params.searchQuery.replace(/'/g, "\\'");
    queryParts.push(`name contains '${escaped}'`);
  }

  if (params.filterType === 'folders') {
    queryParts.push("mimeType = 'application/vnd.google-apps.folder'");
  } else if (params.filterType === 'images') {
    queryParts.push("(mimeType contains 'image/' or mimeType contains 'png' or mimeType contains 'jpeg')");
  } else if (params.filterType === 'documents') {
    queryParts.push("(mimeType contains 'pdf' or mimeType contains 'document' or mimeType contains 'sheet' or mimeType contains 'presentation' or mimeType contains 'text/')");
  }

  const q = queryParts.join(' and ');
  const fields = 'nextPageToken, files(id, name, mimeType, iconLink, hasThumbnail, thumbnailLink, webViewLink, webContentLink, createdTime, modifiedTime, size, owners, shared)';
  const url = new URL(`${DRIVE_API_BASE}/files`);
  url.searchParams.set('q', q);
  url.searchParams.set('fields', fields);
  url.searchParams.set('pageSize', String(params.pageSize || 30));
  url.searchParams.set('orderBy', 'folder,modifiedTime desc');

  if (params.pageToken) {
    url.searchParams.set('pageToken', params.pageToken);
  }

  const res = await fetch(url.toString(), {
    headers: {
      Authorization: `Bearer ${token}`,
      Accept: 'application/json',
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || `Failed to list files (${res.status})`);
  }

  const data = await res.json();
  return {
    files: data.files || [],
    nextPageToken: data.nextPageToken,
  };
};

/**
 * Create a new folder in Google Drive (e.g. "SAMZEN Project Assets")
 */
export const createDriveFolder = async (
  folderName: string,
  parentFolderId?: string
): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required to create folder.');

  const metadata: Record<string, any> = {
    name: folderName,
    mimeType: 'application/vnd.google-apps.folder',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const res = await fetch(`${DRIVE_API_BASE}/files`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(metadata),
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to create folder in Google Drive.');
  }

  return await res.json();
};

/**
 * Upload a file directly to Google Drive using multipart upload
 */
export const uploadDriveFile = async (
  file: File,
  parentFolderId?: string
): Promise<DriveFileItem> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required to upload file.');

  const metadata: Record<string, any> = {
    name: file.name,
    mimeType: file.type || 'application/octet-stream',
  };

  if (parentFolderId) {
    metadata.parents = [parentFolderId];
  }

  const boundary = '-------314159265358979323846';
  const delimiter = `\r\n--${boundary}\r\n`;
  const closeDelimiter = `\r\n--${boundary}--`;

  // Read file as ArrayBuffer
  const fileData = await file.arrayBuffer();

  // Create multipart body
  const metadataPart = `${delimiter}Content-Type: application/json; charset=UTF-8\r\n\r\n${JSON.stringify(metadata)}\r\n`;
  const mediaHeaderPart = `--${boundary}\r\nContent-Type: ${file.type || 'application/octet-stream'}\r\n\r\n`;

  const enc = new TextEncoder();
  const metaBytes = enc.encode(metadataPart);
  const mediaHeaderBytes = enc.encode(mediaHeaderPart);
  const closeBytes = enc.encode(closeDelimiter);

  const totalLength = metaBytes.byteLength + mediaHeaderBytes.byteLength + fileData.byteLength + closeBytes.byteLength;
  const combinedBuffer = new Uint8Array(totalLength);

  let offset = 0;
  combinedBuffer.set(metaBytes, offset);
  offset += metaBytes.byteLength;
  combinedBuffer.set(mediaHeaderBytes, offset);
  offset += mediaHeaderBytes.byteLength;
  combinedBuffer.set(new Uint8Array(fileData), offset);
  offset += fileData.byteLength;
  combinedBuffer.set(closeBytes, offset);

  const res = await fetch(`${DRIVE_UPLOAD_BASE}/files?uploadType=multipart&fields=id,name,mimeType,webViewLink,size,iconLink`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': `multipart/related; boundary=${boundary}`,
    },
    body: combinedBuffer,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to upload file to Google Drive.');
  }

  return await res.json();
};

/**
 * Delete a file or folder from Google Drive (DESTRUCTIVE OPERATION: Must have user confirmation!)
 */
export const deleteDriveFile = async (fileId: string): Promise<void> => {
  const token = await getAccessToken();
  if (!token) throw new Error('Authentication required to delete file.');

  const res = await fetch(`${DRIVE_API_BASE}/files/${fileId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok && res.status !== 204) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err.error?.message || 'Failed to delete file from Google Drive.');
  }
};
