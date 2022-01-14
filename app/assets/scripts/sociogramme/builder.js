var app=app || {};

app.getSociogrammeById=function(sociogramme_id){
	return app.sociogrammesIndex[sociogramme_id];	
}

app.buildSociogrammesIndex=function(){
	app.sociogrammesIndex=[];
	for (var i = 0, lng = app.sociogrammes.length; i < lng; i++) {
		app.sociogrammesIndex[app.sociogrammes[i].sociogramme_id]=app.sociogrammes[i];
	}

};