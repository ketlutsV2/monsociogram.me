var app=app || {}; 

app.initClassroomStudentsExport=function(){ 

  var classe=app.currentClasse;
  app.titleRender('<a href="#home">MonSociogram<span class="small">.me</span></a> / '+app.cleanClasseName(classe.classe_nom));
  $('.classroom-page').css('display','none');
  $('#classroom-main').css('display','none');
  $('#classe-export').css('display',''); 
  $('#classroom-toolbar').css('display','');
  app.classeExportRender();
}

app.classeExportRender=function(){
  var html=[];
  html.push('<table id="classroom-export-table">');
  html.push('<thead>');
  html.push('<tr>');  
  html.push("<th class='large-screen'><input type='checkbox' onchange='app.studentsCheckAll(this.checked);' class='btn btn-control'/></th>"); 
  html.push("<th>ID</th>"); 
  html.push("<th>NOM</th>"); 
  html.push('<th>Prénom</th>'); 
  html.push('</tr>');
  html.push('</thead>');    
  html.push('<tbody>');
  for (var i = app.currentClasse.eleves.length - 1; i >= 0; i--) {
   var eleve= app.getEleveById(app.currentClasse.eleves[i]);
   html.push('<tr onclick="app.go(\'student/'+eleve.eleve_id+'/edit\');">');
   html.push("<td class='large-screen'><input id='student_"+eleve.eleve_id+"_checkbox' type='checkbox' onchange='app.studentsSelectedCount();' class='btn btn-control'/></td>"); 
   html.push('<td>');
   html.push(eleve.eleve_id);
   html.push('</td>');  
   html.push('<td>');
   html.push(eleve.eleve_nom.toUpperCase());
   html.push('</td>');
   html.push('<td>');
   html.push(ucfirst(eleve.eleve_prenom));
   html.push('</td>');
   html.push('</tr>');
 };
 html.push('</tbody>');
 html.push("</table>");
 document.getElementById("classe-export-div").innerHTML=html.join('');
 $('#classroom-export-table').dataTable({

  dom:'Bft',
  responsive:true,
  colReorder: true,
  columnDefs: [
  { responsivePriority: 1, targets: 1 },
  { responsivePriority: 2, targets: 2 },
  { responsivePriority: 3, targets: 3 }
  ],
  buttons: [

  ],
  stateSave: true,
  "language":app.datatableFR,
  "lengthMenu": [[-1,10, 25, 50], ["Tous",10, 25, 50]],
  "order":[[3,'asc']],
  "autoWidth": false
});
 $('#classroom-export-table').addClass('table table-striped ');
 $('.dataTables_filter input').attr('placeholder', 'Recherche').removeClass('input-sm');
 app.studentsSelectedCount();
 if(app.currentClasse.eleves.length==0){
  $('.ifCohortes').addClass('d-none');
}else{
 $('.ifCohortes').removeClass('d-none'); 
}
}

app.studentsCheckAll=function(checked){
  for (var i = 0, lng=app.currentClasse.eleves.length ; i<lng; i++){
   var eleve_id= app.currentClasse.eleves[i];
   if(document.getElementById("student_"+eleve_id+"_checkbox")){ 
    document.getElementById("student_"+eleve_id+"_checkbox").checked=checked;
  }
}
app.studentsSelectedCount();  
}

app.studentsSelectedCount=function(){
  var n=0;
  for (var i = 0, lng=app.currentClasse.eleves.length ; i<lng; i++){
   var eleve= app.getEleveById(app.currentClasse.eleves[i]);
   if(document.getElementById("student_"+eleve.eleve_id+"_checkbox")){     
    if(document.getElementById("student_"+eleve.eleve_id+"_checkbox").checked){
      n++;
    }
  }
}
if(n>0){
  $('#student-selected-bloc').css('display','');
  $('#student-selected-nb').html(n +" personne"+app.pluralize(n,'s'));
}else{
  $('#student-selected-bloc').css('display','none');
}
}