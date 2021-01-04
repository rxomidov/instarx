import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
    apiKey: "AIzaSyAvQdghXe6YxljSDzqSQ-B96vM-o9vwZ7Y",
    authDomain: "instarx-4cf72.firebaseapp.com",
    projectId: "instarx-4cf72",
    storageBucket: "instarx-4cf72.appspot.com",
    messagingSenderId: "128333789286",
    appId: "1:128333789286:web:5e00ed8a65dcce6ae9d5a7",
    measurementId: "G-RRDE3QHWRW"
});

const db = firebaseApp.firestore();
const auth = firebase.auth();
const storage = firebase.storage()

export {db,auth,storage};