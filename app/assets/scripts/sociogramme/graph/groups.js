var app=app || {};

app.sociogrammeGroupsDetector=function(){
	app.sociogroups=[];
	var eleves=app.sociogramme.eleves;
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);
		if(!eleve) {continue;}
		eleve.groupeNum=null;
	}
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);	
		if(!eleve) {continue;}	
		if(eleve.groupeNum!=null){
			continue;
		}
		app.areInSociogroups=[eleve.eleve_id];
		var groupeNum=app.sociogrammeGroupsDetectorByEleve(eleve.eleve_id);
		if(groupeNum===false){
			groupeNum=app.sociogroups.length;
		}
		app.sociogroups[groupeNum]=app.sociogroups[groupeNum]||[];
		for (var j = app.areInSociogroups.length - 1; j >= 0; j--) {
			app.getEleveById(app.areInSociogroups[j]).groupeNum=groupeNum;
			app.sociogroups[groupeNum].push(app.areInSociogroups[j]);
		}
	}
}

app.sociogrammeGroupsDetectorByEleve=function(eleve_id){
	var eleve=app.getEleveById(eleve_id);
	var x1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
	var y1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
	var eleves=app.sociogramme.eleves;
	for (var j = eleves.length - 1; j >= 0; j--) {
		var other_eleve=app.getEleveById(eleves[j]);	
		if(!other_eleve) {continue;}
		if(app.areInSociogroups.indexOf(other_eleve.eleve_id)>=0){
			continue;
		}
		var x2=Math.floor(other_eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(other_eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y2=Math.floor(other_eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(other_eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);

		if(Math.sqrt((x1-x2)*(x1-x2)+(y1-y2)*(y1-y2))<=100){
			if(other_eleve.groupeNum!=null){
				return other_eleve.groupeNum;
			}	else{
				app.areInSociogroups.push(other_eleve.eleve_id);
				return app.sociogrammeGroupsDetectorByEleve(other_eleve.eleve_id);
			}
		}
	}
	return false;
}

app.sociogrammeGroupsDetectorRender=function(){
	app.go('classroom/'+app.sociogrammeCurrentClasse+'/groups');
	setTimeout(function(){
		if(app.sociogramme.mode=="groups"){
			app.renderGroupes(app.currentClasse.currentGroupes);
		}else{
			app.renderGroupes(app.sociogroups);
		}		
	},1000);
}