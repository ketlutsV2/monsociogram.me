var app=app || {};

app.studentInitViews=function(eleve_id) {	
	var eleve=app.getEleveById(eleve_id);
	if(!eleve){
		app.go('home');
		return;
	}
	app.viewClear();
	app.currentView="eleve";
	app.currentEleve = eleve;

	$('.template_eleve').css('display','flex');
};