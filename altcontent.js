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
      page_object["favicon"] = favicon=`https://s2.googleusercontent.com/s2/favicons?domain_url=${page_object["url"]}&sz=64`

      object[page] = page_object; 


      chrome.storage.local.set(object, function() {            
        console.log(object[page]["quotes"][0]);

      });


      // Web Component Stuff Start Here //
      var component = `
      <quoteback-popup text="${text}" author="${page_object["author"]}" title="${page_object["title"]}">
        <quoteback-component slot="quoteback-component" url="${page_object["url"]}" text="${text}" author="${page_object["author"]}" title="${page_object["title"]}" favicon="${page_object["favicon"]}">
        </quoteback-component> 
      </quoteback-popup>    
      `;   

      // ABOVE - not sure the best way to get quoteback-internal.js here

      var popup = document.createElement('div');
      document.documentElement.appendChild(popup);
      popup.innerHTML = component;
      popup.style.cssText = "background-color:white; width:670px; height:auto; position:fixed; border:none; top:0px; right:0px; z-index:2147483647;"

      const template = document.createElement('template');
      template.innerHTML=`
      <link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("styles/styles.css")}">
      <div class="citation-capture-519256" id="citation-capture-519256">
      <div class="citation-meta-519256">
      <form>
      <label class="citation-input-label-519256" for="Author">Author</label>
      <input class="citation-input-519256" id="author-field" name="Author" value=""></input>
      </form>
      <form>
      <label class="citation-input-label-519256" for="Title">Title</label>
      <input class="citation-input-519256" id="title-field" name="Title" value=""></input>
      </form>       
      </div>

      <slot name="quoteback-component"></slot>

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

      <div class="allquotes-519256"><a target="_blank" class="quoteslink-519256" href="${chrome.runtime.getURL("options.html")}#${page}">All Quotes<img src="${chrome.runtime.getURL("images/allquotes.png")}"></a></div>

      </div>`;

      class QuotebackPopup extends HTMLElement {
        constructor(){
          super();
          this.attachShadow({mode: 'open'});
          this.shadowRoot.appendChild(template.content.cloneNode(true));
        
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
            this.shadowRoot.querySelector('#title-field').value = value;
        };
        get title() {
          return this._title;
        };
      }
      
      window.customElements.define('quoteback-popup', QuotebackPopup);
      embedquoteback();


      //
      //
      // COPY EMBED //
      var p = document.querySelector("quoteback-popup").shadowRoot;
      p.querySelector("#getlink-519256").addEventListener("click", function(event) {
        var embed = `
        <blockquote class="quoteback" data-title="${page_object["title"]}" data-author="${page_object["author"]}" cite="${page_object["url"]}">
          <p>${text}</p>
          <footer>${page_object["author"]} <cite><a href="${page_object["url"]}">${page_object["url"]}</a></cite></footer>
          <script note="SCRIPT GOES HERE" src=""></script>
        </blockquote>`;

        copyToClipboard(embed);
        console.log(p.querySelector("#getlink-519256"));
        p.querySelector("#getlink-519256").innerHTML = "Copied!";
        setTimeout(function() {
          p.querySelector("#getlink-519256").innerHTML = "<> Embed";
        }, 1000);
      });


      // SAVE & CLOSE //
      p.querySelector("#close-button-519256").addEventListener("click", function(event) {
        var paras = popup;
        if (paras){
          paras.parentNode.removeChild(paras);
        };         
        AutoSave.stop();              
        clearInterval(t); // stop timer
      });

      var time = 0;
      var textfocus = false;
      var ishover = false;
      var isPaused = false;
      txtAreaListenFocus();
      txtAreaListenBlur();


      p.addEventListener("mouseover", function( event ) {   
          ishover = true;
      });

      p.addEventListener("mouseout", function( event ) {   
          ishover = false;
      });

      AutoSave.start(object);

      var t = window.setInterval(function() {
          // timeout to remove popups
          if(!ishover && !textfocus) {
            time++;
            if(time > 5){
              if (popup){
                popup.parentNode.removeChild(popup);
              };
 
              AutoSave.stop();              
              clearInterval(t); // stop timer
            };
            // console.log(time + "is hover: "+ishover + "is textfocus:"+textfocus);
          }

        }, 1000);

        function txtAreaListenFocus(){
          var txtArea = p.querySelector('#comment-field-519256'); // changed
          var authorArea = p.querySelector('#author-field'); // changed
          var titleArea = p.querySelector('#title-field'); // changed
          authorArea.addEventListener('focus', function(event) {
             textfocus = true;
          }.bind(this));
          titleArea.addEventListener('focus', function(event) {
            textfocus = true;
         }.bind(this));
         txtArea.addEventListener('focus', function(event) {
          textfocus = true;
       }.bind(this));                               
        };

        function txtAreaListenBlur(){
          var txtArea = p.querySelector('#comment-field-519256'); // changed
          var authorArea = p.querySelector('#author-field'); // changed
          var titleArea = p.querySelector('#title-field'); // changed
          txtArea.addEventListener('blur', function(event) {
            textfocus = false;
          }.bind(this));
          authorArea.addEventListener('blur', function(event) {
            textfocus = false;
          }.bind(this));
          titleArea.addEventListener('blur', function(event) {
            textfocus = false;
          }.bind(this));
        };                          



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



var AutoSave = (function(){

  var timer = null;

	function save(object){
    // console.log("running save");
    var popup = document.querySelector("quoteback-popup").shadowRoot;
    var quote = document.querySelector("quoteback-component").shadowRoot;
    var commentbox = popup.querySelector("#comment-field-519256");
    var title = popup.querySelector("#title-field")
    var author = popup.querySelector("#author-field");

    var page = document.location.href;

    object[page]["quotes"][0]["comment"] = commentbox.value;
    object[page]["title"] = title.value;
    object[page]["author"] = author.value;

    chrome.storage.local.set(object, function() { 
        console.log("autosaved");
        if(popup.querySelector(".save-indicator-519256").innerText == "Saving..."){
          popup.querySelector(".save-indicator-519256").innerHTML = "<span style='color:green'>Saved</span>"; // changed
          quote.querySelector(".portal-author-519256").innerHTML = author.value;
          quote.querySelector(".title-wrapper-519256").innerHTML = title.value;
      };
    });
            
  };

	return { 

		start: function(object){
      var popup = document.querySelector("quoteback-popup").shadowRoot;                 
      popup.addEventListener("keydown", function( event ) {
          popup.querySelector(".save-indicator-519256").innerText = "Saving..."; // changed
      });            

			if (timer != null){
				clearInterval(timer);
				timer = null;
			}
			timer = setInterval(function(){
        save(object)
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

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};
