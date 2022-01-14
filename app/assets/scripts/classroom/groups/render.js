var app=app || {};

app.renderGroupes=function(groupes){
  var eleves_id=[];
 var temp_groupes=[];
 var max=0;
 for(var i=0, lng=groupes.length;i<lng;i++){
   var llng=groupes[i].length;
   if(llng>max){max=llng;}
   if(llng!=0){
     temp_groupes.push(groupes[i]);
   }
 }
 groupes=temp_groupes;
 var nbGroupes=groupes.length;
 var html = [];
 for(i=0;i<nbGroupes;i++){
  var cohesion=app.classroomGroupsCohesionScore(groupes[i]);
  html.push('<div class="list-group" ondragover="event.preventDefault();" ondrop="app.classroomGroupsItemDrop(event,'+i+');">');
  
  var nomGroupe=i*1+1;
  html.push('<div class="list-group-item bold">Groupe '+nomGroupe+'');
  html.push('<span class="classroom-groupes-cohesion hide" title="Cohésion du groupe"> <span class="bi bi-people-fill"></span><br/><span class="classroom-groupes-cohesion-value">'+cohesion+'%</span></span>');
  html.push('</div>');
  for(var j=0,lng=max;j<lng;j++){

    if(groupes[i][j]){
      var eleve=app.getEleveById(groupes[i][j]);
      if(!eleve){
        continue;
      }
      
      eleves_id.push(eleve.eleve_id);
      html.push('<div draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\', \''+j+'~'+i+'\');" class="list-group-item">');
      html.push('<span  class="movable">'+app.renderEleveNom(eleve)+'</span>')
    }else{
      html.push('<div class="list-group-item">');
      html.push("...");       
    }       
    html.push('</div>');
  }
  html.push("</div>");
}
//On affiche le nouveau groupe
var nomGroupe=groupes.length*1+1;
html.push('<div class="list-group groupe-vide"  ondragover="event.preventDefault();" ondrop="app.classroomGroupsItemDrop(event,\'new_groupe\');">');

html.push('<div class="list-group-item bold">Groupe '+nomGroupe+'</div>');
html.push('<div class="list-group-item">');
html.push("...");  
html.push("</div>");
html.push("</div>");
//On affiche les élèves non classés dans un groupe
var n=0;
html.push('<div class="list-group"  ondragover="event.preventDefault();" ondrop="app.classroomGroupsItemDrop(event,\'nc\');">');

html.push('<div class="list-group-item bold">Non classé(s)</div>');
for(var j=0;j<app.currentClasse.eleves.length;j++){
  if(eleves_id.indexOf(app.currentClasse.eleves[j])>=0){continue;}
  n++;
  var eleve=app.getEleveById(app.currentClasse.eleves[j]);
  
  html.push('<div draggable="true" ondragstart="event.dataTransfer.setData(\'text/plain\', \''+eleve.eleve_id+'~nc\')" class="list-group-item">');
  html.push('<span class="movable">'+app.renderEleveNom(eleve)+'</span>')
  html.push('</div>');
}
if(n==0){
 html.push('<div class="list-group-item">');
 html.push("...");  
 html.push('</div>');
}

html.push("</div>");
app.currentClasse.currentGroupes=groupes;

document.getElementById("classroom-groupes-liste").innerHTML=html.join('');

};