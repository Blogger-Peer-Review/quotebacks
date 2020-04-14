// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

chrome.browserAction.setPopup({popup:''});  //disable browserAction's popup

chrome.browserAction.onClicked.addListener(()=>{
  chrome.tabs.create({url:'options.html'});
});

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    chrome.tabs.create({url:'welcome.html'});
  }else if(details.reason == "update"){
      var thisVersion = chrome.runtime.getManifest().version;
      console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
});



