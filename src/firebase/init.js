import firebase from "firebase/app";
import "firebase/database";

//import firestore from "firebase/firestore";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDoOzfVam1d73Jhd219m4Kf4CBGGb5-n6I",
  authDomain: "talk-time-7f88c.firebaseapp.com",
  databaseURL: "https://talk-time-7f88c.firebaseio.com",
  projectId: "talk-time-7f88c",
  storageBucket: "",
  messagingSenderId: "349021451329"
};
const firebaseApp = firebase.initializeApp(config);
//firebaseApp.firestore().settings({ timestampsInSnapshots: true });

export default firebaseApp;
