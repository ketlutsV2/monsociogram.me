var app=app || {};

app.getGroupsRandom=function(nbGroupes){
  //GROUPES ALEATOIRES
  var mixite=false;

  var eleves=clone(app.currentClasse.eleves);
  eleves.sort(function(){ return Math.round(Math.random())});
  var groupes=[];
 
   for(var i=0,lng=eleves.length;i<lng;i++){
     var eleve=app.getEleveById(eleves[i]);
     var k=i%nbGroupes;
     if(!groupes[k]){groupes[k]=[];}
     groupes[k].push(eleve.eleve_id);
   }

 return groupes;
}