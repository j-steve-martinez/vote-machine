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
   },
   getAllPolls: function getAllPolls(){
       console.log('getAllPolls started');
       var myHeaders = new Headers();

       var myInit = { method: 'GET',
                  headers: myHeaders,
                  // mode: 'cors',
                  cache: 'default' };

       var url = '/api/allPolls'
       var myRequest = new Request(url, myInit);
       fetch(myRequest).then(res => {
         console.log('allPolls fetch res');
         console.log(res.json());

         return res.json();
         // this.setState({user : data});
       }).then(allPolls => {
         console.log('allPolls then');
         console.log(allPolls);
         // this.setState(myBlob);
       });
   }
};
