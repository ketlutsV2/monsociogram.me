var app=app || {};

app.sociogrammeMouseOver=function(){
	app.sociogramme.over=true;
}

app.sociogrammeMouseOut=function(){
	app.sociogramme.over=false;
	app.sociogrammeMouseDown=false;
}

app.sociogrammeMouseClick=function(){	
		if(app.sociogrammeClick==false)	{return;}
	for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(app.sociogramme.eleves[i]);
		var x=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		var x_min=x-1-eleve.width/2;
		var x_max=x*1+eleve.width*1-1-eleve.width/2;
		var y_min=y-25;
		var y_max=y*1+eleve.height*1-25;
		if(app.mouse.x>x_min && app.mouse.x<x_max && app.mouse.y>y_min && app.mouse.y<y_max){
			app.sociogramme.selectedEleve=i;	
			app.sociogrammeStudentForm(app.sociogramme.eleves[i]);
			return;
		}else{
			app.hide('sociogramme-student-form-block');
		}
	};
}

app.start_move=function(){
	app.sociogrammeClick=true;
	app.sociogrammeMouseDown=true;
	app.sociogrammeEnableSave=false;
	for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
		var eleve=app.getEleveById(app.sociogramme.eleves[i]);
		var x=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
		var y=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
		var x_min=x-1-eleve.width/2;
		var x_max=x*1+eleve.width*1-1-eleve.width/2;
		var y_min=y-25;
		var y_max=y*1+eleve.height*1-25;
		if(app.mouse.x>x_min && app.mouse.x<x_max && app.mouse.y>y_min && app.mouse.y<y_max){
			app.sociogramme.selectedEleve=i;	
			app.sociogramme.enable_move=true;
			app.preventTouch=true;
			continue;
		}
	};
	// for (var i = app.sociogramme.centres.length - 1; i >= 0; i--) {
	// 	var centre=	app.sociogramme.centres[i];
	// 	var coord=app.sociogrammeGetReduceCoord(centre[0],centre[1]);
	// 	var x=coord.x;
	// 	var y=coord.y;		
	// 	if(app.mouse.x>x-15 && app.mouse.x<x+15 && app.mouse.y>y-15 && app.mouse.y<y+15){
	// 		app.sociogramme.selectedCentre=i;	
	// 		app.sociogramme.enable_move=true;			
	// 		app.preventTouch=true;
	// 		continue;
	// 	}
	// };
	app.sociogrammeRenderInit();
}

app.movemouse=function(e)
{
	if(app.currentView!="sociogrammes"){
		return;
	}
	var pos = $('#sociogramme-canvas').offset();	
	var new_mousex = e.pageX-pos.left;
	var new_mousey = e.pageY-pos.top;   
	var diffX=app.mouse.x-new_mousex;
	var diffY=app.mouse.y-new_mousey;
	app.mouse.x=new_mousex;
	app.mouse.y=new_mousey;
	if(app.sociogramme.enable_move){

		if(app.sociogramme.selectedEleve>=0 && app.sociogramme.selectedEleve!=null){
			var eleve=app.getEleveById(app.sociogramme.eleves[app.sociogramme.selectedEleve]);
			var x=eleve.sociogramme[app.sociogramme.vue].coordR*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT);
			var y=eleve.sociogramme[app.sociogramme.vue].coordR*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT);
			x-=diffX/app.sociogramme.zoom;
			y-=diffY/app.sociogramme.zoom;
			var r=Math.sqrt(x*x+y*y);
			var theta=Math.atan2(y, x);
			eleve.sociogramme[app.sociogramme.vue].coordR=Math.floor(r*1000)/1000;
			eleve.sociogramme[app.sociogramme.vue].coordT=Math.floor(theta*1000)/1000;;
			app.sociogrammeClick=false;
			app.sociogrammeEnableSave=true;
		}		
		// if(app.sociogramme.selectedCentre>=0 && app.sociogramme.selectedCentre!=null){	
		// 	var centre=app.sociogramme.centres[app.sociogramme.selectedCentre];	
		// 	centre[0]-=diffX/app.sociogramme.zoom;
		// 	centre[1]-=diffY/app.sociogramme.zoom;
		// 	app.sociogrammeClick=false;
		// 	app.sociogrammeEnableSave=true;
		// 	for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
		// 		var eleve=app.getEleveById(app.sociogramme.eleves[i]);
		// 		if(eleve.groupe==app.sociogramme.selectedCentre){
		// 			eleve.sociogramme[app.sociogramme.vue].x-=diffX/app.sociogramme.zoom;
		// 			eleve.sociogramme[app.sociogramme.vue].y-=diffY/app.sociogramme.zoom;					
		// 		}
		// 	}
		// }

		app.preventTouch=true;
	}else if(app.sociogrammeMouseDown){
		app.sociogramme.centerX-=diffX;
		app.sociogramme.centerY-=diffY;
		app.sociogrammeRenderInit();

	}


	if(app.sociogramme.over){
		var cursor=false;
		for (var i = app.sociogramme.eleves.length - 1; i >= 0; i--) {
			var eleve=app.getEleveById(app.sociogramme.eleves[i]);
			var x1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.cos(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerX);
			var y1=Math.floor(eleve.sociogramme[app.sociogramme.vue].coordR*app.sociogramme.zoom*Math.sin(eleve.sociogramme[app.sociogramme.vue].coordT)+app.sociogramme.centerY);
			var x_min=x1-1-eleve.width/2;
			var x_max=x1*1+eleve.width*1-1-eleve.width/2;
			var y_min=y1-25;
			var y_max=y1*1+eleve.height*1-25;
			if(app.mouse.x>x_min && app.mouse.x<x_max && app.mouse.y>y_min && app.mouse.y<y_max){
				cursor=true;
			}
		};
		// for (var i = app.sociogramme.centres.length - 1; i >= 0; i--) {
		// 	var centre=	app.sociogramme.centres[i];
		// 	var coord=app.sociogrammeGetReduceCoord(centre[0],centre[1]);
		// 	var x=coord.x;
		// 	var y=coord.y;
		// 	if(app.mouse.x>x-15 && app.mouse.x<x+15 && app.mouse.y>y-15 && app.mouse.y<y+15){
		// 		cursor=true;
		// 	}
		// };
		if(cursor){
			document.getElementById('sociogramme-canvas').style.cursor="pointer";
		}else{
			document.getElementById('sociogramme-canvas').style.cursor="move";
		}
	}


}

app.end_move=function(){
	if(app.sociogrammeEnableSave){
		app.sociogrammeEnableSave=false;
		app.sociogrammeSave();
		app.sociogrammeRenderInit();
	}
	app.preventTouch=false;
	app.sociogramme.enable_move=false;
	app.sociogramme.selectedEleve=null;	
	app.sociogramme.selectedCentre=-1;
	app.sociogrammeMouseDown=false;
}


app.sociogrammeWheel=function(event){
	event.preventDefault();
	if(event.deltaY>0){
		app.sociogrammeZoom(-0.05);
	}
	else{
		app.sociogrammeZoom(0.05);
	}
}