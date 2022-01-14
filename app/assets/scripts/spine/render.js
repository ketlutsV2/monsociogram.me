var app=app || {};

app.spineRender=function(){
	var liste=app.spinePetales;

	$('.petale').addClass('petale-disabled');
	$('.spine_icon').addClass('petale-disabled');
	$('.spine_icon').html('');
	$('.spine_badge').css('display',"none");
	$('.spine_text').html('');
	$('.spine_icon').attr('data-url','');
	$('.petale').attr('data-url','');

	for (let i =0,lng= liste.length; i<lng; i++) {
		let button=liste[i];

		if(button.view=='userView' && app.userConfig.ppView){
			continue;
		}


		if(Math.floor(i/6)!=app.spinePage){
			continue;
		}
		var petale_id=i%6;

		if(app.spineWhiteList.length!=0){
			if(app.spineWhiteList.indexOf(button.url)>=0){
				$('#petale_'+petale_id).removeClass('petale-disabled');		
				$('#spine_icon_'+petale_id).removeClass('petale-disabled');
			}	
		}else{
			$('.petale').removeClass('petale-disabled');
			$('.spine_icon').removeClass('petale-disabled');
		}


		if(button.badge){
			$('#spine_badge_'+petale_id).css('display',"").html(button.badge);
		}

		document.getElementById('spine_icon_'+petale_id).innerHTML='<span class="'+button.icon+'"></span>';

		if(button.svg){
			document.getElementById('spine_icon_'+petale_id).innerHTML='<img src="assets/svg/all/'+button.svg+'.svg" width="50"/>';	
		}

		document.getElementById('spine_icon_'+petale_id).setAttribute('data-url',button.url);

		if(button.color){
			document.getElementById('petale_'+petale_id).style.fill=button.color;
		}
		
		document.getElementById('petale_'+petale_id).setAttribute('data-url',button.url);

		button.text=button.text||'';

		document.getElementById('spine_text_'+petale_id).innerHTML=button.text;

	}

	var quotient=Math.floor(liste.length/6);
	var reste=liste.length%6;
	var nbPages=quotient;
	if(reste!=0){
		nbPages++;
	}

	generatePolygon(nbPages);
}