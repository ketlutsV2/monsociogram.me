var app=app || {};

app.initAdminPlugins=function(){
  app.titleRender("<a href='#admin'>Administration</a> / Plugins");
  $('.config-admin').css('display','none');
  app.show('config-plugins');
  $('.admin-toolbar-btn').removeClass('btn-primary').addClass('btn-light'); 
  $('#admin-toolbar-btn-plugins').removeClass('btn-light').addClass('btn-primary');
  app.configPluginsListeRender();
}

app.configUpdatePlugin=function(name,value){
  var pluginsEnabled=[];
  for (var i = app.plugins.length - 1; i >= 0; i--) {
    var plugin=app.plugins[i];
    if(plugin.name==name){
      plugin.enabled=value;
      if(plugin.enabled){
        pluginsEnabled.push(plugin.name);
        (plugin['onEnabled'])();
      }
    }

  }

  app.serverConfigUPD({'plugins':JSON.stringify(pluginsEnabled)});
  return true;
}

app.configPluginsListeRender=function(){
  var html=[];
  for (var i = app.plugins.length - 1; i >= 0; i--) {
    var plugin=app.plugins[i];
    if(!plugin.display){
      continue;
    }
    var checked="";
    if(plugin.enabled){
      checked="checked";
    }

    html.push('<div class="well well-sm plugin-desciption">');
    html.push('<label class="switch">');

    html.push('<input type="checkbox" onclick="return app.configUpdatePlugin(\''+plugin.name+'\',this.checked);" '+checked+'/>');
    html.push('<span class="slider round"></span>');
    html.push('</label>');

    html.push('<h4>');
    html.push(plugin.name);
    html.push('</h4>');

    if(plugin.description){
      html.push('<hr/>');
      html.push(plugin.description);
    }

    html.push('</div>');
  }
  document.getElementById('config-plugins-descriptions').innerHTML=html.join('');
}