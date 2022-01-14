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