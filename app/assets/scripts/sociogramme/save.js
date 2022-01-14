var app=app || {};

app.sociogrammeSave=function(){
	if (!app.checkConnection()) {return;}

	if(app.sociogramme.mode=="groups"){		
		return;
	}else{
		if(document.getElementById('sociogrammeViewRangs').checked){
			app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
			app.sociogrammeRenderInit();
			return;
		}
	}
	
	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	var save={};
	save.eleves=null;
	if(!document.getElementById('sociogrammeViewRangs').checked){
		var eleves_positions=[];
		for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
			var eleve=app.getEleveById(app.sociogramme.eleves[i]);
			eleves_positions.push({
				eleve_id:eleve.eleve_id,
				coordR:eleve.sociogramme[app.sociogramme.vue].coordR,
				coordT:eleve.sociogramme[app.sociogramme.vue].coordT
			});
		};
		save.eleves=eleves_positions;
	}
	save.zoom=app.sociogramme.zoom;
	var picture=app.sociogrammeThumbs();
	var saves=app.sociogrammesSaves;
	for (var i = saves.length - 1; i >= 0; i--) {
		let oldSave=saves[i];
		if(oldSave.sociogrammeSave_sociogramme!=app.sociogramme.current){ continue;}
		if(oldSave.sociogrammeSave_classe!=app.sociogrammeCurrentClasse){ continue;}		
		save.sociogrammesSave_picture=picture;	
		if(save.eleves==null){
			save.eleves=jsonParse(oldSave.sociogrammeSave_data).eleves;
		}	
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=save",{
		data:JSON.stringify(save),
		classe_id:classe.classe_id,
		picture:picture,
		time:Math.floor(app.myTime()/1000),
		sociogramme_id:app.sociogramme.current,
		sessionParams:app.sessionParams
	},function(data){
		app.render(data);
	});	
}

app.sociogrammeLoadSave=function(){
	var saves=app.sociogrammesSaves;
	var issetSave=false;
	for (var i = saves.length - 1; i >= 0; i--) {
		var save=saves[i];
		if(save.sociogrammeSave_sociogramme!=app.sociogramme.current){ continue;}
		if(save.sociogrammeSave_classe!=app.sociogrammeCurrentClasse){ continue;}
		issetSave=true;

		app.sociogramme.eleves=app.getClasseById(app.sociogrammeCurrentClasse).eleves;

		var classe=app.getClasseById(app.sociogrammeCurrentClasse);
		for (var i = classe.eleves.length - 1; i >= 0; i--) {
			let eleve=app.getEleveById(classe.eleves[i]);
			
			eleve.sociogramme=[];
			eleve.sociogramme[app.sociogramme.vue]={
				coordR:'',
				coordT:''
			};	
		}

		app.setElevesPositions(app.sociogramme.eleves,[]);

		var datas=jsonParse(save.sociogrammeSave_data).eleves;
		for (var j = datas.length - 1; j >= 0; j--) {
			var data=datas[j];
			var eleve=app.getEleveById(data.eleve_id);
			if(!eleve){continue;}
			eleve.sociogramme[app.sociogramme.vue]={
				coordR:data.coordR,
				coordT:data.coordT
			};	
		}				
	}
	if(!issetSave){
		app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
	}
}