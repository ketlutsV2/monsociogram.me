var app=app || {};

app.renameClasse=function(){
  if (!app.checkConnection()) {
    return;
  }


  swal({
    text: 'Nouveau nom ?',
    icon:'warning',
    content: {
      element: "input",
      attributes: {
        placeholder: "6ème A"
      },
    },
    button: {
      text: "Enregistrer",
      closeModal: false,
    } 
  })
  .then(
    (name) => {
     if(name===null){ 
       app.go('classroom/'+app.currentClasse.classe_id+'/config');
       return;
     }
     if (app.trim(name)=="") {
       swal("Il faut indiquer un nom de cohorte.", {
        icon: "error",
      }).then(valid=>{
       
        app.renameClasse();
      }
      );


      return;
    }
    var classe=app.currentClasse;
    $.post(app.serveur + "index.php?go=classe&q=update",
    {
      classe_nom:name,
      classe_id:classe.classe_id,
      sessionParams:app.sessionParams
    }, function(data) {
      app.render(data); 
      app.go('home');
      if(app.onMobile()){
        app.spineGoToPageByURL('classroom/'+classe.classe_id);
      }
      swal("Cohorte renommée !", {
        icon: "success",
      });
      setTimeout(function(){
       swal.close();
     },1500);
    }
    );

  }
  );

};

app.deleteClasse=function(confirm) {
  if (!app.checkConnection()) {
    return;
  }
  if(!confirm){
    app.alert({title:'Voulez-vous vraiment supprimer cette cohorte ?',icon:'confirm'},function(){app.deleteClasse(true);});
    return;
  }
  $.post(app.serveur + "index.php?go=classe&q=delete",
  {
    classe_id:app.currentClasse.classe_id,
    sessionParams:app.sessionParams
  }, function(data){
    app.render(data);  
    app.go('home');  
  });
};