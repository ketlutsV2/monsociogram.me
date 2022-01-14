var app=app || {};

app.sociogrammeStudentForm=function(eleve_id){
	if(app.onMobile()){
		$('.sociogramme-bloc').css('display','none');
		app.show('sociogramme-main','flex');
	}
	
	app.show('sociogramme-student-form-block');
	app.sociogrammeCurrentStudent=eleve_id;
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	var eleve=app.getEleveById(eleve_id);
	var questions=jsonParse(sociogramme.sociogramme_questions);
	var eleve_relations=[];
	var html=[];

	var template = $('#template-sociogrammes-relations-form').html();
	var rendered = Mustache.render(template, {
		questions:questions,
		eleves:app.sociogramme.eleves,
		"isVisible":function(){
			return true;
		},
		"eleve_nom_prenom":function(){
			var eleve=app.getEleveById(this);
			return ucfirst(eleve.eleve_prenom)+" "+eleve.eleve_nom.toUpperCase();
		},
		"eleve_id":function(){
			return this;
		},
		"points":function(){
			return this.question_points+' point'+app.pluralize(this.question_points,'s');
		}
		
	});
	html.push(rendered); 
	$('#sociogramme-student-form').html(html.join(''));
	var relations= app.sociogramme.relations;
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i];
		if(relation.socioRelation_from==eleve_id){
			document.getElementById('socioRelation_'+relation.socioRelation_question).value=relation.socioRelation_to;
		}
	}
	document.getElementById('sociogrammeCurrentStudentSelect').value=eleve_id;
}

app.saveRelations=function(){
	if (!app.checkConnection()) {
		return;
	}	
	var eleve_id=app.sociogrammeCurrentStudent;
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	var questions=jsonParse(sociogramme.sociogramme_questions);
	var relations=[];
	for (var i = questions.length - 1; i >= 0; i--) {
		var question_id=questions[i].question_id;
		var relation={
			question_id:question_id,
			from:eleve_id,
			to:document.getElementById('socioRelation_'+question_id).value
		};
		relations.push(relation);
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=updateRelations", {
		eleve_id:eleve_id,
		sociogramme_id:app.sociogramme.current,
		relations:JSON.stringify(relations),			
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	},function(data) {
		app.render(data);  
		app.getClasseSociogramme({mode:app.sociogramme.mode});
		app.sociogrammeSave();
		app.sociogrammeNoRelationsBtn();
	});
}

app.sociogrammeRelationsReset=function(confirm){
	if (!app.checkConnection()) {return;}
	if(app.sociogrammeCurrentClasse==null){
		return;
	}
	if(app.sociogramme.current==null){
		return;
	}
	if(!confirm){
		app.alert({title:'Supprimer toutes les relations pour cette cohorte ?',icon:'confirm'},function(){app.sociogrammeRelationsReset(true);});
		return;
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=deleteAllRelations", {
		eleves:JSON.stringify(app.sociogramme.eleves),
		sociogramme_id:app.sociogramme.current,		
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	},function(data) {
		app.render(data);  
		app.hide('sociogramme-student-form-block');		
		app.getClasseSociogramme({mode:app.sociogramme.mode});
		app.sociogrammeElevesPositionsReset(true);
		app.sociogrammeSave();
		app.sociogrammeNoRelationsBtn();
	});
}