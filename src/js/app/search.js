
function io_search_filter(obj,str){
  if(str.length > 1){
    var txt = $(obj).text();
    var srch = txt.toLowerCase().search(str.toLowerCase());
    if(srch == -1){
      //$(obj).addClass('none');
    }else{
      $("#search-title").text('"'+str+'"');
      /*
      var prefix = txt.substr(0,srch).split(" ");
      var suffix = txt.substr(srch+str.length,txt.length).split(" ");
      newtxt = txt.substr(srch,(srch+str.length));
      $("#search-results").append('<div class="search-result"><h3><a href="'+$(obj).attr('url')+'">'+$(obj).attr('tit')+'</a></h3></div><div class="output">'+prefix.join(" ")+'<b>'+newtxt+'</b>'+suffix.join(" ")+'</div>');
      */
      var tail = 100;
      var dots_start = '...';
      var dots_end = '...';
      var prefix_in = srch - tail;
      var prefix_length = tail;
      var suffix_out = srch+str.length ;
      var suffix_length = tail;
      if(prefix_in < 0){
        prefix_in = 0;
        dots_start = '';
      }
      if(prefix_length > srch){
        prefix_length = srch-1;
        if(prefix_length < 0){
          prefix_length = 0;
        }
      }
      if(suffix_out > txt.length){
        suffix_out = txt.length;
        dots_end = '';
      }
      var prefix = txt.substr(prefix_in,prefix_length);
      var suffix = txt.substr(suffix_out,suffix_length);
      var newtxt = txt.substr(srch,str.length);
      //$("#search-results").append('<div class="search-result"><h3><a href="'+$(obj).attr('url')+'">'+$(obj).attr('tit')+'</a></h3></div><div class="output">'+prefix+'<b>'+newtxt+'</b>'+suffix+'</div>');
      $("#search-results").append('<div class="search-result"><h3><a href="'+$(obj).attr('url')+'">'+$(obj).attr('tit')+'</a></h3><div class="output">'+dots_start+''+prefix+'<span>'+newtxt+'</span>'+suffix+''+dots_end+'</div></div>');


    }
  }
}

function io_search_update(){
  if($("#site_search_input").val().length > 1){
    $("#search-results").empty();
    $("#search-output .search-output").each(function(){
      $(this).find('.main').removeAttr('id');
      io_search_filter($(this),$("#site_search_input").val());
    });
  }
}

var io_search_site_loaded = false;
var io_search_site_setup = true;
function io_search_site(){
  if(!io_search_site_loaded){

    io_search_site_loaded = true;
    $("#cardano-nav a").each(function(index,value){

      if($(this).hasClass('nosearch')){

      }else{
        var url = $(this).attr('href');
        var tit = $(this).text();
        $("#search-output").append('<div id="search-output-'+index+'" class="search-output" url="'+url+'" tit="'+tit+'"></div>');
        $("#search-output-"+index).load(url+' #main',function(){
          io_search_update();
        });
      }

    });
  }

  if(io_search_site_setup){
    io_search_site_setup = false;
    $("#main").addClass('none');
    $("#searching").html('<button id="io_search_close" class="close"><em class="fa fa-times"></em></button>');
    //$("#searching").append('<div id="search-output" class="none"></div>');
    $("#searching").append('<h1>Searching <b id="search-title"></b></h1>');
    $("#searching").append('<div id="search-results"></div>');

    $("#io_search_close").click(function(){
      $("#searching").empty();
      $("#main").removeClass('none');
      io_search_site_setup = true;
    });

  }else{
    io_search_update();
  }
}

$('#site_search_input').on('input', function() {
  io_search_update();
});
