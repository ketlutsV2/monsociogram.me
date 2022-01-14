var app=app || {};

app.deconnexion=function(){  
	sessionStorage.clear();
	localStorage.clear();
	app.initVariables(); 
	app.urlHash="";
	$.post(app.serveur + "index.php?go=users&q=deconnexion",
	{ 
		sessionParams:app.sessionParams
	}, function(data){	
		document.location.reload();
	});	
}