var app=app || {};

app.buildSpineButton=function(){
	app.spineButtonsVar=[];
	var n=app.spineButtonsFixed.length;
	app.spineWhiteList=[];

	for (var i=0, lng=app.classes.length; i <lng; i++) {
		var classe=app.classes[i];
		if(classe.classe_id<0){
			continue;
		}
		n++;
		classe.eleves=classe.eleves||[];
		app.spineButtonsVar.push({
			icon:'spine_icon flaticon-teamwork',
			url:'sociogrammes/'+classe.classe_id,
			text:app.cleanClasseName(classe.classe_nom),
			num:n,
			badge:classe.eleves.length
		});
	}

	if(app.userConfig.admin){
		n++;
		var num=n;
		if(app.classes.length==0){
			num=-1;	
			app.spineWhiteList.push('classroom/add');		
			app.spineWhiteList.push('admin');
		}
		app.spineButtonsVar.push({
			icon:'bi bi-plus',
			svg:'011-add-group',
			url:'classroom/add',
			text:'Ajouter une cohorte',
			num:num
		});
		n++;
		app.spineButtonsVar.push({
			icon:'bi bi-gear',
			svg:'016-settings-a',
			url:'user',
			text:'Mon compte',
			num:num*1+1
		});
	}

	app.spinePetales=app.spineButtonsFixed.concat(app.spineButtonsVar);
	app.spinePetales=app.orderBy(app.spinePetales,'num','ASC');
}