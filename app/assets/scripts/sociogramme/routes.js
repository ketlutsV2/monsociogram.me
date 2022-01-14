"use strict";
var app=app || {};

app.routes=app.routes||{};

app.routes.sociogrammes=function(dir){
  var classe_id=dir[1];
  var sociogramme_id=dir[2];
  var view=dir[3];
  var isInit=false;

  if(app.currentView!="sociogrammes"){ 
   app.sociogrammesInitView();
   isInit=true;
 }   

 if(classe_id=='add'){

  app.sociogrammeFormInit();
  return;
}


if(classe_id==null || !app.getClasseById(classe_id)){ 
  app.go('home');
  return;
}

if(app.getClasseById(classe_id).eleves.length<=0){
  app.go('classroom/'+classe_id+'/import');
  return;
}

app.sociogrammeCurrentClasse=classe_id;

if(sociogramme_id==null){ 
  if(!isInit){
    app.sociogrammesInitView();
  }
  app.sociogrammesSelectRenderInit(classe_id);  
}   

if(sociogramme_id!=null && app.getSociogrammeById(sociogramme_id)!=false){
  app.sociogrammeToggle(sociogramme_id);
}

if(view=="synthese"){
  if(app.sociogrammeCurrentClasse==null){
    app.go('sociogrammes');
  }
  else{
   app.initSociogrammeSynthese();
 }  
}
else if(view=="options"){
  app.sociogrammeShowAside();
}
else if(view=="edit" && sociogramme_id!=null && app.getSociogrammeById(sociogramme_id)!=false){
  app.sociogrammeEditionInit(sociogramme_id);
}

}