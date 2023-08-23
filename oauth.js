// window.onload = function() {
//     document.querySelector('button').addEventListener('click', function() {
//       chrome.identity.getAuthToken({interactive: true}, function(token) {
//         let init = {
//           method: 'GET',
//           async: true,
//           headers: {
//             Authorization: 'Bearer ' + token,
//             'Content-Type': 'application/json'
//           },
//           'contentType': 'json'
//         };
//         fetch(
//             'https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=AIzaSyCT-6VL-ZLI4jrnxL9X3eMonEfvr9c3AUo',
//             init)
//             .then((response) => response.json())
//             .then(function(data) {
//               let photoDiv = document.querySelector('#friendDiv');
//               let returnedContacts = data.memberResourceNames;
//               for (let i = 0; i < returnedContacts.length; i++) {
//                 fetch(
//                     'https://people.googleapis.com/v1/' + returnedContacts[i] +
//                         '?personFields=photos&key=AIzaSyCT-6VL-ZLI4jrnxL9X3eMonEfvr9c3AUo',
//                     init)
//                     .then((response) => response.json())
//                     .then(function(data) {
//                       let profileImg = document.createElement('img');
//                       profileImg.src = data.photos[0].url;
//                       photoDiv.appendChild(profileImg);
//                     });
//               };
//             });
//       });
//     });
//   };
API_KEY = "AIzaSyCT-6VL-ZLI4jrnxL9X3eMonEfvr9c3AUo";


// get the user's email address
function getUserEmail() {
  return new Promise((resolve) => {
    chrome.identity.getProfileUserInfo(function(userInfo) {
      resolve(userInfo.email);
    });
  });
}

// get the user's contacts
function getUserContacts() {
  return new Promise((resolve, reject) => {
    chrome.identity.getAuthToken({interactive: true}, async (token) => {
      try {
        let init = {
          method: 'GET',
          async: true,
          headers: {
            Authorization: 'Bearer ' + token,
            'Content-Type': 'application/json',
          },
          'contentType': 'json',
        };
        let response = await fetch('https://people.googleapis.com/v1/contactGroups/all?maxMembers=20&key=AIzaSyCT-6VL-ZLI4jrnxL9X3eMonEfvr9c3AUo', init);
        let data = await response.json();
        let returnedContacts = data.memberResourceNames;
        let contacts = [];
        for (let i = 0; i < returnedContacts.length; i++) {
          let contactResponse = await fetch(
            'https://people.googleapis.com/v1/' + returnedContacts[i] + 
              '?personFields=emailAddresses&key=AIzaSyCT-6VL-ZLI4jrnxL9X3eMonEfvr9c3AUo',
            init);
          let contactData = await contactResponse.json();
          let contact = contactData.emailAddresses[0].value;
          contacts.push(contact);
        }
        resolve(contacts);
        console.log("contacts: ", contacts);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }); 
}