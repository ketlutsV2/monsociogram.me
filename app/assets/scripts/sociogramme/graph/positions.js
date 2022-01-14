var app=app || {};

app.setElevesRang=function(eleves,relations){
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);
		eleve.rang=0;
	}
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i];
		var eleve=app.getEleveById(relation.socioRelation_to);
		eleve.rang+=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question).question_points*1;
	}
}

app.sociogrammeGetQuestion=function(sociogramme_id,question_id){
	var sociogramme=app.getSociogrammeById(sociogramme_id);
	var questions=jsonParse(sociogramme.sociogramme_questions);
	for (var i = questions.length - 1; i >= 0; i--) {
		var question=questions[i];
		if(question.question_id==question_id){
			return question;
		}
	}
	return null;	
}

app.getRangs=function(eleves){
	var rangs=[];
	var tmpRangs=[];
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);
		var index=tmpRangs.indexOf(eleve.rang);    
		if(index==-1){
			var rang={value:eleve.rang, eleves:[i]};
			rangs.push(rang);
			tmpRangs.push(eleve.rang);
		}else{
			rangs[index].eleves.push(i);
		}
	}
	rangs.sort(function(a,b){
		if(a.value>b.value)
			return -1;
		return 1;
	});
	return rangs;
}

app.getSociogrammeRelations=function(classe_id){
	var relations=[];
	var classe=app.getClasseById(classe_id);
		for (var i = app.relations.length - 1; i >= 0; i--) {
			var relation=app.relations[i];
			if(classe.eleves.indexOf(relation.socioRelation_from)<0 || classe.eleves.indexOf(relation.socioRelation_to)<0){continue;}
			if(relation['socioRelation_sociogramme']!=app.sociogramme.current){continue;}
			if(relation.socioRelation_user==app.userConfig.userID && relation.socioRelation_user_type=='user'){
				relations.push(relation);
			}
		};
		
	return relations;
}

app.getRelation=function(from,to,relations){
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i];
		if(relation.socioRelation_from==from && relation.socioRelation_to==to)
			return [relation,i];
	}
	return false;
}

app.setElevesPositions=function(eleves,rangs){
	var tmpRangs=[];
	for (var i = rangs.length - 1; i >= 0; i--) {	
		var rang =rangs[i];
		var index=tmpRangs.indexOf(rang.value);    
		if(index==-1){				
			tmpRangs.push(rang.value);
		}
	}
	tmpRangs.sort(function(a,b){
		if(a.value>b.value)
			return -1;
		return 1;
	});
	var theta=2*app.pi/eleves.length;
	for (var i = eleves.length - 1; i >= 0; i--) {		
		var eleve=app.getEleveById(eleves[i]);
		if(!eleve.sociogramme){
			eleve.sociogramme=[];
		}
		if(!eleve.sociogramme[app.sociogramme.vue]){
			eleve.sociogramme[app.sociogramme.vue]={
				coordR:0,
				coordT:0
			};
		}
		if(app.sociogrammeReverse){
			var r=(tmpRangs.length-tmpRangs.indexOf(eleve.rang)+1)*app.sociogramme.step;
		}else{
			var r=(tmpRangs.indexOf(eleve.rang)+1)*app.sociogramme.step;
		}
		var angle=i*theta;
		eleve.sociogramme[app.sociogramme.vue].coordR=Math.floor(r*1000)/1000;
		eleve.sociogramme[app.sociogramme.vue].coordT=Math.floor(angle*1000)/1000;
	};
	app.sociogramme.mode=app.sociogramme.mode||"students";
}

app.setElevesPositionsByGroupes=function(){	
	app.sociogramme.vue="groupes";
	app.sociogramme.centres=[];
	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	var groupes=classe.currentGroupes;
	var n=groupes.length;

	if(n==0){return;}
	var ctx = app.sociogramme.ctx;
	var theta=2*app.pi/n;

	for (var j = 0, lng=groupes.length; j <lng; j++) {
		var angle=j*theta+theta*0.4;
		var new_centre_R=200;
		var new_centre_T=angle;
		app.sociogramme.centres.push([new_centre_R,new_centre_T,0,0]);
		var groupe=groupes[j];		
		var eleve_t=0;
		var eleve_r=50;
		for (var i = 0, llng=groupe.length; i <llng; i++) {
			var eleve=app.getEleveById(groupe[i]);
			eleve_t+=2*app.pi/groupe.length;
			if(!eleve.sociogramme){
				eleve.sociogramme=[];
			}

			var eleve_x=eleve_r*Math.cos(eleve_t)+new_centre_R*Math.cos(new_centre_T)*1;
			var eleve_y=eleve_r*Math.sin(eleve_t)+new_centre_R*Math.sin(new_centre_T)*1;

			if(!eleve.sociogramme[app.sociogramme.vue]){
				eleve.sociogramme[app.sociogramme.vue]={
					coordR:0,
					coordT:0
				};
			}
			eleve.sociogramme[app.sociogramme.vue].coordR=Math.sqrt(eleve_x*eleve_x+eleve_y*eleve_y);
			eleve.sociogramme[app.sociogramme.vue].coordT=Math.atan2(eleve_y, eleve_x);
			eleve.groupe=j;			
		}
	}
};