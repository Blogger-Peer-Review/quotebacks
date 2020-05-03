document.addEventListener("DOMContentLoaded", function(){
    
    var index = document.getElementsByClassName("quoteback");

    for (item in index){

        var text = index[item].childNodes[1].innerHTML;
        var url = index[item].cite;
        var author = index[item].getAttribute("data-author");
        var title = index[item].getAttribute("data-title");
        
        var favicon = "https://s2.googleusercontent.com/s2/favicons?domain_url="+url+"&sz=64"

        var component = `
        <quoteback-component>
        <span slot="portal-content">${text}</span>
        <span slot="portal-author">${author}</span>  
        <span slot="portal-title">${title}</span>
        <a target="_blank" id="123456789" href="${url}" slot="portal-link">Go to text <span class="right-arrow">&#8594;</span></a>
        <script src="./quoteback.js"></script>  
        </quoteback-component>    
        `;
        var newEl = document.createElement('div');
        newEl.innerHTML = component;

        // replace el with newEL
        index[item].parentNode.replaceChild(newEl, index[item]);

        const template = document.createElement('template');
        template.innerHTML=`
        <link rel="stylesheet" type="text/css" href="https://files-lovat-six.now.sh/quote.css"> 
        <div class="portal-container-519256">
            <div id="portal-parent-519256" class="portal-parent-519256">
                <div class="portal-content-519256"><slot name="portal-content"></slot></div>       
            </div>

            <div class="portal-head-519256">       
                <div class="portal-avatar-519256"><img class="mini-favicon-519256" src="${favicon}"/></div>     
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

        console.log(customElements.get('quoteback-component'));

        if (customElements.get('quoteback-component')){
            null;
        }else{
            window.customElements.define('quoteback-component', QuoteBack)
        }
    }
});