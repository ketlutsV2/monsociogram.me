"use strict";
var app=app || {};

app.render=function(data,callback) {

  var data = jsonParse(data); 

  var toExecute=[];

/*---------------
-----------------
------APP-------
-----------------
---------------*/ 
     
if (data['etablissementsLST']) {
  if(data['etablissementsCRT']==false){
     app.etablissementsCRT=false;
    $('#connexion-menu-nouvelEtablissement').prop("disabled", true);
  }
}  

if (data['info'] && data['info'] != "") {
 // app.renderNoty(data['info']);

app.alert({title:data['info'][0][0]});


}
if(data['statut']==false && app.sessionID!=null){
  app.sessionID=null;
 app.deconnexion();
 return;
}
if(data['sessionID']){
app.sessionID=data['sessionID'];
app.load();

}
if(data['alertes']){
 for (var i = data['alertes'].length - 1; i >= 0; i--) {
  app.alert({title:data['alertes'][i]});
}
}
if (data['titre']) {
  app.titleRender(data['titre']);
}
 /*---------------
-----------------
------CONFIG------
-----------------
---------------*/
if(data['options']){
  app.serveurOptions=data['options'];
  for (var i = app.plugins.length - 1; i >= 0; i--) {
    var plugin= app.plugins[i];
    if(app.serveurOptions.plugins && app.serveurOptions.plugins.indexOf(plugin.name)>=0){
      plugin.enabled=true;
    }
   } 
   app.checkVersion();
     app.pluginsLauncher('appLoaded');
}

  /*---------------
-----------------
------USER------
-----------------
---------------*/
 if (data['userMemos']) { 
  app.userConfig.memos=data['userMemos'];
}
if (data['user']) {  
  if (data['user']['user_config']) {
    app.configUserInit(data['user']['user_config']);
  }

  if (data['user']['user_id']) {
   app.userConfig.userID=data['user']['user_id'];
 }
 
if (data['user']['mail']) { 
 app.userConfig.mail=data['user']['mail'];
}
if (data['user']['nom']) { 
 app.userConfig.nom=data['user']['nom'];
}

if (data['user']['prenom']) { 
 app.userConfig.prenom=data['user']['prenom'];
}
if(data['user']['admin']){
  app.userConfig.admin=data['user']['admin'];
  $('.admin').css('display','');
}
else if(data['user']['admin']==false){
  app.userConfig.admin=data['user']['admin'];
  $('.admin').css('display','none');
}
app.userConfigRenderForm();
app.userInfosHeaderRender();
}
/*---------------
-----------------
------DATA------
-----------------
---------------*/
if (data['eleves']) {
  app.eleves=data['eleves'];
  toExecute.push(app.buildElevesIndex);
}

if (data['classes']) {

 app.loadClasses(data['classes']); 
  toExecute.push(app.buildClassroomStudent);
  toExecute.push(app.buildClassroomGroups);
 toExecute.push(app.buildSpineButton); 
toExecute.push(function(){
if (data['new_classe_id']){
  if(app.onMobile()){
      app.buildSpineButton();
       app.spineRender();     
      app.spineGoToPageByURL('classroom/'+data['new_classe_id']);
    }else{
      app.homeClassesRender();
    }

}
});
}

if(data['elevesByClasses']){ 
  app.elevesByClasses=data['elevesByClasses'];
  toExecute.push(app.buildClassroomStudent);
  toExecute.push(app.buildClassroomGroups);
}
if (data['userGroupes']) { 
  app.userConfig.groupes=data['userGroupes'];
 toExecute.push(app.buildClassroomGroups);
}

if (data['userSociogrammesSave']) {
app.sociogrammesSaves=data['userSociogrammesSave'];
}

if (data['sociogrammes']) {
  app.sociogrammes=data['sociogrammes'];
  toExecute.push(app.buildSociogrammesIndex);
}

if (data['relations']) {
  app.relations=data['relations'];
}


if (data['picture']) {
app.currentEleve.eleve_picture=data['picture'];
toExecute.push(app.studentPictureSet);
}


if(data['lastUpdated']){
  app.checkLastUpdated(data['lastUpdated']);
}

toExecute=arrayUnique(toExecute);
for (var i =0,lng= toExecute.length; i <lng; i++) {
  toExecute[i]();
}

if (data['users']) {
  app.users=data['users'];
  app.buildUsersIndex();
}   

app.tutoSetStep(); 

return data;   
};