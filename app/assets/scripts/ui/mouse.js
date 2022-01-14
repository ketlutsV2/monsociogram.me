var app=app || {};

app.mouseInit=function(){
	document.onmousemove=function(e){
			if(app.currentView=="sociogrammes"){
			app.movemouse(e);
		}		
	}
}