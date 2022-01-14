var app=app || {};

app.connexionRender=function(){
	app.viewClear();
	$('#app').goTo();
	$(".template_connexion").css('display','block');
	document.getElementById('connexion-header').style.display = "";  
		$('#home-tutoriel').css('display','none');
	$("#connexion-password-recovery").css('display','none');
	document.getElementById('connexion-btn-step1').style.display="block";
	document.getElementById('connexion-btn-step2').style.display="none";
	document.getElementById('connexion_auto').checked="";
	document.getElementById('header').style.display = "none";
	$('.connexion-btn').button('reset');
	document.getElementById('prefix').innerHTML='<span class="bi bi-people-fill"></span>';
	app.titleRender("");
	$(document.body).trigger("sticky_kit:recalc");

	document.getElementById("user_pseudo").value="";
	document.getElementById("user_passe").value="";
	document.getElementById("user_passe2").value="";

	document.getElementById('user_passe2_form').style.display="none";
	document.getElementById('connexion-user-form').style.display="block";

	app.connexionFormMode='connexion';

	if(app.etablissementsCRT==false){
		$('#connexion-menu-nouvelEtablissement').prop("disabled", true);
	}
	
	app.pluginsLauncher('connexionAfterRender');
}

app.renderCreateAccountForm=function(type){
	let pseudo=document.getElementById('user_pseudo').value;
	let passe=document.getElementById('user_passe').value;        
	
	if(type=="etablissement"){
		app.connexionFormMode='create';
	}else{
		app.connexionFormMode='connexion';
	}
	document.getElementById('user_passe2_form').style.display="";
	$('#connexion-btn-step1').css('display','none');
	$('#connexion-btn-step2').css('display','block');
	$('.connexion-btn').button('reset');
}