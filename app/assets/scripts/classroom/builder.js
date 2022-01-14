var app=app || {};

app.getClasseById=function(classe_id) {
  var classes=app.classes;
  for (var i = 0, lng = classes.length; i < lng; i++) {
    if (classes[i].classe_id == classe_id) {
      classes[i].num=i;     
      return classes[i];
    }
  }
  return false;
};

app.loadClasses=function(classes){  
  app.classes=classes;
  var n_classe={
    classe_nom:"~Toutes les personnes~",
    classe_id:'-1',
    controles:[],
    eleves:[],
    sociogrammes:[],
    groupes:[],
    classe_destinataires:[],
    classe_intelligences:false
  };

  app.classes.push(n_classe);  

  var n_classe={
    classe_nom:"~Non classées~",
    classe_id:'-2',
    controles:[],
    eleves:[],
    sociogrammes:[],
    groupes:[],
    classe_destinataires:[],
    classe_intelligences:false
  }   
  
  app.classes.push(n_classe);  

  app.classes=app.orderBy(app.classes,'classe_nom','ASC');

  app.setColorClasses();
  app.homeBuildClassesListes();

  if(app.classes.length==2 || app.eleves.length==0){
    $('.ifCohortes').addClass('d-none');
  }else{
   $('.ifCohortes').removeClass('d-none'); 
 }

}

app.homeBuildClassesListes=function(){
  var currentFirstLetter = "";
  var classes=[];
  var family=[];

  for (var i = 0, lng=app.classes.length ; i < lng; i++) {
    var classe=app.classes[i];
    if(classe.classe_id<0){continue;}

    var firstLetter = classe.classe_nom.charAt(0);
    if (firstLetter != currentFirstLetter) {
     currentFirstLetter = firstLetter;
     if(family.length>0){classes.push(family);}   
     family=[classe]; 
   }else{
    family.push(classe);
  }
}
classes.push(family);
app.homeClassesListe=classes;
}

app.setColorClasses=function(){
  var k=0;
  var nb=app.classes.length+1;
  for (var i = 0, lng = app.classes.length; i < lng; i++) {
    var classe=app.classes[i];
    classe.visible=true;
    var color="#ffffff";    
    var p=(k/nb)*100;
    var fctAffineNum=Math.floor(p/(100/6));
    var n=Math.round((p*100/((fctAffineNum+1)*(100/6)))/100*255);
    if(fctAffineNum%2==1){
      n=255-n;
    }
    n=n.toString(16);
    if(n.length<2){
      n="0"+n;
    }
    if(fctAffineNum==0){
      color="#ff00"+n;
    }
    else if(fctAffineNum==1){
      color="#"+n+"00ff";
    }
    else if(fctAffineNum==2){
      color="#00"+n+"ff";
    }
    else if(fctAffineNum==3){
      color="#00ff"+n;
    }
    else if(fctAffineNum==4){
      color="#"+n+"ff00";
    }
    else if(fctAffineNum==5){
      color="#ff"+n+"00";
    }
    classe.color=color;
    k++;
  }  
}

app.buildClassroomStudent=function(){
  var data=app.elevesByClasses;
  var all=[];
  for (var i = app.classes.length - 1; i >= 0; i--) {
    app.classes[i].eleves=[];
  }
  for (var i =data.length - 1; i >= 0; i--) {
    var classe=app.getClasseById(data[i]['rec_classe']);
    if(!classe){
      continue;
    }
    classe.eleves.push(data[i]['rec_eleve']);
    all.push(data[i]['rec_eleve']);
  }   

  var non_classes=[];
  for (var i = app.eleves.length - 1; i >= 0; i--) {
    if(all.indexOf(app.eleves[i].eleve_id)<0){
      app.classes[app.classes.length-2].eleves.push(app.eleves[i].eleve_id);
    }
  }
}

app.buildClassroomGroups=function(){
  var data=app.userConfig.groupes;
  for (var i = app.classes.length - 1; i >= 0; i--) {
    var classe=app.classes[i];
    classe.groupes=[];    
    var girls=[];
    var boys=[];
    var eleves=classe.eleves;
    for (let i = eleves.length - 1; i >= 0; i--) {
     var eleve=app.getEleveById(eleves[i]);
     if(eleve.eleve_genre=="F"){
      girls.push(eleves[i]);
    }
    else if(eleve.eleve_genre=="G"){
      boys.push(eleves[i]);
    }
  }
  classe.groupes.push({
    groupe_name:"Cohorte entière ("+eleves.length+")",
    groupe_data:JSON.stringify({'eleves':[eleves]})
  });
  classe.groupes.push({
    groupe_name:"Filles/Garçons",
    groupe_data:JSON.stringify({'eleves':[girls,boys]})
  });
  classe.groupes.push({
    groupe_name:"Filles ("+girls.length+")",
    groupe_data:JSON.stringify({'eleves':[girls]})
  });
  classe.groupes.push({
    groupe_name:"Garçons ("+boys.length+")",
    groupe_data:JSON.stringify({'eleves':[boys]})
  });
}
for (var i =data.length - 1; i >= 0; i--) {
  var classe=app.getClasseById(data[i].groupe_classe);
  if(!classe){
    continue;
  }
  classe.groupes.push(data[i]);
}
}