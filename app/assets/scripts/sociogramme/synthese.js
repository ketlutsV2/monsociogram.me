var app=app || {};

app.initSociogrammeSynthese=function(){
	$('.sociogramme-bloc').css('display','none');
	app.show('classroom-sociogramme-synthese-box');
	$('#sociogramme_noRelations').css('display','none');
	app.titleRender("<a href='#sociogrammes/"+app.sociogramme.current+"/"+app.sociogrammeCurrentClasse+"'>Sociogrammes</a> / Synthèse");
	app.sociogrammeSyntheseTable();
}

app.sociogrammeSyntheseTable=function(){
	if(app.sociogramme.current==null){return;}
	
	var eleves=app.sociogramme.eleves;
	var relations=app.sociogramme.relations;
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	var studentsPoints=[];
	for (var i = relations.length - 1; i >= 0; i--) {
		var relation=relations[i]; 
		if(relation.relation_type<4){continue;}
		studentsPoints[relation.socioRelation_to]=studentsPoints[relation.socioRelation_to]||[];
		studentsPoints[relation.socioRelation_to]['total']=studentsPoints[relation.socioRelation_to]['total']||0;
		studentsPoints[relation.socioRelation_to][relation.socioRelation_question]=studentsPoints[relation.socioRelation_to][relation.socioRelation_question]||0;
		studentsPoints[relation.socioRelation_to][relation.socioRelation_question]++;
		studentsPoints[relation.socioRelation_to]['total']++;
	}
	var questions=jsonParse(sociogramme.sociogramme_questions);
	var html=[];
	html.push('<table class="table" id="classroom-sociogramme-synthese-tab">');
	html.push('<thead>');
	html.push(' <tr>');
	html.push('<th>Élèves</th>');
	for (var i=0,lng= questions.length ; i<lng; i++) {
		var question=questions[i];
		var color=hexToRgb(question.question_color);
		html.push('<th style="background-color:rgba('+color.r+','+color.g+','+color.b+',0.3);">'+question.question_intitule+'</th>');
	}
	html.push('<th>Poids relatifs</th>');
	html.push('</tr>');
	html.push('</thead>');
	html.push('<tbody>');
	for (var i = 0; i < eleves.length; i++) {
		var eleve=app.getEleveById(eleves[i]);
		if(!studentsPoints[eleve.eleve_id]){continue;}
		html.push('<tr>');
		html.push('<td>');
		html.push(app.renderEleveNom(eleve));
		html.push('</td>');
		for (var j =0,lng= questions.length ; j<lng; j++) {
			var question=questions[j];
			var color=hexToRgb(question.question_color);
			html.push('<td style="background-color:rgba('+color.r+','+color.g+','+color.b+',0.3);">'+(studentsPoints[eleve.eleve_id][question.question_id]||0)+'</td>');
		}
		html.push('<td>'+(studentsPoints[eleve.eleve_id]['total']||0)+'</td>');
		html.push('</tr>');
	}
	html.push('</tbody>');
	html.push('</table>');
	document.getElementById('classroom-sociogramme-synthese').innerHTML=html.join(''); 
	$('#classroom-sociogramme-synthese-tab').dataTable({
		"paging":   false,
		dom: 't',		
		stateSave: true,
		"language":app.datatableFR
	});
}