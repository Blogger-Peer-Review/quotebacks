var quoteStyle  = `.quoteback-container {
  font-family: -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
  text-rendering: optimizeLegibility;
  border: 1px solid #C2DFE3;
  border-radius: 8px;
  margin-bottom: 25px;
  max-width: 800px;
  background-color: white;
  -webkit-transition: all 0.2s ease;
  -moz-transition: all 0.2s ease;
  -ms-transition: all 0.2s ease;
  -o-transition: all 0.2s ease;
  transition: all 0.2s ease; }
  .quoteback-container:hover {
    transform: translateY(-3px);
    box-shadow: 0px 6px 20px 0px rgba(0, 0, 0, 0.15);
    border: 1px solid #9DB8BF; }
  .quoteback-container .quoteback-parent {
    overflow: hidden;
    position: relative;
    width: 100%;
    box-sizing: border-box; }
    .quoteback-container .quoteback-parent .quoteback-parent-text {
      padding: 15px;
      color: #5C6D73;
      z-index: 40; }
    .quoteback-container .quoteback-parent .quoteback-content {
      font-family: -apple-system, system-ui, "Segoe UI", Helvetica, "Apple Color Emoji", Arial, sans-serif, "Segoe UI Emoji", "Segoe UI Symbol";
      font-size: 16px;
      font-weight: 400;
      padding: 15px;
      color: #464A4D;
      line-height: 150%; }
  .quoteback-container .quoteback-head {
    border-top: 1px solid #C2DFE3;
    display: flex;
    flex-flow: row nowrap;
    justify-content: start;
    align-items: stretch;
    padding-left: 15px;
    -webkit-transition: all 0.2s ease;
    -moz-transition: all 0.2s ease;
    -ms-transition: all 0.2s ease;
    -o-transition: all 0.2s ease;
    transition: all 0.2s ease; }
    .quoteback-container .quoteback-head .quoteback-avatar {
      border-radius: 100%;
      border: 1px solid #C2DFE3;
      width: 42px;
      height: 42px;
      min-width: 42px !important;
      margin: 12px 0px;
      position: relative; }
      .quoteback-container .quoteback-head .quoteback-avatar .mini-favicon {
        width: 22px;
        height: 22px;
        position: absolute;
        margin: auto;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0; }
    .quoteback-container .quoteback-head .quoteback-metadata {
      min-width: 0px;
      display: flex;
      flex-shrink: 1;
      align-items: center;
      margin-left: 10px; }
    .quoteback-container .quoteback-head .quoteback-author {
      font-size: 14px;
      line-height: 1.2;
      color: black;
      font-weight: 600;
      margin-bottom: 2px; }
    .quoteback-container .quoteback-head .quoteback-title {
      font-size: 14px;
      line-height: 1.2;
      color: #9DB8BF;
      max-width: 100%; }
      .quoteback-container .quoteback-head .quoteback-title .title-wrapper {
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;
        font-weight: 600;
        padding-right: 20px;
        color: #5C6D73; }
    .quoteback-container .quoteback-head .quoteback-backlink {
      margin-left: auto;
      display: flex;
      flex-shrink: 1;
      align-items: center;
      width: 85px;
      min-width: 85px !important;
      padding: 0px 15px;
      border-left: 1px solid #C2DFE3; }
      .quoteback-container .quoteback-head .quoteback-backlink .quoteback-arrow {
        border: none !important;
        font-family: inherit !important;
        font-size: 14px !important;
        color: #9DB8BF !important;
        text-decoration: none !important;
        -webkit-transition: opacity 0.1s ease;
        -moz-transition: opacity 0.1s ease;
        -ms-transition: opacity 0.1s ease;
        -o-transition: opacity 0.1s ease;
        transition: opacity 0.1s ease; }
        .quoteback-container .quoteback-head .quoteback-backlink .quoteback-arrow:hover {
          opacity: .5 !important; }
        .quoteback-container .quoteback-head .quoteback-backlink .quoteback-arrow:visited {
          text-decoration: none !important; }

/*# sourceMappingURL=quoteback.css.map */
`

document.addEventListener("DOMContentLoaded", function(){
    
    // get all our classed blockquote components
    var index = document.getElementsByClassName("quoteback");


    for(var item=0; item < index.length; item++ ){
      
        // remove the footer element
        index[item].removeChild(index[item].querySelector("footer"));
        
        var text = index[item].innerHTML;

        // something to remove footer

        var url = index[item].cite;
        var author = index[item].getAttribute("data-author");
        var title = index[item].getAttribute("data-title");
        var favicon = `https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&sz=64`

        // create a new component with that data
        var component = `
        <quoteback-component url="${url}" text="${encodeURIComponent(text)}" author="${author}" title="${title}" favicon="${favicon}"> 
        	<script src="./quoteback.js"></script>  
        </quoteback-component>    
        `;
        var newEl = document.createElement('div');
        newEl.innerHTML = component;

        // replace the original blockquote with our quoteback seed component
        index[item].parentNode.replaceChild(newEl, index[item]);

        const template = document.createElement('template');
        template.innerHTML=`
        <style>${quoteStyle}</style>
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