var app=app || {};

app.renderClasseAdd=function(){ 
  if (!app.checkConnection()) {return;}

  swal({
    text: 'Nom de la nouvelle cohorte ?',
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
      app.go('home');
      return;
    }
    if (app.trim(name)=="") {
     swal("Il faut indiquer un nom de cohorte.", {
      icon: "error",
    }).then(valid=>{
     
      app.renderClasseAdd();
    }
    );
    return;
  }
  app.go('home');
  app.classeAdd(name); 
}
);
};

app.classeAdd=function(classeNom) {
  if (!app.checkConnection()) {
    return;
  }  
  $.post(app.serveur + "index.php?go=classe&q=add",{
    classe_nom:classeNom,
    sessionParams:app.sessionParams
  },function(data){
    app.render(data);
//      app.tutoSetStep();  
    swal("Cohorte créée !", {
      icon: "success",
    });
    setTimeout(function(){
     swal.close();
   },1500); 
    
  } );  
};