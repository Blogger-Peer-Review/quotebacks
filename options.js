var debug = localStorage.getItem("quotebackdebug");
if(debug){console.log("Debug set to true")};

var alldata;
var allKeys;
var alljson = [];
var sorted = [];

document.addEventListener("DOMContentLoaded", function(){
  chrome.storage.local.get(null, function(items) {
    allKeys = Object.keys(items);
    

    //only run all the code if there are items in the DB
    if(allKeys.length != 0){
      
    alldata = items;

    if(debug){console.log(alldata)};
    embedquoteback();

    //create sorted array by last_updated 
    for (var item in items) {
      //for quotes with no last_mod
      //i.e. beta users
      if(!items[item].last_update){
        items[item].last_update = "1546347661"
      }
      sorted.push([item, items[item].last_update]);
    }
    sorted.sort(function(a,b){
      return a[1] - b[1]
    })    
    sorted.reverse();

    for( var i in sorted){

      alljson.push(items[sorted[i][0]]);

      const article_fragment = document.getElementById('articleItem');
      const article_instance = document.importNode(article_fragment.content, true);
      // Add relevant content to the template

      var domain = extractHostname(items[sorted[i][0]].url);
      article_instance.querySelector('.title').innerHTML = items[sorted[i][0]].title;
      article_instance.querySelector('.mini-favicon').src = "https://s2.googleusercontent.com/s2/favicons?domain_url="+domain+"&size=64";
      article_instance.querySelector('.url').innerHTML = domain;
      article_instance.querySelector('.article').setAttribute("data-id",items[sorted[i][0]].url);

      

      // Append the instance ot the DOM
      document.getElementById('article-scrollContainer').appendChild(article_instance);
    }

    alljson = JSON.stringify(alljson);
    alljson = JSON.parse(alljson);

    var pagehash = $(location).attr('hash').replace("#","");

    if($(location).attr('hash')){
      if(allKeys.includes(pagehash)){ // error handling for some mishandled hash value
        displayquotes(pagehash)
    }else{
      displayquotes(sorted[0][0]);
    };
    }else{
      displayquotes(sorted[0][0]);
    }

    window.addEventListener('hashchange', function() {
      var hashval = $(location).attr('hash').replace("#","");
      if(allKeys.includes(hashval)){ // check hash is a valid entry in data
        displayquotes(hashval)
      };
    }, false);
      
    $( ".article" ).click(function() {
      var url = $(this).attr('data-id');
      displayquotes(url);

    });
    
    $('#rightpanel').on('click',"#copy", function() {

      var quote = $(this).closest(".quote-container").find("#quoteback-component");
      var text = decodeURIComponent(quote.attr("text"));

      var htmlfragment = document.createRange().createContextualFragment(text);
      var cleaned = htmlfragment.textContent;

      copyToClipboard(cleaned);
      var el = $(this);
      el.html("Copied!");
      setTimeout(function() {
        el.html("Copy Text");
      }, 1000);
    });

    $('#rightpanel').on('click',"#embedLink", function() {

      var quote = $(this).closest(".quote-container").find("#quoteback-component");

      var title = $(".selected").find(".title").text();
      var url = $(".selected").attr("data-id");
      var text = quote.attr("text");

      // if we want to use text instead of html inside the blockquote we should use this:
      // https://ourcodeworld.com/articles/read/376/how-to-strip-html-from-a-string-extract-only-text-content-in-javascript
      // however we'd then need to move to storing the html string in an attribute in the web component
      //var stripedHtml = decodeURIComponent(text).replace(/<[^>]+>/g, '');
      
      
      var author = quote.attr("author");

      var embed = `
<blockquote class="quoteback" darkmode="" data-title="${encodeURIComponent(title)}" data-author="${author}" cite="${url}">
${decodeURIComponent(text)}
<footer>${author}<cite> <a href="${url}">${url}</a></cite></footer>
</blockquote><script note="" src="https://cdn.jsdelivr.net/gh/Blogger-Peer-Review/quotebacks@1/quoteback.js"></script>`;

        copyToClipboard(embed);
        let el = $(this);
        el.html("Copied!");
        setTimeout(function() {
          el.html("<> Embed");
        }, 1000);
      });

    // use html2screenshot to generate canvas, copy img to clipboard
    $('#rightpanel').on('click',"#copyimg", function() {
      var el = $(this);

      quote = el.closest(".quoteblock");
      quote = quote[0].querySelector("quoteback-component");
      if(debug){console.log(quote)};

      var newDiv = document.createElement("div"); 
      newDiv.id = "copyimage";
      newDiv.innerHTML = quote.shadowRoot.innerHTML;
      
      //position div offscreen to prevent flicker
      document.getElementById("panel-scrollContainer").style.height = "3000px";
      newDiv.style.bottom = "-999px";
      newDiv.style.position = "absolute";
      newDiv.style.width = "500px";
      newDiv.style.padding = "7px 7px 7px 7px";
      
      var content = newDiv.querySelector(".quoteback-content");
      newDiv.querySelector(".quoteback-container").setAttribute("style", "margin: 0px 0px 0px 0px");
      if(navigator.userAgent.indexOf("Firefox") != -1 ){ 
        console.log("firefox only");
        newDiv.querySelector(".quoteback-container").setAttribute("style", "margin: 0px 0px 0px 0px; font-family: 'Inter';");
        newDiv.querySelector(".quoteback-content").setAttribute("style", "font-family:'Inter' !important; font-weight:400;");
      };
      var ems = content.querySelectorAll("div.quoteback-content > em");
      if(content.querySelector("em")){
        content.querySelector("em").setAttribute("style", "font-family:'Inter' !important; font-style: italic;");
      }
      

      ems.forEach(function(emItem) {
        emItem.setAttribute("style", "font-family:'Inter' !important; font-style: italic;");
      });      

      document.getElementById("panel-scrollContainer").appendChild(newDiv);


      //stop the "go to text" element rendering in the image
      document.getElementById("copyimage").querySelector(".quoteback-backlink").setAttribute("data-html2canvas-ignore", "true");

      // use faviconkit for screenshots for CORS
      var url = document.getElementById("copyimage").querySelector(".quoteback-arrow").href;
      var hostname = (new URL(url)).hostname;
      document.getElementById("copyimage").querySelector(".mini-favicon").src = "https://api.faviconkit.com/"+hostname;

      var title = document.getElementById("copyimage").querySelector(".quoteback-title");
      if(title.innerHTML.length > 65){ // html2canvas doesn't support text-overflow:ellipses
        title.innerHTML = title.innerHTML.substring(0,60);
        title.innerHTML = title.innerHTML + "...";
      }
    

      html2canvas(document.getElementById("copyimage"), {
        useCORS: true,
        onclone: function(document) {
        }
      }).then((canvas) => {
        canvas.toBlob(function(blob) {
          saveAs(canvas.toDataURL(), url+'.png');
          var item = new ClipboardItem({ "image/png": blob });
          navigator.clipboard.write([item]).then(
            function() {
              console.log("Copied to clipboard successfully!");
              
              var element = document.getElementById("copyimage");
              if(debug){}else{
                element.parentNode.removeChild(element);
              }

              document.getElementById("panel-scrollContainer").style.height = "initial";

              el.html("Copied!");
              setTimeout(function() {
                el.html("Copy Image");
              }, 1000);
            },
            function(error) {
              console.error("unable to write to clipboard. Error:");
              console.log(error);
            }
          );
        });
      }).catch(function (error) {
          console.log('oops, something went wrong!', error);
      });
    
    
    
    

    });
  

// used in html2canvas
function saveAs(uri, filename) {

      var link = document.createElement('a');
  
      if (typeof link.download === 'string') {
  
          link.href = uri;
          link.download = filename;
  
          //Firefox requires the link to be in the body
          document.body.appendChild(link);
  
          //simulate click
          link.click();
  
          //remove the link when done
          document.body.removeChild(link);
  
      } else {
  
          window.open(uri);
  
      }
  }

    // convert quote to markdown using turndown.js
    $('#rightpanel').on('click',"#copymd", function() {
      var el = $(this);

      quote = el.closest(".quoteblock");
      quote = quote[0].querySelector("quoteback-component");

      var html = `<blockquote>${quote.text}</blockquote>
      Source: <a href="${quote.url}">${quote.title}</a> by ${quote.author}`;

      const turndownService = new TurndownService();

      const markdown = turndownService.turndown(html);

      copyToClipboard(markdown);

      el.html("Copied!");
      setTimeout(function() {
        el.html("Copy Markdown");
      }, 1000);

    });

    // Delete QUOTE
    $('#rightpanel').on('click',"#delete", function() {
      
      var r = confirm("Are you sure you want to delete this quote?");
      if (r == true) {
        
        var url = $(".selected").attr("data-id");
        var quoteblock = $(this).closest('.quoteblock');
        var index = $(".quoteblock").index(quoteblock);
        var quotes = alldata[url]["quotes"];
        var removed = quotes.splice(index,1);
        alldata[url]["quotes"] = quotes;
        if(quotes.length == 0){ //if no quotes left then delete whole item from alldata
          chrome.storage.local.remove(url, function (){
            console.log("deleted "+url);
            location.reload();
          });
        }else{
        chrome.storage.local.set(alldata, function(){ 
          console.log("saving data");
          displayquotes(url);
        }); 
      }
      
      } else {
      } 
    });    

    // DELETE ARTICLE
    $('#titlebar').on('click',"#titlebar-delete", function(){
      var r = confirm("Are you sure you want to delete this entire article?")
      if (r == true) {
        var url = $(".selected").attr("data-id");
        chrome.storage.local.remove(url, function(){ // delete entire item from alldata
          location.reload();
          
        });
      }else{
      }
    });






    // on title/author -> trigger autosave
    $( "#rightpanel" ).on("focus" , "#titlebar-author", function() {
      var el = $(this);
      var url = $(".selected").attr("data-id");
      var object = alldata[url];
      AutoSaveTitle.start(object, el ,url);
      $("#titlebar-author").keypress(function(e){ // prevent return in title
        if(e.which == 13){
          $("#titlebar-author").blur();
        }
        return e.which != 13;
        
       });
    });

    $( "#rightpanel" ).on("focusout" , "#titlebar-author", function() {
      AutoSaveTitle.stop();
    });

    $( "#rightpanel" ).on("focus" , "#titlebar-title", function() {
      var el = $(this);
      var url = $(".selected").attr("data-id");
      var object = alldata[url];
      AutoSaveTitle.start(object, el ,url);
      $("#titlebar-title").keypress(function(e){ // prevent return in title
        if(e.which == 13){
          $("#titlebar-title").blur();
        }
        return e.which != 13;
        
       });
    });

    $( "#rightpanel" ).on("focusout" , "#titlebar-title", function() {
      AutoSaveTitle.stop();
    });
    
    
    
    // on focus comment box -> trigger autosave
    $( "#rightpanel" ).on("focus" , ".comment", function() {
      
      var url = $(".selected").attr("data-id");
      var object = alldata[url];
      if($(this).text() == "Add comment"){
        $(this).text("");
      };
      $(this).css("color","#464A4D")
      var el = $(this);
      AutoSave.start(object, el , $(this).index(".comment"),url);
    });

    // on focusout comment box -> stop autosave
    $( "#rightpanel" ).on("focusout" , ".comment", function() {
      AutoSave.stop();
    });    
  };
  });
});


