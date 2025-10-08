import FirebaseClientProvider, {
    initializeFirebase,
    useFirebase,
    useFirebaseApp,
    useFirestore,
    useAuth,
} from '@/firebase/client-provider';

import { useUser } from '@/firebase/auth/use-user';
import { useCollection } from '@/firebase/firestore/use-collection';
import { useDoc } from '@/firebase/firestore/use-doc';

export {
    initializeFirebase,
    FirebaseClientProvider,
    useFirebase,
    useFirebaseApp,
    useFirestore,
    useAuth,
    useUser,
    useCollection,
    useDoc,
};
