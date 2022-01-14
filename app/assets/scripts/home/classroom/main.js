var app=app || {};

app.homeClassesInit=function(){
  $('.home-page').css('display','none');
  $('#home-classrooms').css('display','');
  $('#home-aside').css('display','');
  $('#home-classrooms-liste').css('display','');
  app.homeClassesRender();

}

app.homeClassesRender=function(){
 var classes=app.homeClassesListe;
 
 if(app.classes.length>2){
  $('#cohortes-liste-bloc').css("display","");
}
else{
  $('#cohortes-liste-bloc').css("display","none");
}

var template = $('#template-home-classes').html();
var rendered = Mustache.render(template, {
  classes:classes,
  "classeNbEleves":function(){
    return this.eleves.length;
  },
  "classeNom":function(){
    return app.cleanClasseName(this.classe_nom);
  },
  "hasEleves":function(){
    if(this.eleves.length>0){
      return true;
    }
    return false;
  }
});
document.getElementById('home-classrooms-liste').innerHTML=rendered;

}