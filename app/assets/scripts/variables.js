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