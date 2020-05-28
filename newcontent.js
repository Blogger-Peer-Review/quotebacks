chrome.runtime.onMessage.addListener(
  function(request, sender, sendResponse) {

    // tell background.js that we're loaded and alive
    if (request.message == "ping"){
      sendResponse({alive: "loaded"});
    }

    var selectionChecker = (window.getSelection().toString());
    // run the popup on message from background.js if there is no selection text
    
    if (request.message == "copyquote" && selectionChecker == ""){
      return null;
    } else if (request.message == "copyquote" && selectionChecker != ""){

      console.log("my selection type is " + window.getSelection.typeof);

      closePopup();
      
      var object = {};
      var highlighter;

      rangy.init();
    
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
    
        if(result[page] == null){
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
          }
        else{
          page_object["title"] = result[page]["title"];
          page_object["author"] = result[page]["author"];

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
        <quoteback-popup text="${encodeURIComponent(text)}" author="${page_object["author"]}" title="${page_object["title"]}">
        <quoteback-component slot="quoteback-component" url="${page_object["url"]}" text="${encodeURIComponent(text)}" author="${page_object["author"]}" title="${page_object["title"]}" favicon="${page_object["favicon"]}" editable="true">
        </quoteback-component> 
        </quoteback-popup>    
        `;   
    
        // ABOVE - not sure the best way to get quoteback-internal.js here
    
        var popup = document.createElement('div');
        document.documentElement.appendChild(popup);
        popup.innerHTML = component;
        popup.style.cssText = "background-color:white; width:670px; height:auto; position:fixed; border:none; top:0px; right:0px; z-index:2147483647;"
    
        var template = document.createElement('template');
        template.innerHTML=`
        <link rel="stylesheet" type="text/css" href="${chrome.runtime.getURL("styles/styles.css")}">
        <div class="citation-capture" id="citation-capture">
    
        <slot name="quoteback-component"></slot>
    
        <div class="citation-tools">
        <div class="comment-field">
        <input class="citation-input" placeholder="Add comment"></input>    
          <div class="save-indicator">Saved</div>
        </div>
        <div class="tools-buttons">
          <button id="getlink" class="control-button"><> Embed</button>
          <button id="getMarkdown" class="control-button">Copy Markdown</button>
          <a target="_blank" id="quoteslink" class="control-button" href="${chrome.runtime.getURL("options.html")}#${page}">All Quotes<img src="${chrome.runtime.getURL("images/allquotes.png")}"></a>
          <button id="close-button" class="control-button">Close</button>
        </div>
        </div>
    
        </div>
        `;
    
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
        }

        if (customElements.get('quoteback-popup')){
        null;
        }else{
        window.customElements.define('quoteback-popup', QuotebackPopup)  
        }
        embedquoteback();
    
        //
        //
        // COPY EMBED //
        var p = document.querySelector("quoteback-popup").shadowRoot;
        p.querySelector("#getlink").addEventListener("click", function(event) {
          var embed = `<blockquote class="quoteback" data-title="${page_object["title"]}" data-author="${page_object["author"]}" cite="${page_object["url"]}">
${text}
<footer>${page_object["author"]} <cite><a href="${page_object["url"]}">${page_object["url"]}</a></cite></footer>
</blockquote>
<script note="REPLACE WITH REAL SCRIPT" src="https://cdn.jsdelivr.net/gh/tomcritchlow/Citations-Magic@tom-branch/quoteback.js"></script>`;
      
          copyToClipboard(embed);
          console.log(p.querySelector("#getlink"));
          p.querySelector("#getlink").innerHTML = "Copied!";
          setTimeout(function() {
              p.querySelector("#getlink").innerHTML = "<> Embed";
          }, 1000);
        });

        // COPY MARKDOWN //
        var p = document.querySelector("quoteback-popup").shadowRoot;
        p.querySelector("#getMarkdown").addEventListener("click", function(event) {

          var htmlembed = `<blockquote>${text}</blockquote>
          Source: <a href="${page_object["url"]}">${page_object["title"]}</a> by ${page_object["author"]}`;
      
          const turndownService = new TurndownService();

          const markdown = turndownService.turndown(htmlembed);
    
          copyToClipboard(markdown);
          
          p.querySelector("#getMarkdown").innerHTML = "Copied!";
          setTimeout(function() {
              p.querySelector("#getMarkdown").innerHTML = "Copy Markdown";
          }, 1000);
        });        
    
    
        appendIcon();
        function appendIcon(){
          var popup = document.querySelector("quoteback-popup");
          var quote = popup.querySelector("quoteback-component").shadowRoot;
          quote.querySelector(".quoteback-title").classList.add("editable");
          quote.querySelector(".quoteback-author").classList.add("editable");
        };

        // SAVE & CLOSE //
        p.querySelector("#close-button").addEventListener("click", function(event) {
        closePopup()           
        clearInterval(t); // stop timer
        });
    
        // Close popup on "all quotes" button
        p.querySelector("#quoteslink").addEventListener("click", function(event) {
        closePopup()           
        clearInterval(t); // stop timer
        });      
    
        // Close popup on tab focus out
        // window.onblur = onBlur;
        // function onBlur() {
        //   closePopup()           
        //   clearInterval(t); // stop timer
        // };
        
        // rangy highlight selection code
        // remember to uncomment background.js files too
        /*
        highlighter = rangy.createHighlighter();

        highlighter.addClassApplier(
          rangy.createClassApplier("quotebackhighlight", {
            ignoreWhiteSpace: true,
            tagNames: ["span", "a"]
          })
        );

        highlighter.highlightSelection("quotebackhighlight");

        */

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
            if(time > 100){
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
            var popup = document.querySelector("quoteback-popup");
            var quote = popup.querySelector("quoteback-component").shadowRoot;   
            // var txtArea = popup.shadowRoot.querySelector('.quoteback-title-input'); // changed
            var authorArea = quote.querySelector('.quoteback-author'); // changed
            var titleArea = quote.querySelector('.quoteback-title'); // changed
            
            authorArea.addEventListener('keydown', function(event){
              if (event.keyCode === 13) {
                event.preventDefault();
                return null;
                authorArea.blur()
              };
            });

            titleArea.addEventListener('keydown', function(event){
              if (event.keyCode === 13) {
                event.preventDefault();
                return null;
                titleArea.blur()
              };
            });

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
          var popup = document.querySelector("quoteback-popup");
          var quote = popup.querySelector("quoteback-component").shadowRoot;   
          // var txtArea = popup.shadowRoot.querySelector('.quoteback-title-input'); // changed
          var authorArea = quote.querySelector('.quoteback-author'); // changed
          var titleArea = quote.querySelector('.quoteback-title'); // changed
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
        
          //get rangehtml using rangy, strip un-allowed tags (e.g. script tags, button tags)
          // regex here: https://stackoverflow.com/questions/44009089/javascript-replace-regex-all-html-tags-except-p-a-and-img
          // NOTE: this removes tags but not contents. e.g. "<script>some script</script>"" will return "some script"
          var selectionhtml =  rangy.getSelection().toHtml();
          var cleaned = selectionhtml.replace(/(<\/?(?:a|b|p|img|h1|h2|h3|h4|h5|em|strong|ul|ol|li|blockquote)[^>]*>)|<[^>]+>/ig, '$1');
          
          //create a document fragment to make manipulations like absolute links
          var htmlfragment = document.createRange().createContextualFragment(cleaned);

          // remove inline styles from elements
          var descendents = htmlfragment.querySelectorAll("*");
          for (var i = 0; i < descendents.length; i++) {
            e = descendents[i];
            e.removeAttribute("style");
          }

          //make all link & image references absolute not relative
          var links = htmlfragment.querySelectorAll("a");
          links.forEach(e => {
            e.href = convertAbsolute(e.href);
            e.setAttribute("target","_blank"); //ensure links open inside quoteback in new window
          });
    
          var images = htmlfragment.querySelectorAll("img");
          images.forEach(e => {e.src = convertAbsolute(e.src)});
    
          var div = document.createElement('div');
          div.appendChild( htmlfragment.cloneNode(true) );
          CleanChildren(div); // remove empty html elements - rangy is adding them
          var html = div.innerHTML;
          
          return(html);
    
        } else if (document.selection && document.selection.type != "Control") { // think this is for IE?
        text = document.selection.createRange().text;
        }
        };

//from here: https://stackoverflow.com/questions/43481799/javascript-remove-empty-paragraphs-from-html-string
function CleanChildren(elem)
        {
          var parent = elem

          parent.childNodes.forEach(child => child.nodeType === document.ELEMENT_NODE 
            && !child.innerText.trim() 
            && parent.removeChild(child));
        }
        
    function convertAbsolute(url){
      let absolute = new URL(url, document.baseURI).href;
      return absolute;
    }    
    
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

          var popup = document.querySelector("quoteback-popup");                 
          var quote = popup.querySelector("quoteback-component").shadowRoot;
          var commentbox = popup.shadowRoot.querySelector(".citation-input");
          var title = quote.querySelector('.quoteback-title');
          var author = quote.querySelector('.quoteback-author'); 
      
          var page = document.location.href;
      
          object[page]["quotes"][0]["comment"] = commentbox.value;
          object[page]["title"] = title.textContent;
          object[page]["author"] = author.textContent;
      
          chrome.storage.local.set(object, function() { 
              console.log("autosaved");
              if(popup.shadowRoot.querySelector(".save-indicator").innerText == "Saving..."){
                popup.shadowRoot.querySelector(".save-indicator").innerHTML = "Saved"; // changed
            };
          });
                
      };
    
        return { 
    
            start: function(object){
          var popup = document.querySelector("quoteback-popup").shadowRoot;                 
          popup.addEventListener("keydown", function( event ) {
              popup.querySelector(".save-indicator").innerText = "Saving..."; // changed
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
    
function copyToClipboard(str){   
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

function closePopup(){
  var paras = document.querySelector("quoteback-popup");
  if (paras){
      paras.parentNode.removeChild(paras);
  };         
  AutoSave.stop();              
}