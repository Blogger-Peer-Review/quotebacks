var alldata;
var allKeys;

document.addEventListener("DOMContentLoaded", function(){
  chrome.storage.local.get(null, function(items) {
    allKeys = Object.keys(items);
    alldata = items;

    console.log(items);

    for( var i in items){
      const article_fragment = document.getElementById('article');
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
    
    $('#rightpanel').on('click',".copy", function() {
      console.log("copying?");
      var quote = $(this).closest('.quoteblock').find('.quote').text();
      copyToClipboard(quote);
      var el = $(this);
      el.css('border', '1px solid red');
      setTimeout(function() {
        el.css('border', 'none');
      }, 1000);
    });

    document.getElementById("clear").onclick = function(){
      var r = confirm("Are you sure you want to delete all citations?!");
      if (r == true) {
        chrome.storage.local.clear()
      } else {
      } 
    };

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
    instance.querySelector('.date').innerHTML = item.date;
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


