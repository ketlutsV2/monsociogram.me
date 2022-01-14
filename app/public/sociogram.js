/*
Copyright 2021 Pierre GIRARDOT

This file is part of Sociogram.

Sociogram is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version GPL-3.0-or-later of the License.

Sociogram is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Sociogram.  If not, see <https://www.gnu.org/licenses/>.*/
"use strict";
var app=app || {};

/*******/
/* Run */
/*******/
document.addEventListener("DOMContentLoaded", function(event) { 
 
  app.initVariables();
  app.keyboardInit();
  app.touchInit(); 
  app.mouseInit();
  app.pluginsLauncher('appInit');
  app.navigationInit(); 

//Reconnexion automatique
let sessionParams= sessionStorage.getItem('sessionParams')||localStorage.getItem('sessionParams');
if(sessionParams!=null){
  sessionParams = jsonParse(sessionParams); 
  if(app.myTime()-sessionParams.time<8640000){
    app.nom_etablissement=sessionParams.nom_etablissement;
    app.pseudo_utilisateur=sessionParams.pseudo_utilisateur;
    app.sessionID=sessionParams.sessionID;
    app.version=sessionParams.version;
    app.load();
  }else{
   app.connexionRender();  
 }
 
}else{
  app.connexionRender();  
}




});

app.load=function() {

  app.sessionParams=JSON.stringify({
    nom_etablissement:app.nom_etablissement,
    pseudo_utilisateur:app.pseudo_utilisateur,
    sessionID:app.sessionID,
    version:app.version,
    time:app.myTime()
  });


  sessionStorage.setItem('sessionParams', app.sessionParams);
  if(document.getElementById('connexion_auto').checked="checked"){
   localStorage.setItem('sessionParams', app.sessionParams);
 }else{
  localStorage.clear();
}

$.ajax({url: app.serveur + "index.php?go=loader",
  timeout: 60000,
  method:"POST",
  data:{ 
    time:Math.floor(app.myTime()/1000),
    sessionParams:app.sessionParams
  }
}).done(function(data){
  
  app.render(data);   
  app.navigate(app.urlHash,true);
  app.timerPing=setTimeout(app.ping, 0);
});
};

app.ping=function() {
 clearTimeout(app.timerPing);
 $.ajax({url: app.serveur + "index.php?go=ping",
   method:"POST",
   data:{ 
    time:Math.floor(app.myTime()/1000),
    sessionParams:app.sessionParams,
    syncId:app.userConfig.messagesSyncId
  },
  timeout: 1000
})
 .done(function(data) {
  if (!app.isConnected) {
    app.isConnected = true;
    $.ajax({url: app.serveur + "index.php?go=loader",
      timeout: 5000,
      method:"POST",
      data:{ 
        time:Math.floor(app.myTime()/1000),
        sessionParams:app.sessionParams
      }
    })
    $(".connexion-requise").prop("disabled", false);
    return;
  }

  app.render(data);  

}
).fail(
function() {
  app.isConnected = false;
  $(".connexion-requise").prop("disabled", true);
}
);
app.timerPing=setTimeout(app.ping, 20000);
};


app.pluginsLauncher=function(callback){
  var plugins=app.plugins;
  for (var i = plugins.length - 1; i >= 0; i--) {
   var plugin=plugins[i];
   if(!plugin.enabled){continue;}
   if(plugin[callback]){
    (plugin[callback])();
  }
}
}

app.checkVersion=function(){
  if(app.userConfig.version && app.userConfig.version!=app.version){
    app.alert({title:"L'application a été mise à jour.",text:'',buttons: ["Fermer", "Valider"]},function(){});
    app.userConfig.version=app.version;    
    app.pushUserConfig(); 
  } 
}
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
"use strict";
var app=app || {};

app.checkLastUpdated=function(lastUpdated){


}
"use strict";
var app=app || {};

app.nom_etablissement="";
app.pseudo_utilisateur="";

app.loadUi=0;
app.logo="<img src='assets/img/logo.svg' width='40px'>";
app.plugins=app.plugins||[];

//**********
// Connexion
//*********
app.etablissementsCRT=true;
app.connexionFormMode='connexion';
//app.connexionParam = "";

app.initVariables=function(){
//**********
// App
//*********
app.version = "v20220102";
app.currentMode="";
app.platform="web";
app.sessionID=null;
app.isConnected =true;
app.keyboardEnable=true;
app.urlHash="";
app.mouse={
  x:0,
  y:0 
};
app.timerPing=null;
app.update = [];
app.users=[];
app.usersIndex=[];

app.pi=Math.PI;
app.cacheColor=[];

app.enableKeyboardShorcuts=true;

//**********
// UI
//*********
app.currentHash="";
app.currentView="";
app.navigationCallbacks=[];
//**********
// Home
//*********
app.homeClassesListe=[];
//**********
// Classe
//*********
app.elevesByClasses=[];
app.classes = [];
app.currentClasse = null;
//**********
// Eleves
//*********
app.elevesIndex=[];
app.eleves=[];
app.currentEleve = null;
//**********
// Config
//*********
app.configCurrentUser=null;
//**********
// Sociogramme
//*********
app.sociogrammes=[];
app.relations=[];
app.sociogramme={
  width:0,
  height:0,
  current:null,
 zoom:1,
 centerX:250,
 centerY:250,
 centres:[],
 vue:"",
 mode:"students",
 relationsView:"userView",
 eleves:[],
 rangs:[],
 relations:[],
 enableDraw:true,
 enable_move:false,
 selectedEleve:null,
 selectedCentre:null,
 step:100,
 filtre:null,
 ctx:null
};
app.newSociogrammeQuestionsNb=0;
app.preventTouch=false;
app.sociogrammeCurrentClasse=null;
app.sociogrammeCurrentStudent=null;
app.sociogrammeClick=false;
app.sociogrammeMouseDown=false;
app.sociogroupsButton=false;
app.sociogrammeReverse=false;
app.sociogrammeEnableSave=false;
app.sociogrammeFilters=[];
app.sociogrammeEdition=false;
app.sociogrammesSaves=[];
app.areInSociogroups=[];
app.sociogroups=[];
app.sociogrammeRepeatZoom=false;
//**********
// Groupes
//*********
app.currentGroupe={
  sociogramme_id:null
};
//**********
// Tuto
//*********
app.tutoStep=0;
app.tutoIsEnable=true;
//**********
// Datatable
//*********
app.datatableFR={
sProcessing:"Traitement en cours...",
sSearch:         "",
sLengthMenu:     "Afficher _MENU_ &eacute;l&eacute;ments",
sInfo:           "Affichage de l'&eacute;lement _START_ &agrave; _END_ sur _TOTAL_ &eacute;l&eacute;ments",
sInfoEmpty:      "Affichage de l'&eacute;lement 0 &agrave; 0 sur 0 &eacute;l&eacute;ments",
sInfoFiltered:   "(filtr&eacute; de _MAX_ &eacute;l&eacute;ments au total)",
sInfoPostFix:    "",
sLoadingRecords: "Chargement en cours...",
sZeroRecords:    "Aucun &eacute;l&eacute;ment &agrave; afficher",
sEmptyTable:     "Aucune donn&eacute;e disponible dans le tableau",
oPaginate: {
  sFirst:"Premier",
  sPrevious:   "<span class='bi bi-chevron-left'></span>",
  sNext:       "<span class='bi bi-chevron-right'></span>",
  sLast:       "Dernier"    
},
oAria: {
  "sSortAscending":  ": activer pour trier la colonne par ordre croissant",
  "sSortDescending": ": activer pour trier la colonne par ordre d&eacute;croissant"    
},
search: "_INPUT_",
searchPlaceholder: "Rechercher"
};
//**********
// User
//*********
app.users=[];
app.userConfig={
  sorting:0,
  coloration:0,
  version:app.version,
  userID:0,
  sociogrammeViewRangs:true,
  groupes:[],
  memos:[]
};

//Init UI
if(app.loadUi==0)
{
  app.uiInit();
}

}
var app=app || {};

app.deconnexion=function(){  
	sessionStorage.clear();
	localStorage.clear();
	app.initVariables(); 
	app.urlHash="";
	$.post(app.serveur + "index.php?go=users&q=deconnexion",
	{ 
		sessionParams:app.sessionParams
	}, function(data){	
		document.location.reload();
	});	
}
var app=app || {};

app.createAccount=function(){
  
  var pseudo=document.getElementById("user_pseudo").value;
  var password_1=document.getElementById("user_passe").value;
  var password_2=document.getElementById("user_passe2").value;
  var etablissement=pseudo;
  var etablissement_password_1=password_1
  var etablissement_password_2=password_2
  var error=false;
  if(password_1=="" ||etablissement_password_1==""){
   app.alert({title:'Les mots de passe ne doivent pas être vides.'});
   error=true;
 }
 if(password_1!=password_2){
   app.alert({title:'Les mots de passe utilisateur sont différents.'});
   error=true;
 }
 if(pseudo==""){
   app.alert({title:'Il faut choisir un pseudo.'});
   error=true;
 }  
 if(error){
  $('.connexion-btn').button('reset');
  return;
}

$('.template').css('display','none');
$('#splash-screen').css('display','');

$.post(app.serveur + "index.php?go=users&q=create",{
  pseudo_utilisateur:pseudo,
  pass_utilisateur:password_1,
  nom_etablissement:etablissement,
  pass_etablissement:etablissement_password_1,
  create_account:true
}, function(data) {
  data=app.render(data);
  $('.connexion-btn').button('reset');
  if(data['statut']==true){   
   app.pluginsLauncher('createAccount');
   app.connexion();
 }else{
  $('#splash-screen').css('display','none');
  $(".template_connexion").css('display','block');
 }
}
);
}
var app=app || {};

app.passwordRetrieveGetCode=function(){
	if (!app.checkConnection()) {return;}
	let etablissement=document.getElementById('retrieve_etablissement').value;
	let pseudo=document.getElementById('retrieve_pseudo').value;
	$.post(app.serveur + "index.php?go=users&q=passwordRecovery&action=getCode",
	{
		retrieve_etablissement:etablissement,
		retrieve_pseudo:pseudo
	}, function(data){
		app.render(data);       
	});
};

app.passwordRetrieveNew=function(){
	if (!app.checkConnection()) {return;}
	let etablissement=document.getElementById('retrieve_etablissement2').value;
	let pseudo=document.getElementById('retrieve_pseudo2').value;
	let passe=document.getElementById('retrieve_passe').value;
	let passe2=document.getElementById('retrieve_passe2').value;
	let token=document.getElementById('retrieve_token').value;
	$.post(app.serveur + "index.php?go=users&q=passwordRecovery&action=passwordUPD",{
		retrieve_etablissement:etablissement,
		retrieve_pseudo:pseudo,
		retrieve_passe:passe,
		retrieve_passe2:passe2,
		retrieve_token:token
	},app.render);
}
var app=app || {};

app.initAdminConfig=function(){  

  app.viewClear();
  app.currentClasse=null;
  app.currentEleve=null;
  app.currentView="config";
 app.show('config-admin-bloc','');
 
};

//#########
//OPTIONS
//#########
app.serverConfigUPD=function(options) {
  if (!app.checkConnection()) {
    return;
  }   
  $.post(app.serveur + "index.php?go=school&q=update", {
    options:JSON.stringify(options),
    sessionParams:app.sessionParams
  },
  app.render
  );
};

//#########
//RESETS
//#########

app.initDeleteSchool=function(){
 app.titleRender("<a href='#user'>Mon compte</a> / Clôture");
 app.show('config_school_delete');

}


app.etablissementDEL=function(confirm) {
  if (!app.checkConnection()) {
    return;
  }
  if(!confirm){
    app.alert({title:'Voulez-vous vraiment supprimer cet établissement ?',icon:'confirm'},function(){app.etablissementDEL(true);},function(){
      $('#config_school_delete_btn').button('reset');
    });
    
    return;
  }
  $.post(app.serveur + "index.php?go=school&q=delete",{
    sessionParams:app.sessionParams
  }, app.render);
};

var app=app || {};

app.initAdminPlugins=function(){
  app.titleRender("<a href='#admin'>Administration</a> / Plugins");
  $('.config-admin').css('display','none');
  app.show('config-plugins');
  $('.admin-toolbar-btn').removeClass('btn-primary').addClass('btn-light'); 
  $('#admin-toolbar-btn-plugins').removeClass('btn-light').addClass('btn-primary');
  app.configPluginsListeRender();
}

app.configUpdatePlugin=function(name,value){
  var pluginsEnabled=[];
  for (var i = app.plugins.length - 1; i >= 0; i--) {
    var plugin=app.plugins[i];
    if(plugin.name==name){
      plugin.enabled=value;
      if(plugin.enabled){
        pluginsEnabled.push(plugin.name);
        (plugin['onEnabled'])();
      }
    }

  }

  app.serverConfigUPD({'plugins':JSON.stringify(pluginsEnabled)});
  return true;
}

app.configPluginsListeRender=function(){
  var html=[];
  for (var i = app.plugins.length - 1; i >= 0; i--) {
    var plugin=app.plugins[i];
    if(!plugin.display){
      continue;
    }
    var checked="";
    if(plugin.enabled){
      checked="checked";
    }

    html.push('<div class="well well-sm plugin-desciption">');
    html.push('<label class="switch">');

    html.push('<input type="checkbox" onclick="return app.configUpdatePlugin(\''+plugin.name+'\',this.checked);" '+checked+'/>');
    html.push('<span class="slider round"></span>');
    html.push('</label>');

    html.push('<h4>');
    html.push(plugin.name);
    html.push('</h4>');

    if(plugin.description){
      html.push('<hr/>');
      html.push(plugin.description);
    }

    html.push('</div>');
  }
  document.getElementById('config-plugins-descriptions').innerHTML=html.join('');
}
var app=app || {};

app.getClasseById=function(classe_id) {
  var classes=app.classes;
  for (var i = 0, lng = classes.length; i < lng; i++) {
    if (classes[i].classe_id == classe_id) {
      classes[i].num=i;     
      return classes[i];
    }
  }
  return false;
};

app.loadClasses=function(classes){  
  app.classes=classes;
  var n_classe={
    classe_nom:"~Toutes les personnes~",
    classe_id:'-1',
    controles:[],
    eleves:[],
    sociogrammes:[],
    groupes:[],
    classe_destinataires:[],
    classe_intelligences:false
  };

  app.classes.push(n_classe);  

  var n_classe={
    classe_nom:"~Non classées~",
    classe_id:'-2',
    controles:[],
    eleves:[],
    sociogrammes:[],
    groupes:[],
    classe_destinataires:[],
    classe_intelligences:false
  }   
  
  app.classes.push(n_classe);  

  app.classes=app.orderBy(app.classes,'classe_nom','ASC');

  app.setColorClasses();
  app.homeBuildClassesListes();

  if(app.classes.length==2 || app.eleves.length==0){
    $('.ifCohortes').addClass('d-none');
  }else{
   $('.ifCohortes').removeClass('d-none'); 
 }

}

app.homeBuildClassesListes=function(){
  var currentFirstLetter = "";
  var classes=[];
  var family=[];

  for (var i = 0, lng=app.classes.length ; i < lng; i++) {
    var classe=app.classes[i];
    if(classe.classe_id<0){continue;}

    var firstLetter = classe.classe_nom.charAt(0);
    if (firstLetter != currentFirstLetter) {
     currentFirstLetter = firstLetter;
     if(family.length>0){classes.push(family);}   
     family=[classe]; 
   }else{
    family.push(classe);
  }
}
classes.push(family);
app.homeClassesListe=classes;
}

app.setColorClasses=function(){
  var k=0;
  var nb=app.classes.length+1;
  for (var i = 0, lng = app.classes.length; i < lng; i++) {
    var classe=app.classes[i];
    classe.visible=true;
    var color="#ffffff";    
    var p=(k/nb)*100;
    var fctAffineNum=Math.floor(p/(100/6));
    var n=Math.round((p*100/((fctAffineNum+1)*(100/6)))/100*255);
    if(fctAffineNum%2==1){
      n=255-n;
    }
    n=n.toString(16);
    if(n.length<2){
      n="0"+n;
    }
    if(fctAffineNum==0){
      color="#ff00"+n;
    }
    else if(fctAffineNum==1){
      color="#"+n+"00ff";
    }
    else if(fctAffineNum==2){
      color="#00"+n+"ff";
    }
    else if(fctAffineNum==3){
      color="#00ff"+n;
    }
    else if(fctAffineNum==4){
      color="#"+n+"ff00";
    }
    else if(fctAffineNum==5){
      color="#ff"+n+"00";
    }
    classe.color=color;
    k++;
  }  
}

app.buildClassroomStudent=function(){
  var data=app.elevesByClasses;
  var all=[];
  for (var i = app.classes.length - 1; i >= 0; i--) {
    app.classes[i].eleves=[];
  }
  for (var i =data.length - 1; i >= 0; i--) {
    var classe=app.getClasseById(data[i]['rec_classe']);
    if(!classe){
      continue;
    }
    classe.eleves.push(data[i]['rec_eleve']);
    all.push(data[i]['rec_eleve']);
  }   

  var non_classes=[];
  for (var i = app.eleves.length - 1; i >= 0; i--) {
    if(all.indexOf(app.eleves[i].eleve_id)<0){
      app.classes[app.classes.length-2].eleves.push(app.eleves[i].eleve_id);
    }
  }
}

app.buildClassroomGroups=function(){
  var data=app.userConfig.groupes;
  for (var i = app.classes.length - 1; i >= 0; i--) {
    var classe=app.classes[i];
    classe.groupes=[];    
    var girls=[];
    var boys=[];
    var eleves=classe.eleves;
    for (let i = eleves.length - 1; i >= 0; i--) {
     var eleve=app.getEleveById(eleves[i]);
     if(eleve.eleve_genre=="F"){
      girls.push(eleves[i]);
    }
    else if(eleve.eleve_genre=="G"){
      boys.push(eleves[i]);
    }
  }
  classe.groupes.push({
    groupe_name:"Cohorte entière ("+eleves.length+")",
    groupe_data:JSON.stringify({'eleves':[eleves]})
  });
  classe.groupes.push({
    groupe_name:"Filles/Garçons",
    groupe_data:JSON.stringify({'eleves':[girls,boys]})
  });
  classe.groupes.push({
    groupe_name:"Filles ("+girls.length+")",
    groupe_data:JSON.stringify({'eleves':[girls]})
  });
  classe.groupes.push({
    groupe_name:"Garçons ("+boys.length+")",
    groupe_data:JSON.stringify({'eleves':[boys]})
  });
}
for (var i =data.length - 1; i >= 0; i--) {
  var classe=app.getClasseById(data[i].groupe_classe);
  if(!classe){
    continue;
  }
  classe.groupes.push(data[i]);
}
}
var app=app || {};

