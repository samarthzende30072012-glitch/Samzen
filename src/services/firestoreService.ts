import {
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  getDocFromServer
} from 'firebase/firestore';
import { firestore, auth } from './googleDriveAuth';

export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

export interface FirestoreServiceRequest {
  id: string;
  userId: string;
  clientName: string;
  clientEmail: string;
  clientPhone: string;
  planId: string;
  requestType: 'free_support' | 'paid_service';
  title: string;
  description: string;
  status: 'submitted' | 'in_review' | 'in_progress' | 'completed';
  fee: number;
  createdAt: string;
}

export interface FirestoreProjectEnquiry {
  id: string;
  name: string;
  email: string;
  phone: string;
  businessCategory: string;
  selectedPlan: string;
  requirements: string;
  status: 'pending' | 'contacted' | 'in_discussion' | 'closed';
  createdAt: string;
}

/**
 * Validate live connection to Firestore per skill guidelines
 */
export const testFirestoreConnection = async (): Promise<boolean> => {
  try {
    await getDocFromServer(doc(firestore, 'test', 'connection'));
    return true;
  } catch (error: any) {
    if (error?.code === 'not-found') return true;
    console.warn('Firestore server connection test notice:', error?.message);
    return false;
  }
};

/**
 * Persist a client service request to Firestore
 */
export const createServiceRequest = async (
  data: Omit<FirestoreServiceRequest, 'id' | 'createdAt' | 'status'>
): Promise<FirestoreServiceRequest> => {
  const id = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newRequest: FirestoreServiceRequest = {
    ...data,
    id,
    status: 'submitted',
    createdAt: new Date().toISOString(),
  };

  const path = `serviceRequests/${id}`;
  try {
    const reqDocRef = doc(firestore, 'serviceRequests', id);
    await setDoc(reqDocRef, newRequest);
    return newRequest;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
};

/**
 * Fetch all service requests for a specific client
 */
export const fetchUserServiceRequests = async (
  userId: string
): Promise<FirestoreServiceRequest[]> => {
  const path = 'serviceRequests';
  try {
    const q = query(
      collection(firestore, 'serviceRequests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreServiceRequest);
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, path);
  }
};

/**
 * Persist a public project enquiry to Firestore
 */
export const createProjectEnquiry = async (
  data: Omit<FirestoreProjectEnquiry, 'id' | 'createdAt' | 'status'>
): Promise<FirestoreProjectEnquiry> => {
  const id = `enq_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
  const newEnquiry: FirestoreProjectEnquiry = {
    ...data,
    id,
    status: 'pending',
    createdAt: new Date().toISOString(),
  };

  const path = `projectEnquiries/${id}`;
  try {
    const docRef = doc(firestore, 'projectEnquiries', id);
    await setDoc(docRef, newEnquiry);
    return newEnquiry;
  } catch (err) {
    handleFirestoreError(err, OperationType.CREATE, path);
  }
};
