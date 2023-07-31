// service worker catch errors

self.importScripts('../firebase/firebase-app.js', '../firebase/firebase-database.js');

// Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyBsmkCcoKGJSUg21mg7XWalbthi1rzU00Y",
    authDomain: "potluck-peer-recommendations.firebaseapp.com",
    databaseURL: "https://potluck-peer-recommendations-default-rtdb.firebaseio.com",
    projectId: "potluck-peer-recommendations",
    storageBucket: "potluck-peer-recommendations.appspot.com",
    messagingSenderId: "759667592929",
    appId: "1:759667592929:web:32d5c7c6310e51919031a0",
    measurementId: "G-1WN2JQ4ZJ4"
    };

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
console.log(firebase);

var db = firebase.database();

// Listen for messages
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    // recommend message
    if (msg.command === "recommend") {
        var url = msg.data.url;
        var user = "Araaish"
        const ref = db.ref("recommendations/" + user);
        var post = ref.push().set({
            url: url,
        });
        response("success");   
    }


});


// OAUTH TUTORIAL
chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({url: 'index.html'});
  });
