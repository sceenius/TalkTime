import firebase from "firebase/app";
import "firebase/database";

// Initialize Firebase
var config = {
  apiKey: "AIzaSyDoOzfVam1d73Jhd219m4Kf4CBGGb5-n6I",
  authDomain: "talk-time-7f88c.firebaseapp.com",
  databaseURL: "https://talk-time-7f88c.firebaseio.com",
  projectId: "talk-time-7f88c",
  storageBucket: "",
  messagingSenderId: "349021451329"
};

// const firebaseApp = firebase.initializeApp(config);
// export default firebaseApp;

// https://github.com/zeit/next.js/issues/1999
export default (!firebase.apps.length
  ? firebase.initializeApp(config)
  : firebase.app());
