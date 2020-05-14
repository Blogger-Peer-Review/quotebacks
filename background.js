chrome.commands.onCommand.addListener(function(command) {
  
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
    file: 'newcontent.js'
  });
  


});
