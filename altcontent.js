document.addEventListener('keydown', function(event) {
//  cmd + shift + S
  if (event.metaKey && event.shiftKey && event.which === 83) {

    var object = {};

    var text = getSelectionText();  
    
    var links = document.getElementsByTagName("link");
    if (getCanonical()){
      var page = getCanonical();    
    }else{
      var page = document.location.href;      
    };


    // https://stackoverflow.com/questions/10097988/chrome-extension-prevent-css-from-being-over-written
    // Create our iframe and style it so that we can see it...
    chrome.storage.local.get([page], function(result) {
      var page_object = {};        
      page_object["last_update"] = getDate();
      page_object["url"] = page;

      if(getMeta("twitter:title")){
        page_object["title"] = getMeta("twitter:title");
      } else if(getMeta("og:title")){
        page_object["title"] = getMeta("og:title");
      }else{
        page_object["title"] = document.title;
      }
      
      if(getMeta("author")){
        page_object["author"] = getMeta("author");  
      }else{
      page_object["author"] = getMeta("twitter:site");
      }

      var quotes = [];
      var quote = {};

      quote["text"] = text;
      quote["date"] = getDate();

      quotes.push(quote);

      if(result[page] == null){
        var combined = quotes;
      }
      else{
        var combined = quotes.concat(result[page]["quotes"])
      }

      page_object["quotes"] = combined;
      
      object[page] = page_object; 


      chrome.storage.local.set(object, function() {            
        console.log(object[page]["quotes"][0]);

      });


      // Web Component Stuff Start Here //
      var component = `
      <quoteback-popup url="${page_object["url"]}" text="${text}" author="${page_object["author"]}" title="${page_object["title"]}" favicon="https://s2.googleusercontent.com/s2/favicons?domain_url=${page_object["url"]}&sz=64"> 
      </quoteback-popup>    
      `;   
      var popup = document.createElement('div');
      popup.innerHTML = component;
      document.documentElement.appendChild(popup);
      popup.style.cssText = "background-color:white; width:670px; height:800px; position:fixed; border:none; top:0px; right:0px; z-index:2147483647;"

      const template = document.createElement('template');
      template.innerHTML=`
      <div class="citation-capture-519256" id="citation-capture-519256">
      <div class="citation-meta-519256">
      <form>
      <label class="citation-input-label-519256" for="Author">Author</label>
      <input class="citation-input-519256" id="author-field" name="Author" value="${page_object["author"]}"></input>
      </form>
      <form>
      <label class="citation-input-label-519256" for="Title">Title</label>
      <input class="citation-input-519256" id="title-field" name="Title" value="${page_object["title"]}"></input>
      </form>       
      </div>

      <div class="citation-bottom-519256">
      <div class="comment-519256">
      <input class="citation-input-519256" id="comment-field-519256" placeholder="+ Add Comment"></input>    
      <div class="save-indicator-519256">Saved</div>
      </div>
      <div>
      <button id="getlink-519256" class="control-button-519256"><> Embed</button>
      <button id="close-button-519256" class="control-button-519256">Close</button>
      </div>
      </div>

      <div class="allquotes-519256"><a target="_blank" class="quoteslink-519256" href="">All Quotes<img src="${chrome.runtime.getURL("images/allquotes.png")}"></a></div>

      </div>`;

      class Popup extends HTMLElement {
        constructor(){
          super();
          this.attachShadow({mode: 'open'});
          this.shadowRoot.appendChild(template.content.cloneNode(true));
          
          this.text = this.getAttribute('text');
          this.author = this.getAttribute('author');
          this.title = this.getAttribute('title'); 
          this.url = this.getAttribute('url')
          this.favicon = this.getAttribute('favicon');
        };

        set author(value) {
          this._author = value;
          if (this.shadowRoot)
            this.shadowRoot.querySelector('#author-field').value = value;
        };
        get author() {
          return this._author;
        };  
        set title(value) {
          this._title = value;
          if (this.shadowRoot)
            this.shadowRoot.querySelector('#title-field').innerHTML = value;
        };
        get title() {
          return this._title;
        };
        set url(value) {
          this._url = value;
          if (this.shadowRoot)
            this.shadowRoot.querySelector('.quoteslink-519256').href = value;
        };
        get url() {
          return this._url;
        };
        // set favicon(value) {
        //   this._favicon = value;
        //   if (this.shadowRoot)
        //     this.shadowRoot.querySelector('.mini-favicon').src = value;
        // };

      }
    window.customElements.define('quoteback-popup', Popup);        
    });
  }
});

  

