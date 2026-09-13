import { initializeApp, getApps, getApp } from 'firebase/app';
import { 
  getAuth, 
  signInAnonymously, 
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  updateProfile,
  signOut,
  onAuthStateChanged, 
  User 
} from 'firebase/auth';
import { 
  getFirestore, 
  doc, 
  setDoc, 
  getDoc, 
  collection, 
  getDocs, 
  getDocFromServer,
  serverTimestamp 
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';

// Initialize Firebase App singleton
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth
export const auth = getAuth(app);

// Initialize Firestore with custom databaseId if specified
export const db = firebaseConfig.firestoreDatabaseId 
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Test connection on boot
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('[Firestore] Connection validated successfully.');
    return true;
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.warn('[Firestore] Client is offline or database initializing.');
      return false;
    }
    // Connection is alive even if the test document doesn't exist
    return true;
  }
}

// Auto sign-in or resume session
export function initAuthListener(onUserReady: (user: User | null) => void) {
  return onAuthStateChanged(auth, async (user) => {
    if (user) {
      onUserReady(user);
    } else {
      try {
        const cred = await signInAnonymously(auth);
        onUserReady(cred.user);
      } catch (err) {
        console.warn('[Auth] Anonymous sign-in failed, continuing in guest mode:', err);
        onUserReady(null);
      }
    }
  });
}

// Student Registration with Real Email & Password & Name
export async function registerStudent(name: string, email: string, pass: string): Promise<User> {
  const cred = await createUserWithEmailAndPassword(auth, email.trim(), pass);
  if (cred.user) {
    await updateProfile(cred.user, { displayName: name.trim() });
    // Write profile immediately to Firestore
    const userRef = doc(db, 'users', cred.user.uid);
    await setDoc(userRef, {
      userId: cred.user.uid,
      fullName: name.trim(),
      email: email.trim().toLowerCase(),
      isAnonymous: false,
      enrolledAt: new Date().toISOString(),
      updatedAt: serverTimestamp(),
      completedLessons: [],
      quizScores: {},
      totalStudyHours: 0
    }, { merge: true });
  }
  return cred.user;
}

// Student Login with Email & Password
export async function loginStudent(email: string, pass: string): Promise<User> {
  const cred = await signInWithEmailAndPassword(auth, email.trim(), pass);
  return cred.user;
}

// Sign out student
export async function logoutStudent(): Promise<void> {
  await signOut(auth);
}

// Update student profile details in Firestore
export async function updateStudentProfile(userId: string, data: { fullName?: string; email?: string }): Promise<void> {
  if (!userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      ...data,
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (err) {
    console.warn('[Firestore] Failed to update profile:', err);
  }
}

// Save student progress to Firestore
export async function saveProgressToCloud(
  userId: string, 
  completedLessons: string[], 
  currentLessonId: string,
  quizScores: Record<string, number>
) {
  if (!userId) return;
  try {
    const userRef = doc(db, 'users', userId);
    await setDoc(userRef, {
      userId,
      completedLessons,
      currentLessonId,
      quizScores,
      lastActive: new Date().toISOString(),
      updatedAt: serverTimestamp()
    }, { merge: true });
  } catch (e) {
    console.warn('[Firestore] Failed to save student progress to cloud:', e);
  }
}

// Load student progress from Firestore
export async function loadProgressFromCloud(userId: string) {
  if (!userId) return null;
  try {
    const userRef = doc(db, 'users', userId);
    const snap = await getDoc(userRef);
    if (snap.exists()) {
      return snap.data();
    }
  } catch (e) {
    console.warn('[Firestore] Failed to load student progress from cloud:', e);
  }
  return null;
}

// Save student note to Firestore
export async function saveNoteToCloud(userId: string, lessonId: string, content: string) {
  if (!userId || !lessonId) return;
  try {
    const noteId = `note_${lessonId}`;
    const noteRef = doc(db, 'users', userId, 'notes', noteId);
    await setDoc(noteRef, {
      id: noteId,
      userId,
      lessonId,
      content,
      updatedAt: new Date().toISOString()
    }, { merge: true });
  } catch (e) {
    console.warn('[Firestore] Failed to save note:', e);
  }
}

// Load notes for a student
export async function loadNotesFromCloud(userId: string): Promise<Record<string, string>> {
  if (!userId) return {};
  try {
    const notesRef = collection(db, 'users', userId, 'notes');
    const snap = await getDocs(notesRef);
    const notes: Record<string, string> = {};
    snap.forEach(docSnap => {
      const data = docSnap.data();
      if (data.lessonId && data.content) {
        notes[data.lessonId] = data.content;
      }
    });
    return notes;
  } catch (e) {
    console.warn('[Firestore] Failed to load notes:', e);
    return {};
  }
}

// Fetch all student progress records for Admin Console
export async function getAllStudentsProgress(): Promise<any[]> {
  try {
    const snap = await getDocs(collection(db, 'users'));
    const students: any[] = [];
    snap.forEach((d) => {
      students.push({ id: d.id, ...d.data() });
    });
    return students;
  } catch (err) {
    console.warn('[Firestore] Failed to get all students:', err);
    return [];
  }
}
