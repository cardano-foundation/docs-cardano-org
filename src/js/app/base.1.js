var choice = '';
var choiceurl = '';
var chosen = '';
var io_hist = new Object();
var svgloader = '<div class="text-center" style="padding:50px 0"><?xml version="1.0" encoding="utf-8"?><svg width="120px" height="120px" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" preserveAspectRatio="xMidYMid" class="uil-ring-alt"><rect x="0" y="0" width="100" height="100" fill="none" class="bk"></rect><circle cx="50" cy="50" r="40" stroke="#333333" fill="none" stroke-width="10" stroke-linecap="round"></circle><circle cx="50" cy="50" r="40" stroke="#ff0000" fill="none" stroke-width="6" stroke-linecap="round"><animate attributeName="stroke-dashoffset" dur="2s" repeatCount="indefinite" from="0" to="502"></animate><animate attributeName="stroke-dasharray" dur="2s" repeatCount="indefinite" values="150.6 100.4;1 250;150.6 100.4"></animate></circle></svg></div>';


var is_chrome = navigator.userAgent.indexOf('Chrome') > -1;
var is_explorer = navigator.userAgent.indexOf('MSIE') > -1;
var is_firefox = navigator.userAgent.indexOf('Firefox') > -1;
var is_safari = navigator.userAgent.indexOf("Safari") > -1;
var is_opera = navigator.userAgent.toLowerCase().indexOf("op") > -1;
if ((is_chrome)&&(is_safari)) {is_safari=false;}
if ((is_chrome)&&(is_opera)) {is_chrome=false;}


function is_even(n) {
   return n % 2 == 0;
}

function io_strip(html){
   var tmp = document.createElement("DIV");
   tmp.innerHTML = html;
   return tmp.textContent || tmp.innerText || "";
}
function io_slug(str) {
    var re = /[^a-z0-9]+/gi; // global and case insensitive matching of non-char/non-numeric
    var re2 = /^-*|-*$/g;     // get rid of any leading/trailing dashes
    str = str.replace(re, '-');  // perform the 1st regexp
    return str.replace(re2, '').toLowerCase(); // ..aaand the second + return lowercased result
}

function io_class_toggle(cls,tgl) {
    jQuery(cls).toggleClass(tgl);
}

function io_hash() {
    var hash = document.location.hash;
    if(hash == '#tag-all'){
        return false;
    }
    if (hash.match('#')) {
        hash = hash.replace('#','');
        return hash;
    }else{
        return false;
    }
}

function io_nohttp(str) {
    str = str.replace('http://','');
    return str.replace('https://','');
}

function io_send_mail(obj) {
    var title = jQuery(obj).data('title');
    var link = jQuery(obj).data('link');
    window.open('mailto:bugs@iohk.io?subject=Daedalus bug&body='+encodeURI('There is a bug in Daedalus:\n'));
}

var textzoomed = 2,
textzoom_arr = new Array();
textzoom_arr[0] = 'font-smaller',
textzoom_arr[1] = 'font-small',
textzoom_arr[2] = '',
textzoom_arr[3] = 'font-big',
textzoom_arr[4] = 'font-bigger';

var dayname = new Array('January','February','March','April','May','June','July','August','September','October','November','December');


function textzoom(num) {

    if(num == 0){
        jQuery(".entry").removeClass(textzoom_arr[textzoomed]);
        textzoomed = 2;
    }else{
        jQuery(".entry").removeClass(textzoom_arr[textzoomed]);
        textzoomed += num;
        if(textzoomed > 4){
            textzoomed = 4;
        }
        if(textzoomed < 0){
            textzoomed = 0;
        }
        jQuery(".entry").addClass(textzoom_arr[textzoomed]);

    }
}

var webglAvailable = function () {
    try {
        var canvas = document.createElement("canvas");
        return !!(window.WebGLRenderingContext && (canvas.getContext( 'webgl' ) || canvas.getContext( 'experimental-webgl')));
    } catch(e){
        return false;
    }
};


io_intro_colors = {};
io_intro_colors.names = {
    aqua: "#00ffff",
    azure: "#f0ffff",
    beige: "#f5f5dc",
    blue: "#0000ff",
    brown: "#a52a2a",
    cyan: "#00ffff",
    darkblue: "#00008b",
    darkcyan: "#008b8b",
    darkgrey: "#a9a9a9",
    darkgreen: "#006400",
    darkkhaki: "#bdb76b",
    darkmagenta: "#8b008b",
    darkolivegreen: "#556b2f",
    darkorange: "#ff8c00",
    darkorchid: "#9932cc",
    darkred: "#8b0000",
    darksalmon: "#e9967a",
    darkviolet: "#9400d3",
    fuchsia: "#ff00ff",
    gold: "#ffd700",
    green: "#008000",
    indigo: "#4b0082",
    khaki: "#f0e68c",
    lightblue: "#add8e6",
    lightcyan: "#e0ffff",
    lightgreen: "#90ee90",
    lightgrey: "#d3d3d3",
    lightpink: "#ffb6c1",
    lightyellow: "#ffffe0",
    lime: "#00ff00",
    magenta: "#ff00ff",
    maroon: "#800000",
    navy: "#000080",
    olive: "#808000",
    orange: "#ffa500",
    pink: "#ffc0cb",
    purple: "#800080",
    violet: "#800080",
    red: "#ff0000",
    silver: "#c0c0c0",
    white: "#ffffff",
    yellow: "#ffff00"
};

io_intro_colors.random = function() {
    var result;
    var count = 0;
    for (var prop in this.names)
        if (Math.random() < 1/++count)
           result = prop;
    return result;
};


$(function() {
  return $("h2, h3, h4, h5, h6").each(function(i, el) {
    var $el, icon, id;
    $el = $(el);
    id = $el.attr('id');
    icon = '<i class="fa fa-link"></i>';
    if (id) {
      return $el.prepend($("<a />").addClass("header-link").attr("href", "#" + id).html(icon));
    }
  });
});


var io_months = ["January","February","March","April","May","June","July","August","September","October","November","December"];

$(window).on('load',function(){
  if(localStorage.getItem('popState') !== 'shown'){
    $('#myModal').modal('show');
    localStorage.setItem('popState','shown')
  }
});