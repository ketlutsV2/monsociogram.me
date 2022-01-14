var app=app || {};

app.classroomGroupsFormRender=function() {
 var classe=app.currentClasse;
 if (!classe.eleves) {
  return;
}
var lng = classe.eleves.length;
document.getElementById('groupsGenerator-groupsNb').max = Math.round(lng / 2);
document.getElementById('groupsGenerator-groupsNb').value = Math.floor(app.currentClasse.eleves.length/3);
};

app.classroomGroupsCohesionScore=function(groupe){
  var relations=app.getSociogrammeRelations(app.currentClasse.classe_id);
  var relationsNb=0;
  var relationsMax=0;
  for (var j = relations.length - 1; j >= 0; j--) {
    var relation=relations[j];  
    if(app.currentClasse.eleves.indexOf(relation.socioRelation_to)<0){
      continue;
    }
    if(groupe.indexOf(relation.socioRelation_from)>=0){
      var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;
      relationsMax++;
      var index=groupe.indexOf(relation.socioRelation_to);
      if(index>=0 && value>0){
        relationsNb++;
      }
      else if(index<0 && value<0){
        relationsNb++;
      }
    }
  };
  if(relationsMax!=0){
   return Math.round(relationsNb/relationsMax*100);
 }
 else{
  return "--";
}
}

app.classroomsGroupsPrint=function(){
  var classeName=app.cleanClasseName(app.currentClasse.classe_nom);
  $('#html2pdf-data').html(document.getElementById("classroom-groupes-liste").innerHTML);
  $('#html2pdf-title').html(classeName+' - Groupes - '+moment().format('DD MMM YYYY'));
  var element = document.getElementById("html2pdf-page");
  var opt = {
    margin:       0.5,
    filename:     'Sociogram_'+classeName+'_groupes_'+moment().format('DD_MMM_YYYY')+'.pdf',
    image:        { type: 'jpeg', quality: 0.98 },
    html2canvas:  { scale: 1 },
    jsPDF:        { unit: 'in', format: 'a4', orientation: 'portrait' },
    pagebreak: { mode: ['avoid-all', 'css', 'legacy'] }
  };

  $('#html2pdf-page').css('display','block');

  html2pdf().set(opt).from(element).save().then((onFulfilled,onRejected)=>{
    $('#html2pdf-page').css('display','none');
  });

}

app.classroomGroupsItemDrop=function(e,groupe_num){
  e.preventDefault();
  if (e.stopPropagation) e.stopPropagation(); 
  var eleve = e.dataTransfer.getData('text/plain').split("~");
  if(groupe_num!=="nc"){
    if(groupe_num=="new_groupe"){
     groupe_num=app.currentClasse.currentGroupes.length;
     app.currentClasse.currentGroupes.push([]);
   }
   if(eleve[1]!=="nc"){
    app.currentClasse.currentGroupes[groupe_num].push(clone(app.currentClasse.currentGroupes[eleve[1]][eleve[0]]));
    app.currentClasse.currentGroupes[eleve[1]].splice(eleve[0], 1);
  }else{
    app.currentClasse.currentGroupes[groupe_num].push(eleve[0]);
  }
}else{
  app.currentClasse.currentGroupes[eleve[1]].splice(eleve[0], 1);
}
app.renderGroupes(app.currentClasse.currentGroupes);
}

app.groupesInfoUpdate=function(){
  var  nbGroupes=2;
  var nbStudentsByGroupes=2;
  var nbStudents=app.currentClasse.eleves.length;
  nbGroupes=document.getElementById('groupsGenerator-groupsNb').value;
  nbStudentsByGroupes=Math.floor(nbStudents / nbGroupes);
  var r=nbStudents-nbGroupes*Math.floor(nbStudents / nbGroupes);
  var suite="";
  if(r!=0){
    suite=" et <span class='bold'>"+r+"</span>x"+(nbStudentsByGroupes+1)+" personnes";
  }
  document.getElementById('groupes-info').innerHTML="<span class='bold'>"+nbGroupes+" groupes </span> <br/><span class='bold'>"+(nbGroupes-r)+"</span>x"+nbStudentsByGroupes+" personne"+app.pluralize(nbStudentsByGroupes,'s')+suite;
}