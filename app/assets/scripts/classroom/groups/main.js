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