app.initClassroom=function(classe_id) {  
  var classe=app.getClasseById(classe_id)
  if(!classe){
    app.go('home');
    return;
 }
 
 app.viewClear();
 app.currentView="classe";
 app.currentEleve=null;   
 app.currentClasse=classe;
 $(".template_classe").css("display","block");
 $('.classroom-page').css('display','none');
 $('#classroom-main').css("display","");
 $('#classroom-toolbar').css('display','');



 document.getElementById('classe-delete').style.display="none";     
};
var app=app || {};

app.cleanClasseName=function(classe_name){
  return classe_name.replace(/~/g,'');
}
"use strict";
var app=app || {};

app.routes=app.routes||{};

app.routes.classroom=function(dir){
 var id=dir[1];
 if(id==undefined){app.go('home');
 return;}
 if(id=="add"){
  if(app.currentView!="home"){
    app.go('home'); 
    return;
  }   
  app.renderClasseAdd();
  return;
}
if(app.currentView!='classe' || dir[1]!=app.currentClasse.classe_id){
 app.initClassroom(id);
}

var view=dir[2];
if(view=="groups"){
  app.initClassroomGroups();
}
else if(view=="import"){
  app.initClassroomStudentsImport();
}
else if(view=="export"){
 app.initClassroomStudentsExport();
}
else if(view=="config"){
 app.classroomConfigInit();
}
else{
  app.initClassroomStudentsExport();
}

}
var app=app || {};

app.homeInit=function(){
  app.viewClear();
  app.currentView="home";
  app.currentClasse=null;
  app.currentEleve=null;

  $(".template_home").css("display","flex");
  app.titleRender('MonSociogram<span class="small">.me</span>');
  
  app.spineRender();

  document.getElementById('home-memo').value=app.getMemo('home',0)||'';
  $('#home-memo').css('height','auto');
  $('#home-memo').css('height',document.getElementById('home-memo').scrollHeight+'px');


  app.pluginsLauncher('homeAfterRender');
};

app.homeViews=function(view){
  app.homeClassesInit();
  
  /*if(view!=app.userConfig.homeCurrentView){
    app.userConfig.homeCurrentView=view;
    app.pushUserConfig();
  } */
}
var app=app || {};

app.homeMemoSave=function(){
  if (!app.checkConnection()) {return;}
  var data=$('#home-memo').val();
  app.setMemo('home',0,data); 
}
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
var app=app || {};

app.getSociogrammeById=function(sociogramme_id){
	return app.sociogrammesIndex[sociogramme_id];	
}

app.buildSociogrammesIndex=function(){
	app.sociogrammesIndex=[];
	for (var i = 0, lng = app.sociogrammes.length; i < lng; i++) {
		app.sociogrammesIndex[app.sociogrammes[i].sociogramme_id]=app.sociogrammes[i];
	}

};
var app=app || {};

app.sociogrammesInitView=function(){
	app.viewClear(); 
	app.currentView="sociogrammes";
	$('.template_sociogrammes').css('display','flex');
	$('.sociogramme-bloc').css('display','none');
	app.show('sociogramme-main','flex');
	app.show('sociogramme-render','flex');
	app.show('sociogramme-toolbar','flex');
	app.hide('sociogramme-smalltoolbar');
	app.hide('classroom-sociogramme-synthese-box');
	app.hide('sociogramme_form');
	app.hide('sociogramme-options');
	$('.sociogrammes-classes-toolbar').css('display','none');

	if(app.userConfig.sociogrammeViewRangs){
		document.getElementById('sociogrammeViewRangs').checked="checked";
		$('.sociogramme-rangs').css('display','block');
	}
	else{
		document.getElementById('sociogrammeViewRangs').checked="";	
		$('.sociogramme-rangs').css('display','none');
	}

	app.sociogramme.current=null;	
	app.sociogrammeEdition=false;
	app.sociogramme.height=$('#classroom-sociogramme').height();
	app.sociogramme.centerX=app.sociogramme.height/2;
	app.sociogramme.centerY=app.sociogramme.height/2;	

	app.sociogrammeNoRelationsBtn();



}

app.sociogrammesSelectRenderInit=function(classe_id){
	var classe=app.getClasseById(classe_id);
	let button='';
	if(app.onMobile()){
		button=' <button class="btn btn-light small-screen ms-2"  onclick="app.go(\'#classroom/'+app.sociogrammeCurrentClasse+'\');">\
		<span class="bi bi-gear"></span>\
		</button >';
	}
	app.titleRender('<a href="#home">MonSociogram<span class="small">.me</span></a> / '+app.cleanClasseName(classe.classe_nom) + button);
	app.sociogrammesSelectRender();
}

app.sociogrammeToggle=function(sociogramme_id){
	$('#sociogramme-main').css('display','');
	$('.sociogramme-classe').css('display','none');
	
	var sociogramme=app.getSociogrammeById(sociogramme_id);

	app.titleRender("<a href='#sociogrammes'>MonSociogram<span class='small'>.me</span></a> / "+ucfirst(sociogramme.sociogramme_name));

	$('#questionnaires-liste-bloc').css('display','none');
	$('#sociogrammes-tab').css('display','none');
	$('#sociogrammes-create-button').css('display','none');
	app.hide('sociogramme-student-form-block');
	app.hide('sociogramme_form');
	app.hide('sociogramme-scissors-btn');
	app.hide('sociogramme-sociogroups-btn');
	app.sociogramme.current=sociogramme_id;
	app.sociogrammeFilterSelectInit();	
	app.sociogrammeByClasse(app.sociogrammeCurrentClasse);
}

app.sociogrammeByClasse=function(classe_id){
	app.sociogrammeCurrentClasse=classe_id;
	$('.sociogramme-bloc').css('display','none');
	app.show('sociogramme-toolbar','flex');
	app.show('sociogramme-main','flex');

	app.show('sociogramme-render','flex');
	$('.sociogrammes-classes-toolbar').css('display','');
	app.getClasseSociogramme({mode:'students'});
	app.classroomGroupsFormRender();
	app.classroomGroupsSelectSaveRender(); 
	app.groupesInfoUpdate();
}

app.getClasseSociogramme=function(options){
	options=options||{};
	if(options.classe_id!=null){
		app.sociogrammeCurrentClasse=options.classe_id;
	}
	if(options.sociogramme_id!=null){
		app.sociogramme.current=options.sociogramme_id;
	}
	app.sociogramme.mode=options.mode||app.sociogramme.mode;
	app.sociogrammeEdition=false;

	$('.sociogramme-classe').css('display','');

	app.show('classroom-sociogramme');
	app.show('sociogramme-sociogroups-btn');
	app.show('sociogramme-smalltoolbar');
	if(app.onMobile()){
		app.hide('sociogramme-options');
	}else{
		app.show('sociogramme-options');
	}
$('#home-tutoriel').css('display','none');
	app.tutoIsEnable=false;
	//app.titleRender("Sociogrammes");
	$('#questionnaires-liste-bloc').css('display','none');	
	$('#sociogrammes-create-button').css('display','none');
	document.getElementById('sociogrammes-tab').innerHTML='';
	document.getElementById('classroom-sociogramme-synthese').innerHTML="";
	app.currentClasse=app.getClasseById(app.sociogrammeCurrentClasse);

	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	app.sociogramme.relations=app.getSociogrammeRelations(classe.classe_id);

	if(app.sociogramme.relations.length>0){
		$('#sociogramme-scissors-btn').css('display','');
	}else{
		app.hide('sociogramme-scissors-btn');
	}
	
	app.titleRender("<a href='#home'>MonSociogram<span class='small'>.me</span></a> / <a href='#sociogrammes/"+classe.classe_id+"'>"+app.cleanClasseName(classe.classe_nom)+"</a> / "+ucfirst(app.getSociogrammeById(app.sociogramme.current).sociogramme_name));

	app.sociogramme.eleves=classe.eleves;

	if(app.sociogramme.mode=="students"){	
		app.sociogramme.vue="classe_"+classe.classe_id;
		app.setElevesRang(app.sociogramme.eleves,app.sociogramme.relations);
		app.sociogramme.rangs=app.getRangs(app.sociogramme.eleves);
		if(document.getElementById('sociogrammeViewRangs').checked){
			app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
		}
		else{
			app.sociogrammeLoadSave();	
		}	
		$('.sociogramme-option').css('display','');
	}
	else{
		$('.sociogramme-option').css('display','none');
		$('#sociogramme-sociogroups-btn').css('display','');
		app.setElevesPositionsByGroupes();
	}	
	app.sociogrammeAdaptativeZoom();
	app.sociogrammeSave();
	app.sociogrammeNoRelationsBtn();
}

app.sociogrammeNoRelationsBtn=function(){
	if(!app.sociogramme.current || app.sociogrammeCountRelations(app.sociogrammeCurrentClasse,app.sociogramme.current)>0){
		$('#sociogramme_noRelations').css('display','none');
	}
	else{
		$('#sociogramme_noRelations').css('display','');	
	}
}
var app=app || {};

app.sociogrammesSelectRender=function(){
	$('#questionnaires-liste-bloc').css('display','');
	$('#sociogrammes-tab').css('display','');
	$('#sociogrammes-create-button').css('display','');

	//MES SOCIOGRAMMES
	var html=[];
	var sociogrammes=app.sociogrammes;
	sociogrammes=app.orderBy(sociogrammes,'sociogramme_date','ASC');
	
	if(sociogrammes.length==0){
		$('#sociogramme-render').css('display','none');
	}else{
		$('#sociogramme-render').css('display','');
	}

	for (var i = sociogrammes.length - 1; i >= 0; i--) {
		var sociogramme=sociogrammes[i];
		html.push('<div class="sociogramme-box" onclick="app.go(\'sociogrammes/'+app.sociogrammeCurrentClasse+'/'+sociogramme.sociogramme_id+'\');">');
		html.push('<div class="text-center">');
		html.push('<span class="sociogramme-box-title">'+ucfirst(sociogramme.sociogramme_name)+'</span>');
		html.push('</div>');
		html.push('<br/>');
		
		var questions=jsonParse(sociogramme.sociogramme_questions);
		html.push(questions.length+ ' question'+app.pluralize(questions.length,'s'));
		html.push('  <button class="btn btn-light me-2 btn-sm" onclick="event.stopPropagation();app.go(\'sociogrammes/'+app.sociogrammeCurrentClasse+'/'+sociogramme.sociogramme_id+'/edit\');" title="Éditer les questions"><span class="bi bi-pencil-square"></span></button> ');
		html.push('<button class="btn btn-light mt-3" onclick="event.stopPropagation();app.go(\'sociogrammes/'+app.sociogrammeCurrentClasse+'/'+sociogramme.sociogramme_id+'\');" title="Commencer."><span class="bi bi-bullseye"></span> Commencer</button> ');
		html.push('</div>');
		html.push('</div>');
	}
	document.getElementById('questionnaires-liste').innerHTML=html.join('');

	//OUVERTS RECEMMENT
	var n=0;
	var html=[];
	var saves=app.sociogrammesSaves;
	saves=app.orderBy(saves,'sociogrammeSave_date','ASC');
	html.push('<div class="bold text-start mb-2"><span class="bi bi-arrow-return-right"></span>  Utilisés récemment</div>');

	for (var i = saves.length - 1; i >= 0; i--) {
		var save=saves[i];
		var sociogramme=app.getSociogrammeById(save.sociogrammeSave_sociogramme);

		var classe=app.getClasseById(save.sociogrammeSave_classe);
		if(classe.classe_id!=app.sociogrammeCurrentClasse){
			continue;
		}
		var nbRelations=app.sociogrammeCountRelations(save.sociogrammeSave_classe,save.sociogrammeSave_sociogramme);
		n++;
		
		html.push('<div class="sociogramme-box" onclick="app.go(\'sociogrammes/'+save.sociogrammeSave_classe+'/'+save.sociogrammeSave_sociogramme+'\');">');
		html.push('<div class="text-center">');
		html.push('<span class="sociogramme-box-title" >'+ucfirst(sociogramme.sociogramme_name)+'</span>');
		html.push('</div>');
		html.push('<img src="'+save.sociogrammeSave_picture+'" width="100" class="mb-1"/>');
		
		if(nbRelations>0){			
			html.push(nbRelations+ ' relation'+app.pluralize(nbRelations,'s'));
		}
		else{
			html.push('Aucune relation');
		}
		html.push('<button class="btn btn-light mt-2" onclick="event.stopPropagation();app.go(\'sociogrammes/'+app.sociogrammeCurrentClasse+'/'+sociogramme.sociogramme_id+'\');" title="Commencer."><span class="bi bi-bullseye"></span> Commencer</button> ');

		html.push('</div>');
		html.push('</div>');
	}

	html.push('<hr/>');
	if(n==0){
		$('#sociogrammes-tab').html('');
		return;
	}
	document.getElementById('sociogrammes-tab').innerHTML=html.join('');
};
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
var app=app || {};

app.sociogrammeSave=function(){
	if (!app.checkConnection()) {return;}

	if(app.sociogramme.mode=="groups"){		
		return;
	}else{
		if(document.getElementById('sociogrammeViewRangs').checked){
			app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
			app.sociogrammeRenderInit();
			return;
		}
	}
	
	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	var save={};
	save.eleves=null;
	if(!document.getElementById('sociogrammeViewRangs').checked){
		var eleves_positions=[];
		for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
			var eleve=app.getEleveById(app.sociogramme.eleves[i]);
			eleves_positions.push({
				eleve_id:eleve.eleve_id,
				coordR:eleve.sociogramme[app.sociogramme.vue].coordR,
				coordT:eleve.sociogramme[app.sociogramme.vue].coordT
			});
		};
		save.eleves=eleves_positions;
	}
	save.zoom=app.sociogramme.zoom;
	var picture=app.sociogrammeThumbs();
	var saves=app.sociogrammesSaves;
	for (var i = saves.length - 1; i >= 0; i--) {
		let oldSave=saves[i];
		if(oldSave.sociogrammeSave_sociogramme!=app.sociogramme.current){ continue;}
		if(oldSave.sociogrammeSave_classe!=app.sociogrammeCurrentClasse){ continue;}		
		save.sociogrammesSave_picture=picture;	
		if(save.eleves==null){
			save.eleves=jsonParse(oldSave.sociogrammeSave_data).eleves;
		}	
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=save",{
		data:JSON.stringify(save),
		classe_id:classe.classe_id,
		picture:picture,
		time:Math.floor(app.myTime()/1000),
		sociogramme_id:app.sociogramme.current,
		sessionParams:app.sessionParams
	},function(data){
		app.render(data);
	});	
}

app.sociogrammeLoadSave=function(){
	var saves=app.sociogrammesSaves;
	var issetSave=false;
	for (var i = saves.length - 1; i >= 0; i--) {
		var save=saves[i];
		if(save.sociogrammeSave_sociogramme!=app.sociogramme.current){ continue;}
		if(save.sociogrammeSave_classe!=app.sociogrammeCurrentClasse){ continue;}
		issetSave=true;

		app.sociogramme.eleves=app.getClasseById(app.sociogrammeCurrentClasse).eleves;

		var classe=app.getClasseById(app.sociogrammeCurrentClasse);
		for (var i = classe.eleves.length - 1; i >= 0; i--) {
			let eleve=app.getEleveById(classe.eleves[i]);
			
			eleve.sociogramme=[];
			eleve.sociogramme[app.sociogramme.vue]={
				coordR:'',
				coordT:''
			};	
		}

		app.setElevesPositions(app.sociogramme.eleves,[]);

		var datas=jsonParse(save.sociogrammeSave_data).eleves;
		for (var j = datas.length - 1; j >= 0; j--) {
			var data=datas[j];
			var eleve=app.getEleveById(data.eleve_id);
			if(!eleve){continue;}
			eleve.sociogramme[app.sociogramme.vue]={
				coordR:data.coordR,
				coordT:data.coordT
			};	
		}				
	}
	if(!issetSave){
		app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
	}
}
var app=app || {};

app.initSociogrammeSynthese=function(){
	$('.sociogramme-bloc').css('display','none');
	app.show('classroom-sociogramme-synthese-box');
	$('#sociogramme_noRelations').css('display','none');
	app.titleRender("<a href='#sociogrammes/"+app.sociogramme.current+"/"+app.sociogrammeCurrentClasse+"'>Sociogrammes</a> / Synthèse");
	app.sociogrammeSyntheseTable();
}

app.sociogrammeSyntheseTable=function(){
	if(app.sociogramme.current==null){return;}
	
	var eleves=app.sociogramme.eleves;
	var relations=app.sociogramme.relations;
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	var studentsPoints=[];
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i]; 
		if(relation.relation_type<4){continue;}
		studentsPoints[relation.socioRelation_to]=studentsPoints[relation.socioRelation_to]||[];
		studentsPoints[relation.socioRelation_to]['total']=studentsPoints[relation.socioRelation_to]['total']||0;
		studentsPoints[relation.socioRelation_to][relation.socioRelation_question]=studentsPoints[relation.socioRelation_to][relation.socioRelation_question]||0;
		studentsPoints[relation.socioRelation_to][relation.socioRelation_question]++;
		studentsPoints[relation.socioRelation_to]['total']++;
	}
	var questions=jsonParse(sociogramme.sociogramme_questions);
	var html=[];
	html.push('<table class="table" id="classroom-sociogramme-synthese-tab">');
	html.push('<thead>');
	html.push(' <tr>');
	html.push('<th>Élèves</th>');
	for (var i=0,lng= questions.length ; i<lng; i++) {
		var question=questions[i];
		var color=hexToRgb(question.question_color);
		html.push('<th style="background-color:rgba('+color.r+','+color.g+','+color.b+',0.3);">'+question.question_intitule+'</th>');
	}
	html.push('<th>Poids relatifs</th>');
	html.push('</tr>');
	html.push('</thead>');
	html.push('<tbody>');
	for (var i = 0; i < eleves.length; i++) {
		var eleve=app.getEleveById(eleves[i]);
		if(!studentsPoints[eleve.eleve_id]){continue;}
		html.push('<tr>');
		html.push('<td>');
		html.push(app.renderEleveNom(eleve));
		html.push('</td>');
		for (var j =0,lng= questions.length ; j<lng; j++) {
			var question=questions[j];
			var color=hexToRgb(question.question_color);
			html.push('<td style="background-color:rgba('+color.r+','+color.g+','+color.b+',0.3);">'+(studentsPoints[eleve.eleve_id][question.question_id]||0)+'</td>');
		}
		html.push('<td>'+(studentsPoints[eleve.eleve_id]['total']||0)+'</td>');
		html.push('</tr>');
	}
	html.push('</tbody>');
	html.push('</table>');
	document.getElementById('classroom-sociogramme-synthese').innerHTML=html.join(''); 
	$('#classroom-sociogramme-synthese-tab').dataTable({
		"paging":   false,
		dom: 't',		
		stateSave: true,
		"language":app.datatableFR
	});
}
var app=app || {};

