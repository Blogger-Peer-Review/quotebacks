document.addEventListener("DOMContentLoaded", function(){
    
    // get all our classed blockquote components
    var index = document.getElementsByClassName("quoteback");

    for (item in index){

        // export its data
        var text = index[item].childNodes[1].innerHTML;
        var url = index[item].cite;
        var author = index[item].getAttribute("data-author");
        var title = index[item].getAttribute("data-title");
        var favicon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&sz=64`

        // create a new component with that data
        var component = `
        <quoteback-component url="${url}" text="${text}" author="${author}" title="${title}" favicon="${favicon}"> 
        	<script src="./quoteback.js"></script>  
        </quoteback-component>    
        `;   
        var newEl = document.createElement('div');
        newEl.innerHTML = component;


        // replace the original blockquote with our quoteback seed component
        index[item].parentNode.replaceChild(newEl, index[item]);

        const template = document.createElement('template');
        template.innerHTML=`
        <link rel="stylesheet" type="text/css" href="https://files-lovat-six.now.sh/quote.css"> 
        <div class="portal-container-519256">
            <div id="portal-parent-519256" class="portal-parent-519256">
                <div class="portal-content-519256"></div>       
            </div>

            <div class="portal-head-519256">       
                <div class="portal-avatar-519256"><img class="mini-favicon-519256" src=""/></div>     
                <div class="portal-metadata-519256">
                    <div class="portal-title-519256">
                        <div class="portal-author-519256"></div>
                        <div class="title-wrapper-519256"></div>
                    </div> 
                </div>

            <div class="portal-backlink-519256"><a target="_blank" href="" class="portal-arrow-519256">Go to text <span class="right-arrow">&#8594;</span></a></div>
            </div>  
        </div>`;

        class QuoteBack extends HTMLElement {
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

						set text(value) {
						  this._text = value;
						  if (this.shadowRoot)
						    this.shadowRoot.querySelector('.portal-content-519256').innerHTML = value;
						};
						get text() {
						  return this._text;
						};
						set author(value) {
						  this._author = value;
						  if (this.shadowRoot)
						    this.shadowRoot.querySelector('.portal-author-519256').innerHTML = value;
						};
						get author() {
						  return this._author;
						};	
						set title(value) {
						  this._title = value;
						  if (this.shadowRoot)
						    this.shadowRoot.querySelector('.title-wrapper-519256').innerHTML = value;
						};
						get title() {
						  return this._title;
						};
						set url(value) {
						  this._url = value;
						  if (this.shadowRoot)
						    this.shadowRoot.querySelector('.portal-arrow-519256').href = value;
						};
						get url() {
						  return this._url;
						};
						set favicon(value) {
							this._favicon = value;
							if (this.shadowRoot)
								this.shadowRoot.querySelector('.mini-favicon-519256').src = value;
						};

        }

        // if quoteback-component is already defined
        if (customElements.get('quoteback-component')){
            null;
        }else{
            window.customElements.define('quoteback-component', QuoteBack)  
        }
    }
});