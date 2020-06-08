chrome.storage.local.get(null, function(items) {
  allKeys = Object.keys(items);
});

chrome.commands.onCommand.addListener(function(command) {
  
  //send ping. If no response then load scripts.
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, {message: "ping"}, function(response) {
      if(response){
        // Send copyquote command
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
          chrome.tabs.sendMessage(tabs[0].id, {message: "copyquote"}, function(response) {
            
          });
        });
        
      }
      else{

        chrome.tabs.executeScript({
          file: 'webcomponents-sd-ce.js'
        });
      
        chrome.tabs.executeScript({
          file: 'quoteback-internal.js'
        });
      
        chrome.tabs.executeScript({
          file: 'quotestyle.js'
        });  
        
        chrome.tabs.executeScript({
          file: 'rangy-core.js'
        });

        chrome.tabs.executeScript({
          file: 'turndown.js'
        });        

        // files for highlighter
        /*
        chrome.tabs.executeScript({
          file: 'rangy-classapplier.js'
        });

        chrome.tabs.executeScript({
          file: 'rangy-highlighter.js'
        });        

        chrome.tabs.insertCSS({
          file: 'styles/quoteback-highlighter.css'
        });
        */
      
        chrome.tabs.executeScript({
          file: 'newcontent.js',
        },
        function(){
          // Send copyquote command
          chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
            chrome.tabs.sendMessage(tabs[0].id, {message: "copyquote"}, function(response) {
              
            });
          }); 
        }
        );

      }
      
    });
  }); 

});


chrome.browserAction.setPopup({popup:''});  //disable browserAction's popup


// proof of concept that can watch for pages in DB then:
// retrieve serializedhighlights
// send message to page to deserialize highlights
//requires webNavigation permission in manifest.json
/*
chrome.webNavigation.onCompleted.addListener(function(e) {
  if (allKeys.includes(e.url)){
    console.log("page in DB");
    }
  });
*/


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