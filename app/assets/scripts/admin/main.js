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
