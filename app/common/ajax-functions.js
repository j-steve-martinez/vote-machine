'use strict';

var appUrl = window.location.origin;
// console.log(appUrl);
var ajaxFunctions = {
   ready: function ready (fn) {
      if (typeof fn !== 'function') {
         return;
      }

      if (document.readyState === 'complete') {
         return fn();
      }

      document.addEventListener('DOMContentLoaded', fn, false);
   },
   ajaxRequest: function ajaxRequest (method, url, callback) {
      var xmlhttp = new XMLHttpRequest();

      xmlhttp.onreadystatechange = function () {
         if (xmlhttp.readyState === 4 && xmlhttp.status === 200) {
            callback(xmlhttp.response);
         }
      };

      xmlhttp.open(method, url, true);
      xmlhttp.send();
   }
};

// The XHR version follows: much more complex

// function retrieveImage(requestObj,imageNo) {
//   var request = new XMLHttpRequest();
//   request.open('GET', requestObj, true);
//   request.responseType = 'blob';
//   request.send();

//   request.onload = function() {
//     var objectURL = URL.createObjectURL(request.response);
//     thumbs[imageNo].setAttribute('src',objectURL);
//     thumbs[imageNo].onclick = function() {
//       mainImg.setAttribute('src',objectURL);
//       mainImg.className = 'blowup';
//         for(i = 0; i < thumbs.length; i++) {
//           thumbs[i].className = 'thumb darken';
//         }
//     }
//   }
// }
