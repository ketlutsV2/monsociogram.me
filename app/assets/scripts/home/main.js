var app=app || {};

app.homeInit=function(){
  app.viewClear();
  app.currentView="home";
  app.currentClasse=null;
  app.currentEleve=null;

  $(".template_home").css("display","flex");
  app.titleRender('MonSociogram<span class="small">.me</span>');
  
  app.spineRender();

  document.getElementById('home-memo').value=app.getMemo('home',0)||'';
  $('#home-memo').css('height','auto');
  $('#home-memo').css('height',document.getElementById('home-memo').scrollHeight+'px');


  app.pluginsLauncher('homeAfterRender');
};

app.homeViews=function(view){
  app.homeClassesInit();
  
  /*if(view!=app.userConfig.homeCurrentView){
    app.userConfig.homeCurrentView=view;
    app.pushUserConfig();
  } */
}