function getSelectionText() {
    var text = "";
    if (window.getSelection) {
    
      // from here: https://gist.github.com/gleuch/2475825
      // selection range
      var range = window.getSelection().getRangeAt(0);

      // plain text of selected range (if you want it w/o html)
      var plaintext = window.getSelection();
      plaintext = plaintext.toString().replace(/(?:\r\n|\r|\n)/g, '<br>'); // replace line breaks with <br> tags
      plaintext = plaintext.replace(/(<br>)+$/g, ''); //remove trailing <br> if there is one
          
      // document fragment with html for selection
      var fragment = range.cloneContents();

      // make new element, insert document fragment, then get innerHTML!
      var div = document.createElement('div');
      div.appendChild( fragment.cloneNode(true) );

      // your document fragment to a string (w/ html)! (yay!)
      var text = div.innerHTML;


    } else if (document.selection && document.selection.type != "Control") { // think this is for IE?
    text = document.selection.createRange().text;
    }
    return plaintext.toString();
};

function getMeta(metaName) {
    const metas = document.getElementsByTagName('meta');

    for (let i = 0; i < metas.length; i++) {
      if (metas[i].getAttribute('name') === metaName) {
        return metas[i].getAttribute('content');
      } else if(metas[i].getAttribute('property') === metaName){ //for facebook meta property tags
        return metas[i].getAttribute('content');
      }
    }

    return '';
  };

function getCanonical() {
  var canonical = "";
  var links = document.getElementsByTagName("link");
  for (var i = 0; i < links.length; i ++) {
      if (links[i].getAttribute("rel") === "canonical") {
        if(links[i].getAttribute("href").includes("http")){  // ignore relative canonical links
          canonical = links[i].getAttribute("href")
        }
      }
  }
  return canonical;
  };  

function getDate(){
  var today = Number(new Date());
  return today;
};



// var AutoSave = (function(){

//   var timer = null;

// 	function save(object){
//         console.log("running save");
//         let iframe = document.getElementById("citation-iframe-519256"); // added
//         var commentbox = iframe.contentDocument.querySelector("#comment-field-519256");
//         var title = iframe.contentDocument.querySelector("#title-field")
//         var author = iframe.contentDocument.querySelector("#author-field");

//         var page = document.location.href;

//         object[page]["quotes"][0]["comment"] = commentbox.value;
//         object[page]["title"] = title.value;
//         object[page]["author"] = author.value;

//         chrome.storage.local.set(object, function() { 
//             console.log("autosaved");
//             if(iframe.contentDocument.querySelector(".save-indicator-519256").innerText == "Saving..."){
//               iframe.contentDocument.querySelector(".save-indicator-519256").innerHTML = "<span style='color:green'>Saved</span>"; // changed
//               iframe.contentDocument.querySelector(".portal-author-519256").innerHTML = author.value;
//               iframe.contentDocument.querySelector(".title-wrapper-519256").innerHTML = title.value;
//           };
//         });
            
//         };

// 	return { 

// 		start: function(object){
//             let iframe = document.getElementById("citation-iframe-519256"); // added
                 
//           iframe.contentDocument.addEventListener("keydown", function( event ) {
//               iframe.contentDocument.querySelector(".save-indicator-519256").innerText = "Saving..."; // changed
//           });            

// 			if (timer != null){
// 				clearInterval(timer);
// 				timer = null;
// 			}
// 			timer = setInterval(function(){
//                 save(object)
//             }, 500);
// 		},

// 		stop: function(){

// 			if (timer){ 
// 				clearInterval(timer);
// 				timer = null;
// 			}

// 		}
// 	}
 

// }());

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};