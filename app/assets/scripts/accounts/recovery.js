var app=app || {};

app.passwordRetrieveGetCode=function(){
	if (!app.checkConnection()) {return;}
	let etablissement=document.getElementById('retrieve_etablissement').value;
	let pseudo=document.getElementById('retrieve_pseudo').value;
	$.post(app.serveur + "index.php?go=users&q=passwordRecovery&action=getCode",
	{
		retrieve_etablissement:etablissement,
		retrieve_pseudo:pseudo
	}, function(data){
		app.render(data);       
	});
};

app.passwordRetrieveNew=function(){
	if (!app.checkConnection()) {return;}
	let etablissement=document.getElementById('retrieve_etablissement2').value;
	let pseudo=document.getElementById('retrieve_pseudo2').value;
	let passe=document.getElementById('retrieve_passe').value;
	let passe2=document.getElementById('retrieve_passe2').value;
	let token=document.getElementById('retrieve_token').value;
	$.post(app.serveur + "index.php?go=users&q=passwordRecovery&action=passwordUPD",{
		retrieve_etablissement:etablissement,
		retrieve_pseudo:pseudo,
		retrieve_passe:passe,
		retrieve_passe2:passe2,
		retrieve_token:token
	},app.render);
}