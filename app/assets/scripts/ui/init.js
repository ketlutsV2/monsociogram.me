var app=app || {};

app.uiInit=function(){
  app.loadUi++;

  if(app.hebergeur.mail!=""){
    $('#footer-hebergeur').html(' | Hébergé par <a href="mailto:'+app.hebergeur.mail+'">'+app.hebergeur.nom+'</a>');
  }
  
  document.getElementById('footer-version').innerHTML=app.version;


  window.onresize = app.windowResize;

  document.getElementById('sociogramme-canvas').addEventListener('wheel', app.sociogrammeWheel);

  document.getElementById('app').onclick=function(e){

 }


document.getElementById('spine_pages').addEventListener('click', event => {
  app.spineNextPage();
});
document.querySelectorAll(".petale").forEach(function(petale){
  petale.addEventListener('click',function(){
    if(this.classList.contains("petale-disabled")){
      return;
    };
    app.go(this.getAttribute('data-url'));
  });
});

document.querySelectorAll(".spine_icon").forEach(function(petale){
  petale.addEventListener('click',function(){
    if(this.classList.contains("petale-disabled")){
      return;
    };
    app.go(this.getAttribute('data-url'));
  });
});


$.get(app.serveur + "index.php?go=school&q=getAll", function(data) {
  app.render(data);         
}
); 


}