app.buildSpineButton=function(){
	app.spineButtonsVar=[];
	var n=app.spineButtonsFixed.length;
	app.spineWhiteList=[];

	for (var i=0, lng=app.classes.length; i <lng; i++) {
		var classe=app.classes[i];
		if(classe.classe_id<0){
			continue;
		}
		n++;
		classe.eleves=classe.eleves||[];
		app.spineButtonsVar.push({
			icon:'spine_icon flaticon-teamwork',
			url:'sociogrammes/'+classe.classe_id,
			text:app.cleanClasseName(classe.classe_nom),
			num:n,
			badge:classe.eleves.length
		});
	}

	if(app.userConfig.admin){
		n++;
		var num=n;
		if(app.classes.length==0){
			num=-1;	
			app.spineWhiteList.push('classroom/add');		
			app.spineWhiteList.push('admin');
		}
		app.spineButtonsVar.push({
			icon:'bi bi-plus',
			svg:'011-add-group',
			url:'classroom/add',
			text:'Ajouter une cohorte',
			num:num
		});
		n++;
		app.spineButtonsVar.push({
			icon:'bi bi-gear',
			svg:'016-settings-a',
			url:'user',
			text:'Mon compte',
			num:num*1+1
		});
	}

	app.spinePetales=app.spineButtonsFixed.concat(app.spineButtonsVar);
	app.spinePetales=app.orderBy(app.spinePetales,'num','ASC');
}
var app=app || {};

app.spineNextPage=function(){
	var liste=app.spinePetales;
	var quotient=Math.floor(liste.length/6);
	var reste=liste.length%6;
	var nbPages=quotient;
	
	if(reste!=0){
		nbPages++;
	}
	app.spinePage=(app.spinePage*1+1)%nbPages;

	document.querySelectorAll(".petale").forEach(
		function(petale){
			petale.classList.remove('petale-opacity');	
			window.requestAnimationFrame(function(time) {
				window.requestAnimationFrame(function(time) {
					petale.classList.add('petale-opacity');	
				});
			});
		}
		);
	app.spineRender();
}

app.spineGoToPageByURL=function(url){
	for (let i =0,lng= app.spinePetales.length; i<lng; i++) {
		let button=app.spinePetales[i];
		if(button.url==url){
			var quotient=Math.floor(i/6);
			app.spinePage=quotient-1;
			app.spineNextPage();
		}
	}
}
var app=app || {};

const sideCountEl = document.querySelector('#js-side-count');
const radiusEl = document.querySelector('#js-radius');
const cxEl = document.querySelector('#js-cx');
const cyEl = document.querySelector('#js-cy');
const generateEl = document.querySelector('#js-generate');
const polygonEl = document.querySelector('#js-polygon');
const resultEl = document.querySelector('#js-result');
const svgEl = document.querySelector('#js-svg');

function pts(sideCount, radius) {
  const angle = 360 / sideCount;
  const vertexIndices = range(sideCount);
  const offsetDeg =  ((180 - angle) / 2);
  const offset = degreesToRadians(offsetDeg);

  return vertexIndices.map((index) => {
    return {
      theta: offset + degreesToRadians(angle * index),
      r: radius,
    };
  });
}

function range(count) {
  return Array.from(Array(count).keys());
}

function degreesToRadians(angleInDegrees) {
  return (Math.PI * angleInDegrees) / 180;
}

function polygon([cx, cy], sideCount, radius) {
  return pts(sideCount, radius)
  .map(({ r, theta }) => [
    5+ cx + r * Math.cos(theta), 
    5+ cy + r * Math.sin(theta),
    ])
  .join(' '); 
}

function generatePolygon(sideCount) {
  const radius = 0.08*$('#spine').width();
  const s = 2 * radius ;

  const viz = polygon([s / 2, s / 2], sideCount, radius);
  const spine_polygon=document.getElementById('spine_polygon');
  const spine_pages=document.getElementById('spine_pages');
  spine_pages.innerHTML='';
  const svgPolygon=document.getElementById('spine_center');

  svgPolygon.setAttribute('points', viz);
  
  const summits=viz.split(' ');

  spine_polygon.style.width=(s+10)+'px';
  spine_polygon.style.height=(s+10)+'px';
  spine_pages.style.width=(s+10)+'px';
  spine_pages.style.height=(s+10)+'px';

  for (let i = summits.length - 1; i >= 0; i--) {

    let circle= document.createElementNS("http://www.w3.org/2000/svg", "circle");
    let coords=summits[i].split(',');
    circle.setAttribute('cx', coords[0]);
    circle.setAttribute('cy', coords[1]);
    circle.setAttribute('r', 5);
    let fill='#E3E3E3';

    if(i==app.spinePage){
      fill="#ff7040";
    }

    circle.setAttribute('fill', fill);  
    circle.setAttribute('stroke', "#E3E3E3");
    spine_pages.appendChild(circle);
  }
}
var app=app || {};

app.spineRender=function(){
	var liste=app.spinePetales;

	$('.petale').addClass('petale-disabled');
	$('.spine_icon').addClass('petale-disabled');
	$('.spine_icon').html('');
	$('.spine_badge').css('display',"none");
	$('.spine_text').html('');
	$('.spine_icon').attr('data-url','');
	$('.petale').attr('data-url','');

	for (let i =0,lng= liste.length; i<lng; i++) {
		let button=liste[i];

		if(button.view=='userView' && app.userConfig.ppView){
			continue;
		}


		if(Math.floor(i/6)!=app.spinePage){
			continue;
		}
		var petale_id=i%6;

		if(app.spineWhiteList.length!=0){
			if(app.spineWhiteList.indexOf(button.url)>=0){
				$('#petale_'+petale_id).removeClass('petale-disabled');		
				$('#spine_icon_'+petale_id).removeClass('petale-disabled');
			}	
		}else{
			$('.petale').removeClass('petale-disabled');
			$('.spine_icon').removeClass('petale-disabled');
		}


		if(button.badge){
			$('#spine_badge_'+petale_id).css('display',"").html(button.badge);
		}

		document.getElementById('spine_icon_'+petale_id).innerHTML='<span class="'+button.icon+'"></span>';

		if(button.svg){
			document.getElementById('spine_icon_'+petale_id).innerHTML='<img src="assets/svg/all/'+button.svg+'.svg" width="50"/>';	
		}

		document.getElementById('spine_icon_'+petale_id).setAttribute('data-url',button.url);

		if(button.color){
			document.getElementById('petale_'+petale_id).style.fill=button.color;
		}
		
		document.getElementById('petale_'+petale_id).setAttribute('data-url',button.url);

		button.text=button.text||'';

		document.getElementById('spine_text_'+petale_id).innerHTML=button.text;

	}

	var quotient=Math.floor(liste.length/6);
	var reste=liste.length%6;
	var nbPages=quotient;
	if(reste!=0){
		nbPages++;
	}

	generatePolygon(nbPages);
}
var app=app || {};

app.spineButtonsVar=[];
app.petalesTimeOut=null;
app.spinePage=0;
app.spinePetales=[];
app.spineWhiteList=[];
app.spineButtonsFixed=[

/*{
	
	icon:'bi bi-vinyl',
	svg:'025-affiliate marketing-a',
	url:'sociogrammes',
	//color:'#21224C',
	text:"Sociogrammes",
	num:4,
	view:'userView'
}*/
];
var app=app || {};

app.getEleveById=function(eleve_id) {
	return app.eleves[app.elevesIndex[eleve_id]]||false;
};

app.buildElevesIndex=function(){
	var classe_fictive_num=app.getClasseById(-1).num;

	app.elevesIndex=[];
	for (var i = 0, lng = app.eleves.length; i < lng; i++) {
		app.elevesIndex[app.eleves[i].eleve_id]=i;
		app.eleves[i].eleve_num=i;    		
		app.classes[classe_fictive_num].eleves.push(app.eleves[i].eleve_id);
	}

	if(app.classes.length==2 || app.eleves.length==0){
		$('.ifCohortes').addClass('d-none');
	}else{
		$('.ifCohortes').removeClass('d-none'); 
	}
	
}
var app=app || {};

app.studentDelete=function(confirm) {
	if (!app.checkConnection()) {
		return;
	}
	if(!confirm){
		app.alert({title:'Supprimer cette personne et TOUTES SES RELATIONS ?',icon:'confirm'},function(){app.studentDelete(true);});
		return;
	}
	$.post(app.serveur + "index.php?go=eleves&q=delete",{
		eleves:JSON.stringify([app.currentEleve.eleve_id]),
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	},function(data){
		if(app.currentClasse){
			app.go('classroom/'+app.currentClasse.classe_id);
		}else{
			app.go('home');
		}
		app.render(data);
	});
};

app.studentsDelete=function(confirm){
	if (!app.checkConnection()) {
		return;
	}
	var ids=[];
	for (var i = 0, lng=app.currentClasse.eleves.length ; i<lng; i++){
		var eleve= app.getEleveById(app.currentClasse.eleves[i]);   
		if(document.getElementById("student_"+eleve.eleve_id+"_checkbox").checked){
			ids.push(eleve.eleve_id);
		}
	}
	if(ids.length>0){
		if(!confirm){
			app.alert({title:'Supprimer ce'+app.pluralize(ids.length,'s','tte')+' personne'+app.pluralize(ids.length,'s','')+' et TOUTES '+app.pluralize(ids.length,'LEURS','SES')+' RELATIONS ?',icon:'confirm'},function(){app.studentsDelete(true);});
			return;
		}
		$.post(app.serveur + "index.php?go=eleves&q=delete",{
			eleves:JSON.stringify(ids),
			time:Math.floor(app.myTime()/1000),
			sessionParams:app.sessionParams
		},function(data){
			app.render(data);
			app.classeExportRender();
		});
	}
}
var app=app || {};

app.studentInitViews=function(eleve_id) {	
	var eleve=app.getEleveById(eleve_id);
	if(!eleve){
		app.go('home');
		return;
	}
	app.viewClear();
	app.currentView="eleve";
	app.currentEleve = eleve;

	$('.template_eleve').css('display','flex');
};
var app=app || {};

app.studentPictureSelect=function(input){ 
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {	
			var img=document.createElement('img');	
			img.setAttribute('id','student-edit-picture-img');
			img.src=e.target.result;
			$('#student-edit-picture').html(img);
		}
		reader.readAsDataURL(input.files[0]);
	}	
}

app.studentPictureEditCancel=function(){
	app.studentPictureSet();
}

app.studentPictureSave=function(){ 
	if (!app.checkConnection()) {return;}
	if(app.currentEleve.delete_eleve_picture){
		app.currentEleve.eleve_picture="";
		$.post(app.serveur + "index.php?go=eleves&q=deletePicture",
		{
			eleve_id:app.currentEleve.eleve_id,
			sessionParams:app.sessionParams
		},
		function(data) {
			app.render(data);   
		});
		return;
	}

	var data=$('#student-edit-picture-img').attr('src');	
	if(data.indexOf('base64')<0){
		app.studentPictureEditCancel();
		return;
	}
	var eleve_id=app.currentEleve.eleve_id;
	var input=document.querySelector('#eleve-picture-input');
	if(!input.files[0]){
		return;
	}
	var form = new FormData();
	form.append('file', input.files[0]);
	form.append('eleve_id',app.currentEleve.eleve_id);	
	form.append('sessionParams',app.sessionParams);
	$.ajax( {
		url: app.serveur + "index.php?go=eleves&q=addPicture",
		type: 'POST',
		data: form,
		processData: false,
		contentType: false,
		success:function(data){
			app.render(data);   			
		}
	} );
}

app.studentPictureSet=function(eleve_id,get){
	eleve_id=eleve_id||app.currentEleve.eleve_id;
	var eleve=app.getEleveById(eleve_id);
	var photo=app.renderStudentPicture(eleve_id);
	if(get){
		return photo;
	}
	$('#student-picture').html(photo);
	$('#student-edit-picture').html(photo);
}

app.renderStudentPicture=function(eleve_id){
	var eleve=app.getEleveById(eleve_id);
	var photo='<svg class="student-picture" data-jdenticon-value="student_'+eleve_id+'"></svg>';
	if(app.isConnected){
		if(eleve.eleve_picture && eleve.delete_eleve_picture!=true){
			photo='<img class="student-picture" src="'+app.serveur + 'index.php?go=eleves&q=getPicture&file='+eleve.eleve_picture+'&sessionParams='+encodeURI(app.sessionParams)+'"/>';
		}
	}
	return photo;
}

app.studentPictureSelectDelete=function(){
	app.currentEleve.delete_eleve_picture=true;	
	app.show('eleve_infos_save');
	app.studentPictureSet();
	jdenticon.update('.student-picture');
}
var app=app || {};

app.renderEleveInfos=function(){
	document.getElementById('eleve_infos_save').style.display = "none";	
	var eleve=app.currentEleve;
	eleve.delete_eleve_picture=false;

	//Photo
	document.getElementById('eleve-picture-input').value="";
	app.studentPictureSet();
	jdenticon.update('.student-picture');
	
	//NOM et Prénom
	document.getElementById('eleve-nom').innerHTML =app.renderEleveNom(eleve);
	document.getElementById('eleve_nom').value=eleve.eleve_nom||"";
	document.getElementById('eleve_prenom').value=eleve.eleve_prenom||"";
}

app.renderEleveInfosEdit=function(){
	app.renderEleveInfos();
	$('#eleve_infos_save_btn').button('reset');
}

app.eleveInfosUpdate=function(){
	if (!app.checkConnection()) {
		$('#eleve_infos_save_btn').button('reset');
		return;
	}
	var eleve_nom=document.getElementById('eleve_nom').value;
	var eleve_prenom=document.getElementById('eleve_prenom').value;
	if(eleve_nom=="" && eleve_prenom==""){
		app.alert({title:"Le NOM et le Prénom ne peuvent pas être vides."});
		$('#eleve_infos_save_btn').button('reset');
		return;
	}
	app.currentEleve.eleve_nom=eleve_nom;
	app.currentEleve.eleve_prenom=eleve_prenom;
	
	$.post(app.serveur + "index.php?go=eleves&q=update&eleve_id="+app.currentEleve.eleve_id,
	{
		eleve_statut:'',
		eleve_nom:eleve_nom,
		eleve_prenom:eleve_prenom,
		eleve_birthday:'',
		eleve_genre:'',
		sessionParams:app.sessionParams
	},
	function(data) {
		app.render(data);   
		app.renderEleveInfosEdit(); 
	});
	app.studentPictureSave();
}

var app=app || {};

app.renderEleveNom=function(eleve,cut,firstletter){
	var nom=eleve.eleve_nom.toUpperCase();
	var prenom="";
	if(eleve.eleve_prenom){
		prenom=ucfirst(eleve.eleve_prenom);
	}

	if(!nom){
		return prenom;
	}
	if(nom && !prenom){
		return nom;
	}
	if(cut){
		if(app.userConfig.sorting<4){
			nom=nom[0]+".";
		}
		if(prenom){
			if(app.userConfig.sorting>=4){
				prenom=prenom[0]+".";
			}
		}
	}

	if(firstletter){
		if([0,1,6,7].indexOf(app.userConfig.sorting)>=0 ){
			prenom= "<div class='bolder-first-letter'>"+prenom+"</div> ";
		}
		else{
			nom= "<div class='bolder-first-letter'>"+nom+"</div> ";
		}
	}

	if(app.userConfig.sorting<4){

		return prenom+" "+nom;
	}else{
		
		return nom+" "+prenom;
	}	
};
"use strict";
var app=app || {};

app.routes=app.routes||{};

app.routes.student=function(dir){
  var id=dir[1];
  if(id==undefined){app.go('home');
  return;
}
app.studentInitViews(id);

var view=dir[2];
if(view=="events"){
  app.studentEventsView();
}else if(view=="challenges"){
  app.studentEtoilesView();
}else if(view=="notes"){
 app.studentNotesView();
}else if(view=="edit"){
  app.studentEditView();
}else{
}

$('#app').goTo();

}
var app=app || {};

app.studentEditView=function(){
	$('.eleve-page').css('display','none');
	$('#eleve-edit').css('display','');
	document.getElementById('eleve_infos_save').style.display = "none";	

	app.currentClasse=app.currentClasse||false;
	var eleve=app.currentEleve;
	eleve.delete_eleve_picture=false;

	//NOM et Prénom
	document.getElementById('eleve_nom').value=eleve.eleve_nom||"";
	document.getElementById('eleve_prenom').value=eleve.eleve_prenom||"";

	//Photo
	document.getElementById('eleve-picture-input').value="";
	app.studentPictureSet();
	jdenticon.update('.student-picture');

	app.titleRender('<a href="#classroom/'+app.currentClasse.classe_id+'">'+app.renderEleveNom(app.currentEleve)+'</a> / Édition');
}

"use strict";
var app=app || {};

app.trim=function(myString)
{
  return myString.replace(/^\s+/g,'').replace(/\s+$/g,'');
} 

function dump(obj) {
  var out = '';
  for (var i in obj) {
    if(typeof obj[i]===typeof {}){
      out+=dump(obj[i])+ "\n";
    }else{
     out += i + ": " + obj[i] + "\n";
   }
 }
 return out;   
}