document.addEventListener("DOMContentLoaded", function(){

// Import function
document.getElementById("importQuotes").onclick = function(){
  document.getElementById('fileid').click();
};

document.getElementById('fileid').onchange = function(evt) {
  try {
      let files = evt.target.files;
      if (!files.length) {
          alert('No file selected!');
          return;
      }
      let file = files[0];
      let reader = new FileReader();
      const self = this;
      var importobject = {};
      reader.onload = (event) => {
          var importitems = JSON.parse(event.target.result);
          //console.log('FILE CONTENT', event.target.result);

          chrome.storage.local.set(importitems, function() {            
            console.log("import done!");
            location.reload();
    
          });

          //console.log(importitems);
      };
      reader.readAsText(file);
  } catch (err) {
      console.error(err);
  }
}

// CLEAR STORAGE
document.getElementById("clearStorage").onclick = function(){
  var r = confirm("Are you sure you want to delete all citations?!");
  if (r == true) {
    chrome.storage.local.clear();
    location.reload();
  } else {
  } 
};

// Export function
document.getElementById("exportQuotes").onclick = function(){
  var dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(alldata, null, 2));
  var d = new Date();
  var curr_date = d.getDate();
  var curr_month = d.getMonth() + 1; //Months are zero based
  var curr_year = d.getFullYear();
  var a = document.createElement("a");
  a.setAttribute("href",     dataStr     );
  a.setAttribute("download", curr_date + "-" + curr_month + "-" + curr_year +"-quoteback.json");
  a.click();
};
});






