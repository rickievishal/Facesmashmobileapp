import { initializeApp } from 'firebase/app';
import {getStorage} from 'firebase/storage'
const firebaseConfig = {
    apiKey: "AIzaSyCXoV45qhjSaIUT91PdTtKngCQAUpRUIMU",
    authDomain: "ratingbackend.firebaseapp.com",
    projectId: "ratingbackend",
    storageBucket: "ratingbackend.appspot.com",
    messagingSenderId: "137839956556",
    appId: "1:137839956556:web:e6b2d295ea993c98fb1ae9"
  };

//we are initializing the firebase app
const app = initializeApp(firebaseConfig);
export const storage = getStorage(app)