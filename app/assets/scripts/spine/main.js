var app=app || {};

app.spineNextPage=function(){
	var liste=app.spinePetales;
	var quotient=Math.floor(liste.length/6);
	var reste=liste.length%6;
	var nbPages=quotient;
	
	if(reste!=0){
		nbPages++;
	}
	app.spinePage=(app.spinePage*1+1)%nbPages;

	document.querySelectorAll(".petale").forEach(
		function(petale){
			petale.classList.remove('petale-opacity');	
			window.requestAnimationFrame(function(time) {
				window.requestAnimationFrame(function(time) {
					petale.classList.add('petale-opacity');	
				});
			});
		}
		);
	app.spineRender();
}

app.spineGoToPageByURL=function(url){
	for (let i =0,lng= app.spinePetales.length; i<lng; i++) {
		let button=app.spinePetales[i];
		if(button.url==url){
			var quotient=Math.floor(i/6);
			app.spinePage=quotient-1;
			app.spineNextPage();
		}
	}
}