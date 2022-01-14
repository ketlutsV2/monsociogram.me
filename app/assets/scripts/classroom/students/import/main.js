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