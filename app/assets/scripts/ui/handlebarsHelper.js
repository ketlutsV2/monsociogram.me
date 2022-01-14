var app=app || {};

Handlebars.registerHelper('eleve_nom', function() {
	var eleve=app.getEleveById(this);
	return truncateString(eleve.eleve_nom.toUpperCase(),15);
});
Handlebars.registerHelper('eleve_prenom', function() {
	var eleve=app.getEleveById(this);
	return truncateString(ucfirst(eleve.eleve_prenom),15);
});

Handlebars.registerHelper('eleve_id', function() {
	var eleve=app.getEleveById(this);
	return eleve.eleve_id;
});
Handlebars.registerHelper('eleve_token', function() {
	var eleve=app.getEleveById(this);
	return eleve.eleve_token;
});
/*Handlebars.registerHelper('classroom_name', function() {	
	return this.classe_nom.replace(/~/g,'');
});
Handlebars.registerHelper('classroom_nb_students', function() {	
	var n=this.eleves.length;
	return n+" élève"+app.pluralize(n,'s');
});*/