function displayquotes(url){

  if(alldata[url]){

  document.getElementById('panel-scrollContainer').innerHTML = "";

  window.location.hash = url;

  const fragment = document.getElementById('quote');

  var offset = $(".article[data-id='"+url+"']").offset();
  if(offset){
    $("#article-scrollContainer").scrollTop(offset.top);
  }
    
  alldata[url].quotes.forEach(item => {

    var date = new Date(item.date);
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    
    date = mm + '/' + dd + '/' + yyyy;
    var datefield = date;

    var quotetext = document.createElement("div");
    quotetext.innerHTML = item.text;
    if(debug){console.log(quotetext.textContent)};

    var quotetemplate = `
    <div class="quoteblock">
      <div class="meta">
      <div class="date">Created ${datefield}</div>
      <div class="linkback"><a target="_blank" rel="noopener" href="${url}#:~:text=${encodeURIComponent(quotetext.textContent)}">View Original</a></div>
      </div>
      <div class="quote-container">
        <quoteback-component id="quoteback-component" url="${url}" text="${encodeURIComponent(item.text)}" author="${alldata[url].author}" title="${encodeURIComponent(alldata[url].title)}" favicon="https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&size=64"> 
        </quoteback-component> 
        <div class="quote-controls">
          <button id="embedLink" class="options-control-button"><> Embed</button>        
          <button id="copyimg" class="options-control-button">Copy Image</button>        
          <button id="copy" class="options-control-button">Copy Text</button>
          <button id="copymd" class="options-control-button">Copy Markdown</button>
          <button id="delete" class="options-control-button">Delete</button>        
        </div>
      </div>
    <div class="comment" contenteditable="true" ${item.comment ? "style='color:#464A4D'" : ""}>${item.comment ? item.comment : "Add Comment"}</div>
    </div>
    `;
    
    embedquoteback();
    // Append the instance ot the DOM
    document.getElementById('panel-scrollContainer').insertAdjacentHTML("beforeend", quotetemplate);

    

    $( ".article" ).each(function() {
      $( this ).removeClass( "selected" );
    });

    $(".article[data-id='"+url+"']").addClass( "selected" );

    // Update the Title Bar
    var titlebar = document.getElementById('titlebar');
    titlebar.querySelector("#titlebar-author").innerHTML = alldata[url].author;
    titlebar.querySelector("#titlebar-title").innerHTML = alldata[url].title;

  });
  }
};

