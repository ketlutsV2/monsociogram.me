var app=app || {};

app.titleRender=function(value){
  $('.title').html(value);
}

/*app.renderLegendsUsers=function(div_id){
  app.legendsUsers.sort(function(a,b){
   return b.localeCompare(a);
 });
  var lng=app.legendsUsers.length;
  var legendeHtml=[];
  var eventUser = [];
  if(lng!=0){
   for (var i =0; i<lng; i++) {
    var user=app.getUserById(app.legendsUsers[i]);   
    var user_discipline=app.getDisciplineById(user.user_matiere).discipline_name||"";
    if(eventUser.indexOf(user.user_pseudo)<0){
      legendeHtml.push("<div class='well well-sm legende' style='border-color:#" + app.getColor(user.user_pseudo) + ";'><b>" + user.user_pseudo + "</b><br/><i>" + ucfirst(user_discipline) + "</i></div>");
    }
    eventUser.push(user.user_pseudo);
  };
}
$('.usersLegend').css('display','block').html(legendeHtml.join(''));
};*/

function NeutralizeAccent(data){
  return !data
  ? ''
  : typeof data === 'string'
  ? data
  .replace(/\n/g, ' ')
  .replace(/[éÉěĚèêëÈÊË]/g, 'e')
  .replace(/[šŠ]/g, 's')
  .replace(/[čČçÇ]/g, 'c')
  .replace(/[řŘ]/g, 'r')
  .replace(/[žŽ]/g, 'z')
  .replace(/[ýÝ]/g, 'y')
  .replace(/[áÁâàÂÀ]/g, 'a')
  .replace(/[íÍîïÎÏ]/g, 'i')
  .replace(/[ťŤ]/g, 't')
  .replace(/[ďĎ]/g, 'd')
  .replace(/[ňŇ]/g, 'n')
  .replace(/[óÓ]/g, 'o')
  .replace(/[úÚůŮ]/g, 'u')
  : data
}