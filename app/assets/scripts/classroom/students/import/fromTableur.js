var app=app || {}; 

app.importFromTableur=function(){  
  var tab=document.getElementById('import-tableur').value;
  var split=tab.split('\n');
  for (var i = split.length - 1; i >= 0; i--) {
   var eleve_tab=split[i];
   var eleve=eleve_tab.split('\t');
   app.elevesAddInputRender({eleve_nom:eleve[0],eleve_prenom:eleve[1],eleve_id:false,eleve_genre:eleve[2],eleve_birthday:eleve[3]});
 };
 $('#import-tableur-btn').button('reset');
}