// COPY TO CLIPBOARD

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }
  return hostname 
};



// HOVER TO SHOW CONTROLS

$(document).on('mouseenter mouseleave', '.quoteblock', function(e) {
    if (e.type == "mouseenter"){

      $(this).find('.quote-controls').addClass('showcontrols');
    }else{
      $(this).find('.quote-controls').removeClass('showcontrols');
    }
});


// AUTOSAVE FUNCTION
var AutoSave = (function(){
  var timer = null;

  function save(object, el, index, url){
    console.log("running save");
    console.log(el);
    alldata[url]["quotes"][index]["comment"] = el.text();
    chrome.storage.local.set(alldata, function(){ 
      console.log("autosaved");
    });          
  };

  function restore(){ //don't think I actually need this restore function...?
    var page = document.location.href;
    var saved = "";
    chrome.storage.local.get([page], function(result) {
        saved = result[page]["quotes"][0]["comment"];
    });

    var editor = getEditor();
    if (saved && editor){
      editor.value = saved; 
    }
  }

  return { 

    start: function(object, el, index, url){

      if (timer != null){
        clearInterval(timer);
        timer = null;
      }
      timer = setInterval(function(){
                save(object, el, index, url)
            }, 500);
    },

    stop: function(){

      if (timer){ 
        clearInterval(timer);
        timer = null;
      }

    }
  }
}());

