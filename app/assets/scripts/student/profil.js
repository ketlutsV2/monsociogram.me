var app=app || {};

app.renderEleveInfos=function(){
	document.getElementById('eleve_infos_save').style.display = "none";	
	var eleve=app.currentEleve;
	eleve.delete_eleve_picture=false;

	//Photo
	document.getElementById('eleve-picture-input').value="";
	app.studentPictureSet();
	jdenticon.update('.student-picture');
	
	//NOM et Prénom
	document.getElementById('eleve-nom').innerHTML =app.renderEleveNom(eleve);
	document.getElementById('eleve_nom').value=eleve.eleve_nom||"";
	document.getElementById('eleve_prenom').value=eleve.eleve_prenom||"";
}

app.renderEleveInfosEdit=function(){
	app.renderEleveInfos();
	$('#eleve_infos_save_btn').button('reset');
}

app.eleveInfosUpdate=function(){
	if (!app.checkConnection()) {
		$('#eleve_infos_save_btn').button('reset');
		return;
	}
	var eleve_nom=document.getElementById('eleve_nom').value;
	var eleve_prenom=document.getElementById('eleve_prenom').value;
	if(eleve_nom=="" && eleve_prenom==""){
		app.alert({title:"Le NOM et le Prénom ne peuvent pas être vides."});
		$('#eleve_infos_save_btn').button('reset');
		return;
	}
	app.currentEleve.eleve_nom=eleve_nom;
	app.currentEleve.eleve_prenom=eleve_prenom;
	
	$.post(app.serveur + "index.php?go=eleves&q=update&eleve_id="+app.currentEleve.eleve_id,
	{
		eleve_statut:'',
		eleve_nom:eleve_nom,
		eleve_prenom:eleve_prenom,
		eleve_birthday:'',
		eleve_genre:'',
		sessionParams:app.sessionParams
	},
	function(data) {
		app.render(data);   
		app.renderEleveInfosEdit(); 
	});
	app.studentPictureSave();
}
