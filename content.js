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
    var iframe = document.createElement('iframe');
    iframe.id = "citation-iframe-519256";
    document.documentElement.appendChild(iframe);
    iframe.style.cssText = "width:670px; height:800px; position:fixed; border:none; top:0px; right:0px; z-index:99999;"



    chrome.storage.local.get([page], function(result) {

        var page_object = {};        
        // page_object["date"] = getDate(); needs to get attached to each quote item
        page_object["url"] = page;
        page_object["title"] = document.title;
        
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

            var browser_page = chrome.runtime.getURL("options.html");

            var stylesurl = chrome.runtime.getURL("styles/styles.css");
            var popupStyle = '<link rel="stylesheet" href="'+stylesurl+'" type="text/css">';
            //iframe.contentDocument.head.appendChild(popupStyle);
            
            iframe.contentDocument.head.insertAdjacentHTML('beforeend', popupStyle);

            // stick our css in the iframe body
            iframe.contentDocument.body.innerHTML = `

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

<div class="thickdivider"></div>



<div class="portal-container-519256">

<div id="portal-parent-519256" class="portal-parent-519256">
<div class="portal-content-519256">${text}
</div>       
</div> 

<div class="portal-head-519256">

<div class="portal-avatar-519256"><img class="mini-favicon-519256" src="https://s2.googleusercontent.com/s2/favicons?domain_url=${location.hostname}&sz=64"/></div>

<div class="portal-metadata-519256">
<div class="portal-title-519256">
<div class="portal-author-519256">${page_object["author"]}</div>
<div class="title-wrapper-519256">${page_object["title"]}</div>
</div> 
</div>

<div class="portal-backlink-519256"><a target="_blank" href="${page_object["url"]}" class="portal-arrow">Go to text <span class="right-arrow">&#8594;</span></a></div>

</div>       
</div>




<div class="thickdivider"></div>

<div class="citation-bottom-519256">
<div class="comment-519256">
<form>
  <input class="citation-input-519256" id="comment-field-519256" placeholder="+ Add Comment"></input>
</form>
<div class="citation-saving-519256"></div>
</div>
<div><button id="getlink-519256" class="control-button-519256"><> Embed</button></div>
<div><button id="save-button-519256">Save & Close</button></div>
</div>

</div>
`;


            
            // boundary.top from here if we wanna position relative to the text selection
            // https://stackoverflow.com/questions/4106109/selected-text-and-xy-coordinates
            /*
            var txt = window.getSelection(),
            range = txt.getRangeAt(0),
            boundary = range.getBoundingClientRect();
            */

            var time = 0;
            var textfocus = false;
            var ishover = false;
            var isPaused = false;
            txtAreaListenFocus();
            txtAreaListenBlur();

            // let popup = iframe;
  
            iframe.addEventListener("mouseover", function( event ) {   
                ishover = true;
            });

            iframe.addEventListener("mouseout", function( event ) {   
                ishover = false;
            });

            AutoSave.start(object);

            var t = window.setInterval(function() {

                // timeout to remove popups
                if(!ishover && !textfocus) {
                  time++;
                  if(time > 500){
                    var paras = document.getElementById('citation-iframe-519256');
                    if (paras){
                      paras.parentNode.removeChild(paras);
                    };
                    // while(paras[0]) {
                    //     paras[0].parentNode.removeChild(paras[0]); // remove all popups
                    // };         
                    AutoSave.stop();              
                    clearInterval(t); // stop timer
                  };
                  console.log(time + "is hover: "+ishover + "is textfocus:"+textfocus);
                }

              }, 1000);

              function txtAreaListenFocus(){
                var txtArea = iframe.contentDocument.querySelector('#comment-field-519256'); // changed
                txtArea.addEventListener('focus', function(event) {
                   textfocus = true;
                }.bind(this));
              };

              function txtAreaListenBlur(){
                var txtArea = iframe.contentDocument.querySelector('#comment-field-519256'); // changed
                txtArea.addEventListener('blur', function(event) {
                  textfocus = false;
                }.bind(this));
              };


          });

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
          
      // document fragment with html for selection
      var fragment = range.cloneContents();

      // make new element, insert document fragment, then get innerHTML!
      var div = document.createElement('div');
      div.appendChild( fragment.cloneNode(true) );

      // your document fragment to a string (w/ html)! (yay!)
      var text = div.innerHTML;
      // console.log(text);


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
      }
    }

  
    return '';
  };

function getCanonical() {
  var canonical = "";
  var links = document.getElementsByTagName("link");
  for (var i = 0; i < links.length; i ++) {
      if (links[i].getAttribute("rel") === "canonical") {
          canonical = links[i].getAttribute("href")
      }
  }
  return canonical;
  };  

function getDate(){
  
  var today = Number(new Date());

  return today;
};

// From: https://gist.github.com/gcmurphy/3651776
var AutoSave = (function(){

    var timer = null;

	function getEditor(){
    let iframe = document.getElementById("citation-iframe-519256"); // added
		var elems = iframe.contentDocument.querySelector("#comment-field-519256"); // changed
		if (!elems)
			return null;
		return elems;
	}

	function save(object){
        console.log("running save");
        let iframe = document.getElementById("citation-iframe-519256"); // added        
		    var editor = getEditor(); 
            if (editor) {

            var page = document.location.href;

            object[page]["quotes"][0]["comment"] = editor.value;
            chrome.storage.local.set(object, function() { 
                console.log("autosaved");
                if(iframe.contentDocument.querySelector(".citation-saving-519256").innerText == "Saving..."){
                  iframe.contentDocument.querySelector(".citation-saving-519256").innerHTML = "<span style='color:green'>Saved</span>"; // changed
              };
            });
            }
        };

	function restore(){ //don't think I actually need this restore function...?
        var page = document.location.href;
        var saved = "";
        chrome.storage.local.get([page], function(result) {
            saved = result[page]["quotes"][0]["comment"];
        });
        //var saved = localStorage.getItem("AUTOSAVE_" + document.location)
		var editor = getEditor();
		if (saved && editor){
			editor.value = saved; 
		}
	}

	return { 

		start: function(object){
            let iframe = document.getElementById("citation-iframe-519256"); // added
            var editor = getEditor(); 
            // console.log(editor);
                 
          editor.addEventListener("keydown", function( event ) {   
              iframe.contentDocument.querySelector(".citation-saving-519256").innerText = "Saving..."; // changed
          });            

			if (editor.value.length <= 0)
				restore();

			if (timer != null){
				clearInterval(timer);
				timer = null;
			}
			timer = setInterval(function(){
                save(object)
            }, 1000);
		},

		stop: function(){

			if (timer){ 
				clearInterval(timer);
				timer = null;
			}

		}
	}
 

}());
