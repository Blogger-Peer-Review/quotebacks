console.log("quoteback-internal loaded");

  var qbtemplate = document.createElement('template');
	qbtemplate.innerHTML=`
      <style>${quoteStyle}</style>
      <div class="quoteback-container" role="quotation" aria-labelledby="quoteback-author" >
          <div id="quoteback-parent" class="quoteback-parent">
              <div class="quoteback-content"></div>       
          </div>

          <div class="quoteback-head">       
              <div class="quoteback-avatar"><img class="mini-favicon" src=""/></div>     
              <div class="quoteback-metadata">
									<div class="metadata-inner">
										<div aria-label="" id="quoteback-author" class="quoteback-author"></div>
										<div aria-label="" class="quoteback-title"></div>
                  </div>  
              </div>

          <div class="quoteback-backlink"><a target="_blank" aria-label="go to the full text of this quotation" rel="noopener" href="" class="quoteback-arrow">Go to text <span class="right-arrow">&#8594;</span></a></div>
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
					this.title = decodeURIComponent(this.getAttribute('title')); 
					this.url = this.getAttribute('url');
					this.favicon = this.getAttribute('favicon');
					this.editable = this.getAttribute('editable');
					this.darkmode = this.getAttribute('darkmode')

					if(this.darkmode == "true"){
						this.shadowRoot.querySelector('.quoteback-container').classList += " dark-theme";
					}						

				}
			};
	
				connectedCallback() {
          console.info( 'connected' );

          if(this.darkmode == "true"){
            this.shadowRoot.querySelector('.quoteback-container').classList += " dark-theme";
					}
					this.shadowRoot.querySelector('.quoteback-content').innerHTML = decodeURIComponent(this.getAttribute('text'));
					this.shadowRoot.querySelector('.mini-favicon').src = this.getAttribute('favicon');
          this.shadowRoot.querySelector('.quoteback-author').innerHTML = this.getAttribute('author');
          this.shadowRoot.querySelector('.quoteback-author').setAttribute("aria-label", "quote by " + this.getAttribute('author'));
					this.shadowRoot.querySelector('.quoteback-title').innerHTML = decodeURIComponent(this.getAttribute('title'));
          this.shadowRoot.querySelector('.quoteback-title').setAttribute("aria-label", "title: " + decodeURIComponent(this.getAttribute('title')));
          this.shadowRoot.querySelector('.quoteback-arrow').href = this.getAttribute('url');					

					// Manually focus and blur clicked targets
					// This solves firefox bug where clicking between contenteditable fields doesn't work					
					if(this.editable == "true"){
						let titlediv = this.shadowRoot.querySelector('.quoteback-title');
						let authordiv = this.shadowRoot.querySelector('.quoteback-author');
						
						titlediv.addEventListener("click", evt => {
							evt.target.contentEditable = true;
							evt.target.focus();
						});
						titlediv.addEventListener("blur", evt => {
							evt.target.contentEditable = false;
						});

						authordiv.addEventListener("click", evt => {
							evt.target.contentEditable = true;
							evt.target.focus();
						});
						authordiv.addEventListener("blur", evt => {
							evt.target.contentEditable = false;
						});
					}
					// end this fix

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