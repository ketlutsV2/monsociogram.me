var app=app || {};

app.sociogrammeFormInit=function(){
	$('.sociogramme-bloc').css('display','none');
	app.show('sociogramme_form');
	app.hide('sociogramme-options');
	app.hide('sociogramme-student-form-block');

	app.hide('classroom-sociogramme-synthese-box');
	app.hide('classroom-sociogramme');
	app.hide('sociogramme-delete-button');
	document.getElementById('sociogramme-name').value=null;
	app.titleRender('<a href="#home">MonSociogram<span class="small">.me</span></a> / Nouveau questionnaire');
	document.getElementById("sociogramme_questions").innerHTML="";
	app.sociogrammeEdition=false;
	app.sociogramme.current=null;
	app.newSociogrammeQuestionsNb=0;
	app.sociogrammeAddQuestion();
	document.getElementById('sociogramme-name').focus();
}

app.sociogrammeAddModele=function(modele){
	app.sociogrammeFormInit();

	if(modele=='simple'){
		document.getElementById('sociogramme-name').value="Simple";
		app.sociogrammeAddQuestion();
		app.sociogrammeAddQuestion();
		var questions=[];
		for (let i=1;i<=app.newSociogrammeQuestionsNb; i++) {
			if(i==1){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Proche de...";
				document.getElementById('sociogramme-question-'+i+'-points').value=2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#0000FF";
			}
			if(i==2){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Proche de...";
				document.getElementById('sociogramme-question-'+i+'-points').value=1;
				document.getElementById('sociogramme-question-'+i+'-color').value="#007F00";
			}
			if(i==3){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="À éloigner de...";
				document.getElementById('sociogramme-question-'+i+'-points').value=-2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#FF0000";
			}
		}
		return;
	}

	if(modele=='avance'){
		document.getElementById('sociogramme-name').value="Avancé";
		app.sociogrammeAddQuestion();
		app.sociogrammeAddQuestion();
		app.sociogrammeAddQuestion();
		var questions=[];
		for (let i=1;i<=app.newSociogrammeQuestionsNb; i++) {
			if(i==1){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Avec qui aimerais-tu jouer ou travailler ?";
				document.getElementById('sociogramme-question-'+i+'-points').value=2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#0000FF";
			}
			if(i==2){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Avec qui n’aimerais-tu pas jouer ou travailler ?";
				document.getElementById('sociogramme-question-'+i+'-points').value=-2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#FF0000";
			}
			if(i==3){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Par qui penses-tu être choisi ?";
				document.getElementById('sociogramme-question-'+i+'-points').value=1;
				document.getElementById('sociogramme-question-'+i+'-color').value="#007F00";
			}
			if(i==4){
				document.getElementById('sociogramme-question-'+i+'-intitule').value="Par qui penses-tu avoir été rejeté ?";
				document.getElementById('sociogramme-question-'+i+'-points').value=-2;
				document.getElementById('sociogramme-question-'+i+'-color').value="#000000";
			}
		}
	}
}

app.sociogrammeAddQuestion=function(){
	app.newSociogrammeQuestionsNb++;
	var source   = document.getElementById("template-sociogrammes-form").innerHTML;
	var template = Handlebars.compile(source);
	var context = {
		questions:[{
			"intitule":"",
			"color":"#0000ff",
			"nb":app.newSociogrammeQuestionsNb
		}]
	};		
	var div=document.getElementById("sociogramme_questions");
	var newQuestion= document.createElement("tr");
	newQuestion.innerHTML=template(context);
	div.appendChild(newQuestion);
	document.getElementById('sociogramme-question-'+app.newSociogrammeQuestionsNb+'-points').value=1;
}

app.sociogrammeCreate=function(){
	if(app.sociogrammeEdition==true){
		app.sociogrammeEditionSave();
		return;
	}
	if (!app.checkConnection()) {return;}
	var sociogramme_name=(document.getElementById('sociogramme-name').value).trim();;
	
	if (app.trim(sociogramme_name)=="") {
		swal("Il faut indiquer le nom du questionnaire ou choisir un modèle.", {
			icon: "error",
		}).then(valid=>{
		}
		);
		return;
	}

	var questions=[];
	for (let i=1;i<=app.newSociogrammeQuestionsNb; i++) {
		var intitule=(document.getElementById('sociogramme-question-'+i+'-intitule').value).trim();
		if(intitule==""){
			continue;
		}
		var question={
			question_id:i,
			question_intitule:intitule,
			question_points:document.getElementById('sociogramme-question-'+i+'-points').value,
			question_color:document.getElementById('sociogramme-question-'+i+'-color').value
		};
		questions.push(question);
	}


	if (questions.length==0) {
		swal("Il faut créer des questions ou choisir un modèle.", {
			icon: "error",
		}).then(valid=>{});
		return;
	}

	$.post(app.serveur + "index.php?go=sociogramme&q=create",
	{			
		sociogramme_name:sociogramme_name,
		questions:JSON.stringify(questions),		
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	}, function(data) {
		app.render(data);  
		app.sociogrammesInitView();
		app.go("#sociogrammes/"+app.sociogrammeCurrentClasse);
	}
	);
};

