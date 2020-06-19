// let gettingAllCommands = browser.commands.getAll();
// gettingAllCommands.then((commands) => {
//   for (let command of commands) {
//     // Note that this logs to the Add-on Debugger's console: https://developer.mozilla.org/en-US/Add-ons/WebExtensions/Debugging
//     // not the regular Web console.
//     console.log(command);
//   }
// });


//chrome.storage.local.get(null, function(items) {
//  allKeys = Object.keys(items);
//});

chrome.commands.onCommand.addListener(function(command) { 
  copyquote();
});

chrome.browserAction.setPopup({popup:''});  //disable browserAction's popup

chrome.browserAction.onClicked.addListener(()=>{
  chrome.tabs.create({url:'options.html'});
});

// Check whether new version is installed
chrome.runtime.onInstalled.addListener(function(details){
  if(details.reason == "install"){
    chrome.tabs.create({url:'https://quotebacks.net/welcome.html'});
  }else if(details.reason == "update"){
      var thisVersion = chrome.runtime.getManifest().version;
      console.log("Updated from " + details.previousVersion + " to " + thisVersion + "!");
  }
});

chrome.runtime.onInstalled.addListener(function() {
  // Create a parent item and two children.
  chrome.contextMenus.create({"title": "Quoteback: Copy Quote", "id": "quoteback","contexts":["selection"]});
  chrome.contextMenus.onClicked.addListener(onClickHandler);
});


function onClickHandler(info, tab) {
  if (info.menuItemId == "quoteback") {
   copyquote();
  }
};

function copyquote(){
  // console.log("invoke the quotebacks!")
  //send ping. If no response then load scripts.


chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  chrome.tabs.sendMessage(tabs[0].id, {message: "ping"}, function(response) {
    if(response){
      // Send copyquote command
      console.log("we heard a response and we are sending a message to newcontent.js");
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {message: "copyquote"}, function(response) {
          
        });
      });
      
    }
    else{
      console.log("we didn't hear a response and now we're waiting to load some scripts...");
      chrome.tabs.executeScript({
        file: 'webcomponents-sd-ce.js'
      },function(){
        chrome.tabs.executeScript({
          file: 'quotestyle.js'
        },function(){
          chrome.tabs.executeScript({
            file: 'rangy-core.js'
          },function(){
            chrome.tabs.executeScript({
              file: 'turndown.js'
            },function(){
              chrome.tabs.executeScript({
                file: 'newcontent.js',
              },function(){
                chrome.tabs.executeScript({
                  file: 'quoteback-internal.js'
                },function(){
                    // console.log("...and now that those scripts are loaded we are sending a message to newcontent.js");
                    // Send copyquote command
                    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
                      chrome.tabs.sendMessage(tabs[0].id, {message: "copyquote"}, function(response) {
                      });
                    }); 
                });
              });
            });
          });
        });
      });
    };
    
    
  });
});
}

