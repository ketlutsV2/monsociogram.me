var app=app || {};

app.viewClear=function() {
  app.currentView=null;
  app.keyboardEnable=true;

  $(".template").css('display', 'none'); 
  document.getElementById('header').style.display = "flex";
  document.getElementById('connexion-header').style.display = "none";  
   document.getElementById('mentions-header').style.display = "none";  
};

app.show=function(id,display){
  display=display||"block";
  document.getElementById(id).style.display=display;
}

app.hide=function(id){
  document.getElementById(id).style.display="none";
}

app.toggleViewById=function(id,display){
  display=display||"block";
  var elem=document.getElementById(id);
  if(elem.style.display!="none"){

    elem.style.display="none";
    return false;
  }else{
    elem.style.display=display;
    return true;
  }
}


app.alert=function(swal_options,callback,fallback){
  callback=callback||function(){};
  fallback=fallback||function(){};

if(swal_options.buttons===null){
  swal_options.buttons=true;
}

swal_options.icon=swal_options.icon||"success";
  if(swal_options.icon=='confirm'){
   swal_options.buttons=['Annuler','Valider'];    
 }
 swal_options.icon='warning';

 swal(swal_options).then(
  (confirm) => {
  if (confirm) {
   (callback)();
  } else {
   (fallback)();
  }
}
);

};


app.pluralize=function(n,str,sing){
  sing=sing||"";
  if(n>1)
    return str;
  return sing;
}

app.feminize=function(genre,str){
  if(genre=="F")
    return str;
  return "";
}


app.getColor=function(texte){
  if(texte==""){
    return "ffffff";
  }
  if(!app.cacheColor[''+texte+'']) {
    app.cacheColor[''+texte+'']=intToRGB(hashCode(texte));
  }
  return app.cacheColor[''+texte+''];
};

app.updateTextareaHeight=function(input) {
  input.style.height = 'auto';
  input.style.height = input.scrollHeight+'px';
}

app.windowResize=function(){
  app.sociogrammeAdaptativeZoom();
}

