var app=app || {};

app.renderUserConfig=function(){  
	app.viewClear();
	app.currentView="config";
	$(".config_user").css("display","block");

	app.currentClasse=null;
	app.currentEleve=null;

	app.hide('btn_save_config');

	app.initUserConfigMain();
	app.show('user-security','');
};





app.initUserConfigMain=function(){
	app.titleRender("Mon compte");
/*	if(app.onMobile()){
		$('.user-config-toolbar-btn').removeClass('btn-primary').addClass('btn-light'); 
		
		$('.user-config').css('display','none');
	}*/
	app.userConfigRenderForm();	
	app.show('user-main','flex');
}