"use strict";
var app=app || {};

(function($) {
  $.fn.goTo=function() {
    var offset=85;

    $('html, body').animate({
     scrollTop: ($(this).offset().top*1-offset) + 'px'
   }, 1);
    return this; 
  }
})(jQuery);

app.go=function(hash,callback=function(){}){
 if(hash==app.currentHash){
  $('#app').goTo();
  return;
}
window.location.hash=hash;

app.navigationCallbacks.push(callback);
}

app.navigationInit=function(){
  app.urlHash=window.location.hash.split('#')[1];

  window.onhashchange=function(){
   app.navigate();
   app.navigationCallbacks.map(callback => (callback)());
   app.navigationCallbacks=[];
 }
}

app.navigate=function(hash,force){
 hash=hash||window.location.hash.split('#')[1];
 if(!hash){
   app.go('home');

  return;
}

if(hash==app.currentHash && !force){$('#app').goTo(); return;}
app.currentHash=hash;

var dir=hash.split('/');
if(dir.length==0){
  app.go('sociogrammes');
  return;
}

if(app.routes[dir[0]]){
  app.routes[dir[0]](dir);
}else{
  app.go('sociogrammes');
}
$(document.body).trigger("sticky_kit:recalc");

return;

}