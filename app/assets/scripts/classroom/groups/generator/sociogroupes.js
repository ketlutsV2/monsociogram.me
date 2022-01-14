var app=app || {};

app.getGroupsByRelations=function(n){

  var generatedGroupes=[];
  var cohesionGroupes=[];
 // var nombre_essais=100;
  //var essaie_nb=0;
if(app.sociogramme.current==null){
  return [];
}

  var relations=app.getSociogrammeRelations(app.currentClasse.classe_id);
  var nb_filles_max=app.currentClasse.nb_girls/n;
  var nb_boys_max=app.currentClasse.nb_boys/n;
  var mixite=false;

  app.setElevesRang(app.currentClasse.eleves,relations);
  app.setStudentsRelationsNb(app.currentClasse.eleves,relations);
  var max_par_groupe=Math.floor(app.currentClasse.eleves.length/n);
  //while(essaie_nb<nombre_essais){
    //Préparation de la liste des élèves
    var eleves=[];
    for (var i = app.currentClasse.eleves.length - 1; i >= 0; i--) {
      var eleve=app.getEleveById(app.currentClasse.eleves[i]);
      eleve.inGroupe=false;
      eleves.push(eleve);
    };
    eleve=app.orderBy(eleves,'nbRelations','DESC');
//On place les fortes relations en premières
var groupes=[];
for (var i = 0, lng=eleves.length; i <lng; i++) {
  var eleve=eleves[i];
  var tabScore=[];
  for (var j = 0,llng=groupes.length; j<llng; j++) {
    var groupe=groupes[j]||[];
   // if(!mixite || groupe.length<2){
      tabScore.push(app.relationsReciproques(eleve,groupe,relations));
  //  }else{
   //   tabScore.push(0);
    //}   
  }
  var max=getMaxOfArray(tabScore);    
  if(max>0){
    if(groupes[tabScore.indexOf(max)].length<max_par_groupe){
     groupes[tabScore.indexOf(max)].push(eleve); 
   }   
 }
 else{
  groupes[groupes.length]=[eleve];
}
}
var temp_groupes=[];
for (var j = 0,lng=groupes.length; j<lng; j++) {
  var groupe=groupes[j];
  if(groupe.length>1){
    temp_groupes.push(groupe);
  }
}
groupes=temp_groupes;
//on regroupe les groupes formés précedemment pour avoir le nombre de groupes demandé
var temp_groupes=[];
for (var i = 0; i <n; i++) {
  temp_groupes[i]=groupes[i]||[];
}
for (var j = n,lng=groupes.length; j<lng; j++) {
  var tabScore=[];
  var groupe=groupes[j];
  for (var i = 0; i <n; i++) {
    var other_groupe=groupes[i];
   // if(mixite){
    //  tabScore.push(app.getScoreEntreGroupes(groupe,other_groupe,relations)*app.getGroupMixite(groupe,other_groupe,nb_filles_max,nb_boys_max));
    //}
    //else{
      tabScore.push(app.getScoreEntreGroupes(groupe,other_groupe,relations));
    //}   
  }
  var inGroupe=false;
  var k=0;
  while(!inGroupe){     
    var max=getMaxOfArray(tabScore); 
    var favoriteGroupe=tabScore.indexOf(max);  
    if(temp_groupes[favoriteGroupe].length*1+groupe.length*1>max_par_groupe){
      if(k<=n){
        tabScore[favoriteGroupe]=getMinOfArray(tabScore); 
      }else{
        inGroupe=true;
      } 
    }else{
      inGroupe=true;
      temp_groupes[favoriteGroupe]=groupes[favoriteGroupe].concat(groupe);
    } 
    k++;
  } 
}
groupes=temp_groupes;
//On coche les élèves déjà placés
var temp_groupes=[];
for (var j = 0,lng=groupes.length; j<lng; j++) {
  var groupe=groupes[j];
  temp_groupes[j]=[];
  for (var i = 0, llng=groupe.length; i <llng; i++) {
    var eleve=groupe[i];
    eleve.inGroupe=true;    
    temp_groupes[j].push(eleve.eleve_id);
  }
}
//On remplie les groupes du mieux possible
for (var j = 0; j<n; j++) {
  groupes[j]=groupes[j]||[];
  temp_groupes[j]=temp_groupes[j]||[];
}
for (var i = 0, lng=eleves.length; i <lng; i++) {
  var eleve=eleves[i];  
  if(!eleve.inGroupe){
    var tabScore=[];
    for (var j = 0; j<n; j++) {
      var groupe=groupes[j];
      //if(mixite){
     //   var eleve_groupe_score=app.getGroupeScore(eleve,groupe,relations)*app.getGroupMixite(groupe,[eleve],nb_filles_max,nb_boys_max);
      //}
     // else{
        var eleve_groupe_score=app.getGroupeScore(eleve,groupe,relations);
    //  }
      var new_score=(eleve_groupe_score*1+1)*100/(groupe.length+1);
      tabScore.push(new_score);
    };
    var inGroupe=false;
    var k=0;
    var temp_favorite=favoriteGroupe;
    while(!inGroupe){      
      var max=getMaxOfArray(tabScore);    
      var favoriteGroupe=tabScore.indexOf(max); 
      if(groupes[favoriteGroupe].length==max_par_groupe){
        if(k<=n){
          tabScore[favoriteGroupe]=getMinOfArray(tabScore); 
        }else{
          inGroupe=true;
          eleve.inGroupe=true;
          //if(!mixite){
            groupes[temp_favorite].push(eleve); 
            temp_groupes[temp_favorite].push(eleve.eleve_id); 
         // }
        } 
      }else{
        inGroupe=true;
        eleve.inGroupe=true;
        groupes[favoriteGroupe].push(eleve);  
        temp_groupes[favoriteGroupe].push(eleve.eleve_id);  
      } 
      k++;
    } 
  } 
}
return temp_groupes;
//generatedGroupes[essaie_nb]=generatedGroupes[essaie_nb]||[];
//generatedGroupes[essaie_nb]=generatedGroupes[essaie_nb].concat(temp_groupes);
// if(mixite){
//   cohesionGroupes[essaie_nb]= app.getCohesionGroupes(groupes,relations)*app.getMixiteGroupes(groupes,nb_filles_max)*app.getEquilibreGroupes(groupes,max_par_groupe);
// }else{
//   cohesionGroupes[essaie_nb]= app.getCohesionGroupes(groupes,relations)*app.getEquilibreGroupes(groupes,max_par_groupe);
// }
//essaie_nb++;
//}
//max=getMaxOfArray(cohesionGroupes); 
//favoriteGroupe=cohesionGroupes.indexOf(max);
//return generatedGroupes[favoriteGroupe];
};
app.setStudentsRelationsNb=function(eleves,relations){
  for (var i = eleves.length - 1; i >= 0; i--) {
   var eleve=app.getEleveById(eleves[i]);
   eleve.nbRelations=0;
 }
 for (var j = relations.length - 1; j >= 0; j--) {
  var relation=relations[j];

var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;


  if(value>0){
    if(app.currentClasse.eleves.indexOf(relation.socioRelation_from)){
      app.getEleveById(relation.socioRelation_from).nbRelations++;
    }
    if(app.currentClasse.eleves.indexOf(relation.socioRelation_to)){
     app.getEleveById(relation.socioRelation_to).nbRelations++;
   }
 }



}
}
app.getGroupeScore=function(eleve,groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var autre_eleve=groupe[i];
    for (var j = relations.length - 1; j >= 0; j--) {
      var relation=relations[j];

      if((relation.socioRelation_from==autre_eleve.eleve_id && relation.socioRlation_to==eleve.eleve_id) || (relation.socioRelation_from==eleve.eleve_id && relation.socioRelation_to==autre_eleve.eleve_id)){
    var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;
        score+=value;
      }
    };
  };
  return score;
};
app.relationsReciproques=function(eleve,groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var autre_eleve=groupe[i];
    var n=0;
    for (var j = relations.length - 1; j >= 0; j--) {
      var relation=relations[j];


var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;


  if(value>0){
        if((relation.socioRelation_from==autre_eleve.eleve_id && relation.socioRelation_to==eleve.eleve_id) || (relation.socioRelation_from==eleve.eleve_id && relation.socioRelation_to==autre_eleve.eleve_id)){
          n++;
          if(n%2==0 && n>0){          
           score+=value;
         }
       }
     }
   };
 };  
 return score;
}
app.relationsEleveGroupe=function(eleve,groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var autre_eleve=groupe[i];
    for (var j = relations.length - 1; j >= 0; j--) {
      var relation=relations[j];
      var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;

      if(value>0){
       if((relation.socioRelation_from==autre_eleve.eleve_id && relation.socioRelation_to==eleve.eleve_id) || (relation.socioRelation_from==eleve.eleve_id && relation.socioRelation_to==autre_eleve.eleve_id)){
        score++;
      }
    }
  };
};
return score;
}
app.countRelations=function(eleve,groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var autre_eleve=groupe[i];
    for (var j = relations.length - 1; j >= 0; j--) {
      var relation=relations[j];
      if((relation.socioRelation_from==autre_eleve.eleve_id && relation.socioRelation_to==eleve.eleve_id) || (relation.socioRelation_from==eleve.eleve_id && relation.socioRelation_to==autre_eleve.eleve_id)){
         var value=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;

        if(value>0){score++;}else{score--;}  



      }
    };
  };
  return score;
}
app.getScoreEntreGroupes=function(groupe,other_groupe,relations){
  var score=0;
  for (var i = groupe.length - 1; i >= 0; i--) {
    var eleve=groupe[i];
    score+=app.relationsEleveGroupe(eleve,other_groupe,relations);
  }
  return score;
}
// app.getCohesionGroupes=function(groupes,relations){
//   var score=0;
//   for (var j = 0,lng=groupes.length; j<lng; j++) {
//     var groupe=groupes[j];
//     for (var i = groupe.length - 1; i >= 0; i--) {
//       var eleve=groupe[i];  
//       score+=app.countRelations(eleve,groupe,relations);
//     }
//   }
//   return score;
// }
// app.getEquilibreGroupes=function(groupes,max_par_groupe){
//   var score=0;
//   for (var j = 0,lng=groupes.length; j<lng; j++) {
//     var groupe=groupes[j];
//     score+=Math.abs(max_par_groupe-groupe.length);  
//   }
//   return 100-score*100/max_par_groupe;
// }
// app.getMixiteGroupes=function(groupes,nb_filles_max){
//   var score=0;
//   for (var j = 0,lng=groupes.length; j<lng; j++) {
//     var groupe=groupes[j];
//     var nb_filles=0;
//     for (var i = groupe.length - 1; i >= 0; i--) {
//       var eleve=groupe[i];
//       if(eleve.eleve_genre=="F"){
//         nb_filles++;
//       }
//     }
//     score+=Math.abs(nb_filles_max-nb_filles); 
//   }
//   return 100-score*100/nb_filles_max;
// }
