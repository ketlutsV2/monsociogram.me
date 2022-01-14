var app=app || {};

app.sociogrammesInitView=function(){
	app.viewClear(); 
	app.currentView="sociogrammes";
	$('.template_sociogrammes').css('display','flex');
	$('.sociogramme-bloc').css('display','none');
	app.show('sociogramme-main','flex');
	app.show('sociogramme-render','flex');
	app.show('sociogramme-toolbar','flex');
	app.hide('sociogramme-smalltoolbar');
	app.hide('classroom-sociogramme-synthese-box');
	app.hide('sociogramme_form');
	app.hide('sociogramme-options');
	$('.sociogrammes-classes-toolbar').css('display','none');

	if(app.userConfig.sociogrammeViewRangs){
		document.getElementById('sociogrammeViewRangs').checked="checked";
		$('.sociogramme-rangs').css('display','block');
	}
	else{
		document.getElementById('sociogrammeViewRangs').checked="";	
		$('.sociogramme-rangs').css('display','none');
	}

	app.sociogramme.current=null;	
	app.sociogrammeEdition=false;
	app.sociogramme.height=$('#classroom-sociogramme').height();
	app.sociogramme.centerX=app.sociogramme.height/2;
	app.sociogramme.centerY=app.sociogramme.height/2;	

	app.sociogrammeNoRelationsBtn();



}

app.sociogrammesSelectRenderInit=function(classe_id){
	var classe=app.getClasseById(classe_id);
	let button='';
	if(app.onMobile()){
		button=' <button class="btn btn-light small-screen ms-2"  onclick="app.go(\'#classroom/'+app.sociogrammeCurrentClasse+'\');">\
		<span class="bi bi-gear"></span>\
		</button >';
	}
	app.titleRender('<a href="#home">MonSociogram<span class="small">.me</span></a> / '+app.cleanClasseName(classe.classe_nom) + button);
	app.sociogrammesSelectRender();
}

app.sociogrammeToggle=function(sociogramme_id){
	$('#sociogramme-main').css('display','');
	$('.sociogramme-classe').css('display','none');
	
	var sociogramme=app.getSociogrammeById(sociogramme_id);

	app.titleRender("<a href='#sociogrammes'>MonSociogram<span class='small'>.me</span></a> / "+ucfirst(sociogramme.sociogramme_name));

	$('#questionnaires-liste-bloc').css('display','none');
	$('#sociogrammes-tab').css('display','none');
	$('#sociogrammes-create-button').css('display','none');
	app.hide('sociogramme-student-form-block');
	app.hide('sociogramme_form');
	app.hide('sociogramme-scissors-btn');
	app.hide('sociogramme-sociogroups-btn');
	app.sociogramme.current=sociogramme_id;
	app.sociogrammeFilterSelectInit();	
	app.sociogrammeByClasse(app.sociogrammeCurrentClasse);
}

app.sociogrammeByClasse=function(classe_id){
	app.sociogrammeCurrentClasse=classe_id;
	$('.sociogramme-bloc').css('display','none');
	app.show('sociogramme-toolbar','flex');
	app.show('sociogramme-main','flex');

	app.show('sociogramme-render','flex');
	$('.sociogrammes-classes-toolbar').css('display','');
	app.getClasseSociogramme({mode:'students'});
	app.classroomGroupsFormRender();
	app.classroomGroupsSelectSaveRender(); 
	app.groupesInfoUpdate();
}

app.getClasseSociogramme=function(options){
	options=options||{};
	if(options.classe_id!=null){
		app.sociogrammeCurrentClasse=options.classe_id;
	}
	if(options.sociogramme_id!=null){
		app.sociogramme.current=options.sociogramme_id;
	}
	app.sociogramme.mode=options.mode||app.sociogramme.mode;
	app.sociogrammeEdition=false;

	$('.sociogramme-classe').css('display','');

	app.show('classroom-sociogramme');
	app.show('sociogramme-sociogroups-btn');
	app.show('sociogramme-smalltoolbar');
	if(app.onMobile()){
		app.hide('sociogramme-options');
	}else{
		app.show('sociogramme-options');
	}
$('#home-tutoriel').css('display','none');
	app.tutoIsEnable=false;
	//app.titleRender("Sociogrammes");
	$('#questionnaires-liste-bloc').css('display','none');	
	$('#sociogrammes-create-button').css('display','none');
	document.getElementById('sociogrammes-tab').innerHTML='';
	document.getElementById('classroom-sociogramme-synthese').innerHTML="";
	app.currentClasse=app.getClasseById(app.sociogrammeCurrentClasse);

	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	app.sociogramme.relations=app.getSociogrammeRelations(classe.classe_id);

	if(app.sociogramme.relations.length>0){
		$('#sociogramme-scissors-btn').css('display','');
	}else{
		app.hide('sociogramme-scissors-btn');
	}
	
	app.titleRender("<a href='#home'>MonSociogram<span class='small'>.me</span></a> / <a href='#sociogrammes/"+classe.classe_id+"'>"+app.cleanClasseName(classe.classe_nom)+"</a> / "+ucfirst(app.getSociogrammeById(app.sociogramme.current).sociogramme_name));

	app.sociogramme.eleves=classe.eleves;

	if(app.sociogramme.mode=="students"){	
		app.sociogramme.vue="classe_"+classe.classe_id;
		app.setElevesRang(app.sociogramme.eleves,app.sociogramme.relations);
		app.sociogramme.rangs=app.getRangs(app.sociogramme.eleves);
		if(document.getElementById('sociogrammeViewRangs').checked){
			app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
		}
		else{
			app.sociogrammeLoadSave();	
		}	
		$('.sociogramme-option').css('display','');
	}
	else{
		$('.sociogramme-option').css('display','none');
		$('#sociogramme-sociogroups-btn').css('display','');
		app.setElevesPositionsByGroupes();
	}	
	app.sociogrammeAdaptativeZoom();
	app.sociogrammeSave();
	app.sociogrammeNoRelationsBtn();
}

app.sociogrammeNoRelationsBtn=function(){
	if(!app.sociogramme.current || app.sociogrammeCountRelations(app.sociogrammeCurrentClasse,app.sociogramme.current)>0){
		$('#sociogramme_noRelations').css('display','none');
	}
	else{
		$('#sociogramme_noRelations').css('display','');	
	}
}