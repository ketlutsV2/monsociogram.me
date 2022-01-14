var app=app || {};

app.onMobile=function() {
if(window.innerWidth<=900){
	return true;
}
return false;
};