app.sociogrammeEditionInit=function(sociogramme_id){
	$('.sociogramme-bloc').css('display','none');
	app.show('sociogramme_form');
	app.hide('sociogramme-options');
	app.hide('sociogramme-student-form-block');
	app.hide('classroom-sociogramme-synthese-box');
	app.hide('classroom-sociogramme');
	app.hide('sociogramme-delete-button');

	$('#sociogramme_noRelations').css('display','none');
	$('#sociogramme-delete-button').css('display','');
	
	app.sociogrammeEdition=true;
	
	var classe=app.getClasseById(app.sociogrammeCurrentClasse);
	app.sociogramme.current=sociogramme_id;
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	app.titleRender('<a href="#home">MonSociogram<span class="small">.me</span></a> / '+ucfirst(app.getSociogrammeById(app.sociogramme.current).sociogramme_name) +' / Édition');
	document.getElementById('sociogramme-name').value=sociogramme.sociogramme_name;
	var sociogrammeQuestionsNb=0;
	document.getElementById("sociogramme_questions").innerHTML="";
	var questions=jsonParse(sociogramme.sociogramme_questions);
	var source   = document.getElementById("template-sociogrammes-form").innerHTML;
	var template = Handlebars.compile(source);
	var div=document.getElementById("sociogramme_questions");
	for (var i = 0,lng=questions.length; i <lng; i++) {
		var question=questions[i];
		var context = {
			questions:[{
				"intitule":question.question_intitule,
				"color":question.question_color,
				"nb":question.question_id
			}]
		};		
		sociogrammeQuestionsNb=Math.max(sociogrammeQuestionsNb,question.question_id);
		var newQuestion= document.createElement("tr");
		newQuestion.innerHTML=template(context);
		div.appendChild(newQuestion);
		document.getElementById('sociogramme-question-'+question.question_id+'-points').value=question.question_points;
	}
	app.newSociogrammeQuestionsNb=sociogrammeQuestionsNb;
}

app.sociogrammeDelete=function(confirm){
	if (!app.checkConnection()) {return;}    
	if(!confirm){
		app.alert({title:'Supprimer ce sociogramme et tous les liens associés ?',icon:'confirm'},function(){app.sociogrammeDelete(true);});
		return;
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=delete",
	{			
		sociogramme_id:app.sociogramme.current,		
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	}, function(data) {
		app.render(data); 		
		app.go("#sociogrammes/"+app.sociogrammeCurrentClasse);
	}
	);
}

app.sociogrammeEditionSave=function(){
	if(app.sociogrammeEdition==false){return;}
	if (!app.checkConnection()) {return;}
	var sociogramme=app.getSociogrammeById(app.sociogramme.current);
	var sociogramme_name=(document.getElementById('sociogramme-name').value).trim();;
	if(sociogramme_name==""){
		return;
	}
	var new_questions=[];
	for (var i = 0; i <= app.newSociogrammeQuestionsNb; i++) {
		if(!document.getElementById('sociogramme-question-'+i+'-intitule')){continue;}
		var intitule=(document.getElementById('sociogramme-question-'+i+'-intitule').value).trim();
		if(intitule==""){
			continue;
		}
		var points=document.getElementById('sociogramme-question-'+i+'-points').value;
		var color=document.getElementById('sociogramme-question-'+i+'-color').value;
		new_questions.push({
			question_id:i,
			question_intitule:intitule,
			question_points:points,
			question_color:color
		});
	}
	$.post(app.serveur + "index.php?go=sociogramme&q=update",
	{			
		sociogramme_id:sociogramme.sociogramme_id,
		sociogramme_name:sociogramme_name,
		sociogramme_questions:JSON.stringify(new_questions),		
		time:Math.floor(app.myTime()/1000),
		sessionParams:app.sessionParams
	}, function(data) {
		app.render(data);  
		app.hide("sociogramme_form");
		app.go("#sociogrammes/"+app.sociogrammeCurrentClasse);
	}
	);
}