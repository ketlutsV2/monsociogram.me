var app=app || {}; 

app.elevesAddInputRender=function(options) {
	if (!app.checkConnection()) {
		return;
	}
	options=options||{};
	var div=document.getElementById("classroom-addStudents-liste");
	var n=document.getElementsByClassName('input_eleve').length;
	var new_eleve= document.createElement("div");
	new_eleve.className="input_eleve";
	new_eleve.id="new_eleve_"+n;

	var html=[];
	html.push('<div class="classroom-addStudents-liste-student flex-rows">');

	html.push('<div class="flex-1 me-2 flex-rows">');
 //Colonne de droite
 html.push('<button type="button" id="input_eleve_btn_'+n+'" class="btn btn-light me-2 " onclick="app.elevesAddInputRemove('+n+');" >');
 html.push("<span class='bi bi-trash'></span><span class=''> </span>");
 html.push('</button>');
 html.push('<div class="form-group">');
 if(options.eleve_nom=="null"){options.eleve_nom="";}
 var value = options.eleve_nom||"";
 html.push('<input type="text" class="form-control" name="eleves_noms[]" placeholder="NOM" id="input_eleve_nom_'+n+'" value="'+value+'"/>');
 html.push('</div>');

 html.push('</div>');
 //Colonne de gauche
 html.push('<div class="flex-1 me-2">');

 html.push('<div class="form-group">');
 if(options.eleve_nom=="null"){options.eleve_prenom="";}
 var value = options.eleve_prenom||"";
 html.push('<input type="text" class="form-control" name="eleves_prenoms[]" placeholder="Prénom" id="input_eleve_prenom_'+n+'" value="'+value+'"/>');
 html.push('</div>');

//Fin : Colonne de gauche
html.push('</div>');

html.push('<div class="">');

html.push('</div>');

html.push('</div>');
new_eleve.innerHTML=html.join('');

div.appendChild(new_eleve);
var input_id = document.createElement("input");
input_id.name = "eleves_ids[]";
input_id.value = options.eleve_id||"";
input_id.type = "hidden";
input_id.id = "input_eleve_id_"+n;
div.appendChild(input_id);
if(options.eleve_id){
	document.getElementById('input_eleve_nom_'+n+'').disabled = true;
	document.getElementById('input_eleve_prenom_'+n+'').disabled = true;
	document.getElementById('input_eleve_id_'+n+'').disabled = true;
}
};