// AUTOSAVE Meta Title / Author FUNCTION
var AutoSaveTitle = (function(){
  var timer = null;

  function save(object, el, url){
    console.log("running autosavetitle");
    console.log(el);
    var author = document.getElementById("titlebar-author").textContent;
    var title = document.getElementById("titlebar-title").textContent;
    alldata[url]["author"] = author;
    alldata[url]["title"] = title;
    chrome.storage.local.set(alldata, function(){ 
      var quoteelems = document.getElementsByTagName("quoteback-component");
      for(var i = 0; i < quoteelems.length; i++){
        quoteelems[i].author = author;
        quoteelems[i].title = title;
      }
      
      console.log("autosaved");
    });          
  };

  return { 

    start: function(object, el, url){

      if (timer != null){
        clearInterval(timer);
        timer = null;
      }
      timer = setInterval(function(){
                save(object, el, url)
            }, 500);
    },

    stop: function(){

      if (timer){ 
        clearInterval(timer);
        timer = null;
      }

    }
  }
}());


document.addEventListener("DOMContentLoaded", function(){
  $(".comment").resizable();
});

document.addEventListener("DOMContentLoaded", function(){
    var articleOptions = document.getElementById("titlebar-options");
    var dropdown = document.getElementById("titlebar-dropdown");

    var addMenu = function addDropDownMenu() {
      dropdown.classList.add("on");
    };
    var removeMenu = function removeDropDownMenu() {
      dropdown.classList.remove("on");
    };
    articleOptions.addEventListener("mouseover", addMenu);
    articleOptions.addEventListener("mouseout", removeMenu);
});

document.addEventListener("DOMContentLoaded", function(){
    var globalOptions = document.getElementById("global-options-button");
    var dropdown = document.getElementById("global-options");

    var addMenu = function addDropDownMenu() {
      dropdown.classList.add("on");
    };
    var removeMenu = function removeDropDownMenu() {
      dropdown.classList.remove("on");
    };
    // Add mouse over event to show menu
    globalOptions.addEventListener("mouseover", addMenu);
    // Add mouse out event to remove menu
    globalOptions.addEventListener("mouseout", removeMenu);
});




// $("#leftnav").resizable({
//     // only use the eastern handle
//     handles: 'e',
//     // restrict the width range
//     minWidth: 120,
//     maxWidth: 450,
//     // resize handler updates the content panel width
//     resize: function(event, ui){
//         var currentWidth = ui.size.width;

//         // this accounts for padding in the panels + 
//         // borders, you could calculate this using jQuery
//         var padding = 12; 

//         // this accounts for some lag in the ui.size value, if you take this away 
//         // you'll get some instable behaviour
//         $(this).width(currentWidth);

//         // set the content panel width
//         $("#rightpanel").width(containerWidth - currentWidth - padding);            
//     }
// });