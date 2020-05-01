const template = document.createElement('template');
const url = document.getElementById('123456789').getAttribute("href");
template.innerHTML=`
<style>
@import "./styles/quote.css";
</style>   
<div class="portal-container-519256">
    <div id="portal-parent-519256" class="portal-parent-519256">
        <div class="portal-content-519256"><slot name="portal-content"></slot></div>       
    </div>

    <div class="portal-head-519256">       
        <div class="portal-avatar-519256"><img class="mini-favicon-519256" src="https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&sz=64"/></div>     
        <div class="portal-metadata-519256">
            <div class="portal-title-519256">
                <div class="portal-author-519256"><slot name="portal-author"></slot></div>
                <div class="title-wrapper-519256"><slot name="portal-title"></slot></div>
            </div> 
        </div>

    <div class="portal-backlink-519256"><a target="_blank" href="${url}" class="portal-arrow-519256">Go to text <span class="right-arrow">&#8594;</span></a></div>
    </div>  
</div>`;

class QuoteBack extends HTMLElement {
    constructor(){
        super();
        this.attachShadow({mode: 'open'});
        this.shadowRoot.appendChild(template.content.cloneNode(true));
    }    
}

window.customElements.define('quoteback-component', QuoteBack)