function hashCode(str) { 
  str += '00000';
  str=hex_md5(str);
  var hash = 0;
  for (var i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return Math.abs(hash);
}

function intToRGB(i) {
  var color= ((i >> 24) & 0xFF).toString(16) +
  ((i >> 16) & 0xFF).toString(16) +
  ((i >> 8) & 0xFF).toString(16);
  while(color.length<6){
    color="0"+color;
  }
  return color;
}

function hexToRgb(hex) {
  var result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
}

function arrayUnique(array) {
  var a = array.concat();
  for(var i=0; i<a.length; ++i) {
    for(var j=i+1; j<a.length; ++j) {
      if(a[i] === a[j])
        a.splice(j--, 1);
    }
  }
  return a;
} 

function ucfirst(str)
{
  if(str=="" || !str){return "";}
  return str.charAt(0).toUpperCase() + str.substr(1);
}

function clone(obj) {
  var copy;
  // Handle the 3 simple types, and null or undefined
  if (null == obj || "object" != typeof obj) return obj;
  // Handle Date
  if (obj instanceof Date) {
    copy = new Date();
    copy.setTime(obj.getTime());
    return copy;
  }
  // Handle Array
  if (obj instanceof Array) {
    copy = [];
    for (var i = 0, len = obj.length; i < len; i++) {
      copy[i] = clone(obj[i]);
    }
    return copy;
  }
  // Handle Object
  if (obj instanceof Object) {
    copy = {};
    for (var attr in obj) {
      if (obj.hasOwnProperty(attr)) copy[attr] = clone(obj[attr]);
    }
    return copy;
  }
  throw new Error("Unable to copy obj! Its type isn't supported.");
}

function getMaxOfArray(numArray) {
  return Math.max.apply(null, numArray);
}

function getMinOfArray(numArray) {
  return Math.min.apply(null, numArray);
}  

app.orderBy=function(array,orderBy,order){
  app.orderByParam=orderBy;
  if(order=="ASC"){
    return array.sort(function(a,b){
      if(!isNaN(a[app.orderByParam])){
        if(a[app.orderByParam]*1>b[app.orderByParam]*1) return 1;
        if(a[app.orderByParam]*1<b[app.orderByParam]*1) return -1;
      }

      if(a[app.orderByParam]>b[app.orderByParam]) return 1;
      if(a[app.orderByParam]<b[app.orderByParam]) return -1;

      return 0;
    });
  }
  return array.sort(function(a,b){
    if(!isNaN(a[app.orderByParam])){
      if(a[app.orderByParam]*1>b[app.orderByParam]*1) return -1;
      if(a[app.orderByParam]*1<b[app.orderByParam]*1) return 1;
    }
    if(a[app.orderByParam]>b[app.orderByParam]) return -1;
    if(a[app.orderByParam]<b[app.orderByParam]) return 1;
    return 0;
  });
}

app.add=function(a,b) {
  return a*1 + b*1;
};   

app.distanceEuclidienne=function(v1,v2){
  var sum = 0;
  for (var n = 0, lng=v1.length; n < lng; n++) {
    var d=v1[n] - v2[n];
    sum += d*d;
  }
  return sum;
}

function truncateString(str, num) {
  return str.length > num ? str.slice(0, num >= 3 ? num - 3 : num) + '...' : str;
}

"use strict";
var app=app || {};

app.myTime=function(){
  var d = new Date();
  return d.getTime();
};
var app=app || {};

Handlebars.registerHelper('eleve_nom', function() {
	var eleve=app.getEleveById(this);
	return truncateString(eleve.eleve_nom.toUpperCase(),15);
});
Handlebars.registerHelper('eleve_prenom', function() {
	var eleve=app.getEleveById(this);
	return truncateString(ucfirst(eleve.eleve_prenom),15);
});

Handlebars.registerHelper('eleve_id', function() {
	var eleve=app.getEleveById(this);
	return eleve.eleve_id;
});
Handlebars.registerHelper('eleve_token', function() {
	var eleve=app.getEleveById(this);
	return eleve.eleve_token;
});
/*Handlebars.registerHelper('classroom_name', function() {	
	return this.classe_nom.replace(/~/g,'');
});
Handlebars.registerHelper('classroom_nb_students', function() {	
	var n=this.eleves.length;
	return n+" élève"+app.pluralize(n,'s');
});*/

var app=app || {};

app.uiInit=function(){
  app.loadUi++;

  if(app.hebergeur.mail!=""){
    $('#footer-hebergeur').html(' | Hébergé par <a href="mailto:'+app.hebergeur.mail+'">'+app.hebergeur.nom+'</a>');
  }
  
  document.getElementById('footer-version').innerHTML=app.version;


  window.onresize = app.windowResize;

  document.getElementById('sociogramme-canvas').addEventListener('wheel', app.sociogrammeWheel);

  document.getElementById('app').onclick=function(e){

 }


document.getElementById('spine_pages').addEventListener('click', event => {
  app.spineNextPage();
});
document.querySelectorAll(".petale").forEach(function(petale){
  petale.addEventListener('click',function(){
    if(this.classList.contains("petale-disabled")){
      return;
    };
    app.go(this.getAttribute('data-url'));
  });
});

document.querySelectorAll(".spine_icon").forEach(function(petale){
  petale.addEventListener('click',function(){
    if(this.classList.contains("petale-disabled")){
      return;
    };
    app.go(this.getAttribute('data-url'));
  });
});


$.get(app.serveur + "index.php?go=school&q=getAll", function(data) {
  app.render(data);         
}
); 


}
var app=app || {};

app.keyboardInit=function(){
 document.onkeydown=function(e){
  app.keyOn(e);
};
}

app.keyOn=function(e){
if(!app.keyboardEnable){return;}

 if (e.keyCode ==37){
  if(app.currentView=='eleve'){
    var num=app.currentClasse.eleves.indexOf(app.currentEleve.eleve_id);
    if(num>0){
      var prev=app.currentEleves[num-1].eleve_id;
      app.go('student/'+prev);
    }
  }
 //  if(app.currentView=='classe'){
 //    var k=app.currentClasse.num;
 //    while(k>0){
 //      var prev=k*1-1;

 //      if(!app.agendaEditor['classe'].hasFocus() && app.enableKeyboardShorcuts && app.userConfig.classesDisable.indexOf(app.classes[prev].classe_id)<0){
 //       app.go('classroom/'+app.classes[prev].classe_id);
 //       return;
 //     }
 //     k--;
 //   }
 // }
}
if (e.keyCode==39){
  if(app.currentView=='eleve'){
    var num=app.currentClasse.eleves.indexOf(app.currentEleve.eleve_id);
    if(num<app.currentEleves.length-1){
      var next=app.currentEleves[num*1+1].eleve_id;
      app.go('student/'+next);
    }
  }
//   if(app.currentView=='classe'){
//     var k=app.currentClasse.num;
//     while(k<app.classes.length-3){
//      var next=k*1+1;
//      if(!app.agendaEditor['classe'].hasFocus() && app.enableKeyboardShorcuts && app.userConfig.classesDisable.indexOf(app.classes[next].classe_id)<0){
//       app.go('classroom/'+app.classes[next].classe_id);
//       return;
//     }
//     k++;
//   }
// }
}

}
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


var app=app || {};

app.onMobile=function() {
if(window.innerWidth<=900){
	return true;
}
return false;
};
var app=app || {};

app.mouseInit=function(){
	document.onmousemove=function(e){
			if(app.currentView=="sociogrammes"){
			app.movemouse(e);
		}		
	}
}
var app=app || {};

app.titleRender=function(value){
  $('.title').html(value);
}

/*app.renderLegendsUsers=function(div_id){
  app.legendsUsers.sort(function(a,b){
   return b.localeCompare(a);
 });
  var lng=app.legendsUsers.length;
  var legendeHtml=[];
  var eventUser = [];
  if(lng!=0){
   for (var i =0; i<lng; i++) {
    var user=app.getUserById(app.legendsUsers[i]);   
    var user_discipline=app.getDisciplineById(user.user_matiere).discipline_name||"";
    if(eventUser.indexOf(user.user_pseudo)<0){
      legendeHtml.push("<div class='well well-sm legende' style='border-color:#" + app.getColor(user.user_pseudo) + ";'><b>" + user.user_pseudo + "</b><br/><i>" + ucfirst(user_discipline) + "</i></div>");
    }
    eventUser.push(user.user_pseudo);
  };
}
$('.usersLegend').css('display','block').html(legendeHtml.join(''));
};*/

function NeutralizeAccent(data){
  return !data
  ? ''
  : typeof data === 'string'
  ? data
  .replace(/\n/g, ' ')
  .replace(/[éÉěĚèêëÈÊË]/g, 'e')
  .replace(/[šŠ]/g, 's')
  .replace(/[čČçÇ]/g, 'c')
  .replace(/[řŘ]/g, 'r')
  .replace(/[žŽ]/g, 'z')
  .replace(/[ýÝ]/g, 'y')
  .replace(/[áÁâàÂÀ]/g, 'a')
  .replace(/[íÍîïÎÏ]/g, 'i')
  .replace(/[ťŤ]/g, 't')
  .replace(/[ďĎ]/g, 'd')
  .replace(/[ňŇ]/g, 'n')
  .replace(/[óÓ]/g, 'o')
  .replace(/[úÚůŮ]/g, 'u')
  : data
}
var app=app || {};

app.handleStart=function(evt){
	evt.preventDefault();	
	var pos = $('#sociogramme-canvas').offset();
	var touches = evt.changedTouches;
	//console.log(touches[0].pageX);
	app.mouse.x=touches[0].pageX-pos.left;
	app.mouse.y=touches[0].pageY-pos.top;
	app.start_move();
	
	
}
app.handleMove=function(evt){	
	evt.preventDefault();	
	var touches = evt.changedTouches;
	//app.sociogrammeClick=false;
	app.movemouse(touches[0]);	
	
}
app.handleEnd=function(evt){
	evt.preventDefault();	
	app.end_move();
	//app.sociogrammeClick=true;
	
}
app.touchInit=function(){
	var el = document.getElementById("sociogramme-canvas");
	el.addEventListener("touchstart", app.handleStart, false);
	el.addEventListener("touchend", app.handleEnd, false);
	el.addEventListener("touchleave", app.handleEnd, false);
	el.addEventListener("touchmove", app.handleMove, false);


	document.getElementById('sociogramme-zoom-out-btn').addEventListener("touchstart", function(){
		app.sociogrammeRepeatZoom=true;
		app.sociogrammeZoom(-0.03);
	}, false);
	document.getElementById('sociogramme-zoom-out-btn').addEventListener("touchend", function(){
		app.sociogrammeRepeatZoom=false;
	}, false);

	document.getElementById('sociogramme-zoom-in-btn').addEventListener("touchstart", function(){
		app.sociogrammeRepeatZoom=true;
		app.sociogrammeZoom(0.03);
	}, false);
	document.getElementById('sociogramme-zoom-in-btn').addEventListener("touchend", function(){
		app.sociogrammeRepeatZoom=false;
	}, false);

	document.getElementById('sociogramme-canvas').addEventListener("touchend", function(){

		app.sociogrammeMouseClick();
	}, false);
	document.getElementById('sociogramme-canvas').addEventListener("touchmove", function(){
		app.sociogrammeClick=false;
		app.sociogrammeMouseClick();
	}, false);

}
var app=app || {};

app.userUPD=function(options){
 if (!app.checkConnection()) {return;}
 options=options||{};
 var mail=document.getElementById('user_mail').value;
 var nom=document.getElementById('user_nom').value;
 var prenom=document.getElementById('user_prenom').value;
 var old_passe=document.getElementById('user_old_passe').value;
 var new_passe=document.getElementById('user_new_passe').value;
 var new_passe_bis=document.getElementById('user_new_passe_bis').value;
 $.post(app.serveur + "index.php?go=users&q=update",{
   mail:mail,
   old_passe:old_passe,
   new_passe:new_passe,
   new_passe_bis:new_passe_bis,
   nom:nom,
   prenom:prenom,
   user_id:app.userConfig.userID,
   sessionParams:app.sessionParams
 }, function(data) {
   app.render(data);         
   $("#btn_save_config").button('reset');
   app.hide('btn_save_config');
   app.userInfosHeaderRender();
 }
 );
};

var app=app || {};

app.configUserInit=function(data){
  var config=jsonParse(data);
  app.userConfig.sorting=config.sorting||0;
  app.userConfig.version=config.version||20201128;
  app.userConfig.classroomStudentsPicture=config.classroomStudentsPicture||0; 
  app.userConfig.memo=config.memo||""; 
  app.userConfig.classroomView="liste";  
  app.userConfig.sociogrammeViewRangs=config.sociogrammeViewRangs;
}

app.pushUserConfig=function(){
  if(!app.isConnected){return;}
  $.post(app.serveur + "index.php?go=users&q=update",{
    user_config:JSON.stringify(app.userConfig),
    user_id:app.userConfig.userID,
    sessionParams:app.sessionParams
  }, function(data) {
    app.render(data);    
  }
  );
}
var app=app || {};

app.setMemo=function(memo_type,memo_type_id,memo_data){  
  if (!app.checkConnection()) {return;} 
  //On met à jour les données
  $.post(app.serveur + "index.php?go=memos&q=add",
  {
    memo_type_id:memo_type_id,
    memo_type:memo_type,
    memo_data:memo_data,
sessionParams:app.sessionParams
  },
  function(data) {
    app.render(data);     
  });
}

app.getMemo=function(memo_type,memo_type_id){
var memos=app.userConfig.memos||[];
for (var i = memos.length - 1; i >= 0; i--) {
  var memo=memos[i];
if(memo.memo_type_id==memo_type_id && memo.memo_type==memo_type){
  return memo.memo_data;
}
}
return "";
}
var app=app || {};

app.userInfosHeaderRender=function(){
  $('.home-pseudo').html(ucfirst(app.pseudo_utilisateur));
  $('.home-pseudo').css("borderColor","#"+app.getColor(ucfirst(app.pseudo_utilisateur)));
}

app.userConfigRenderForm=function(){
 if(!app.userConfig.matiere){
  app.userConfig.matiere=-1;
}
app.titleRender("Mon compte");
document.getElementById('user_mail').value = app.userConfig.mail||"";
document.getElementById('user_prenom').value = app.userConfig.prenom||"";
document.getElementById('user_nom').value = app.userConfig.nom||"";
document.getElementById('user_old_passe').value ="";
document.getElementById('user_new_passe').value ="";
document.getElementById('user_new_passe_bis').value = "";
$('.config_pseudo').html(ucfirst(app.pseudo_utilisateur));
jdenticon.update("#config_avatar", app.pseudo_utilisateur);
jdenticon.update("#user-mobile-toolbar-avatar", app.pseudo_utilisateur);

document.getElementById('config_pseudo').style.borderColor="#"+app.getColor(ucfirst(app.pseudo_utilisateur));
}

var app=app || {};

app.renderUserConfig=function(){  
	app.viewClear();
	app.currentView="config";
	$(".config_user").css("display","block");

	app.currentClasse=null;
	app.currentEleve=null;

	app.hide('btn_save_config');

	app.initUserConfigMain();
	app.show('user-security','');
};





app.initUserConfigMain=function(){
	app.titleRender("Mon compte");
/*	if(app.onMobile()){
		$('.user-config-toolbar-btn').removeClass('btn-primary').addClass('btn-light'); 
		
		$('.user-config').css('display','none');
	}*/
	app.userConfigRenderForm();	
	app.show('user-main','flex');
}
var app=app || {};

app.connexion=function(){
  app.pseudo_utilisateur=document.getElementById("user_pseudo").value;
  app.nom_etablissement=app.pseudo_utilisateur;

  if(app.nom_etablissement==""){
   app.alert({title:'Il faut indiquer un nom d\'utilisateur.'});
   app.connexionRender();
   return false;
 }

 $('.template').css('display','none');
 $('#splash-screen').css('display','');

 $.post(app.serveur + "index.php?go=users&q=sessionInit",
 {   
  nom_etablissement:app.nom_etablissement,
  pseudo_utilisateur:app.pseudo_utilisateur,
  pass_utilisateur:document.getElementById("user_passe").value
}, function(data) {
  app.render(data);  
  if(app.sessionID==null){
   app.connexionRender();
   $('.connexion-btn').button('reset');
 }
 
}
);
};


app.checkConnection=function() {
 if (!app.isConnected) {
   app.alert({title:'Vous devez être connecté pour effectuer cette action.'});
   return false;
 }
 return true;
}


app.connexionValidForm=function(){
 if(app.connexionFormMode=="connexion"){
  app.connexion();
}else{
  app.createAccount();
}
}
var app=app || {};

app.connexionRender=function(){
	app.viewClear();
	$('#app').goTo();
	$(".template_connexion").css('display','block');
	document.getElementById('connexion-header').style.display = "";  
		$('#home-tutoriel').css('display','none');
	$("#connexion-password-recovery").css('display','none');
	document.getElementById('connexion-btn-step1').style.display="block";
	document.getElementById('connexion-btn-step2').style.display="none";
	document.getElementById('connexion_auto').checked="";
	document.getElementById('header').style.display = "none";
	$('.connexion-btn').button('reset');
	document.getElementById('prefix').innerHTML='<span class="bi bi-people-fill"></span>';
	app.titleRender("");
	$(document.body).trigger("sticky_kit:recalc");

	document.getElementById("user_pseudo").value="";
	document.getElementById("user_passe").value="";
	document.getElementById("user_passe2").value="";

	document.getElementById('user_passe2_form').style.display="none";
	document.getElementById('connexion-user-form').style.display="block";

	app.connexionFormMode='connexion';

	if(app.etablissementsCRT==false){
		$('#connexion-menu-nouvelEtablissement').prop("disabled", true);
	}
	
	app.pluginsLauncher('connexionAfterRender');
}

app.renderCreateAccountForm=function(type){
	let pseudo=document.getElementById('user_pseudo').value;
	let passe=document.getElementById('user_passe').value;        
	
	if(type=="etablissement"){
		app.connexionFormMode='create';
	}else{
		app.connexionFormMode='connexion';
	}
	document.getElementById('user_passe2_form').style.display="";
	$('#connexion-btn-step1').css('display','none');
	$('#connexion-btn-step2').css('display','block');
	$('.connexion-btn').button('reset');
}
var app=app || {};

app.buildUsersIndex=function(){ 
  app.usersIndex=[];
  for (var i = 0, lng = app.users.length; i < lng; i++) {
    app.users[i].user_pseudo=ucfirst(app.users[i].user_pseudo);
    app.usersIndex[app.users[i].user_id]=app.users[i];
  }
}
app.getUserById=function(user_id){
  return app.usersIndex[user_id]||false;  
}

var app=app || {};

app.renameClasse=function(){
  if (!app.checkConnection()) {
    return;
  }


  swal({
    text: 'Nouveau nom ?',
    icon:'warning',
    content: {
      element: "input",
      attributes: {
        placeholder: "6ème A"
      },
    },
    button: {
      text: "Enregistrer",
      closeModal: false,
    } 
  })
  .then(
    (name) => {
     if(name===null){ 
       app.go('classroom/'+app.currentClasse.classe_id+'/config');
       return;
     }
     if (app.trim(name)=="") {
       swal("Il faut indiquer un nom de cohorte.", {
        icon: "error",
      }).then(valid=>{
       
        app.renameClasse();
      }
      );


      return;
    }
    var classe=app.currentClasse;
    $.post(app.serveur + "index.php?go=classe&q=update",
    {
      classe_nom:name,
      classe_id:classe.classe_id,
      sessionParams:app.sessionParams
    }, function(data) {
      app.render(data); 
      app.go('home');
      if(app.onMobile()){
        app.spineGoToPageByURL('classroom/'+classe.classe_id);
      }
      swal("Cohorte renommée !", {
        icon: "success",
      });
      setTimeout(function(){
       swal.close();
     },1500);
    }
    );

  }
  );

};

app.deleteClasse=function(confirm) {
  if (!app.checkConnection()) {
    return;
  }
  if(!confirm){
    app.alert({title:'Voulez-vous vraiment supprimer cette cohorte ?',icon:'confirm'},function(){app.deleteClasse(true);});
    return;
  }
  $.post(app.serveur + "index.php?go=classe&q=delete",
  {
    classe_id:app.currentClasse.classe_id,
    sessionParams:app.sessionParams
  }, function(data){
    app.render(data);  
    app.go('home');  
  });
};
var app=app || {};

app.classroomConfigInit=function(){ 
	var classe=app.currentClasse;
	$('.classroom-page').css('display','none');
	$('#classe-config').css('display','');
	$('#classroom-main').css('display','none');  
	$('#classroom-toolbar').css('display','none');
	app.titleRender("<a href='#classroom/"+classe.classe_id+"'>"+app.cleanClasseName(classe.classe_nom)+"</a> / Configuration");
}
var app=app || {};

app.initClassroomGroups=function(){
  var classe=app.currentClasse;
  app.titleRender("<a href='#classroom/"+classe.classe_id+"'>"+app.cleanClasseName(classe.classe_nom)+"</a> / Générateur de groupes");
  $('.classroom-page').css('display','none');
  app.show('classroom-groups');
  $('#classroom-main').css('display','none');  
  $('#classroom-toolbar').css('display','none');
  app.classroomGroupsFormRender();
  app.classroomGroupsSelectSaveRender(); 
  app.groupesInfoUpdate();
}


app.getGroupes=function() {  
  var newGroupes=[];
  var  nbGroupes = document.getElementById('groupsGenerator-groupsNb').value;
  //GENERATION
  if(document.getElementById('sociogroupes').checked){
    //SOCIOGROUPES
    newGroupes=app.getGroupsByRelations(nbGroupes);    
  }
  
  else{
    //GROUPES ALEATOIRES
    newGroupes=app.getGroupsRandom(nbGroupes);
  }  

  if(document.getElementById('sociogroupes').checked && app.sociogramme.current!=null){
    app.currentGroupe.sociogramme_id=app.sociogramme.current;
  }

  app.getClasseById(app.sociogrammeCurrentClasse).currentGroupes=newGroupes;

  app.getClasseSociogramme({
    mode:'groups',
    classe_id:app.sociogrammeCurrentClasse,
    sociogramme_id:app.sociogramme.current
  });
};
var app=app || {};

app.renderGroupes=function(groupes){
  var eleves_id=[];
 var temp_groupes=[];
 var max=0;
 for(var i=0, lng=groupes.length;i<lng;i++){
   var llng=groupes[i].length;
   if(llng>max){max=llng;}
   if(llng!=0){
     temp_groupes.push(groupes[i]);
   }
 }
 groupes=temp_groupes;
 var nbGroupes=groupes.length;
 var html = [];
 for(i=0;i<nbGroupes;i++){
  var cohesion=app.classroomGroupsCohesionScore(groupes[i]);
  html.push('<div class="list-group" ondragover="event.preventDefault();" ondrop="app.classroomGroupsItemDrop(event,'+i+');">');
  
  var nomGroupe=i*1+1;
  html.push('<div class="list-group-item bold">Groupe '+nomGroupe+'');
  html.push('<span class="classroom-groupes-cohesion hide" title="Cohésion du groupe"> <span class="bi bi-people-fill"></span><br/><span class="classroom-groupes-cohesion-value">'+cohesion+'%</span></span>');
  html.push('</div>');
  for(var j=0,lng=max;j<lng;j++){

    if(groupes[i][j]){
      var eleve=app.getEleveById(groupes[i][j]);
      if(!eleve){
        continue;
      }
      
      eleves_id.push(eleve.eleve_id);
      html.push('<div draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\', \''+j+'~'+i+'\');" class="list-group-item">');
      html.push('<span  class="movable">'+app.renderEleveNom(eleve)+'</span>')
    }else{
      html.push('<div class="list-group-item">');
      html.push("...");       
    }       
    html.push('</div>');
  }
  html.push("</div>");
}
//On affiche le nouveau groupe
var nomGroupe=groupes.length*1+1;
html.push('<div class="list-group groupe-vide"  ondragover="event.preventDefault();" ondrop="app.classroomGroupsItemDrop(event,\'new_groupe\');">');

html.push('<div class="list-group-item bold">Groupe '+nomGroupe+'</div>');
html.push('<div class="list-group-item">');
html.push("...");  
html.push("</div>");
html.push("</div>");
//On affiche les élèves non classés dans un groupe
var n=0;
html.push('<div class="list-group"  ondragover="event.preventDefault();" ondrop="app.classroomGroupsItemDrop(event,\'nc\');">');

html.push('<div class="list-group-item bold">Non classé(s)</div>');
for(var j=0;j<app.currentClasse.eleves.length;j++){
  if(eleves_id.indexOf(app.currentClasse.eleves[j])>=0){continue;}
  n++;
  var eleve=app.getEleveById(app.currentClasse.eleves[j]);
  
  html.push('<div draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\', \''+eleve.eleve_id+'~nc\')" class="list-group-item">');
  html.push('<span class="movable">'+app.renderEleveNom(eleve)+'</span>')
  html.push('</div>');
}
if(n==0){
 html.push('<div class="list-group-item">');
 html.push("...");  
 html.push('</div>');
}

html.push("</div>");
app.currentClasse.currentGroupes=groupes;

document.getElementById("classroom-groupes-liste").innerHTML=html.join('');

};
var app=app || {};

app.renderGroupSave=function(){
  swal({
    text: 'Quel nom pour ces groupes ?',
    icon:'warning',
    content: {
      element: "input",
      attributes: {
        placeholder: "Groupes A et B"
      },
    },
    button: {
      text: "Enregistrer",
      closeModal: false,
    } 
  })
  .then(
    (name) => {
     if(name===null){ throw null;}
     if (app.trim(name)=="") {
       swal("Il faut indiquer un nom.", {
        icon: "error",
      }).then(valid=>{
        app.renderGroupSave()}
        );

      return;
    }
    var groupe_data={
      'eleves':app.currentClasse.currentGroupes,
      'sociogramme_id':app.currentGroupe.sociogramme_id||null
    };

    $.post(app.serveur + "index.php?go=groupes&q=add",
    {
      groupe_name:name,
      classe_id:app.currentClasse.classe_id,
      groupe_data:JSON.stringify(groupe_data),
      time:Math.floor(app.myTime()/1000),
      sessionParams:app.sessionParams
    },
    function(data) {
     app.render(data);
      // app.renderClasseGroupesSelect();
      if(!app.currentClasse.currentGroupesNum){
        app.currentClasse.currentGroupesNum=0;
      }
//      document.getElementById('classroom-students-toolbar-selectGroup').value=app.currentClasse.currentGroupesNum;
app.classroomGroupsSelectSaveRender();
swal("Groupes enregistrés !", {
  icon: "success",
});
setTimeout(function(){
 swal.close();
},1500); 
}
);
  }
  );
}

app.classroomGroupLoad=function(value){
  if(value==-1){
    return;
  }
  var data=jsonParse(app.currentClasse.groupes[value].groupe_data);

  app.getClasseById(app.sociogrammeCurrentClasse).currentGroupes=data.eleves;

  app.getClasseSociogramme({
    mode:'groups',
    classe_id:app.sociogrammeCurrentClasse,
    sociogramme_id:app.sociogramme.current
  });

}

app.classroomGroupDelete=function(groupe_num,confirm){
  if(!confirm){
    app.alert({title:'Supprimer "'+app.currentClasse.groupes[groupe_num].groupe_name+'" ?',icon:'confirm'},function(){app.classroomGroupDelete(groupe_num,true);});
    return;
  }
  if(app.currentClasse.currentGroupesNum==groupe_num){
    app.currentClasse.currentGroupesNum=0;
  }
  $.post(app.serveur + "index.php?go=groupes&q=delete",
  {
    classe_id:app.currentClasse.classe_id,
    groupe_id:app.currentClasse.groupes[groupe_num].groupe_id,
    sessionParams:app.sessionParams
  }, function(data) {
    document.getElementById("classroom-groupes-liste").innerHTML='';
    app.currentClasse.currentGroupes=[];
    app.render(data);  
    app.classroomGroupsSelectSaveRender();
    if(!app.currentClasse.currentGroupesNum){
      app.currentClasse.currentGroupesNum=0;
    }
  }
  );
}

app.classroomGroupsSelectSaveRender=function(){
  var groupes=app.currentClasse.groupes;
  var lng=groupes.length;
  var n=0;
  var html=[];
  html.push('<ul id="classroom-groupes-save-list">');
  for (var i = 0; i <lng; i++) {
    if(!groupes[i].groupe_id){
      continue;
    }
    n++;
    html.push('<li>');
    html.push('<button class="btn btn-sm btn-light" onclick="app.classroomGroupLoad(\''+i+'\');"><span class="bi bi-chevron-left"></span></button>');
    html.push('<span class="groupes-save-name">'+groupes[i].groupe_name+'</span>');
    html.push('<button class="btn btn-sm btn-light float-right" onclick="app.classroomGroupDelete(\''+i+'\');"><span class="bi bi-x"></span></button>');
    html.push('</li>');
  };
  html.push('</ul>');
  if(n==0){
   document.getElementById('classroom-groupes-save-bloc').style.display='none';
   return;
 }
 else{
   document.getElementById('classroom-groupes-selectSave').innerHTML=html.join('');
   document.getElementById('classroom-groupes-save-bloc').style.display='';
 } 
}
var app=app || {};

app.classroomGroupsFormRender=function() {
 var classe=app.currentClasse;
 if (!classe.eleves) {
  return;
}
var lng = classe.eleves.length;
document.getElementById('groupsGenerator-groupsNb').max = Math.round(lng / 2);
document.getElementById('groupsGenerator-groupsNb').value = Math.floor(app.currentClasse.eleves.length/3);
};

app.classroomGroupsCohesionScore=function(groupe){
  var relations=app.getSociogrammeRelations(app.currentClasse.classe_id);
  var relationsNb=0;
  var relationsMax=0;
  for (var j = relations.length - 1; j >= 0; j--) {
    var relation=relations[j];  
    if(app.currentClasse.eleves.indexOf(relation.socioRelation_to)<0){
      continue;
    }
    if(groupe.indexOf(relation.socioRelation_from)>=0){
      var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;
      relationsMax++;
      var index=groupe.indexOf(relation.socioRelation_to);
      if(index>=0 && value>0){
        relationsNb++;
      }
      else if(index<0 && value<0){
        relationsNb++;
      }
    }
  };
  if(relationsMax!=0){
   return Math.round(relationsNb/relationsMax*100);
 }
 else{
  return "--";
}
}

app.classroomsGroupsPrint=function(){
  var classeName=app.cleanClasseName(app.currentClasse.classe_nom);
  $('#html2pdf-data').html(document.getElementById("classroom-groupes-liste").innerHTML);
  $('#html2pdf-title').html(classeName+' - Groupes - '+moment().format('DD MMM YYYY'));
  var element = document.getElementById("html2pdf-page");
  var opt = {
    margin:       0.5,
    filename:     'Sociogram_'+classeName+'_groupes_'+moment().format('DD_MMM_YYYY')+'.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  $('#html2pdf-page').css('display','block');

  html2pdf().set(opt).from(element).save().then((onFulfilled,onRejected)=>{
    $('#html2pdf-page').css('display','none');
  });

}

app.classroomGroupsItemDrop=function(e,groupe_num){
  e.preventDefault();
  if (e.stopPropagation) e.stopPropagation(); 
  var eleve = e.dataTransfer.getData('text/plain').split("~");
  if(groupe_num!=="nc"){
    if(groupe_num=="new_groupe"){
     groupe_num=app.currentClasse.currentGroupes.length;
     app.currentClasse.currentGroupes.push([]);
   }
   if(eleve[1]!=="nc"){
    app.currentClasse.currentGroupes[groupe_num].push(clone(app.currentClasse.currentGroupes[eleve[1]][eleve[0]]));
    app.currentClasse.currentGroupes[eleve[1]].splice(eleve[0], 1);
  }else{
    app.currentClasse.currentGroupes[groupe_num].push(eleve[0]);
  }
}else{
  app.currentClasse.currentGroupes[eleve[1]].splice(eleve[0], 1);
}
app.renderGroupes(app.currentClasse.currentGroupes);
}

app.groupesInfoUpdate=function(){
  var  nbGroupes=2;
  var nbStudentsByGroupes=2;
  var nbStudents=app.currentClasse.eleves.length;
  nbGroupes=document.getElementById('groupsGenerator-groupsNb').value;
  nbStudentsByGroupes=Math.floor(nbStudents / nbGroupes);
  var r=nbStudents-nbGroupes*Math.floor(nbStudents / nbGroupes);
  var suite="";
  if(r!=0){
    suite=" et <span class='bold'>"+r+"</span>x"+(nbStudentsByGroupes+1)+" personnes";
  }
  document.getElementById('groupes-info').innerHTML="<span class='bold'>"+nbGroupes+" groupes </span> <br/><span class='bold'>"+(nbGroupes-r)+"</span>x"+nbStudentsByGroupes+" personne"+app.pluralize(nbStudentsByGroupes,'s')+suite;
}
var app=app || {}; 

app.initClassroomStudentsExport=function(){ 

  var classe=app.currentClasse;
  app.titleRender('<a href="#home">MonSociogram<span class="small">.me</span></a> / '+app.cleanClasseName(classe.classe_nom));
  $('.classroom-page').css('display','none');
  $('#classroom-main').css('display','none');
  $('#classe-export').css('display',''); 
  $('#classroom-toolbar').css('display','');
  app.classeExportRender();
}

app.classeExportRender=function(){
  var html=[];
  html.push('<table id="classroom-export-table">');
  html.push('<thead>');
  html.push('<tr>');  
  html.push("<th class='large-screen'><input type='checkbox' onchange='app.studentsCheckAll(this.checked);' class='btn btn-control'/></th>"); 
  html.push("<th>ID</th>"); 
  html.push("<th>NOM</th>"); 
  html.push('<th>Prénom</th>'); 
  html.push('</tr>');
  html.push('</thead>');    
  html.push('<tbody>');
  for (var i = app.currentClasse.eleves.length - 1; i >= 0; i--) {
   var eleve= app.getEleveById(app.currentClasse.eleves[i]);
   html.push('<tr onclick="app.go(\'student/'+eleve.eleve_id+'/edit\');">');
   html.push("<td class='large-screen'><input id='student_"+eleve.eleve_id+"_checkbox' type='checkbox' onchange='app.studentsSelectedCount();' class='btn btn-control'/></td>"); 
   html.push('<td>');
   html.push(eleve.eleve_id);
   html.push('</td>');  
   html.push('<td>');
   html.push(eleve.eleve_nom.toUpperCase());
   html.push('</td>');
   html.push('<td>');
   html.push(ucfirst(eleve.eleve_prenom));
   html.push('</td>');
   html.push('</tr>');
 };
 html.push('</tbody>');
 html.push("</table>");
 document.getElementById("classe-export-div").innerHTML=html.join('');
 $('#classroom-export-table').dataTable({

  dom:'Bft',
  responsive:true,
  colReorder: true,
  columnDefs: [
  { responsivePriority: 1, targets: 1 },
  { responsivePriority: 2, targets: 2 },
  { responsivePriority: 3, targets: 3 }
  ],
  buttons: [

  ],
  stateSave: true,
  "language":app.datatableFR,
  "lengthMenu": [[-1,10, 25, 50], ["Tous",10, 25, 50]],
  "order":[[3,'asc']],
  "autoWidth": false
});
 $('#classroom-export-table').addClass('table table-striped ');
 $('.dataTables_filter input').attr('placeholder', 'Recherche').removeClass('input-sm');
 app.studentsSelectedCount();
 if(app.currentClasse.eleves.length==0){
  $('.ifCohortes').addClass('d-none');
}else{
 $('.ifCohortes').removeClass('d-none'); 
}
}

app.studentsCheckAll=function(checked){
  for (var i = 0, lng=app.currentClasse.eleves.length ; i<lng; i++){
   var eleve_id= app.currentClasse.eleves[i];
   if(document.getElementById("student_"+eleve_id+"_checkbox")){ 
    document.getElementById("student_"+eleve_id+"_checkbox").checked=checked;
  }
}
app.studentsSelectedCount();  
}

app.studentsSelectedCount=function(){
  var n=0;
  for (var i = 0, lng=app.currentClasse.eleves.length ; i<lng; i++){
   var eleve= app.getEleveById(app.currentClasse.eleves[i]);
   if(document.getElementById("student_"+eleve.eleve_id+"_checkbox")){     
    if(document.getElementById("student_"+eleve.eleve_id+"_checkbox").checked){
      n++;
    }
  }
}
if(n>0){
  $('#student-selected-bloc').css('display','');
  $('#student-selected-nb').html(n +" personne"+app.pluralize(n,'s'));
}else{
  $('#student-selected-bloc').css('display','none');
}
}
var app=app || {};

app.renderClasseAdd=function(){ 
  if (!app.checkConnection()) {return;}

  swal({
    text: 'Nom de la nouvelle cohorte ?',
    icon:'warning',
    content: {
      element: "input",
      attributes: {
        placeholder: "6ème A"
      },
    },
    button: {
      text: "Enregistrer",
      closeModal: false,
    } 
  })
  .then(
    (name) => {
     if(name===null){ 
      app.go('home');
      return;
    }
    if (app.trim(name)=="") {
     swal("Il faut indiquer un nom de cohorte.", {
      icon: "error",
    }).then(valid=>{
     
      app.renderClasseAdd();
    }
    );
    return;
  }
  app.go('home');
  app.classeAdd(name); 
}
);
};

app.classeAdd=function(classeNom) {
  if (!app.checkConnection()) {
    return;
  }  
  $.post(app.serveur + "index.php?go=classe&q=add",{
    classe_nom:classeNom,
    sessionParams:app.sessionParams
  },function(data){
    app.render(data);
//      app.tutoSetStep();  
    swal("Cohorte créée !", {
      icon: "success",
    });
    setTimeout(function(){
     swal.close();
   },1500); 
    
  } );  
};
var app=app || {};

app.homeClassesInit=function(){
  $('.home-page').css('display','none');
  $('#home-classrooms').css('display','');
  $('#home-aside').css('display','');
  $('#home-classrooms-liste').css('display','');
  app.homeClassesRender();

}

app.homeClassesRender=function(){
 var classes=app.homeClassesListe;
 
 if(app.classes.length>2){
  $('#cohortes-liste-bloc').css("display","");
}
else{
  $('#cohortes-liste-bloc').css("display","none");
}

var template = $('#template-home-classes').html();
var rendered = Mustache.render(template, {
  classes:classes,
  "classeNbEleves":function(){
    return this.eleves.length;
  },
  "classeNom":function(){
    return app.cleanClasseName(this.classe_nom);
  },
  "hasEleves":function(){
    if(this.eleves.length>0){
      return true;
    }
    return false;
  }
});
document.getElementById('home-classrooms-liste').innerHTML=rendered;

}
var app=app || {};

app.tutoSetStep=function(){
if(!app.tutoIsEnable){
	$('#home-tutoriel').addClass('d-none');
	return;
}
//app.tutoRenderStep();



$('.tuto-btn').removeClass('disabled');
$('.tuto-checkbox').prop('checked','');

app.tutoStep=0;


	if(app.classes.length>2){
		app.tutoStep++;
$('#tuto-step1-checkbox').prop('checked','checked');
$('#tuto-step1-btn').addClass('disabled');
	}else{
			$('#tuto-step2-btn').addClass('disabled');
	}


if(app.eleves.length>0){
		app.tutoStep++;
		$('#tuto-step2-btn').addClass('disabled');
		$('#tuto-step2-checkbox').prop('checked','checked');
	}else{

	}

 if(app.sociogrammes.length>0){
		app.tutoStep++;
				$('#tuto-step3-btn').addClass('disabled');
		$('#tuto-step3-checkbox').prop('checked','checked');
	}

	app.tutoRenderStep();


if(app.tutoStep!=3){
	$('#tuto-step4-btn').addClass('disabled');
}


//alert(app.tutoStep+" "+app.tutoFirst);

if(app.tutoStep==3 && app.sociogrammesSaves.length>0){

	$('#home-tutoriel').addClass('d-none');
app.tutoIsEnable=false;
	}
else{
	$('#home-tutoriel').removeClass('d-none');
}

}

app.tutoRenderStep=function(){
$('#tuto-progress').attr('aria-valuenow',app.tutoStep*25);
$('#tuto-progress').css('width',app.tutoStep*25+'%');
}


var app=app || {};

app.sociogrammeFormInit=function(){
	$('.sociogramme-bloc').css('display','none');
	app.show('sociogramme_form');
	app.hide('sociogramme-options');
	app.hide('sociogramme-student-form-block');

	app.hide('classroom-sociogramme-synthese-box');
	app.hide('classroom-sociogramme');
	app.hide('sociogramme-delete-button');
	document.getElementById('sociogramme-name').value=null;
	app.titleRender('<a href="#home">MonSociogram<span class="small">.me</span></a> / Nouveau questionnaire');
	document.getElementById("sociogramme_questions").innerHTML="";
	app.sociogrammeEdition=false;
	app.sociogramme.current=null;
	app.newSociogrammeQuestionsNb=0;
	app.sociogrammeAddQuestion();
	document.getElementById('sociogramme-name').focus();
}

app.sociogrammeAddModele=function(modele){
	app.sociogrammeFormInit();

	if(modele=='simple'){
		document.getElementById('sociogramme-name').value="Simple";
		app.sociogrammeAddQuestion();
		app.sociogrammeAddQuestion();
		var questions=[];
		for (let i=1;i<=app.newSociogrammeQuestionsNb; i++) {
			if(i==1){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Proche de...";
				document.getElementById('sociogramme-question-'+i+'-points').value=2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#0000FF";
			}
			if(i==2){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Proche de...";
				document.getElementById('sociogramme-question-'+i+'-points').value=1;
				document.getElementById('sociogramme-question-'+i+'-color').value="#007F00";
			}
			if(i==3){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="À éloigner de...";
				document.getElementById('sociogramme-question-'+i+'-points').value=-2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#FF0000";
			}
		}
		return;
	}

	if(modele=='avance'){
		document.getElementById('sociogramme-name').value="Avancé";
		app.sociogrammeAddQuestion();
		app.sociogrammeAddQuestion();
		app.sociogrammeAddQuestion();
		var questions=[];
		for (let i=1;i<=app.newSociogrammeQuestionsNb; i++) {
			if(i==1){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Avec qui aimerais-tu jouer ou travailler ?";
				document.getElementById('sociogramme-question-'+i+'-points').value=2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#0000FF";
			}
			if(i==2){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Avec qui n’aimerais-tu pas jouer ou travailler ?";
				document.getElementById('sociogramme-question-'+i+'-points').value=-2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#FF0000";
			}
			if(i==3){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Par qui penses-tu être choisi ?";
				document.getElementById('sociogramme-question-'+i+'-points').value=1;
				document.getElementById('sociogramme-question-'+i+'-color').value="#007F00";
			}
			if(i==4){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Par qui penses-tu avoir été rejeté ?";
				document.getElementById('sociogramme-question-'+i+'-points').value=-2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#000000";
			}
		}
	}
}

app.sociogrammeAddQuestion=function(){
	app.newSociogrammeQuestionsNb++;
	var source   = document.getElementById("template-sociogrammes-form").innerHTML;
	var template = Handlebars.compile(source);
	var context = {
		questions:[{
			"intitule":"",
			"color":"#0000ff",
			"nb":app.newSociogrammeQuestionsNb
		}]
	};		
	var div=document.getElementById("sociogramme_questions");
	var newQuestion= document.createElement("tr");
	newQuestion.innerHTML=template(context);
	div.appendChild(newQuestion);
	document.getElementById('sociogramme-question-'+app.newSociogrammeQuestionsNb+'-points').value=1;
}

app.sociogrammeCreate=function(){
	if(app.sociogrammeEdition==true){
		app.sociogrammeEditionSave();
		return;
	}
	if (!app.checkConnection()) {return;}
	var sociogramme_name=(document.getElementById('sociogramme-name').value).trim();;
	
	if (app.trim(sociogramme_name)=="") {
		swal("Il faut indiquer le nom du questionnaire ou choisir un modèle.", {
			icon: "error",
		}).then(valid=>{
		}
		);
		return;
	}

	var questions=[];
	for (let i=1;i<=app.newSociogrammeQuestionsNb; i++) {
		var intitule=(document.getElementById('sociogramme-question-'+i+'-intitule').value).trim();
		if(intitule==""){
			continue;
		}
		var question={
			question_id:i,
			question_intitule:intitule,
			question_points:document.getElementById('sociogramme-question-'+i+'-points').value,
			question_color:document.getElementById('sociogramme-question-'+i+'-color').value
		};
		questions.push(question);
	}


	if (questions.length==0) {
		swal("Il faut créer des questions ou choisir un modèle.", {
			icon: "error",
		}).then(valid=>{});
		return;
	}

	$.post(app.serveur + "index.php?go=sociogramme&q=create",
	{			
		sociogramme_name:sociogramme_name,
		questions:JSON.stringify(questions),		
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	}, function(data) {
		app.render(data);  
		app.sociogrammesInitView();
		app.go("#sociogrammes/"+app.sociogrammeCurrentClasse);
	}
	);
};

app.sociogrammeEditionInit=function(sociogramme_id){
	$('.sociogramme-bloc').css('display','none');
	app.show('sociogramme_form');
	app.hide('sociogramme-options');
	app.hide('sociogramme-student-form-block');
	app.hide('classroom-sociogramme-synthese-box');
	app.hide('classroom-sociogramme');
	app.hide('sociogramme-delete-button');

	$('#sociogramme_noRelations').css('display','none');
	$('#sociogramme-delete-button').css('display','');
	
	app.sociogrammeEdition=true;
	
	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	app.sociogramme.current=sociogramme_id;
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	app.titleRender('<a href="#home">MonSociogram<span class="small">.me</span></a> / '+ucfirst(app.getSociogrammeById(app.sociogramme.current).sociogramme_name) +' / Édition');
	document.getElementById('sociogramme-name').value=sociogramme.sociogramme_name;
	var sociogrammeQuestionsNb=0;
	document.getElementById("sociogramme_questions").innerHTML="";
	var questions=jsonParse(sociogramme.sociogramme_questions);
	var source   = document.getElementById("template-sociogrammes-form").innerHTML;
	var template = Handlebars.compile(source);
	var div=document.getElementById("sociogramme_questions");
	for (var i = 0,lng=questions.length; i <lng; i++) {
		var question=questions[i];
		var context = {
			questions:[{
				"intitule":question.question_intitule,
				"color":question.question_color,
				"nb":question.question_id
			}]
		};		
		sociogrammeQuestionsNb=Math.max(sociogrammeQuestionsNb,question.question_id);
		var newQuestion= document.createElement("tr");
		newQuestion.innerHTML=template(context);
		div.appendChild(newQuestion);
		document.getElementById('sociogramme-question-'+question.question_id+'-points').value=question.question_points;
	}
	app.newSociogrammeQuestionsNb=sociogrammeQuestionsNb;
}

app.sociogrammeDelete=function(confirm){
	if (!app.checkConnection()) {return;}    
	if(!confirm){
		app.alert({title:'Supprimer ce sociogramme et tous les liens associés ?',icon:'confirm'},function(){app.sociogrammeDelete(true);});
		return;
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=delete",
	{			
		sociogramme_id:app.sociogramme.current,		
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	}, function(data) {
		app.render(data); 		
		app.go("#sociogrammes/"+app.sociogrammeCurrentClasse);
	}
	);
}

app.sociogrammeEditionSave=function(){
	if(app.sociogrammeEdition==false){return;}
	if (!app.checkConnection()) {return;}
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	var sociogramme_name=(document.getElementById('sociogramme-name').value).trim();;
	if(sociogramme_name==""){
		return;
	}
	var new_questions=[];
	for (var i = 0; i <= app.newSociogrammeQuestionsNb; i++) {
		if(!document.getElementById('sociogramme-question-'+i+'-intitule')){continue;}
		var intitule=(document.getElementById('sociogramme-question-'+i+'-intitule').value).trim();
		if(intitule==""){
			continue;
		}
		var points=document.getElementById('sociogramme-question-'+i+'-points').value;
		var color=document.getElementById('sociogramme-question-'+i+'-color').value;
		new_questions.push({
			question_id:i,
			question_intitule:intitule,
			question_points:points,
			question_color:color
		});
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=update",
	{			
		sociogramme_id:sociogramme.sociogramme_id,
		sociogramme_name:sociogramme_name,
		sociogramme_questions:JSON.stringify(new_questions),		
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	}, function(data) {
		app.render(data);  
		app.hide("sociogramme_form");
		app.go("#sociogrammes/"+app.sociogrammeCurrentClasse);
	}
	);
}
var app=app || {};

app.sociogrammeGroupsDetector=function(){
	app.sociogroups=[];
	var eleves=app.sociogramme.eleves;
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);
		if(!eleve) {continue;}
		eleve.groupeNum=null;
	}
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);	
		if(!eleve) {continue;}	
		if(eleve.groupeNum!=null){
			continue;
		}
		app.areInSociogroups=[eleve.eleve_id];
		var groupeNum=app.sociogrammeGroupsDetectorByEleve(eleve.eleve_id);
		if(groupeNum===false){
			groupeNum=app.sociogroups.length;
		}
		app.sociogroups[groupeNum]=app.sociogroups[groupeNum]||[];
		for (var j = app.areInSociogroups.length - 1; j >= 0; j--) {
			app.getEleveById(app.areInSociogroups[j]).groupeNum=groupeNum;
			app.sociogroups[groupeNum].push(app.areInSociogroups[j]);
		}
	}
}

