var app=app || {};

app.sociogrammeRenderErase=function(){
	var canvas=document.getElementById('sociogramme-canvas');
	canvas.height=app.sociogramme.height;
	canvas.width=app.sociogramme.width;
	app.sociogramme.ctx=canvas.getContext("2d");
	var ctx=app.sociogramme.ctx;	
	ctx.fillStyle = "#ffffff";
	ctx.fillRect(0, 0, canvas.width, canvas.height);	
}

app.sociogrammeRenderInit=function(){	
	if(!app.sociogramme.enableDraw){return;}	
	app.sociogrammeGroupsDetector();	
	app.sociogramme.enableDraw=false;
	app.sociogrammeRenderErase();

	if(app.sociogramme.mode=="students"){
		if(document.getElementById('sociogrammeViewRangs').checked){
			app.sociogrammeRenderRangs();
		}
	}
	else{
		app.sociogrammeRenderGroups();
	}
	app.sociogrammeRenderStudents();	
	app.sociogramme.enableDraw=true;
	if(app.sociogramme.enable_move){
		setTimeout(function(){app.sociogrammeRenderInit();},10);
	}	
}

app.sociogrammeRenderRangs=function(){
	var rangs=app.sociogramme.rangs;
	var ctx=app.sociogramme.ctx;
	var rang_max=0;
	if(rangs.length>0){
		rang_max=rangs[0].value;
	}	
	for (var i = rangs.length - 1; i >= 0; i--) {
		if(app.sociogrammeReverse){
			var r=(rangs.length-i+1)*app.sociogramme.step*app.sociogramme.zoom;
		}else{
			var r=(i+1)*app.sociogramme.step*app.sociogramme.zoom;
		}	
		ctx.beginPath();
		ctx.arc(app.sociogramme.centerX, app.sociogramme.centerY, r-1, 0, app.pi*2, true);    
		if(rangs[i].value==0){
			ctx.lineWidth = 4;
		}
		else{
			ctx.lineWidth = 1;
		}
		ctx.strokeStyle = '#003300';
		ctx.stroke();		
		//Affichage des graduations
		ctx.fillStyle = 'black';
		ctx.font = '12pt Arial';
		ctx.fillText(rang_max-i,app.sociogramme.centerX , app.sociogramme.centerY-r-5);
	} 
}

app.sociogrammeRenderGroups=function(){
	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	var groupes=classe.currentGroupes;
	var ctx=app.sociogramme.ctx;	

	for (var i = groupes.length - 1; i >= 0; i--) {
		var centre=app.sociogramme.centres[i];
		var x=Math.floor(centre[0]*app.sociogramme.zoom*Math.cos(centre[1])+app.sociogramme.centerX);
		var y=Math.floor(centre[0]*app.sociogramme.zoom*Math.sin(centre[1])+app.sociogramme.centerY);
		ctx.beginPath();
		ctx.arc(x, y, 50*app.sociogramme.zoom, 0, app.pi*2, true);    
		ctx.lineWidth = 1.5;
		ctx.strokeStyle = '#003300';
		ctx.stroke();
		ctx.beginPath();
		ctx.moveTo(x-4, y-4);
		ctx.lineTo(x+4, y+4);
		ctx.moveTo(x-4, y+4);
		ctx.lineTo(x+4, y-4);
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#003300';
		ctx.stroke();		
	}
}

app.sociogrammeRenderStudents=function(){
	var eleves=app.sociogramme.eleves;
	var relations=app.sociogramme.relations;
	app.sociogroupsButton=false;
	var drawed=[];
	var ctx=app.sociogramme.ctx;
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i];   
		if(relations.indexOf(relation.relation_id)!=-1){continue;}	
		drawed.push(relation.socioRelation_id);
		var eleve_1=app.getEleveById(relation.socioRelation_from);
		var eleve_2=app.getEleveById(relation.socioRelation_to);
		if(!eleve_1 || !eleve_2){continue;}
		var question=app.sociogrammeGetQuestion(app.sociogramme.current,relation.socioRelation_question);
		var value_1=question.question_points;
		var color_1=app.getSociogrammeColorLink(question);
		var value_2=0;
		var other_relation=app.getRelation(relation.socioRelation_to,relation.socioRelation_from,relations);
		var color_2="transparent";
		if(other_relation!=false){		
			var otherQuestion=app.sociogrammeGetQuestion(app.sociogramme.current,other_relation[0].socioRelation_question);
			value_2=otherQuestion.question_points;
			relations[other_relation[1]].drawed=true;
			var color_2=app.getSociogrammeColorLink(otherQuestion);
		};		
		if(color_1=="transparent" && color_2=="transparent"){continue;}	
		//Coordonnées de l'élève 1
		var x1=Math.floor(eleve_1.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve_1.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y1=Math.floor(eleve_1.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve_1.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		//Coordonnées de l'élève 2
		var x2=Math.floor(eleve_2.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve_2.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y2=Math.floor(eleve_2.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve_2.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		var grad= ctx.createLinearGradient(x1, y1, x2, y2);
		grad.addColorStop(0, color_1);
		grad.addColorStop(1, color_2);
		ctx.strokeStyle = grad;
		ctx.beginPath();
		ctx.moveTo(x1,y1);
		ctx.lineTo(x2,y2);
		ctx.lineWidth = 2;
		if(value_1==value_2){
			ctx.lineWidth = 4;
		}
		ctx.stroke();
	}
	ctx.font = '12pt Arial';
	for (var i = eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(eleves[i]);		
		if(eleve.eleve_prenom==""){
			var nom=eleve.eleve_nom;
		}else{
			var nom=eleve.eleve_prenom+" "+ucfirst(eleve.eleve_nom.substr(0,1))+".";
		}
		var textWidth = ctx.measureText (nom);

		var x1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		
		if(eleve.groupeNum!=null && app.sociogroups[eleve.groupeNum].length>=2 && !app.userConfig.sociogrammeViewRangs){
			ctx.beginPath();
			ctx.arc(x1, y1,50, 0, Math.PI*2, true);
			ctx.closePath();
			ctx.fillStyle = 'rgba(86,86,86,0.15)';
			ctx.fill();
			app.sociogroupsButton=true;
		}
		
		ctx.beginPath();
		var x=x1-5-ctx.measureText(nom).width/2;
		var y=y1-17.5;
		ctx.rect(x, y, textWidth.width+10, 35);
		eleve.width=textWidth.width+10;
		eleve.height=35;
		ctx.lineWidth = 1;
		ctx.fillStyle = 'white';
		ctx.fill();
		ctx.strokeStyle = 'black';
		ctx.stroke();
		ctx.fillStyle = 'black';
		x=x1-ctx.measureText(nom).width/2;
		y=y1+5;		
		ctx.fillText(nom,x,y);
	}

	if(app.sociogroupsButton || app.sociogramme.mode=="groups"){
		$('#sociogramme-sociogroups-btn').css('display','');
	}else{
		$('#sociogramme-sociogroups-btn').css('display','none');
	}
}

app.getSociogrammeColorLink=function(question){
	if(app.sociogrammeFilters.indexOf(question.question_color)>=0){
		return "transparent";
	}
	return question.question_color;
}