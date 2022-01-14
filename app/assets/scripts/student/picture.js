var app=app || {};

app.studentPictureSelect=function(input){ 
	if (input.files && input.files[0]) {
		var reader = new FileReader();
		reader.onload = function (e) {	
			var img=document.createElement('img');	
			img.setAttribute('id','student-edit-picture-img');
			img.src=e.target.result;
			$('#student-edit-picture').html(img);
		}
		reader.readAsDataURL(input.files[0]);
	}	
}

app.studentPictureEditCancel=function(){
	app.studentPictureSet();
}

app.studentPictureSave=function(){ 
	if (!app.checkConnection()) {return;}
	if(app.currentEleve.delete_eleve_picture){
		app.currentEleve.eleve_picture="";
		$.post(app.serveur + "index.php?go=eleves&q=deletePicture",
		{
			eleve_id:app.currentEleve.eleve_id,
			sessionParams:app.sessionParams
		},
		function(data) {
			app.render(data);   
		});
		return;
	}

	var data=$('#student-edit-picture-img').attr('src');	
	if(data.indexOf('base64')<0){
		app.studentPictureEditCancel();
		return;
	}
	var eleve_id=app.currentEleve.eleve_id;
	var input=document.querySelector('#eleve-picture-input');
	if(!input.files[0]){
		return;
	}
	var form = new FormData();
	form.append('file', input.files[0]);
	form.append('eleve_id',app.currentEleve.eleve_id);	
	form.append('sessionParams',app.sessionParams);
	$.ajax( {
		url: app.serveur + "index.php?go=eleves&q=addPicture",
		type: 'POST',
		data: form,
		processData: false,
		contentType: false,
		success:function(data){
			app.render(data);   			
		}
	} );
}

app.studentPictureSet=function(eleve_id,get){
	eleve_id=eleve_id||app.currentEleve.eleve_id;
	var eleve=app.getEleveById(eleve_id);
	var photo=app.renderStudentPicture(eleve_id);
	if(get){
		return photo;
	}
	$('#student-picture').html(photo);
	$('#student-edit-picture').html(photo);
}

app.renderStudentPicture=function(eleve_id){
	var eleve=app.getEleveById(eleve_id);
	var photo='<svg class="student-picture" data-jdenticon-value="student_'+eleve_id+'"></svg>';
	if(app.isConnected){
		if(eleve.eleve_picture && eleve.delete_eleve_picture!=true){
			photo='<img class="student-picture" src="'+app.serveur + 'index.php?go=eleves&q=getPicture&file='+eleve.eleve_picture+'&sessionParams='+encodeURI(app.sessionParams)+'"/>';
		}
	}
	return photo;
}

app.studentPictureSelectDelete=function(){
	app.currentEleve.delete_eleve_picture=true;	
	app.show('eleve_infos_save');
	app.studentPictureSet();
	jdenticon.update('.student-picture');
}