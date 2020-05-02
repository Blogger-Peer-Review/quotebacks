document.addEventListener("DOMContentLoaded", function(){
    var el = document.querySelector('#quoteback');
    var text = el.innerHTML;
    var author = el.getAttribute("data-author");
    var title = el.getAttribute("data-title");
    var url = el.getAttribute("cite");

    var component = `
    <quoteback-component>
    <span slot="portal-content">The inaugural report by the Yak Collective, Don’t Waste the Reboot offers organizations a smorgasbord of 25 creative and unexpected provocations, ideas, and action frameworks to navigate the Covid-19 crisis.<br><br>Authored by 21 diverse contributors from around the world – most of whom are working together for the first time – we believe this report will get you thinking about your reboot efforts in a bolder, more imaginative way. Let us know what you think!</span>
    <span slot="portal-author">The Yak Collective</span>  
    <span slot="portal-title">Don't Waste the COVID-19 Reboot</span>
    <a target="_blank" id="123456789" href="https://yakcollective.org/projects/yak-wisdom" slot="portal-link">Go to text <span class="right-arrow">&#8594;</span></a>
    <script src="./quoteback.js"></script>  
    </quoteback-component>    
    `;
    var newEl = document.createElement('div');
    newEl.innerHTML = component;

    // replace el with newEL
    el.parentNode.replaceChild(newEl, el);

    const template = document.createElement('template');
    template.innerHTML=`
    <link rel="stylesheet" type="text/css" href="https://files-lovat-six.now.sh/quote.css"> 
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
});