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