var alldata;
var allKeys;

document.addEventListener("DOMContentLoaded", function(){
  chrome.storage.local.get(null, function(items) {
    allKeys = Object.keys(items);
    alldata = items;

    console.log(items);

    for( var i in items){
      const article_fragment = document.getElementById('articleItem');
      const article_instance = document.importNode(article_fragment.content, true);
      // Add relevant content to the template
      article_instance.querySelector('.title').innerHTML = items[i].title;
      article_instance.querySelector('.author').innerHTML = items[i].author;
      article_instance.querySelector('.url').innerHTML = items[i].url;
      article_instance.querySelector('.article').setAttribute("data-id",items[i].url);

      // Append the instance ot the DOM
      document.getElementById('leftnav').appendChild(article_instance);
    }

    var pagehash = $(location).attr('hash').replace("#","");

    if($(location).attr('hash')){
      displayquotes(pagehash);
    }else{
      displayquotes(allKeys[0]);
    }
      
    $( ".article" ).click(function() {
      var url = $(this).find('.url').text();
      displayquotes(url);

    });
    
    $('#rightpanel').on('click',"#copy", function() {
      console.log("copying?");
      var quote = $(this).closest('.quoteblock').find('.quote').text();
      copyToClipboard(quote);
      var el = $(this);
      el.css('border', '1px solid red');
      setTimeout(function() {
        el.css('border', 'none');
      }, 1000);
    });

    $('#rightpanel').on('click',"#getlink", function() {
      
      var title = $(".selected").find(".title").text();
      var url = $(".selected").find(".url").text();
      var quote = $(this).closest('.quoteblock').find('.quote').text();

      const embed_fragment = document.getElementById('embed');
      const embed = document.importNode(embed_fragment.content, true);
      // Add relevant content to the template
      embed.querySelector('.portal-text-title').innerHTML = title;
      embed.querySelector('.portal-arrow').setAttribute("href", url);
      embed.querySelector('#portal-content').innerHTML = quote;
    
      let div=document.createElement("div");
      div.appendChild(embed);

      copyToClipboard(div.innerHTML);

      var el = $(this);
      el.css('border', '1px solid red');
      setTimeout(function() {
        el.css('border', 'none');
      }, 1000);
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
      console.log($(this).index(".comment"));
      var url = $(".selected").attr("data-id");
      var object = alldata[url];
      console.log(object);
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
  document.getElementById('rightpanel').innerHTML = "";

  const fragment = document.getElementById('quote');
    
  alldata[url].quotes.forEach(item => {
    // Create an instance of the template content
    const instance = document.importNode(fragment.content, true);

    // Add relevant content to the template
    instance.querySelector('.quote').innerHTML = item.text;
    instance.querySelector('.linkback a').href = url;
    instance.querySelector('.date').innerHTML += ' '+ item.date;
    if(item.comment){
     instance.querySelector('.comment').innerHTML = item.comment;
    }else{
      instance.querySelector('.comment').innerHTML = "Add comment";
    };

    
    // Append the instance ot the DOM
    document.getElementById('rightpanel').appendChild(instance);

    $( ".article" ).each(function() {
      $( this ).removeClass( "selected" );
    });

    $(".article[data-id='"+url+"']").addClass( "selected" );


  });
};


const copyToClipboard = str => {
  const el = document.createElement('textarea');
  el.value = str;
  document.body.appendChild(el);
  el.select();
  document.execCommand('copy');
  document.body.removeChild(el);
};


var AutoSave = (function(){

  var timer = null;

function save(object, el, index, url){
            console.log("running save");
            console.log(el);
            alldata[url]["quotes"][index]["comment"] = el.text();
            chrome.storage.local.set(alldata, function() { 
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