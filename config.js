import firebase from 'firebase';
require('@firebase/firestore');

var firebaseConfig = {
    apiKey: "AIzaSyC-yk5HRoHHsU8-EeI5_WIz0zBUR5zGiWw",
    authDomain: "bartersystem-f9b6f.firebaseapp.com",
    projectId: "bartersystem-f9b6f",
    storageBucket: "bartersystem-f9b6f.appspot.com",
    messagingSenderId: "1098523994672",
    appId: "1:1098523994672:web:a8b9d89c106b67f03c5bf5"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);

export default firebase.firestore();