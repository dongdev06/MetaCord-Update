/* eslint-disable linebreak-style */
"use strict";

module.exports = function (_defaultFuncs, api, _ctx) {
    return function getUID(link, callback) {
      var resolveFunc = function () { };
      var rejectFunc = function () { };
      var returnPromise = new Promise(function (resolve, reject) {
        resolveFunc = resolve;
        rejectFunc = reject;
      });
  
      if (!callback) {
        callback = function (err, uid) {
          if (err) return rejectFunc(err);
          resolveFunc(uid);
        };
      }
      
    try {
        var Link = String(link);
        var FindUID = require('../utils/Extension').getUID;
        if (Link.includes('facebook.com') || Link.includes('Facebook.com') || Link.includes('fb')) {
            var LinkSplit = Link.split('/');
            if (LinkSplit.indexOf("https:") == 0) {
              if (!isNaN(LinkSplit[3]) && !Link.split('=')[1]  && !isNaN(Link.split('=')[1])) {
                callback(null, 'Wrong link, link should be formatted as follows: facebook.com/Lazic.Kanzu');
              }
              else if (!isNaN(Link.split('=')[1]) && Link.split('=')[1]) {
                var Format = `https://www.facebook.com/profile.php?id=${Link.split('=')[1]}`;
                FindUID(Format, (data) => {
                  callback(null, data);
                });
              } 
              else {
                FindUID(Link, (data) => {
                  callback(null, data);
                });
              }
            }
            else {
                var Form = `https://www.facebook.com/${LinkSplit[1]}`;
                FindUID(Form, (data) => {
                  callback(null, data);
                });
            }
        }
        else {
            callback(null, 'Wrong link, link needs to be Facebook');
        }
    }
    catch (e) {
      return callback(null, e);
    }
    return returnPromise;
    };
  };