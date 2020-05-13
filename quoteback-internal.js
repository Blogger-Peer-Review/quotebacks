function embedquoteback(){
  const template = document.createElement('template');
    template.innerHTML=`
    <style>${quoteStyle}</style>
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
		  
			this.text = decodeURIComponent(this.getAttribute('text'));
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