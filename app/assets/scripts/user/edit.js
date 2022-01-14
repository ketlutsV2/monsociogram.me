var app=app || {};

app.userUPD=function(options){
 if (!app.checkConnection()) {return;}
 options=options||{};
 var mail=document.getElementById('user_mail').value;
 var nom=document.getElementById('user_nom').value;
 var prenom=document.getElementById('user_prenom').value;
 var old_passe=document.getElementById('user_old_passe').value;
 var new_passe=document.getElementById('user_new_passe').value;
 var new_passe_bis=document.getElementById('user_new_passe_bis').value;
 $.post(app.serveur + "index.php?go=users&q=update",{
   mail:mail,
   old_passe:old_passe,
   new_passe:new_passe,
   new_passe_bis:new_passe_bis,
   nom:nom,
   prenom:prenom,
   user_id:app.userConfig.userID,
   sessionParams:app.sessionParams
 }, function(data) {
   app.render(data);         
   $("#btn_save_config").button('reset');
   app.hide('btn_save_config');
   app.userInfosHeaderRender();
 }
 );
};
