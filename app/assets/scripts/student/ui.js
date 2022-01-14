var app=app || {};

app.studentEditView=function(){
	$('.eleve-page').css('display','none');
	$('#eleve-edit').css('display','');
	document.getElementById('eleve_infos_save').style.display = "none";	

	app.currentClasse=app.currentClasse||false;
	var eleve=app.currentEleve;
	eleve.delete_eleve_picture=false;

	//NOM et Prénom
	document.getElementById('eleve_nom').value=eleve.eleve_nom||"";
	document.getElementById('eleve_prenom').value=eleve.eleve_prenom||"";

	//Photo
	document.getElementById('eleve-picture-input').value="";
	app.studentPictureSet();
	jdenticon.update('.student-picture');

	app.titleRender('<a href="#classroom/'+app.currentClasse.classe_id+'">'+app.renderEleveNom(app.currentEleve)+'</a> / Édition');
}
