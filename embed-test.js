document.addEventListener("DOMContentLoaded", function(){
    // select the element that will be replaced
    var el = document.querySelector('#embed');

    var text = document.querySelector('#embed p').innerHTML;
    var author = el.getAttribute("data-author");
    var title = el.getAttribute("data-title");
    var url = el.getAttribute("cite");


    var embed = `
    <link rel="stylesheet" href="https://files-lovat-six.now.sh/quote.css" type="text/css">
    <div class="portal-container-519256">

    <div id="portal-parent-519256" class="portal-parent-519256">
    <div class="portal-content-519256">${text}
    </div>       
    </div> 
    
    <div class="portal-head-519256">
    
    <div class="portal-avatar-519256"><img class="mini-favicon-519256" src="https://s2.googleusercontent.com/s2/favicons?domain_url=${url}&sz=64"/></div>
    
    <div class="portal-metadata-519256">
    <div class="portal-title-519256">
    <div class="portal-author-519256">${author}</div>
    <div class="title-wrapper-519256">${title}</div>
    </div> 
    </div>
    
    <div class="portal-backlink-519256"><a target="_blank" href="${url}" class="portal-arrow">Go to text <span class="right-arrow">&#8594;</span></a></div>
    
    </div>       
    </div>`

    // <a href="/javascript/manipulation/creating-a-dom-element-51/">create a new element</a> that will take the place of "el"
    var newEl = document.createElement('div');
    newEl.innerHTML = embed;

    // replace el with newEL
    el.parentNode.replaceChild(newEl, el);
});

