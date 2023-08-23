// service worker catch errors
// TODO: remove and regenerate all sensitive data: api keys, firebase config
// TODO: use netlify serverless functions to hide api keys
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
        // get email from oauth
        getUserEmail().then((email) => {
            const restrictedCharactersRegex = /[.$\[\]#\/]/g;
            email = email.replace(restrictedCharactersRegex, "");
            const ref = db.ref("recommendations/" +  email);
            console.log("EMAIL: " + email);
            var post = ref.set({
                url: url,
            });
            response({type: "result", status: "success"});
        });
    }

    // get recommendations message
    if (msg.command === "getRecommendations") {
        
        // get email from oauth
        getUserEmail().then((email) => {
            // get contact list
            getUserContacts().then((contacts) => {
                // get urls from firebase
                console.log("EMAIL: " + email);
                console.log("CONTACTS: " + contacts);
                var promises = [];
                // For each contact, get their recommendations
                contacts.forEach((contact) => {
                    // sanitize contact email
                    contact = contact.replace(/[.$\[\]#\/]/g, "");
                    // get recommendations from firebase
                    const ref = db.ref("recommendations/" + contact);
                    // ref.on("value", (snapshot) => {
                    //     const data = snapshot.val();
                    //     console.log("DATA: " + data);
                    //     if (data) {
                    //         recommendations.push(data.url);
                    //     }
                    // });
                    promises.push(
                        new Promise((resolve) => {
                            ref.on("value", (snapshot) => {
                                const data = snapshot.val();
                                if (data) {
                                    resolve({contact: contact, url: data.url});
                                } else {
                                    resolve(null);
                                }
                            });
                        })
                    );
                });
                Promise.all(promises).then((recs) => {
                    console.log("RECOMMENDATIONS: " + recs);
                    response(recs.filter((rec) => rec !== null));
                });
            });
        });
    }
    return true;
});