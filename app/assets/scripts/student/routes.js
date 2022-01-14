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