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