app.sociogrammeGroupsDetectorByEleve=function(eleve_id){
	var eleve=app.getEleveById(eleve_id);
	var x1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
	var y1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
	var eleves=app.sociogramme.eleves;
	for (var j = eleves.length - 1; j >= 0; j--) {
		var other_eleve=app.getEleveById(eleves[j]);	
		if(!other_eleve) {continue;}
		if(app.areInSociogroups.indexOf(other_eleve.eleve_id)>=0){
			continue;
		}
		var x2=Math.floor(other_eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(other_eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y2=Math.floor(other_eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(other_eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);

		if(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))<=100){
			if(other_eleve.groupeNum!=null){
				return other_eleve.groupeNum;
			}	else{
				app.areInSociogroups.push(other_eleve.eleve_id);
				return app.sociogrammeGroupsDetectorByEleve(other_eleve.eleve_id);
			}
		}
	}
	return false;
}

app.sociogrammeGroupsDetectorRender=function(){
	app.go('classroom/'+app.sociogrammeCurrentClasse+'/groups');
	setTimeout(function(){
		if(app.sociogramme.mode=="groups"){
			app.renderGroupes(app.currentClasse.currentGroupes);
		}else{
			app.renderGroupes(app.sociogroups);
		}		
	},1000);
}
var app=app || {};

app.setElevesRang=function(eleves,relations){
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);
		eleve.rang=0;
	}
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i];
		var eleve=app.getEleveById(relation.socioRelation_to);
		eleve.rang+=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;
	}
}

