import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export async function addToWaitlist(email: string) {
  try {
    const docRef = await addDoc(collection(db, "waitlist"), {
      email,
      createdAt: new Date(),
    });
    return { success: true, id: docRef.id };
  } catch (error) {
    console.error("Error adding to waitlist: ", error);
    return { success: false, error };
  }
} 