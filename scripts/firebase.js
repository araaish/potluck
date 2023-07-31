// service worker catch errors

self.importScripts('../firebase/firebase-app.js', '../firebase/firebase-database.js');
self.importScripts('../oauth.js');

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
        var email = getUserEmail();
        console.log("EMAIL: ", email);
        console.log(getUserContacts());
        const ref = db.ref("recommendations");
        var post = ref.push({
            email: email,
            url: url,
        });
        response("success");   
    }


});


// OAUTH TUTORIAL
chrome.action.onClicked.addListener(function() {
    chrome.tabs.create({url: 'index.html'});
  });
