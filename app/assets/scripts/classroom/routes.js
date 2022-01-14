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