function embedquoteback(){
  var template = document.createElement('template');
    template.innerHTML=`
	    <style>${quoteStyle}</style>
	    <div class="quoteback-container">
	        <div id="quoteback-parent" class="quoteback-parent">
	            <div class="quoteback-content"></div>       
	        </div>

	        <div class="quoteback-head">       
	            <div class="quoteback-avatar"><img class="mini-favicon" src=""/></div>     
	            <div class="quoteback-metadata">
	                <div class="metadata-inner">
	                    <div class="quoteback-author"></div>
	                    <div class="quoteback-title"></div>
	                </div> 
	            </div>

	        <div class="quoteback-backlink"><a target="_blank" href="" class="quoteback-arrow">Go to text <span class="right-arrow">&#8594;</span></a></div>
	        </div>  
	    </div>
    `;

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
		this.editable = this.getAttribute('editable');
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
			};
			set editable(value) {
			  this._editable = value;
			  if (this.shadowRoot)
					if(value == "true"){
						this.shadowRoot.querySelector('.quoteback-author').setAttribute("contenteditable", true);
						this.shadowRoot.querySelector('.quoteback-title').setAttribute("contenteditable", true);
					}	
				
			};
			get editable() {
			  return this._editable;
			};

  }

  // if quoteback-component is already defined
  if (customElements.get('quoteback-component')){
      null;
  }else{
      window.customElements.define('quoteback-component', QuoteBack)  
  }
}	