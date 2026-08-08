import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
    apiKey: 'AIzaSyD9WwcNNtbvQS4leXygv6yimv1MpYEhYpg',
    authDomain: 'patrick-a8a9c.firebaseapp.com',
    projectId: 'patrick-a8a9c',
    storageBucket: 'patrick-a8a9c.firebasestorage.app',
    messagingSenderId: '948197357908',
    appId: '1:948197357908:web:c7d773b605014a2b92f0c1',
    measurementId: 'G-G2VW45TK7E',
};

const firebaseApp = initializeApp(firebaseConfig);

export const firestore = getFirestore(firebaseApp);
