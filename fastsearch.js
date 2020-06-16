var fuse; // holds our search engine
var searchVisible = false; 
var firstRun = true; // allow us to delay loading json data unless search activated
var list = document.getElementById('searchResults'); // targets the <ul>
var first = list.firstElementChild; // first child of search list
var last = list.lastElementChild; // last child of search list
var maininput = document.getElementById('searchInput'); // input box for search
var resultsAvailable = false; // Did we get any search results?

// on click on input
document.getElementById("searchInput").onclick = function(){
  if(firstRun) {
    loadSearch(); // loads our json data and builds fuse.js search index
    firstRun = false; // let's never do this again
  }

  // Toggle visibility of search box
  if (!searchVisible) {
    document.getElementById("fastSearch").style.visibility = "visible"; // show search box
    document.getElementById("searchResults").style.visibility = "visible";
    document.getElementById("searchInput").focus(); // put focus in input box so you can just start typing
    document.getElementById("searchInput").classList.add("unround")
    searchVisible = true; // search visible
  }
  else {

  }
};

// if search loses focus hide search bar
document.getElementById("fastSearch").addEventListener('focusout', (event) => {
  if (document.getElementById("fastSearch").contains(event.relatedTarget)) {
    // don't react to this
    return;
}
  console.log("focusing out");
  document.getElementById("searchInput").value = "";
  document.getElementById("searchResults").style.visibility = "hidden";
  searchVisible = false; // search not visible

});

// if hash changes hide search
window.addEventListener('hashchange', function() {
  document.getElementById("searchInput").value = "";
  document.getElementById("searchResults").style.visibility = "hidden";
  searchVisible = false; // search not visible
}, false);






// ==========================================
// The main keyboard event listener running the show
//
document.addEventListener('keydown', function(event) {

  // CMD-/ to show / hide Search
  if ((event.metaKey && event.which === 191) || (event.metaKey && event.which === 75)) {
      event.preventDefault();
      // Load json search index if first time invoking search
      // Means we don't load json unless searches are going to happen; keep user payload small unless needed
      if(firstRun) {
        loadSearch(); // loads our json data and builds fuse.js search index
        firstRun = false; // let's never do this again
      }

      // Toggle visibility of search box
      if (!searchVisible) {
        document.getElementById("fastSearch").style.visibility = "visible"; // show search box
        document.getElementById("searchResults").style.visibility = "visible";
        document.getElementById("searchInput").focus(); // put focus in input box so you can just start typing
        searchVisible = true; // search visible
      }
      else {
        
        document.activeElement.blur(); // remove focus from search box 
        searchVisible = false; // search not visible
      }
  }

  // Allow ESC (27) to close search box
  if (event.keyCode == 27) {
    if (searchVisible) {
      document.getElementById("searchInput").value = "";
      document.getElementById("searchResults").style.visibility = "hidden";
      document.activeElement.blur();
      searchVisible = false;
    }
  }

  // DOWN (40) arrow
  if (event.keyCode == 40) {
    if (searchVisible && resultsAvailable) {
      console.log("down");
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { first.focus(); } // if the currently focused element is the main input --> focus the first <li>
      else if ( document.activeElement == last ) { last.focus(); } // if we're at the bottom, stay there
      else { 
        console.log(document.activeElement.parentElement);
        document.activeElement.parentElement.nextElementSibling.firstElementChild.focus(); } // otherwise select the next search result
      }
    }


  // UP (38) arrow
  if (event.keyCode == 38) {
    if (searchVisible && resultsAvailable) {
      event.preventDefault(); // stop window from scrolling
      if ( document.activeElement == maininput) { maininput.focus(); } // If we're in the input box, do nothing
      else if ( document.activeElement == first) { maininput.focus(); } // If we're at the first item, go to input box
      else { document.activeElement.parentElement.previousElementSibling.firstElementChild.focus(); } // Otherwise, select the search result above the current active one
    }
  }
});


// ==========================================
// execute search as each character is typed
//
document.getElementById("searchInput").onkeyup = function(e) { 
  executeSearch(this.value);
}





// ==========================================
// load our search index, only executed once
// on first call of search box (CMD-/)
//
function loadSearch() { 
  

  var options = {
    isCaseSensitive: false,
    findAllMatches: false,
    includeMatches: false,
    includeScore: false,
    useExtendedSearch: false,
    minMatchCharLength: 2,
    shouldSort: true,
    threshold: 0.6,
    location: 0,
    distance: 100,
    keys: [
      "url",
      "title",
      "author",
      "quotes.comment",
      "quotes.text",
    ]
  };
    
  console.log(alljson);

  fuse = new Fuse(alljson, options); // build the index from the json file
  
};

function strip(html){
  var doc = new DOMParser().parseFromString(html, 'text/html');
  return doc.body.textContent || "";
}

// ==========================================
// using the index we loaded on CMD-/, run 
// a search query (for "term") every time a letter is typed
// in the search box
//
function executeSearch(term) {
  let results = fuse.search(term); // the actual query being run using fuse.js
  console.log(results);
  let searchitems = ''; // our results bucket

  if (results.length === 0) { // no results based on what was typed into the input box
    resultsAvailable = false;
    searchitems = '';
  } else { // build our html 
   
    for (var i in results.slice(0,5)){

      for(var j in results[i].item.quotes){
        var htmlstripped = strip(results[i].item.quotes[j].text);
        var searchresult = `
        <li>
          <a href='/options.html#${results[i].item.url}'><img src='https://s2.googleusercontent.com/s2/favicons?domain_url=${extractHostname(results[i].item.url)}'/>${results[i].item.title}
            <div>
              <div class="search-url">${extractHostname(results[i].item.url)}</div>
            </div>
            <span class="search-content">${htmlstripped.substring(0,120)}...</span>
          </a>
        </li>`;

        searchitems = searchitems + searchresult;
        
      }
      
    }
   
    resultsAvailable = true;
  }

  document.getElementById("searchResults").innerHTML = searchitems;
  if (results.length > 0) {
    document.getElementById("searchResults").style.display = "inline-block";
    first = list.firstElementChild.firstElementChild; // first result container — used for checking against keyboard up/down location
    last = list.lastElementChild.firstElementChild; // last result container — used for checking against keyboard up/down location
  }

}