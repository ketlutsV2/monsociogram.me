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