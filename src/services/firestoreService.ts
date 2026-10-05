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
import { firestore } from './googleDriveAuth';

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
    // If the document doesn't exist, it still verifies server connectivity
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

  const reqDocRef = doc(firestore, 'serviceRequests', id);
  await setDoc(reqDocRef, newRequest);
  return newRequest;
};

/**
 * Fetch all service requests for a specific client
 */
export const fetchUserServiceRequests = async (
  userId: string
): Promise<FirestoreServiceRequest[]> => {
  try {
    const q = query(
      collection(firestore, 'serviceRequests'),
      where('userId', '==', userId),
      orderBy('createdAt', 'desc')
    );
    const snap = await getDocs(q);
    return snap.docs.map((d) => d.data() as FirestoreServiceRequest);
  } catch (err) {
    console.error('Failed to query serviceRequests from Firestore:', err);
    return [];
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

  const docRef = doc(firestore, 'projectEnquiries', id);
  await setDoc(docRef, newEnquiry);
  return newEnquiry;
};
