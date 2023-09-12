self.importScripts('../firebase/firebase-app.js', '../firebase/firebase-database.js', '../firebase/firebase-auth.js');
self.importScripts('../constants.js');

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
var db = firebase.database();

// Listen for messages
chrome.runtime.onMessage.addListener((msg, sender, response) => {

    // recommend message
    if (msg.command === "recommend") {
        var url = msg.data.url;
        // firebase auth
        chrome.identity.getAuthToken({interactive: true}, async (token) => {
          var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
          firebase.auth().signInWithCredential(credential);
          getUserEmail().then((email) => {
            // sanitize email
            const restrictedCharactersRegex = /[.$\[\]#\/]/g;
            email = email.replace(restrictedCharactersRegex, "");
            const ref = db.ref("recommendations/" +  email);
            try {
              ref.set({
                  url: url,
              });
            } catch (error) {
              response({type: "result", status: "error", data: error});
            }
            response({type: "result", status: "success"});
          });
        });
    }

    // get recommendations message
    if (msg.command === "getRecommendations") {
        getUserEmail().then((email) => {
            getUserContacts().then((contacts) => {
                var promises = [];
                contacts.forEach((contact) => {
                    // sanitize contact email
                    contact = contact.replace(/[.$\[\]#\/]/g, "");
                    const ref = db.ref("recommendations/" + contact);
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
                    recs = recs.filter(rec => rec !== null);
                    const thumbnailPromises = recs.map(rec => getThumbnail(rec.url));
                    const titlePromises = recs.map(rec => getTitle(rec.url));
                    Promise.all(thumbnailPromises).then((thumbnails) => {
                        Promise.all(titlePromises).then((titles) => {
                            response({type: "result", status: "success", data: {thumbnails: thumbnails, titles: titles, recs: recs}});
                        });
                    });
                });
            });
        });
    }
    return true;
});


// get video thumbnail from youtube api
async function getThumbnail(url) {
    const video_id = url.split("v=")[1];
    const thumbnail_url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + video_id + "&key=" + YOUTUBE_API_KEY;
    return fetch(thumbnail_url).then((response) => {
        return response.json();
    }).then((data) => {
        return data.items[0].snippet.thumbnails.default.url;
    });
}

// get video title from youtube api
async function getTitle(url) {
    const video_id = url.split("v=")[1];
    const title_url = "https://www.googleapis.com/youtube/v3/videos?part=snippet&id=" + video_id + "&key=" + YOUTUBE_API_KEY;
    return fetch(title_url).then((response) => {
        return response.json();
    }).then((data) => {
        return data.items[0].snippet.title;
    });
}

// get user email address from chrome identity
function getUserEmail() {
    return new Promise((resolve) => {
      chrome.identity.getProfileUserInfo(function(userInfo) {
        resolve(userInfo.email);
      });
    });
  }
  
// get user contacts from Google People API
function getUserContacts() {
    return new Promise((resolve, reject) => {
      chrome.identity.getAuthToken({interactive: true}, async (token) => {
        try {
          var credential = firebase.auth.GoogleAuthProvider.credential(null, token);
          firebase.auth().signInWithCredential(credential);
          let init = {
            method: 'GET',
            async: true,
            headers: {
              Authorization: 'Bearer ' + token,
              'Content-Type': 'application/json',
            },
            'contentType': 'json',
          };
          let response = await fetch('https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=' + PEOPLE_API_KEY, init);
          let data = await response.json();
          let returnedContacts = data.memberResourceNames;
          let contacts = [];
          for (let i = 0; i < returnedContacts.length; i++) {
            let contactResponse = await fetch(
              'https://people.googleapis.com/v1/' + returnedContacts[i] + 
                '?personFields=emailAddresses&key=' + PEOPLE_API_KEY,
              init);
            let contactData = await contactResponse.json();
            let contact = contactData.emailAddresses[0].value;
            contacts.push(contact);
          }
          resolve(contacts);
        } catch (error) {
          console.error(error);
          reject(error);
        }
      });
    }); 
}