app.sociogrammeGetQuestion=function(sociogramme_id,question_id){
	var sociogramme=app.getSociogrammeById(sociogramme_id);
	var questions=jsonParse(sociogramme.sociogramme_questions);
	for (var i = questions.length - 1; i >= 0; i--) {
		var question=questions[i];
		if(question.question_id==question_id){
			return question;
		}
	}
	return null;	
}

app.getRangs=function(eleves){
	var rangs=[];
	var tmpRangs=[];
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);
		var index=tmpRangs.indexOf(eleve.rang);    
		if(index==-1){
			var rang={value:eleve.rang, eleves:[i]};
			rangs.push(rang);
			tmpRangs.push(eleve.rang);
		}else{
			rangs[index].eleves.push(i);
		}
	}
	rangs.sort(function(a,b){
		if(a.value>b.value)
			return -1;
		return 1;
	});
	return rangs;
}

app.getSociogrammeRelations=function(classe_id){
	var relations=[];
	var classe=app.getClasseById(classe_id);
		for (var i = app.relations.length - 1; i >= 0; i--) {
			var relation=app.relations[i];
			if(classe.eleves.indexOf(relation.socioRelation_from)<0 || classe.eleves.indexOf(relation.socioRelation_to)<0){continue;}
			if(relation['socioRelation_sociogramme']!=app.sociogramme.current){continue;}
			if(relation.socioRelation_user==app.userConfig.userID && relation.socioRelation_user_type=='user'){
				relations.push(relation);
			}
		};
		
	return relations;
}

app.getRelation=function(from,to,relations){
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i];
		if(relation.socioRelation_from==from && relation.socioRelation_to==to)
			return [relation,i];
	}
	return false;
}

app.setElevesPositions=function(eleves,rangs){
	var tmpRangs=[];
	for (var i = rangs.length - 1; i >= 0; i--) {	
		var rang =rangs[i];
		var index=tmpRangs.indexOf(rang.value);    
		if(index==-1){				
			tmpRangs.push(rang.value);
		}
	}
	tmpRangs.sort(function(a,b){
		if(a.value>b.value)
			return -1;
		return 1;
	});
	var theta=2*app.pi/eleves.length;
	for (var i = eleves.length - 1; i >= 0; i--) {		
		var eleve=app.getEleveById(eleves[i]);
		if(!eleve.sociogramme){
			eleve.sociogramme=[];
		}
		if(!eleve.sociogramme[app.sociogramme.vue]){
			eleve.sociogramme[app.sociogramme.vue]={
				coordR:0,
				coordT:0
			};
		}
		if(app.sociogrammeReverse){
			var r=(tmpRangs.length-tmpRangs.indexOf(eleve.rang)+1)*app.sociogramme.step;
		}else{
			var r=(tmpRangs.indexOf(eleve.rang)+1)*app.sociogramme.step;
		}
		var angle=i*theta;
		eleve.sociogramme[app.sociogramme.vue].coordR=Math.floor(r*1000)/1000;
		eleve.sociogramme[app.sociogramme.vue].coordT=Math.floor(angle*1000)/1000;
	};
	app.sociogramme.mode=app.sociogramme.mode||"students";
}

app.setElevesPositionsByGroupes=function(){	
	app.sociogramme.vue="groupes";
	app.sociogramme.centres=[];
	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	var groupes=classe.currentGroupes;
	var n=groupes.length;

	if(n==0){return;}
	var ctx = app.sociogramme.ctx;
	var theta=2*app.pi/n;

	for (var j = 0, lng=groupes.length; j <lng; j++) {
		var angle=j*theta+theta*0.4;
		var new_centre_R=200;
		var new_centre_T=angle;
		app.sociogramme.centres.push([new_centre_R,new_centre_T,0,0]);
		var groupe=groupes[j];		
		var eleve_t=0;
		var eleve_r=50;
		for (var i = 0, llng=groupe.length; i <llng; i++) {
			var eleve=app.getEleveById(groupe[i]);
			eleve_t+=2*app.pi/groupe.length;
			if(!eleve.sociogramme){
				eleve.sociogramme=[];
			}

			var eleve_x=eleve_r*Math.cos(eleve_t)+new_centre_R*Math.cos(new_centre_T)*1;
			var eleve_y=eleve_r*Math.sin(eleve_t)+new_centre_R*Math.sin(new_centre_T)*1;

			if(!eleve.sociogramme[app.sociogramme.vue]){
				eleve.sociogramme[app.sociogramme.vue]={
					coordR:0,
					coordT:0
				};
			}
			eleve.sociogramme[app.sociogramme.vue].coordR=Math.sqrt(eleve_x*eleve_x+eleve_y*eleve_y);
			eleve.sociogramme[app.sociogramme.vue].coordT=Math.atan2(eleve_y, eleve_x);
			eleve.groupe=j;			
		}
	}
};
var app=app || {};

app.sociogrammeRenderErase=function(){
	var canvas=document.getElementById('sociogramme-canvas');
	canvas.height=app.sociogramme.height;
	canvas.width=app.sociogramme.width;
	app.sociogramme.ctx=canvas.getContext("2d");
	var ctx=app.sociogramme.ctx;	
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);	
}

app.sociogrammeRenderInit=function(){	
	if(!app.sociogramme.enableDraw){return;}	
	app.sociogrammeGroupsDetector();	
	app.sociogramme.enableDraw=false;
	app.sociogrammeRenderErase();

	if(app.sociogramme.mode=="students"){
		if(document.getElementById('sociogrammeViewRangs').checked){
			app.sociogrammeRenderRangs();
		}
	}
	else{
		app.sociogrammeRenderGroups();
	}
	app.sociogrammeRenderStudents();	
	app.sociogramme.enableDraw=true;
	if(app.sociogramme.enable_move){
		setTimeout(function(){app.sociogrammeRenderInit();},10);
	}	
}

