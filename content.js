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

            // document.getElementsByTagName('body')[0].insertAdjacentHTML( 'afterbegin', 
            // ^ above is the original code here

            // create create an element with minified style and stick it in the head
            var popupStyle = document.createElement('style'); // is a node
            popupStyle.innerHTML = '.portal-container-519256{font-family:-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";text-rendering:optimizeLegibility;border:1px solid #c2dfe3;border-radius:8px;margin-bottom:25px;max-width:800px;-webkit-transition:all .2s ease;-moz-transition:all .2s ease;-ms-transition:all .2s ease;-o-transition:all .2s ease;transition:all .2s ease}.portal-container-519256:hover{transform:translateY(-3px);box-shadow:0 6px 20px 0 rgba(0,0,0,.15);border:1px solid #9db8bf}.portal-container-519256 .portal-parent-519256{overflow:hidden;position:relative;width:100%;box-sizing:border-box}.portal-container-519256 .portal-parent-519256 .portal-parent-text-519256{padding:15px;color:#5c6d73;z-index:40}.portal-container-519256 .portal-parent-519256 .portal-content-519256{font-family:-apple-system,system-ui,"Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";padding:15px;color:#464a4d;line-height:140%}.portal-container-519256 .portal-head-519256{border-top:1px solid #c2dfe3;display:flex;flex-flow:row nowrap;justify-content:start;align-items:stretch;padding-left:15px;-webkit-transition:all .2s ease;-moz-transition:all .2s ease;-ms-transition:all .2s ease;-o-transition:all .2s ease;transition:all .2s ease}.portal-container-519256 .portal-head-519256 .portal-avatar-519256{border-radius:100%;border:1px solid #c2dfe3;width:42px;height:42px;margin:12px 0;position:relative}.portal-container-519256 .portal-head-519256 .portal-avatar-519256 img{max-width:24px;position:absolute;margin:auto;top:0;left:0;right:0;bottom:0}.portal-container-519256 .portal-head-519256 .portal-metadata-519256{min-width:0;display:flex;flex-shrink:1;align-items:center;margin-left:10px}.portal-container-519256 .portal-head-519256 .portal-author-519256{font-size:14px;color:#000;font-weight:600;margin-bottom:2px}.portal-container-519256 .portal-head-519256 .portal-title-519256{font-size:14px;color:#9db8bf;max-width:100%}.portal-container-519256 .portal-head-519256 .portal-title-519256 .title-wrapper-519256{white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-weight:600;color:#5c6d73}.portal-container-519256 .portal-head-519256 .portal-backlink-519256{margin-left:auto;display:flex;flex-shrink:1;align-items:center;min-width:80px;padding:0 15px;border-left:1px solid #c2dfe3}.portal-container-519256 .portal-head-519256 .portal-backlink-519256 .portal-arrow-519256{font-size:14px;color:#9db8bf;text-decoration:none;-webkit-transition:opacity .1s ease;-moz-transition:opacity .1s ease;-ms-transition:opacity .1s ease;-o-transition:opacity .1s ease;transition:opacity .1s ease}.portal-container-519256 .portal-head-519256 .portal-backlink-519256 .portal-arrow-519256:hover{opacity:.5}button,input{border:none;background-image:none;background-color:transparent;-webkit-box-shadow:none;-moz-box-shadow:none;box-shadow:none}#citation-capture-519256{font-family:-apple-system,system-ui,"Open Sans","Segoe UI",Helvetica,"Apple Color Emoji",Arial,sans-serif,"Segoe UI Emoji","Segoe UI Symbol";overflow:hidden!important;width:600px;height:auto;position:fixed!important;top:10px!important;right:10px!important;overflow-x:hidden;overflow-y:auto;max-height:calc(100% - 50px);border:5px solid #e7e7e5!important;border-radius:.25em;padding:24px;z-index:2147483;background-color:#fff}.citation-meta-519256{display:flex;flex-direction:row;justify-content:space-between;align-items:center;flex:0 0 100%;margin-bottom:10px}.citation-meta-519256 form:first-child{margin-right:10px}.citation-input-519256{width:280px;display:block;padding:11px;height:37px;font-size:12px;box-shadow:none;-webkit-appearance:none;color:#464a4d;background:#eceeef;box-sizing:border-box;border-radius:4px;-webkit-transition:all .1s ease;-moz-transition:all .1s ease;-ms-transition:all .1s ease;-o-transition:all .1s ease;transition:all .1s ease}.citation-input-519256#comment-field-519256{border-radius:10px}.citation-input-519256:focus{outline:0;box-shadow:inset 0 0 0 1px #9db8bf}.citation-input-label-519256{display:block;font-size:12px;margin-bottom:2px}.control-button-519256{border:none;text-align:left;width:auto;min-width:85px;height:24px;font-size:14px;font-weight:500;font-family:inherit;display:block;-webkit-transition:all .2s ease;-moz-transition:all .2s ease;-ms-transition:all .2s ease;-o-transition:all .2s ease;transition:all .2s ease}.control-button-519256:hover{cursor:pointer;opacity:.5}.control-button-519256#getlink-519256{color:#395fe5;height:37px}.citation-bottom-519256{height:50px;display:flex;flex-direction:row;justify-content:space-between;align-items:start;flex:0 0 100%;margin-top:-13px}.citation-bottom-519256 div{display:inline-block}#save-button-519256{-webkit-appearance:none;width:130px;display:block;padding:11px;font-size:14px;box-shadow:none;background:#f2f7fa;border:.5px solid #d5d5d5;box-sizing:border-box;border-radius:4px}';
            iframe.contentDocument.head.appendChild(popupStyle);

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
<input class="citation-input-519256" id="title-field" name="Title" value="${page_object["title"]}></input>
</form>       
</div>

<div class="thickdivider"></div>



<div class="portal-container-519256">

<div id="portal-parent-519256" class="portal-parent-519256">
<div class="portal-content-519256">${text}
</div>       
</div> 

<div class="portal-head-519256">

<div class="portal-avatar-519256"><img src="https://s2.googleusercontent.com/s2/favicons?domain_url=${location.hostname}&sz=64"/></div>

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
                  if(time > 5){
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
      console.log(text);


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
            console.log(editor);
                 
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
