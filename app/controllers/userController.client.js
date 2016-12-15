'use strict';

// (function () {

  //  var profileId = document.querySelector('#profile-id') || null;
  //  var profileUsername = document.querySelector('#profile-username') || null;
  //  var profileRepos = document.querySelector('#profile-repos') || null;
  //  var displayName = document.querySelector('#display-name');
   var apiUrl = appUrl + '/api/:id';
   console.log(apiUrl);
   var auth;
  //  function updateHtmlElement (data, element, userProperty) {
  //     element.innerHTML = data[userProperty];
  //  }

   ajaxFunctions.ready(ajaxFunctions.ajaxRequest('GET', apiUrl, function (data) {
     console.log('userController auth');
     console.log(data);
     auth = data;
    //  if (typeof data === 'object') {
    //    var userObject = JSON.parse(data);
    //    console.log(userObject);
    //    if (userObject.displayName !== null) {
    //       updateHtmlElement(userObject, displayName, 'displayName');
    //    } else {
    //       updateHtmlElement(userObject, displayName, 'username');
    //    }
     //
    //    if (profileId !== null) {
    //       updateHtmlElement(userObject, profileId, 'id');
    //    }
     //
    //    if (profileUsername !== null) {
    //       updateHtmlElement(userObject, profileUsername, 'username');
    //    }
     //
    //    if (profileRepos !== null) {
    //        updateHtmlElement(userObject, profileRepos, 'publicRepos');
    //    }
    //  }
   }));
// })();
