var app=app || {};

app.getEleveById=function(eleve_id) {
	return app.eleves[app.elevesIndex[eleve_id]]||false;
};

app.buildElevesIndex=function(){
	var classe_fictive_num=app.getClasseById(-1).num;

	app.elevesIndex=[];
	for (var i = 0, lng = app.eleves.length; i < lng; i++) {
		app.elevesIndex[app.eleves[i].eleve_id]=i;
		app.eleves[i].eleve_num=i;    		
		app.classes[classe_fictive_num].eleves.push(app.eleves[i].eleve_id);
	}

	if(app.classes.length==2 || app.eleves.length==0){
		$('.ifCohortes').addClass('d-none');
	}else{
		$('.ifCohortes').removeClass('d-none'); 
	}
	
}