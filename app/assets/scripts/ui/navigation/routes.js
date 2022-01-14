"use strict";
var app=app || {};

app.routes=app.routes||{};

app.routes.admin=function(dir){
  app.initAdminConfig();
  $('#app').goTo();
  var view=dir[1];
  if(view=="delete"){
    app.initDeleteSchool();
  }
};

app.routes.user=function(dir){
  var view=dir[1]; 
  app.renderUserConfig();
  if(view=="security"){
    app.initUserConfigSecurity();
  }else{
    app.initUserConfigMain();
  }
};

app.routes.mentions=function(){
  app.viewClear();  
  $('#header').css('display','none');
  $('#app').goTo();
  app.currentView="mentions";
  $('.template_mentions').css('display','block');
  app.titleRender('Mentions légales');
};

app.routes.deconnexion=function(){
  app.deconnexion();
};