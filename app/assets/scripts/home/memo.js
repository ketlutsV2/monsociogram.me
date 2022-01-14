var app=app || {};

app.homeMemoSave=function(){
  if (!app.checkConnection()) {return;}
  var data=$('#home-memo').val();
  app.setMemo('home',0,data); 
}