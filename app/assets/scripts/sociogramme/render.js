var app=app || {};

app.sociogrammesSelectRender=function(){
	$('#questionnaires-liste-bloc').css('display','');
	$('#sociogrammes-tab').css('display','');
	$('#sociogrammes-create-button').css('display','');

	//MES SOCIOGRAMMES
	var html=[];
	var sociogrammes=app.sociogrammes;
	sociogrammes=app.orderBy(sociogrammes,'sociogramme_date','ASC');
	
	if(sociogrammes.length==0){
		$('#sociogramme-render').css('display','none');
	}else{
		$('#sociogramme-render').css('display','');
	}

	for (var i = sociogrammes.length - 1; i >= 0; i--) {
		var sociogramme=sociogrammes[i];
		html.push('<div class="sociogramme-box" onclick="app.go(\'sociogrammes/'+app.sociogrammeCurrentClasse+'/'+sociogramme.sociogramme_id+'\');">');
		html.push('<div class="text-center">');
		html.push('<span class="sociogramme-box-title">'+ucfirst(sociogramme.sociogramme_name)+'</span>');
		html.push('</div>');
		html.push('<br/>');
		
		var questions=jsonParse(sociogramme.sociogramme_questions);
		html.push(questions.length+ ' question'+app.pluralize(questions.length,'s'));
		html.push('  <button class="btn btn-light me-2 btn-sm" onclick="event.stopPropagation();app.go(\'sociogrammes/'+app.sociogrammeCurrentClasse+'/'+sociogramme.sociogramme_id+'/edit\');" title="Éditer les questions"><span class="bi bi-pencil-square"></span></button> ');
		html.push('<button class="btn btn-light mt-3" onclick="event.stopPropagation();app.go(\'sociogrammes/'+app.sociogrammeCurrentClasse+'/'+sociogramme.sociogramme_id+'\');" title="Commencer."><span class="bi bi-bullseye"></span> Commencer</button> ');
		html.push('</div>');
		html.push('</div>');
	}
	document.getElementById('questionnaires-liste').innerHTML=html.join('');

	//OUVERTS RECEMMENT
	var n=0;
	var html=[];
	var saves=app.sociogrammesSaves;
	saves=app.orderBy(saves,'sociogrammeSave_date','ASC');
	html.push('<div class="bold text-start mb-2"><span class="bi bi-arrow-return-right"></span>  Utilisés récemment</div>');

	for (var i = saves.length - 1; i >= 0; i--) {
		var save=saves[i];
		var sociogramme=app.getSociogrammeById(save.sociogrammeSave_sociogramme);

		var classe=app.getClasseById(save.sociogrammeSave_classe);
		if(classe.classe_id!=app.sociogrammeCurrentClasse){
			continue;
		}
		var nbRelations=app.sociogrammeCountRelations(save.sociogrammeSave_classe,save.sociogrammeSave_sociogramme);
		n++;
		
		html.push('<div class="sociogramme-box" onclick="app.go(\'sociogrammes/'+save.sociogrammeSave_classe+'/'+save.sociogrammeSave_sociogramme+'\');">');
		html.push('<div class="text-center">');
		html.push('<span class="sociogramme-box-title" >'+ucfirst(sociogramme.sociogramme_name)+'</span>');
		html.push('</div>');
		html.push('<img src="'+save.sociogrammeSave_picture+'" width="100" class="mb-1"/>');
		
		if(nbRelations>0){			
			html.push(nbRelations+ ' relation'+app.pluralize(nbRelations,'s'));
		}
		else{
			html.push('Aucune relation');
		}
		html.push('<button class="btn btn-light mt-2" onclick="event.stopPropagation();app.go(\'sociogrammes/'+app.sociogrammeCurrentClasse+'/'+sociogramme.sociogramme_id+'\');" title="Commencer."><span class="bi bi-bullseye"></span> Commencer</button> ');

		html.push('</div>');
		html.push('</div>');
	}

	html.push('<hr/>');
	if(n==0){
		$('#sociogrammes-tab').html('');
		return;
	}
	document.getElementById('sociogrammes-tab').innerHTML=html.join('');
};