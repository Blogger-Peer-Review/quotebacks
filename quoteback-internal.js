console.log("quoteback-internal loaded");

  var qbtemplate = document.createElement('template');
	qbtemplate.innerHTML=`
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
				
				// if the page has embeds already then we don't define element
				// this is because for some reason this file can't do customElements.get('quoteback-component')
				if(this.shadowRoot){
				
				}else{
		
				this.attachShadow({mode: 'open'});
				this.shadowRoot.appendChild(qbtemplate.content.cloneNode(true));
					
				this.text = decodeURIComponent(this.getAttribute('text'));
				this.author = this.getAttribute('author');
				this.title = this.getAttribute('title'); 
				this.url = this.getAttribute('url');
				this.favicon = this.getAttribute('favicon');
				this.editable = this.getAttribute('editable');

				
				}
			};
	
				/*set text(value) {
					
					if (this.shadowRoot)
						this.shadowRoot.querySelector('.quoteback-content').innerHTML = value;
				};
				get text() {
					return this.getAttribute('text');
					//return this._text;
					
				};*/	
				/*set author(value) {
					this._author = value;
					if (this.shadowRoot)
						this.shadowRoot.querySelector('.quoteback-author').innerHTML = value;
				};
				get author() {
					return this._author;
				};*/	
				/*set title(value) {
					this._title = value;
					if (this.shadowRoot)
						this.shadowRoot.querySelector('.quoteback-title').innerHTML = value;
				};
				get title() {
					return this._title;
				};*/
				/*set url(value) {
					this._url = value;
					if (this.shadowRoot)
						this.shadowRoot.querySelector('.quoteback-arrow').href = value;
				};
				get url() {
					return this._url;
				};*/
				/*set favicon(value) {
					this._favicon = value;
					if (this.shadowRoot)
						this.shadowRoot.querySelector('.mini-favicon').src = value;
				};
				get favicon() {
					return this._favicon;
				};*/
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
				
				connectedCallback() {
					console.info( 'connected' );
					this.shadowRoot.querySelector('.quoteback-content').innerHTML = decodeURIComponent(this.getAttribute('text'));
					this.shadowRoot.querySelector('.quoteback-author').innerHTML = this.getAttribute('author');
					this.shadowRoot.querySelector('.mini-favicon').src = this.getAttribute('favicon');
					this.shadowRoot.querySelector('.quoteback-title').innerHTML = this.getAttribute('title');
					this.shadowRoot.querySelector('.quoteback-arrow').href = this.getAttribute('url');
					if(this.getAttribute('editable') == "true"){
						this.shadowRoot.querySelector('.quoteback-author').setAttribute("contenteditable", true);
						this.shadowRoot.querySelector('.quoteback-title').setAttribute("contenteditable", true);
					};	
				};

		};
	
		function embedquoteback(){
	
	
			// THIS DOESN'T WORK. customElements.get('quoteback-component')
			// returns undefined even if page has embeds on and has customelement defined
			if (customElements.get('quoteback-component')){
				console.log("quoteback-component already defined");
				null;
			}else{
					console.log("about to define quoteback-component");
					window.customElements.define('quoteback-component', QuoteBack)  
			}
		}	