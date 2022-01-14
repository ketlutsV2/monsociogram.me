var app=app || {};

app.renderGroupSave=function(){
  swal({
    text: 'Quel nom pour ces groupes ?',
    icon:'warning',
    content: {
      element: "input",
      attributes: {
        placeholder: "Groupes A et B"
      },
    },
    button: {
      text: "Enregistrer",
      closeModal: false,
    } 
  })
  .then(
    (name) => {
     if(name===null){ throw null;}
     if (app.trim(name)=="") {
       swal("Il faut indiquer un nom.", {
        icon: "error",
      }).then(valid=>{
        app.renderGroupSave()}
        );

      return;
    }
    var groupe_data={
      'eleves':app.currentClasse.currentGroupes,
      'sociogramme_id':app.currentGroupe.sociogramme_id||null
    };

    $.post(app.serveur + "index.php?go=groupes&q=add",
    {
      groupe_name:name,
      classe_id:app.currentClasse.classe_id,
      groupe_data:JSON.stringify(groupe_data),
      time:Math.floor(app.myTime()/1000),
      sessionParams:app.sessionParams
    },
    function(data) {
     app.render(data);
      // app.renderClasseGroupesSelect();
      if(!app.currentClasse.currentGroupesNum){
        app.currentClasse.currentGroupesNum=0;
      }
//      document.getElementById('classroom-students-toolbar-selectGroup').value=app.currentClasse.currentGroupesNum;
app.classroomGroupsSelectSaveRender();
swal("Groupes enregistrés !", {
  icon: "success",
});
setTimeout(function(){
 swal.close();
},1500); 
}
);
  }
  );
}

app.classroomGroupLoad=function(value){
  if(value==-1){
    return;
  }
  var data=jsonParse(app.currentClasse.groupes[value].groupe_data);

  app.getClasseById(app.sociogrammeCurrentClasse).currentGroupes=data.eleves;

  app.getClasseSociogramme({
    mode:'groups',
    classe_id:app.sociogrammeCurrentClasse,
    sociogramme_id:app.sociogramme.current
  });

}

app.classroomGroupDelete=function(groupe_num,confirm){
  if(!confirm){
    app.alert({title:'Supprimer "'+app.currentClasse.groupes[groupe_num].groupe_name+'" ?',icon:'confirm'},function(){app.classroomGroupDelete(groupe_num,true);});
    return;
  }
  if(app.currentClasse.currentGroupesNum==groupe_num){
    app.currentClasse.currentGroupesNum=0;
  }
  $.post(app.serveur + "index.php?go=groupes&q=delete",
  {
    classe_id:app.currentClasse.classe_id,
    groupe_id:app.currentClasse.groupes[groupe_num].groupe_id,
    sessionParams:app.sessionParams
  }, function(data) {
    document.getElementById("classroom-groupes-liste").innerHTML='';
    app.currentClasse.currentGroupes=[];
    app.render(data);  
    app.classroomGroupsSelectSaveRender();
    if(!app.currentClasse.currentGroupesNum){
      app.currentClasse.currentGroupesNum=0;
    }
  }
  );
}

app.classroomGroupsSelectSaveRender=function(){
  var groupes=app.currentClasse.groupes;
  var lng=groupes.length;
  var n=0;
  var html=[];
  html.push('<ul id="classroom-groupes-save-list">');
  for (var i = 0; i <lng; i++) {
    if(!groupes[i].groupe_id){
      continue;
    }
    n++;
    html.push('<li>');
    html.push('<button class="btn btn-sm btn-light" onclick="app.classroomGroupLoad(\''+i+'\');"><span class="bi bi-chevron-left"></span></button>');
    html.push('<span class="groupes-save-name">'+groupes[i].groupe_name+'</span>');
    html.push('<button class="btn btn-sm btn-light float-right" onclick="app.classroomGroupDelete(\''+i+'\');"><span class="bi bi-x"></span></button>');
    html.push('</li>');
  };
  html.push('</ul>');
  if(n==0){
   document.getElementById('classroom-groupes-save-bloc').style.display='none';
   return;
 }
 else{
   document.getElementById('classroom-groupes-selectSave').innerHTML=html.join('');
   document.getElementById('classroom-groupes-save-bloc').style.display='';
 } 
}