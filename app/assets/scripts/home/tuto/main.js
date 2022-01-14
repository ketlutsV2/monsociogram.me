var app=app || {};

app.tutoSetStep=function(){
if(!app.tutoIsEnable){
	$('#home-tutoriel').addClass('d-none');
	return;
}
//app.tutoRenderStep();



$('.tuto-btn').removeClass('disabled');
$('.tuto-checkbox').prop('checked','');

app.tutoStep=0;


	if(app.classes.length>2){
		app.tutoStep++;
$('#tuto-step1-checkbox').prop('checked','checked');
$('#tuto-step1-btn').addClass('disabled');
	}else{
			$('#tuto-step2-btn').addClass('disabled');
	}


if(app.eleves.length>0){
		app.tutoStep++;
		$('#tuto-step2-btn').addClass('disabled');
		$('#tuto-step2-checkbox').prop('checked','checked');
	}else{

	}

 if(app.sociogrammes.length>0){
		app.tutoStep++;
				$('#tuto-step3-btn').addClass('disabled');
		$('#tuto-step3-checkbox').prop('checked','checked');
	}

	app.tutoRenderStep();


if(app.tutoStep!=3){
	$('#tuto-step4-btn').addClass('disabled');
}


//alert(app.tutoStep+" "+app.tutoFirst);

if(app.tutoStep==3 && app.sociogrammesSaves.length>0){

	$('#home-tutoriel').addClass('d-none');
app.tutoIsEnable=false;
	}
else{
	$('#home-tutoriel').removeClass('d-none');
}

}

app.tutoRenderStep=function(){
$('#tuto-progress').attr('aria-valuenow',app.tutoStep*25);
$('#tuto-progress').css('width',app.tutoStep*25+'%');
}

