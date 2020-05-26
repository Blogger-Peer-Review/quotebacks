document.addEventListener("DOMContentLoaded", function(){
    
    // get all our classed blockquote components
    var index = document.getElementsByClassName("quoteback");

    for (item in index){

        // export its data
        index[item].removeChild(index[item].querySelector("footer"));
        
        var text = index[item].innerHTML;
        
        
        
        
        // something to remove footer

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
        <link rel="stylesheet" type="text/css" href="https://files-cra1rdef4.now.sh/"> 
        <div class="quoteback-container">
            <div id="quoteback-parent" class="quoteback-parent">
                <div class="quoteback-content"></div>       
            </div>

            <div class="quoteback-head">       
                <div class="quoteback-avatar"><img class="mini-favicon" src=""/></div>     
                <div class="quoteback-metadata">
                    <div class="quoteback-title">
                        <div class="quoteback-author"></div>
                        <div class="title-wrapper"></div>
                    </div> 
                </div>

            <div class="quoteback-backlink"><a target="_blank" href="" class="quoteback-arrow">Go to text <span class="right-arrow">&#8594;</span></a></div>
            </div>  
        </div>`;

        class QuoteBack extends HTMLElement {
          constructor(){
            super();
            this.attachShadow({mode: 'open'});
            this.shadowRoot.appendChild(template.content.cloneNode(true));
					  
					  this.text = decodeURIComponent(this.getAttribute('text'));
					  this.author = this.getAttribute('author');
					  this.title = this.getAttribute('title'); 
					  this.url = this.getAttribute('url')
					  this.favicon = this.getAttribute('favicon');
          };

					set text(value) {
					  this._text = value;
					  if (this.shadowRoot)
					    this.shadowRoot.querySelector('.quoteback-content').innerHTML = value;
					};
					get text() {
					  return this._text;
					};
					set author(value) {
					  this._author = value;
					  if (this.shadowRoot)
					    this.shadowRoot.querySelector('.quoteback-author').innerHTML = value;
					};
					get author() {
					  return this._author;
					};	
					set title(value) {
					  this._title = value;
					  if (this.shadowRoot)
					    this.shadowRoot.querySelector('.title-wrapper').innerHTML = value;
					};
					get title() {
					  return this._title;
					};
					set url(value) {
					  this._url = value;
					  if (this.shadowRoot)
					    this.shadowRoot.querySelector('.quoteback-arrow').href = value;
					};
					get url() {
					  return this._url;
					};
					set favicon(value) {
						this._favicon = value;
						if (this.shadowRoot)
							this.shadowRoot.querySelector('.mini-favicon').src = value;
					};
                    get favicon() {
                        return this._favicon;
                    }                    

        }

        // if quoteback-component is already defined
        if (customElements.get('quoteback-component')){
            null;
        }else{
            window.customElements.define('quoteback-component', QuoteBack)  
        }
    }
});