app.sociogrammeRenderRangs=function(){
	var rangs=app.sociogramme.rangs;
	var ctx=app.sociogramme.ctx;
	var rang_max=0;
	if(rangs.length>0){
		rang_max=rangs[0].value;
	}	
	for (var i = rangs.length - 1; i >= 0; i--) {
		if(app.sociogrammeReverse){
			var r=(rangs.length-i+1)*app.sociogramme.step*app.sociogramme.zoom;
		}else{
			var r=(i+1)*app.sociogramme.step*app.sociogramme.zoom;
		}	
		ctx.beginPath();
		ctx.arc(app.sociogramme.centerX, app.sociogramme.centerY, r-1, 0, app.pi*2, true);    
		if(rangs[i].value==0){
			ctx.lineWidth = 4;
		}
		else{
			ctx.lineWidth = 1;
		}
		ctx.strokeStyle = '#003300';
		ctx.stroke();		
		//Affichage des graduations
		ctx.fillStyle = 'black';
		ctx.font = '12pt Arial';
		ctx.fillText(rang_max-i,app.sociogramme.centerX , app.sociogramme.centerY-r-5);
	} 
}

app.sociogrammeRenderGroups=function(){
	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	var groupes=classe.currentGroupes;
	var ctx=app.sociogramme.ctx;	

	for (var i = groupes.length - 1; i >= 0; i--) {
		var centre=app.sociogramme.centres[i];
		var x=Math.floor(centre[0]*app.sociogramme.zoom*Math.cos(centre[1])+app.sociogramme.centerX);
		var y=Math.floor(centre[0]*app.sociogramme.zoom*Math.sin(centre[1])+app.sociogramme.centerY);
		ctx.beginPath();
		ctx.arc(x, y, 50*app.sociogramme.zoom, 0, app.pi*2, true);    
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x-4, y-4);
		ctx.lineTo(x+4, y+4);
		ctx.moveTo(x-4, y+4);
		ctx.lineTo(x+4, y-4);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#003300';
		ctx.stroke();		
	}
}

app.sociogrammeRenderStudents=function(){
	var eleves=app.sociogramme.eleves;
	var relations=app.sociogramme.relations;
	app.sociogroupsButton=false;
	var drawed=[];
	var ctx=app.sociogramme.ctx;
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i];   
		if(relations.indexOf(relation.relation_id)!=-1){continue;}	
		drawed.push(relation.socioRelation_id);
		var eleve_1=app.getEleveById(relation.socioRelation_from);
		var eleve_2=app.getEleveById(relation.socioRelation_to);
		if(!eleve_1 || !eleve_2){continue;}
		var question=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question);
		var value_1=question.question_points;
		var color_1=app.getSociogrammeColorLink(question);
		var value_2=0;
		var other_relation=app.getRelation(relation.socioRelation_to,relation.socioRelation_from,relations);
		var color_2="transparent";
		if(other_relation!=false){		
			var otherQuestion=app.sociogrammeGetQuestion(app.sociogramme.current,other_relation[0].socioRelation_question);
			value_2=otherQuestion.question_points;
			relations[other_relation[1]].drawed=true;
			var color_2=app.getSociogrammeColorLink(otherQuestion);
		};		
		if(color_1=="transparent" && color_2=="transparent"){continue;}	
		//Coordonnées de l'élève 1
		var x1=Math.floor(eleve_1.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve_1.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y1=Math.floor(eleve_1.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve_1.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		//Coordonnées de l'élève 2
		var x2=Math.floor(eleve_2.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve_2.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y2=Math.floor(eleve_2.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve_2.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		var grad= ctx.createLinearGradient(x1, y1, x2, y2);
		grad.addColorStop(0, color_1);
		grad.addColorStop(1, color_2);
		ctx.strokeStyle = grad;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.lineWidth = 2;
		if(value_1==value_2){
			ctx.lineWidth = 4;
		}
		ctx.stroke();
	}
	ctx.font = '12pt Arial';
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);		
		if(eleve.eleve_prenom==""){
			var nom=eleve.eleve_nom;
		}else{
			var nom=eleve.eleve_prenom+" "+ucfirst(eleve.eleve_nom.substr(0,1))+".";
		}
		var textWidth = ctx.measureText (nom);

		var x1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		
		if(eleve.groupeNum!=null && app.sociogroups[eleve.groupeNum].length>=2 && !app.userConfig.sociogrammeViewRangs){
			ctx.beginPath();
			ctx.arc(x1, y1,50, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fillStyle = 'rgba(86,86,86,0.15)';
			ctx.fill();
			app.sociogroupsButton=true;
		}
		
		ctx.beginPath();
		var x=x1-5-ctx.measureText(nom).width/2;
		var y=y1-17.5;
		ctx.rect(x, y, textWidth.width+10, 35);
		eleve.width=textWidth.width+10;
		eleve.height=35;
		ctx.lineWidth = 1;
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fillStyle = 'black';
		x=x1-ctx.measureText(nom).width/2;
		y=y1+5;		
		ctx.fillText(nom,x,y);
	}

	if(app.sociogroupsButton || app.sociogramme.mode=="groups"){
		$('#sociogramme-sociogroups-btn').css('display','');
	}else{
		$('#sociogramme-sociogroups-btn').css('display','none');
	}
}

app.getSociogrammeColorLink=function(question){
	if(app.sociogrammeFilters.indexOf(question.question_color)>=0){
		return "transparent";
	}
	return question.question_color;
}
var app=app || {};

app.sociogrammeStudentForm=function(eleve_id){
	if(app.onMobile()){
		$('.sociogramme-bloc').css('display','none');
		app.show('sociogramme-main','flex');
	}
	
	app.show('sociogramme-student-form-block');
	app.sociogrammeCurrentStudent=eleve_id;
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	var eleve=app.getEleveById(eleve_id);
	var questions=jsonParse(sociogramme.sociogramme_questions);
	var eleve_relations=[];
	var html=[];

	var template = $('#template-sociogrammes-relations-form').html();
	var rendered = Mustache.render(template, {
		questions:questions,
		eleves:app.sociogramme.eleves,
		"isVisible":function(){
			return true;
		},
		"eleve_nom_prenom":function(){
			var eleve=app.getEleveById(this);
			return ucfirst(eleve.eleve_prenom)+" "+eleve.eleve_nom.toUpperCase();
		},
		"eleve_id":function(){
			return this;
		},
		"points":function(){
			return this.question_points+' point'+app.pluralize(this.question_points,'s');
		}
		
	});
	html.push(rendered); 
	$('#sociogramme-student-form').html(html.join(''));
	var relations= app.sociogramme.relations;
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i];
		if(relation.socioRelation_from==eleve_id){
			document.getElementById('socioRelation_'+relation.socioRelation_question).value=relation.socioRelation_to;
		}
	}
	document.getElementById('sociogrammeCurrentStudentSelect').value=eleve_id;
}

app.saveRelations=function(){
	if (!app.checkConnection()) {
		return;
	}	
	var eleve_id=app.sociogrammeCurrentStudent;
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	var questions=jsonParse(sociogramme.sociogramme_questions);
	var relations=[];
	for (var i = questions.length - 1; i >= 0; i--) {
		var question_id=questions[i].question_id;
		var relation={
			question_id:question_id,
			from:eleve_id,
			to:document.getElementById('socioRelation_'+question_id).value
		};
		relations.push(relation);
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=updateRelations", {
		eleve_id:eleve_id,
		sociogramme_id:app.sociogramme.current,
		relations:JSON.stringify(relations),			
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	},function(data) {
		app.render(data);  
		app.getClasseSociogramme({mode:app.sociogramme.mode});
		app.sociogrammeSave();
		app.sociogrammeNoRelationsBtn();
	});
}

app.sociogrammeRelationsReset=function(confirm){
	if (!app.checkConnection()) {return;}
	if(app.sociogrammeCurrentClasse==null){
		return;
	}
	if(app.sociogramme.current==null){
		return;
	}
	if(!confirm){
		app.alert({title:'Supprimer toutes les relations pour cette cohorte ?',icon:'confirm'},function(){app.sociogrammeRelationsReset(true);});
		return;
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=deleteAllRelations", {
		eleves:JSON.stringify(app.sociogramme.eleves),
		sociogramme_id:app.sociogramme.current,		
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	},function(data) {
		app.render(data);  
		app.hide('sociogramme-student-form-block');		
		app.getClasseSociogramme({mode:app.sociogramme.mode});
		app.sociogrammeElevesPositionsReset(true);
		app.sociogrammeSave();
		app.sociogrammeNoRelationsBtn();
	});
}
"use strict";
var app=app || {};

app.sociogrammeRelationsViewSet=function(value){
	$('.sociogrammeRelationsViewSelect').prop('value',value);
}

app.sociogrammeElevesPositionsReset=function(confirm){
	if (!app.checkConnection()) {return;}
	if(!confirm){
		app.alert({title:'Réinitialiser la position des élèves ?',icon:'confirm'},function(){app.sociogrammeElevesPositionsReset(true);});
		return;
	}
	if(app.sociogramme.mode=="students"){
		app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
		app.sociogrammeSave();
	}
	else{
		app.setElevesPositionsByGroupes();		
	}
	app.sociogrammeAdaptativeZoom();
}

app.sociogrammePictureGet=function(){
	let classe=app.getClasseById(app.sociogrammeCurrentClasse);
	let canvas=document.getElementById('sociogramme-canvas');
	let dataURL = canvas.toDataURL();
	document.getElementById('classroom-sociogramme-export').href=dataURL;
	document.getElementById('classroom-sociogramme-export').download="sociogramme-"+app.cleanClasseName(classe.classe_nom)+"-"+moment().format('DD/MM/YYYY-HH[h]mm')+".png";
}

app.sociogrammeThumbs=function() {
    // create an off-screen canvas
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img=document.getElementById('sociogramme-canvas');
    // set its dimension to target size
    canvas.width = 200*app.sociogramme.width/app.sociogramme.height;
    canvas.height = 200;
    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
}
app.setSociogrammeFiltre=function(value){
	app.sociogramme.filtre=value;
	app.sociogrammeRenderInit();
};

app.sociogrammeZoom=function(zoom){
	app.sociogramme.zoom=Math.max(0.01,app.sociogramme.zoom+zoom*1);
	app.sociogrammeRenderInit();
	if(app.sociogrammeRepeatZoom){
		setTimeout(function(){
			app.sociogrammeZoom(zoom);
		},50);		
	}
}

app.sociogrammeAdaptativeZoom=function(){
	let eleves=app.sociogramme.eleves;
	let maxR=0.85*document.body.clientHeight/2-90;
	if(document.body.clientHeight>document.body.clientWidth){
		maxR=0.85*document.body.clientWidth/2;
	}

	let r=0;
	for (let i = eleves.length - 1; i >= 0; i--) {		
		let eleve=app.getEleveById(eleves[i]);
		if(!eleve || !eleve.sociogramme) {continue;}	
		r=Math.max(r,eleve.sociogramme[app.sociogramme.vue].coordR);
	}

	if(r!=0){
		app.sociogramme.zoom=maxR/r;		
	}
	
	app.sociogramme.width=2*r*app.sociogramme.zoom*1.1;
	if(app.sociogramme.width<$('#classroom-sociogramme').width()){
		app.sociogramme.width=$('#classroom-sociogramme').width();
	}
	app.sociogramme.height=$('#classroom-sociogramme').height();
	
	app.sociogramme.centerX=app.sociogramme.width/2;	
	app.sociogramme.centerY=r*1*app.sociogramme.zoom+30;	

	if(app.currentView=="sociogrammes"){
		if(app.sociogramme.current!=null && app.sociogrammeCurrentClasse!=null){
			app.sociogrammeRenderInit();
		}
	}
}

app.sociogrammeReverseToggle=function(value){
	app.sociogrammeReverse=value;
	app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
	app.sociogrammeAdaptativeZoom();
}

app.sociogrammeFilterSelectInit=function(){
	let sociogramme=app.getSociogrammeById(app.sociogramme.current);
	let questions=jsonParse(sociogramme.sociogramme_questions);
	let html=[];
	let colors=[];
	for (let i = questions.length - 1; i >= 0; i--) {
		let question=questions[i];
		let color=question.question_color;
		let style="";
		if(colors.indexOf(color)>=0){ continue;}
		colors.push(color);
		if(app.sociogrammeFilters.indexOf(color)>=0){
			style="sociogrammeColorIsFiltered";
		}
		html.push('<div class="sociogrammeColorSelect '+style+'" style="border-color:'+color+'; background-color:'+color+';" onclick="app.sociogrammeToggleFilter(\''+color+'\');"></div>');
	}
	$('#sociogrammeFilters').html(html.join(''));
}

app.sociogrammeToggleFilter=function(color){
	if(app.sociogrammeFilters.indexOf(color)>=0){
		let filters=[];
		for (let i = app.sociogrammeFilters.length - 1; i >= 0; i--) {
			if(app.sociogrammeFilters[i]!=color){
				filters.push(app.sociogrammeFilters[i]);
			}
		}
		app.sociogrammeFilters=filters;
	}
	else{
		app.sociogrammeFilters.push(color);
	}
	app.sociogrammeFilterSelectInit();
	app.sociogrammeRenderInit();
}

app.sociogrammeRenderRangsToggle=function(){
	let sociogrammeViewRangs=document.getElementById('sociogrammeViewRangs').checked;
	if(sociogrammeViewRangs && app.sociogramme.mode!="groups"){
		$('.sociogramme-rangs').css('display','');
	}else{
		$('.sociogramme-rangs').css('display','none');
	}
	app.userConfig.sociogrammeViewRangs=sociogrammeViewRangs;
	app.getClasseSociogramme();	
	app.pushUserConfig();
}

app.sociogrammeCountRelations=function(classe_id,sociogramme_id){
	let n=0;
	let classe=app.getClasseById(classe_id);
	let sociogramme=app.getSociogrammeById(sociogramme_id);
	for (let i = app.relations.length - 1; i >= 0; i--) {
		let relation=app.relations[i];
		if(classe.eleves.indexOf(relation.socioRelation_from)<0 || classe.eleves.indexOf(relation.socioRelation_to)<0){continue;}
		if(relation['socioRelation_sociogramme']!=sociogramme_id){continue;}
		n++;
	};
	return n;
}

app.sociogrammeShowAside=function(){
	if(app.onMobile()){
		$('.sociogramme-bloc').css('display','none');
		app.show('sociogramme-main','flex');
	}
	app.show('sociogramme-options');
	app.titleRender("<a href='#sociogrammes/"+app.sociogramme.current+"/"+app.sociogrammeCurrentClasse+"'>Sociogrammes</a> / Options");
}
var app=app || {};

app.sociogrammeMouseOver=function(){
	app.sociogramme.over=true;
}

app.sociogrammeMouseOut=function(){
	app.sociogramme.over=false;
	app.sociogrammeMouseDown=false;
}

app.sociogrammeMouseClick=function(){	
		if(app.sociogrammeClick==false)	{return;}
	for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(app.sociogramme.eleves[i]);
		var x=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		var x_min=x-1-eleve.width/2;
		var x_max=x*1+eleve.width*1-1-eleve.width/2;
		var y_min=y-25;
		var y_max=y*1+eleve.height*1-25;
		if(app.mouse.x>x_min && app.mouse.x<x_max && app.mouse.y>y_min && app.mouse.y<y_max){
			app.sociogramme.selectedEleve=i;	
			app.sociogrammeStudentForm(app.sociogramme.eleves[i]);
			return;
		}else{
			app.hide('sociogramme-student-form-block');
		}
	};
}

app.start_move=function(){
	app.sociogrammeClick=true;
	app.sociogrammeMouseDown=true;
	app.sociogrammeEnableSave=false;
	for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(app.sociogramme.eleves[i]);
		var x=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		var x_min=x-1-eleve.width/2;
		var x_max=x*1+eleve.width*1-1-eleve.width/2;
		var y_min=y-25;
		var y_max=y*1+eleve.height*1-25;
		if(app.mouse.x>x_min && app.mouse.x<x_max && app.mouse.y>y_min && app.mouse.y<y_max){
			app.sociogramme.selectedEleve=i;	
			app.sociogramme.enable_move=true;
			app.preventTouch=true;
			continue;
		}
	};
	// for (var i = app.sociogramme.centres.length - 1; i >= 0; i--) {
	// 	var centre=	app.sociogramme.centres[i];
	// 	var coord=app.sociogrammeGetReduceCoord(centre[0],centre[1]);
	// 	var x=coord.x;
	// 	var y=coord.y;		
	// 	if(app.mouse.x>x-15 && app.mouse.x<x+15 && app.mouse.y>y-15 && app.mouse.y<y+15){
	// 		app.sociogramme.selectedCentre=i;	
	// 		app.sociogramme.enable_move=true;			
	// 		app.preventTouch=true;
	// 		continue;
	// 	}
	// };
	app.sociogrammeRenderInit();
}

app.movemouse=function(e)
{
	if(app.currentView!="sociogrammes"){
		return;
	}
	var pos = $('#sociogramme-canvas').offset();	
	var new_mousex = e.pageX-pos.left;
	var new_mousey = e.pageY-pos.top;   
	var diffX=app.mouse.x-new_mousex;
	var diffY=app.mouse.y-new_mousey;
	app.mouse.x=new_mousex;
	app.mouse.y=new_mousey;
	if(app.sociogramme.enable_move){

		if(app.sociogramme.selectedEleve>=0 && app.sociogramme.selectedEleve!=null){
			var eleve=app.getEleveById(app.sociogramme.eleves[app.sociogramme.selectedEleve]);
			var x=eleve.sociogramme[app.sociogramme.vue].coordR*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT);
			var y=eleve.sociogramme[app.sociogramme.vue].coordR*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT);
			x-=diffX/app.sociogramme.zoom;
			y-=diffY/app.sociogramme.zoom;
			var r=Math.sqrt(x*x+y*y);
			var theta=Math.atan2(y, x);
			eleve.sociogramme[app.sociogramme.vue].coordR=Math.floor(r*1000)/1000;
			eleve.sociogramme[app.sociogramme.vue].coordT=Math.floor(theta*1000)/1000;;
			app.sociogrammeClick=false;
			app.sociogrammeEnableSave=true;
		}		
		// if(app.sociogramme.selectedCentre>=0 && app.sociogramme.selectedCentre!=null){	
		// 	var centre=app.sociogramme.centres[app.sociogramme.selectedCentre];	
		// 	centre[0]-=diffX/app.sociogramme.zoom;
		// 	centre[1]-=diffY/app.sociogramme.zoom;
		// 	app.sociogrammeClick=false;
		// 	app.sociogrammeEnableSave=true;
		// 	for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
		// 		var eleve=app.getEleveById(app.sociogramme.eleves[i]);
		// 		if(eleve.groupe==app.sociogramme.selectedCentre){
		// 			eleve.sociogramme[app.sociogramme.vue].x-=diffX/app.sociogramme.zoom;
		// 			eleve.sociogramme[app.sociogramme.vue].y-=diffY/app.sociogramme.zoom;					
		// 		}
		// 	}
		// }

		app.preventTouch=true;
	}else if(app.sociogrammeMouseDown){
		app.sociogramme.centerX-=diffX;
		app.sociogramme.centerY-=diffY;
		app.sociogrammeRenderInit();

	}


	if(app.sociogramme.over){
		var cursor=false;
		for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
			var eleve=app.getEleveById(app.sociogramme.eleves[i]);
			var x1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
			var y1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
			var x_min=x1-1-eleve.width/2;
			var x_max=x1*1+eleve.width*1-1-eleve.width/2;
			var y_min=y1-25;
			var y_max=y1*1+eleve.height*1-25;
			if(app.mouse.x>x_min && app.mouse.x<x_max && app.mouse.y>y_min && app.mouse.y<y_max){
				cursor=true;
			}
		};
		// for (var i = app.sociogramme.centres.length - 1; i >= 0; i--) {
		// 	var centre=	app.sociogramme.centres[i];
		// 	var coord=app.sociogrammeGetReduceCoord(centre[0],centre[1]);
		// 	var x=coord.x;
		// 	var y=coord.y;
		// 	if(app.mouse.x>x-15 && app.mouse.x<x+15 && app.mouse.y>y-15 && app.mouse.y<y+15){
		// 		cursor=true;
		// 	}
		// };
		if(cursor){
			document.getElementById('sociogramme-canvas').style.cursor="pointer";
		}else{
			document.getElementById('sociogramme-canvas').style.cursor="move";
		}
	}


}

