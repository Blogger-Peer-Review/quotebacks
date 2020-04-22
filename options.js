var alldata;
var allKeys;
var alljson = [];

document.addEventListener("DOMContentLoaded", function(){
  chrome.storage.local.get(null, function(items) {
    allKeys = Object.keys(items);
    alldata = items;

    console.log(alldata);

    for( var i in items){

      alljson.push(items[i]);

      const article_fragment = document.getElementById('articleItem');
      const article_instance = document.importNode(article_fragment.content, true);
      // Add relevant content to the template

      var domain = extractHostname(items[i].url);
      article_instance.querySelector('.title').innerHTML = items[i].title;
      // article_instance.querySelector('.author').innerHTML = items[i].author;
      article_instance.querySelector('.mini-favicon').src = "https://s2.googleusercontent.com/s2/favicons?domain_url="+domain+"";
      article_instance.querySelector('.url').innerHTML = domain;
      article_instance.querySelector('.article').setAttribute("data-id",items[i].url);

      // Append the instance ot the DOM
      document.getElementById('article-scrollContainer').appendChild(article_instance);
    }

    alljson = JSON.stringify(alljson);
    alljson = JSON.parse(alljson);

    var pagehash = $(location).attr('hash').replace("#","");

    if($(location).attr('hash')){
      if(allKeys.includes(pagehash)){ // error handling for some mishandled hash value
        displayquotes(pagehash)
    }else{
      displayquotes(allKeys[0]);
    };
    }else{
      displayquotes(allKeys[0]);
    }

    window.addEventListener('hashchange', function() {
      var hashval = $(location).attr('hash').replace("#","");
      if(allKeys.includes(hashval)){ // check hash is a valid entry in data
        displayquotes(hashval)
      };
    }, false);
      
    $( ".article" ).click(function() {
      var url = $(this).attr('data-id');
      displayquotes(url);

    });
    
    $('#rightpanel').on('click',"#copy", function() {
      console.log("copying?");
      var quote = $(this).closest('.quoteblock').find('.portal-content-519256').text();
      copyToClipboard(quote);
      var el = $(this);
      el.css('border', '1px solid red');
      setTimeout(function() {
        el.css('border', 'none');
      }, 1000);
    });

    $('#rightpanel').on('click',"#getlink", function() {
      
      var title = $(".selected").find(".title").text();
      var url = $(".selected").attr("data-id");
      var quote = $(this).closest('.quoteblock').find('.portal-content-519256').text();

      const embed_fragment = document.getElementById('embed');
      const embed = document.importNode(embed_fragment.content, true);
      // Add relevant content to the template
      embed.querySelector('.title-wrapper-519256').innerHTML = title;
      embed.querySelector('.portal-arrow-519256').setAttribute("href", url);
      embed.querySelector('.portal-content-519256').innerHTML = quote;
      embed.querySelector('.mini-favicon-519256').src = "https://s2.googleusercontent.com/s2/favicons?domain_url="+url+"";
    
      let div=document.createElement("div");
      div.appendChild(embed);

      copyToClipboard(div.innerHTML);

      var el = $(this);
      el.css('border', '1px solid red');
      setTimeout(function() {
        el.css('border', 'none');
      }, 1000);
    });


    $('#rightpanel').on('click',"#delete", function() {
      
      var r = confirm("Are you sure you want to delete this quote?");
      if (r == true) {
        
        var url = $(".selected").attr("data-id");
        var quoteblock = $(this).closest('.quoteblock');
        var index = $(".quoteblock").index(quoteblock);
        var quotes = alldata[url]["quotes"];
        var removed = quotes.splice(index,1);
        alldata[url]["quotes"] = quotes;
        if(quotes.length == 0){ //if no quotes left then delete whole item from alldata
          chrome.storage.local.remove(url, function (){
            console.log("deleted "+url);
            $(".selected").hide();
            displayquotes(url);
          });
        }else{
        chrome.storage.local.set(alldata, function(){ 
          console.log("saving data");
          displayquotes(url);
        }); 
      }
        


      } else {
      } 
    });    

    document.getElementById("clearStorage").onclick = function(){
      var r = confirm("Are you sure you want to delete all citations?!");
      if (r == true) {
        chrome.storage.local.clear()
      } else {
      } 
    };

    // on focus comment box -> trigger autosave
    $( "#rightpanel" ).on("focus" , ".comment", function() {
      
      var url = $(".selected").attr("data-id");
      var object = alldata[url];
      console.log($(this).text());
      if($(this).text() == "Add comment"){
        $(this).text("");
      };
      $(this).css("color","#464A4D")
      var el = $(this);
      AutoSave.start(object, el , $(this).index(".comment"),url);
    });

    // on focusout comment box -> stop autosave
    $( "#rightpanel" ).on("focusout" , ".comment", function() {
      AutoSave.stop();
    });    

  });
});


