"use strict";
var app=app || {};

app.sociogrammeRelationsViewSet=function(value){
	$('.sociogrammeRelationsViewSelect').prop('value',value);
}

app.sociogrammeElevesPositionsReset=function(confirm){
	if (!app.checkConnection()) {return;}
	if(!confirm){
		app.alert({title:'Réinitialiser la position des élèves ?',icon:'confirm'},function(){app.sociogrammeElevesPositionsReset(true);});
		return;
	}
	if(app.sociogramme.mode=="students"){
		app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
		app.sociogrammeSave();
	}
	else{
		app.setElevesPositionsByGroupes();		
	}
	app.sociogrammeAdaptativeZoom();
}

app.sociogrammePictureGet=function(){
	let classe=app.getClasseById(app.sociogrammeCurrentClasse);
	let canvas=document.getElementById('sociogramme-canvas');
	let dataURL = canvas.toDataURL();
	document.getElementById('classroom-sociogramme-export').href=dataURL;
	document.getElementById('classroom-sociogramme-export').download="sociogramme-"+app.cleanClasseName(classe.classe_nom)+"-"+moment().format('DD/MM/YYYY-HH[h]mm')+".png";
}

app.sociogrammeThumbs=function() {
    // create an off-screen canvas
    let canvas = document.createElement('canvas');
    let ctx = canvas.getContext('2d');
    let img=document.getElementById('sociogramme-canvas');
    // set its dimension to target size
    canvas.width = 200*app.sociogramme.width/app.sociogramme.height;
    canvas.height = 200;
    // draw source image into the off-screen canvas:
    ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
    // encode image to data-uri with base64 version of compressed image
    return canvas.toDataURL();
}
app.setSociogrammeFiltre=function(value){
	app.sociogramme.filtre=value;
	app.sociogrammeRenderInit();
};

app.sociogrammeZoom=function(zoom){
	app.sociogramme.zoom=Math.max(0.01,app.sociogramme.zoom+zoom*1);
	app.sociogrammeRenderInit();
	if(app.sociogrammeRepeatZoom){
		setTimeout(function(){
			app.sociogrammeZoom(zoom);
		},50);		
	}
}

app.sociogrammeAdaptativeZoom=function(){
	let eleves=app.sociogramme.eleves;
	let maxR=0.85*document.body.clientHeight/2-90;
	if(document.body.clientHeight>document.body.clientWidth){
		maxR=0.85*document.body.clientWidth/2;
	}

	let r=0;
	for (let i = eleves.length - 1; i >= 0; i--) {		
		let eleve=app.getEleveById(eleves[i]);
		if(!eleve || !eleve.sociogramme) {continue;}	
		r=Math.max(r,eleve.sociogramme[app.sociogramme.vue].coordR);
	}

	if(r!=0){
		app.sociogramme.zoom=maxR/r;		
	}
	
	app.sociogramme.width=2*r*app.sociogramme.zoom*1.1;
	if(app.sociogramme.width<$('#classroom-sociogramme').width()){
		app.sociogramme.width=$('#classroom-sociogramme').width();
	}
	app.sociogramme.height=$('#classroom-sociogramme').height();
	
	app.sociogramme.centerX=app.sociogramme.width/2;	
	app.sociogramme.centerY=r*1*app.sociogramme.zoom+30;	

	if(app.currentView=="sociogrammes"){
		if(app.sociogramme.current!=null && app.sociogrammeCurrentClasse!=null){
			app.sociogrammeRenderInit();
		}
	}
}

app.sociogrammeReverseToggle=function(value){
	app.sociogrammeReverse=value;
	app.setElevesPositions(app.sociogramme.eleves,app.sociogramme.rangs);
	app.sociogrammeAdaptativeZoom();
}

app.sociogrammeFilterSelectInit=function(){
	let sociogramme=app.getSociogrammeById(app.sociogramme.current);
	let questions=jsonParse(sociogramme.sociogramme_questions);
	let html=[];
	let colors=[];
	for (let i = questions.length - 1; i >= 0; i--) {
		let question=questions[i];
		let color=question.question_color;
		let style="";
		if(colors.indexOf(color)>=0){ continue;}
		colors.push(color);
		if(app.sociogrammeFilters.indexOf(color)>=0){
			style="sociogrammeColorIsFiltered";
		}
		html.push('<div class="sociogrammeColorSelect '+style+'" style="border-color:'+color+'; background-color:'+color+';" onclick="app.sociogrammeToggleFilter(\''+color+'\');"></div>');
	}
	$('#sociogrammeFilters').html(html.join(''));
}

app.sociogrammeToggleFilter=function(color){
	if(app.sociogrammeFilters.indexOf(color)>=0){
		let filters=[];
		for (let i = app.sociogrammeFilters.length - 1; i >= 0; i--) {
			if(app.sociogrammeFilters[i]!=color){
				filters.push(app.sociogrammeFilters[i]);
			}
		}
		app.sociogrammeFilters=filters;
	}
	else{
		app.sociogrammeFilters.push(color);
	}
	app.sociogrammeFilterSelectInit();
	app.sociogrammeRenderInit();
}

app.sociogrammeRenderRangsToggle=function(){
	let sociogrammeViewRangs=document.getElementById('sociogrammeViewRangs').checked;
	if(sociogrammeViewRangs && app.sociogramme.mode!="groups"){
		$('.sociogramme-rangs').css('display','');
	}else{
		$('.sociogramme-rangs').css('display','none');
	}
	app.userConfig.sociogrammeViewRangs=sociogrammeViewRangs;
	app.getClasseSociogramme();	
	app.pushUserConfig();
}

app.sociogrammeCountRelations=function(classe_id,sociogramme_id){
	let n=0;
	let classe=app.getClasseById(classe_id);
	let sociogramme=app.getSociogrammeById(sociogramme_id);
	for (let i = app.relations.length - 1; i >= 0; i--) {
		let relation=app.relations[i];
		if(classe.eleves.indexOf(relation.socioRelation_from)<0 || classe.eleves.indexOf(relation.socioRelation_to)<0){continue;}
		if(relation['socioRelation_sociogramme']!=sociogramme_id){continue;}
		n++;
	};
	return n;
}

app.sociogrammeShowAside=function(){
	if(app.onMobile()){
		$('.sociogramme-bloc').css('display','none');
		app.show('sociogramme-main','flex');
	}
	app.show('sociogramme-options');
	app.titleRender("<a href='#sociogrammes/"+app.sociogramme.current+"/"+app.sociogrammeCurrentClasse+"'>Sociogrammes</a> / Options");
}