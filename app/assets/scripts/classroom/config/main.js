var app=app || {};

app.classroomConfigInit=function(){ 
	var classe=app.currentClasse;
	$('.classroom-page').css('display','none');
	$('#classe-config').css('display','');
	$('#classroom-main').css('display','none');  
	$('#classroom-toolbar').css('display','none');
	app.titleRender("<a href='#classroom/"+classe.classe_id+"'>"+app.cleanClasseName(classe.classe_nom)+"</a> / Configuration");
}