function displayquotes(url){
  document.getElementById('panel-scrollContainer').innerHTML = "";

  window.location.hash = url;

  const fragment = document.getElementById('quote');

  var offset = $(".article[data-id='"+url+"']").offset();
  $("#article-scrollContainer").scrollTop(offset.top);
    
  alldata[url].quotes.forEach(item => {
    // Create an instance of the template content
    const instance = document.importNode(fragment.content, true);

    // Add relevant content to the template
    instance.querySelector('.portal-content-519256').innerHTML = item.text;
    instance.querySelector('.linkback a').href = url;
    instance.querySelector('.portal-arrow-519256').href = url;
    instance.querySelector('.title-wrapper-519256').innerHTML = alldata[url].title;
    instance.querySelector('.portal-author-519256').innerHTML = alldata[url].author;

    var date = new Date(item.date);
    console.log(date); // date is a timestamp but we only display formatted
    var dd = String(date.getDate()).padStart(2, '0');
    var mm = String(date.getMonth() + 1).padStart(2, '0'); //January is 0!
    var yyyy = date.getFullYear();
    
    date = mm + '/' + dd + '/' + yyyy;
    instance.querySelector('.date').innerHTML += date;

    if(item.comment){
     instance.querySelector('.comment').innerHTML = item.comment;
     instance.querySelector('.comment').style.color = "#464A4D";
    }else{
      instance.querySelector('.comment').innerHTML = "Add comment";
    };

    
    // Append the instance ot the DOM
    document.getElementById('panel-scrollContainer').appendChild(instance);

    $( ".article" ).each(function() {
      $( this ).removeClass( "selected" );
    });

    $(".article[data-id='"+url+"']").addClass( "selected" );


  });
};

// COPY TO CLIPBOARD

const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};

function extractHostname(url) {
  var hostname;
  //find & remove protocol (http, ftp, etc.) and get hostname

  if (url.indexOf("//") > -1) {
      hostname = url.split('/')[2];
  }
  else {
      hostname = url.split('/')[0];
  }
  return hostname 
};



// HOVER TO SHOW CONTROLS

$(document).on('mouseenter mouseleave', '.quoteblock', function(e) {
    if (e.type == "mouseenter"){

      $(this).find('.quote-controls').show().css({"opacity":"1"}).addClass('showcontrols');
    }else{
      $(this).find('.quote-controls').hide().css("opacity","0").removeClass('showcontrols');
    }
});


// AUTOSAVE FUNCTION
var AutoSave = (function(){
  var timer = null;

  function save(object, el, index, url){
    console.log("running save");
    console.log(el);
    alldata[url]["quotes"][index]["comment"] = el.text();
    chrome.storage.local.set(alldata, function(){ 
      console.log("autosaved");
    });          
  };

  function restore(){ //don't think I actually need this restore function...?
    var page = document.location.href;
    var saved = "";
    chrome.storage.local.get([page], function(result) {
        saved = result[page]["quotes"][0]["comment"];
    });

    var editor = getEditor();
    if (saved && editor){
      editor.value = saved; 
    }
  }

  return { 

    start: function(object, el, index, url){

      if (timer != null){
        clearInterval(timer);
        timer = null;
      }
      timer = setInterval(function(){
                save(object, el, index, url)
            }, 1000);
    },

    stop: function(){

      if (timer){ 
        clearInterval(timer);
        timer = null;
      }

    }
  }
}());


document.addEventListener("DOMContentLoaded", function(){
  $(".comment").resizable();
});

// $("#leftnav").resizable({
//     // only use the eastern handle
//     handles: 'e',
//     // restrict the width range
//     minWidth: 120,
//     maxWidth: 450,
//     // resize handler updates the content panel width
//     resize: function(event, ui){
//         var currentWidth = ui.size.width;

//         // this accounts for padding in the panels + 
//         // borders, you could calculate this using jQuery
//         var padding = 12; 

//         // this accounts for some lag in the ui.size value, if you take this away 
//         // you'll get some instable behaviour
//         $(this).width(currentWidth);

//         // set the content panel width
//         $("#rightpanel").width(containerWidth - currentWidth - padding);            
//     }
// });