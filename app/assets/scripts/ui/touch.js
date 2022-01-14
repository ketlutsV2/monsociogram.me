var app=app || {};

app.handleStart=function(evt){
	evt.preventDefault();	
	var pos = $('#sociogramme-canvas').offset();
	var touches = evt.changedTouches;
	//console.log(touches[0].pageX);
	app.mouse.x=touches[0].pageX-pos.left;
	app.mouse.y=touches[0].pageY-pos.top;
	app.start_move();
	
	
}
app.handleMove=function(evt){	
	evt.preventDefault();	
	var touches = evt.changedTouches;
	//app.sociogrammeClick=false;
	app.movemouse(touches[0]);	
	
}
app.handleEnd=function(evt){
	evt.preventDefault();	
	app.end_move();
	//app.sociogrammeClick=true;
	
}
app.touchInit=function(){
	var el = document.getElementById("sociogramme-canvas");
	el.addEventListener("touchstart", app.handleStart, false);
	el.addEventListener("touchend", app.handleEnd, false);
	el.addEventListener("touchleave", app.handleEnd, false);
	el.addEventListener("touchmove", app.handleMove, false);


	document.getElementById('sociogramme-zoom-out-btn').addEventListener("touchstart", function(){
		app.sociogrammeRepeatZoom=true;
		app.sociogrammeZoom(-0.03);
	}, false);
	document.getElementById('sociogramme-zoom-out-btn').addEventListener("touchend", function(){
		app.sociogrammeRepeatZoom=false;
	}, false);

	document.getElementById('sociogramme-zoom-in-btn').addEventListener("touchstart", function(){
		app.sociogrammeRepeatZoom=true;
		app.sociogrammeZoom(0.03);
	}, false);
	document.getElementById('sociogramme-zoom-in-btn').addEventListener("touchend", function(){
		app.sociogrammeRepeatZoom=false;
	}, false);

	document.getElementById('sociogramme-canvas').addEventListener("touchend", function(){

		app.sociogrammeMouseClick();
	}, false);
	document.getElementById('sociogramme-canvas').addEventListener("touchmove", function(){
		app.sociogrammeClick=false;
		app.sociogrammeMouseClick();
	}, false);

}