import {
    initializeFirebase,
    FirebaseProvider,
    FirebaseClientProvider,
    useFirebase,
    useFirebaseApp,
    useFirestore,
    useAuth,
} from '@/firebase/provider';
import { useUser } from '@/firebase/auth/use-user';

// TODO: Add useCollection and useDoc hooks
// import { useCollection } from '@/firebase/firestore/use-collection';
// import { useDoc } from '@/firebase/firestore/use-doc';

export {
    initializeFirebase,
    FirebaseProvider,
    FirebaseClientProvider,
    useFirebase,
    useFirebaseApp,
    useFirestore,
    useAuth,
    useUser,
    // useCollection,
    // useDoc,
};
