import FirebaseClientProvider, {
    initializeFirebase,
    useFirebase,
    useFirebaseApp,
    useFirestore,
} from '@/firebase/client-provider';

import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';

// A mock user object for development without authentication
const useUser = () => ({ user: { uid: 'dev-user' }, loading: false });

export {
    initializeFirebase,
    FirebaseClientProvider,
    useFirebase,
    useFirebaseApp,
    useFirestore,
    useUser,
    useCollection,
    useDoc,
};
