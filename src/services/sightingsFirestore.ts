import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  updateDoc, 
  query, 
  orderBy, 
  limit, 
  onSnapshot,
  arrayUnion,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { SightingLog, CorroborationRecord } from '../types/raptor';
import { INITIAL_SIGHTINGS } from '../data/initialSightings';

const SIGHTINGS_COLLECTION = 'sightings';

/**
 * Seed initial field sightings to Firestore if collection is empty
 */
export async function seedSightingsIfEmpty(): Promise<void> {
  try {
    const colRef = collection(db, SIGHTINGS_COLLECTION);
    const snap = await getDocs(query(colRef, limit(1)));
    if (snap.empty) {
      console.log('Seeding initial sightings to Firestore...');
      // Write the first batch of initial sightings
      for (const sighting of INITIAL_SIGHTINGS.slice(0, 15)) {
        await setDoc(doc(db, SIGHTINGS_COLLECTION, sighting.id), sighting);
      }
      console.log('Successfully seeded sightings to Firestore');
    }
  } catch (err) {
    console.error('Error checking or seeding sightings in Firestore:', err);
  }
}

/**
 * Subscribe to real-time sighting updates from Firestore
 */
export function subscribeToSightings(
  callback: (sightings: SightingLog[]) => void,
  fallbackData: SightingLog[]
): () => void {
  try {
    const q = query(
      collection(db, SIGHTINGS_COLLECTION),
      orderBy('timestamp', 'desc'),
      limit(100)
    );

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        if (!snapshot.empty) {
          const list: SightingLog[] = snapshot.docs.map((docSnap) => docSnap.data() as SightingLog);
          callback(list);
        } else {
          // If Firestore has no records yet, use fallback data
          callback(fallbackData);
        }
      },
      (error) => {
        console.warn('Firestore subscription warning, falling back to local memory:', error);
        callback(fallbackData);
      }
    );

    return unsubscribe;
  } catch (err) {
    console.error('Failed to create Firestore subscription:', err);
    callback(fallbackData);
    return () => {};
  }
}

/**
 * Save a new sighting log directly to Firestore
 */
export async function saveSightingToFirestore(sighting: SightingLog): Promise<void> {
  try {
    const docRef = doc(db, SIGHTINGS_COLLECTION, sighting.id);
    await setDoc(docRef, sighting);
  } catch (err) {
    console.error('Error saving sighting to Firestore:', err);
    throw err;
  }
}

/**
 * Add peer corroboration to an existing sighting in Firestore
 */
export async function addCorroborationToFirestore(
  sightingId: string, 
  corroboration: CorroborationRecord
): Promise<void> {
  try {
    const docRef = doc(db, SIGHTINGS_COLLECTION, sightingId);
    await updateDoc(docRef, {
      corroborations: arrayUnion(corroboration),
      verificationStatus: 'Corroborated by Peers'
    });
  } catch (err) {
    console.error('Error adding corroboration in Firestore:', err);
    throw err;
  }
}
