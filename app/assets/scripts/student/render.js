var app=app || {};

app.renderEleveNom=function(eleve,cut,firstletter){
	var nom=eleve.eleve_nom.toUpperCase();
	var prenom="";
	if(eleve.eleve_prenom){
		prenom=ucfirst(eleve.eleve_prenom);
	}

	if(!nom){
		return prenom;
	}
	if(nom && !prenom){
		return nom;
	}
	if(cut){
		if(app.userConfig.sorting<4){
			nom=nom[0]+".";
		}
		if(prenom){
			if(app.userConfig.sorting>=4){
				prenom=prenom[0]+".";
			}
		}
	}

	if(firstletter){
		if([0,1,6,7].indexOf(app.userConfig.sorting)>=0 ){
			prenom= "<div class='bolder-first-letter'>"+prenom+"</div> ";
		}
		else{
			nom= "<div class='bolder-first-letter'>"+nom+"</div> ";
		}
	}

	if(app.userConfig.sorting<4){

		return prenom+" "+nom;
	}else{
		
		return nom+" "+prenom;
	}	
};