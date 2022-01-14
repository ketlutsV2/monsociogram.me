"use strict";
var app=app || {};

app.routes=app.routes||{};

app.routes.home=function(dir){
  if( app.sessionID==null){
   app.connexionRender();
   return;
 }
 if(app.currentView!="home"){
   app.homeInit();
 }
 app.homeViews(); 
}