app.end_move=function(){
	if(app.sociogrammeEnableSave){
		app.sociogrammeEnableSave=false;
		app.sociogrammeSave();
		app.sociogrammeRenderInit();
	}
	app.preventTouch=false;
	app.sociogramme.enable_move=false;
	app.sociogramme.selectedEleve=null;	
	app.sociogramme.selectedCentre=-1;
	app.sociogrammeMouseDown=false;
}


app.sociogrammeWheel=function(event){
	event.preventDefault();
	if(event.deltaY>0){
		app.sociogrammeZoom(-0.05);
	}
	else{
		app.sociogrammeZoom(0.05);
	}
}
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
var app=app || {};

app.getGroupsRandom=function(nbGroupes){
  //GROUPES ALEATOIRES
  var mixite=false;

  var eleves=clone(app.currentClasse.eleves);
  eleves.sort(function(){ return Math.round(Math.random())});
  var groupes=[];
 
   for(var i=0,lng=eleves.length;i<lng;i++){
     var eleve=app.getEleveById(eleves[i]);
     var k=i%nbGroupes;
     if(!groupes[k]){groupes[k]=[];}
     groupes[k].push(eleve.eleve_id);
   }

 return groupes;
}
var app=app || {};

app.getGroupsByRelations=function(n){

  var generatedGroupes=[];
  var cohesionGroupes=[];
 // var nombre_essais=100;
  //var essaie_nb=0;
if(app.sociogramme.current==null){
  return [];
}

  var relations=app.getSociogrammeRelations(app.currentClasse.classe_id);
  var nb_filles_max=app.currentClasse.nb_girls/n;
  var nb_boys_max=app.currentClasse.nb_boys/n;
  var mixite=false;

  app.setElevesRang(app.currentClasse.eleves,relations);
  app.setStudentsRelationsNb(app.currentClasse.eleves,relations);
  var max_par_groupe=Math.floor(app.currentClasse.eleves.length/n);
  //while(essaie_nb<nombre_essais){
    //Préparation de la liste des élèves
    var eleves=[];
    for (var i = app.currentClasse.eleves.length - 1; i >= 0; i--) {
      var eleve=app.getEleveById(app.currentClasse.eleves[i]);
      eleve.inGroupe=false;
      eleves.push(eleve);
    };
    eleve=app.orderBy(eleves,'nbRelations','DESC');
//On place les fortes relations en premières
var groupes=[];
for (var i = 0, lng=eleves.length; i <lng; i++) {
  var eleve=eleves[i];
  var tabScore=[];
  for (var j = 0,llng=groupes.length; j<llng; j++) {
    var groupe=groupes[j]||[];
   // if(!mixite || groupe.length<2){
      tabScore.push(app.relationsReciproques(eleve,groupe,relations));
  //  }else{
   //   tabScore.push(0);
    //}   
  }
  var max=getMaxOfArray(tabScore);    
  if(max>0){
    if(groupes[tabScore.indexOf(max)].length<max_par_groupe){
     groupes[tabScore.indexOf(max)].push(eleve); 
   }   
 }
 else{
  groupes[groupes.length]=[eleve];
}
}
var temp_groupes=[];
for (var j = 0,lng=groupes.length; j<lng; j++) {
  var groupe=groupes[j];
  if(groupe.length>1){
    temp_groupes.push(groupe);
  }
}
groupes=temp_groupes;
//on regroupe les groupes formés précedemment pour avoir le nombre de groupes demandé
var temp_groupes=[];
for (var i = 0; i <n; i++) {
  temp_groupes[i]=groupes[i]||[];
}
for (var j = n,lng=groupes.length; j<lng; j++) {
  var tabScore=[];
  var groupe=groupes[j];
  for (var i = 0; i <n; i++) {
    var other_groupe=groupes[i];
   // if(mixite){
    //  tabScore.push(app.getScoreEntreGroupes(groupe,other_groupe,relations)*app.getGroupMixite(groupe,other_groupe,nb_filles_max,nb_boys_max));
    //}
    //else{
      tabScore.push(app.getScoreEntreGroupes(groupe,other_groupe,relations));
    //}   
  }
  var inGroupe=false;
  var k=0;
  while(!inGroupe){     
    var max=getMaxOfArray(tabScore); 
    var favoriteGroupe=tabScore.indexOf(max);  
    if(temp_groupes[favoriteGroupe].length*1+groupe.length*1>max_par_groupe){
      if(k<=n){
        tabScore[favoriteGroupe]=getMinOfArray(tabScore); 
      }else{
        inGroupe=true;
      } 
    }else{
      inGroupe=true;
      temp_groupes[favoriteGroupe]=groupes[favoriteGroupe].concat(groupe);
    } 
    k++;
  } 
}
groupes=temp_groupes;
//On coche les élèves déjà placés
var temp_groupes=[];
for (var j = 0,lng=groupes.length; j<lng; j++) {
  var groupe=groupes[j];
  temp_groupes[j]=[];
  for (var i = 0, llng=groupe.length; i <llng; i++) {
    var eleve=groupe[i];
    eleve.inGroupe=true;    
    temp_groupes[j].push(eleve.eleve_id);
  }
}
//On remplie les groupes du mieux possible
for (var j = 0; j<n; j++) {
  groupes[j]=groupes[j]||[];
  temp_groupes[j]=temp_groupes[j]||[];
}
for (var i = 0, lng=eleves.length; i <lng; i++) {
  var eleve=eleves[i];  
  if(!eleve.inGroupe){
    var tabScore=[];
    for (var j = 0; j<n; j++) {
      var groupe=groupes[j];
      //if(mixite){
     //   var eleve_groupe_score=app.getGroupeScore(eleve,groupe,relations)*app.getGroupMixite(groupe,[eleve],nb_filles_max,nb_boys_max);
      //}
     // else{
        var eleve_groupe_score=app.getGroupeScore(eleve,groupe,relations);
    //  }
      var new_score=(eleve_groupe_score*1+1)*100/(groupe.length+1);
      tabScore.push(new_score);
    };
    var inGroupe=false;
    var k=0;
    var temp_favorite=favoriteGroupe;
    while(!inGroupe){      
      var max=getMaxOfArray(tabScore);    
      var favoriteGroupe=tabScore.indexOf(max); 
      if(groupes[favoriteGroupe].length==max_par_groupe){
        if(k<=n){
          tabScore[favoriteGroupe]=getMinOfArray(tabScore); 
        }else{
          inGroupe=true;
          eleve.inGroupe=true;
          //if(!mixite){
            groupes[temp_favorite].push(eleve); 
            temp_groupes[temp_favorite].push(eleve.eleve_id); 
         // }
        } 
      }else{
        inGroupe=true;
        eleve.inGroupe=true;
        groupes[favoriteGroupe].push(eleve);  
        temp_groupes[favoriteGroupe].push(eleve.eleve_id);  
      } 
      k++;
    } 
  } 
}
return temp_groupes;
//generatedGroupes[essaie_nb]=generatedGroupes[essaie_nb]||[];
//generatedGroupes[essaie_nb]=generatedGroupes[essaie_nb].concat(temp_groupes);
// if(mixite){
//   cohesionGroupes[essaie_nb]= app.getCohesionGroupes(groupes,relations)*app.getMixiteGroupes(groupes,nb_filles_max)*app.getEquilibreGroupes(groupes,max_par_groupe);
// }else{
//   cohesionGroupes[essaie_nb]= app.getCohesionGroupes(groupes,relations)*app.getEquilibreGroupes(groupes,max_par_groupe);
// }
//essaie_nb++;
//}
//max=getMaxOfArray(cohesionGroupes); 
//favoriteGroupe=cohesionGroupes.indexOf(max);
//return generatedGroupes[favoriteGroupe];
};
app.setStudentsRelationsNb=function(eleves,relations){
  for (var i = eleves.length - 1; i >= 0; i--) {
   var eleve=app.getEleveById(eleves[i]);
   eleve.nbRelations=0;
 }
 for (var j = relations.length - 1; j >= 0; j--) {
  var relation=relations[j];

var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;


  if(value>0){
    if(app.currentClasse.eleves.indexOf(relation.socioRelation_from)){
      app.getEleveById(relation.socioRelation_from).nbRelations++;
    }
    if(app.currentClasse.eleves.indexOf(relation.socioRelation_to)){
     app.getEleveById(relation.socioRelation_to).nbRelations++;
   }
 }



}
}
app.getGroupeScore=function(eleve,groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var autre_eleve=groupe[i];
    for (var j = relations.length - 1; j >= 0; j--) {
      var relation=relations[j];

      if((relation.socioRelation_from==autre_eleve.eleve_id && relation.socioRlation_to==eleve.eleve_id) || (relation.socioRelation_from==eleve.eleve_id && relation.socioRelation_to==autre_eleve.eleve_id)){
    var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;
        score+=value;
      }
    };
  };
  return score;
};
app.relationsReciproques=function(eleve,groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var autre_eleve=groupe[i];
    var n=0;
    for (var j = relations.length - 1; j >= 0; j--) {
      var relation=relations[j];


var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;


  if(value>0){
        if((relation.socioRelation_from==autre_eleve.eleve_id && relation.socioRelation_to==eleve.eleve_id) || (relation.socioRelation_from==eleve.eleve_id && relation.socioRelation_to==autre_eleve.eleve_id)){
          n++;
          if(n%2==0 && n>0){          
           score+=value;
         }
       }
     }
   };
 };  
 return score;
}
app.relationsEleveGroupe=function(eleve,groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var autre_eleve=groupe[i];
    for (var j = relations.length - 1; j >= 0; j--) {
      var relation=relations[j];
      var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;

      if(value>0){
       if((relation.socioRelation_from==autre_eleve.eleve_id && relation.socioRelation_to==eleve.eleve_id) || (relation.socioRelation_from==eleve.eleve_id && relation.socioRelation_to==autre_eleve.eleve_id)){
        score++;
      }
    }
  };
};
return score;
}
app.countRelations=function(eleve,groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var autre_eleve=groupe[i];
    for (var j = relations.length - 1; j >= 0; j--) {
      var relation=relations[j];
      if((relation.socioRelation_from==autre_eleve.eleve_id && relation.socioRelation_to==eleve.eleve_id) || (relation.socioRelation_from==eleve.eleve_id && relation.socioRelation_to==autre_eleve.eleve_id)){
         var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;

        if(value>0){score++;}else{score--;}  



      }
    };
  };
  return score;
}
app.getScoreEntreGroupes=function(groupe,other_groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var eleve=groupe[i];
    score+=app.relationsEleveGroupe(eleve,other_groupe,relations);
  }
  return score;
}
// app.getCohesionGroupes=function(groupes,relations){
//   var score=0;
//   for (var j = 0,lng=groupes.length; j<lng; j++) {
//     var groupe=groupes[j];
//     for (var i = groupe.length - 1; i >= 0; i--) {
//       var eleve=groupe[i];  
//       score+=app.countRelations(eleve,groupe,relations);
//     }
//   }
//   return score;
// }
// app.getEquilibreGroupes=function(groupes,max_par_groupe){
//   var score=0;
//   for (var j = 0,lng=groupes.length; j<lng; j++) {
//     var groupe=groupes[j];
//     score+=Math.abs(max_par_groupe-groupe.length);  
//   }
//   return 100-score*100/max_par_groupe;
// }
// app.getMixiteGroupes=function(groupes,nb_filles_max){
//   var score=0;
//   for (var j = 0,lng=groupes.length; j<lng; j++) {
//     var groupe=groupes[j];
//     var nb_filles=0;
//     for (var i = groupe.length - 1; i >= 0; i--) {
//       var eleve=groupe[i];
//       if(eleve.eleve_genre=="F"){
//         nb_filles++;
//       }
//     }
//     score+=Math.abs(nb_filles_max-nb_filles); 
//   }
//   return 100-score*100/nb_filles_max;
// }

var app=app || {}; 

app.classeElevesAddRender=function(){
 document.getElementById('classroom-addStudents').style.display = "block";
 document.getElementById("classroom-addStudents-liste").innerHTML="";
 app.elevesAddInputRender();
};
var app=app || {}; 

app.importFromTableur=function(){  
  var tab=document.getElementById('import-tableur').value;
  var split=tab.split('\n');
  for (var i = split.length - 1; i >= 0; i--) {
   var eleve_tab=split[i];
   var eleve=eleve_tab.split('\t');
   app.elevesAddInputRender({eleve_nom:eleve[0],eleve_prenom:eleve[1],eleve_id:false,eleve_genre:eleve[2],eleve_birthday:eleve[3]});
 };
 $('#import-tableur-btn').button('reset');
}
var app=app || {}; 

app.initClassroomStudentsImport=function(){ 
  var classe=app.currentClasse;
  app.titleRender('<a href="#home">MonSociogram<span class="small">.me</span></a> / <a href="#classroom/'+classe.classe_id+'">'+app.cleanClasseName(classe.classe_nom)+'</a> / Ajouter des personnes'); 
  $('#classroom-toolbar').css('display','none');
  $('.classroom-page').css('display','none');
  $('#classroom-main').css('display','none');
  
  $('#classroom-addStudents').css('display',''); 
  
  $('.classroom-addStudents-btn').button('reset');
  document.getElementById('import-tableur').value="";
  app.classeElevesAddRender();  
  document.getElementsByName("eleves_noms[]")[0].focus();
}

app.elevesAddInputRemove=function(id){ 
  document.getElementById("input_eleve_nom_"+id).value="";
  document.getElementById("input_eleve_prenom_"+id).value="";
  document.getElementById("input_eleve_id_"+id).value="";
  document.getElementById("new_eleve_"+id).style.display="none";
};

app.submitEleveForm=function() {  
 var eleves=[];


 var nouveauxElevesNoms = document.getElementsByName("eleves_noms[]");
 var nouveauxElevesPrenoms = document.getElementsByName("eleves_prenoms[]");
 var nouveauxElevesIds = document.getElementsByName("eleves_ids[]");
 
 for (var i = 0, lng = nouveauxElevesNoms.length; i < lng; i++) {
  var eleve={
    eleve_nom:nouveauxElevesNoms[i].value,
    eleve_prenom:nouveauxElevesPrenoms[i].value,
    eleve_id:nouveauxElevesIds[i].value,
    eleve_genre:"",
    eleve_birthday:""
  };
  eleves.push(eleve);
}

$.post(app.serveur + "index.php?go=eleves&q=add", {
 id:app.currentClasse.classe_id,
 eleves: JSON.stringify(eleves),
 sessionParams:app.sessionParams
}, function(data) {
 $('.classroom-addStudents-btn').button('reset');
 app.render(data);

 app.initClassroom(app.currentClasse.classe_id);
 app.go('classroom/'+app.currentClasse.classe_id);

});
};
var app=app || {}; 

app.elevesAddInputRender=function(options) {
	if (!app.checkConnection()) {
		return;
	}
	options=options||{};
	var div=document.getElementById("classroom-addStudents-liste");
	var n=document.getElementsByClassName('input_eleve').length;
	var new_eleve= document.createElement("div");
	new_eleve.className="input_eleve";
	new_eleve.id="new_eleve_"+n;

	var html=[];
	html.push('<div class="classroom-addStudents-liste-student flex-rows">');

	html.push('<div class="flex-1 me-2 flex-rows">');
 //Colonne de droite
 html.push('<button type="button" id="input_eleve_btn_'+n+'" class="btn btn-light me-2 " onclick="app.elevesAddInputRemove('+n+');" >');
 html.push("<span class='bi bi-trash'></span><span class=''> </span>");
 html.push('</button>');
 html.push('<div class="form-group">');
 if(options.eleve_nom=="null"){options.eleve_nom="";}
 var value = options.eleve_nom||"";
 html.push('<input type="text" class="form-control" name="eleves_noms[]" placeholder="NOM" id="input_eleve_nom_'+n+'" value="'+value+'"/>');
 html.push('</div>');

 html.push('</div>');
 //Colonne de gauche
 html.push('<div class="flex-1 me-2">');

 html.push('<div class="form-group">');
 if(options.eleve_nom=="null"){options.eleve_prenom="";}
 var value = options.eleve_prenom||"";
 html.push('<input type="text" class="form-control" name="eleves_prenoms[]" placeholder="Prénom" id="input_eleve_prenom_'+n+'" value="'+value+'"/>');
 html.push('</div>');

//Fin : Colonne de gauche
html.push('</div>');

html.push('<div class="">');

html.push('</div>');

html.push('</div>');
new_eleve.innerHTML=html.join('');

div.appendChild(new_eleve);
var input_id = document.createElement("input");
input_id.name = "eleves_ids[]";
input_id.value = options.eleve_id||"";
input_id.type = "hidden";
input_id.id = "input_eleve_id_"+n;
div.appendChild(input_id);
if(options.eleve_id){
	document.getElementById('input_eleve_nom_'+n+'').disabled = true;
	document.getElementById('input_eleve_prenom_'+n+'').disabled = true;
	document.getElementById('input_eleve_id_'+n+'').disabled = true;
}
};