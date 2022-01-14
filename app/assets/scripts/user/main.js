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