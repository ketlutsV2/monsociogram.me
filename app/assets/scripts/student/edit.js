var app=app || {};

app.studentDelete=function(confirm) {
	if (!app.checkConnection()) {
		return;
	}
	if(!confirm){
		app.alert({title:'Supprimer cette personne et TOUTES SES RELATIONS ?',icon:'confirm'},function(){app.studentDelete(true);});
		return;
	}
	$.post(app.serveur + "index.php?go=eleves&q=delete",{
		eleves:JSON.stringify([app.currentEleve.eleve_id]),
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	},function(data){
		if(app.currentClasse){
			app.go('classroom/'+app.currentClasse.classe_id);
		}else{
			app.go('home');
		}
		app.render(data);
	});
};

app.studentsDelete=function(confirm){
	if (!app.checkConnection()) {
		return;
	}
	var ids=[];
	for (var i = 0, lng=app.currentClasse.eleves.length ; i<lng; i++){
		var eleve= app.getEleveById(app.currentClasse.eleves[i]);   
		if(document.getElementById("student_"+eleve.eleve_id+"_checkbox").checked){
			ids.push(eleve.eleve_id);
		}
	}
	if(ids.length>0){
		if(!confirm){
			app.alert({title:'Supprimer ce'+app.pluralize(ids.length,'s','tte')+' personne'+app.pluralize(ids.length,'s','')+' et TOUTES '+app.pluralize(ids.length,'LEURS','SES')+' RELATIONS ?',icon:'confirm'},function(){app.studentsDelete(true);});
			return;
		}
		$.post(app.serveur + "index.php?go=eleves&q=delete",{
			eleves:JSON.stringify(ids),
			time:Math.floor(app.myTime()/1000),
			sessionParams:app.sessionParams
		},function(data){
			app.render(data);
			app.classeExportRender();
		});
	}
}