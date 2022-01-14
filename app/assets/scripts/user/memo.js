var app=app || {};

app.setMemo=function(memo_type,memo_type_id,memo_data){  
  if (!app.checkConnection()) {return;} 
  //On met à jour les données
  $.post(app.serveur + "index.php?go=memos&q=add",
  {
    memo_type_id:memo_type_id,
    memo_type:memo_type,
    memo_data:memo_data,
sessionParams:app.sessionParams
  },
  function(data) {
    app.render(data);     
  });
}

app.getMemo=function(memo_type,memo_type_id){
var memos=app.userConfig.memos||[];
for (var i = memos.length - 1; i >= 0; i--) {
  var memo=memos[i];
if(memo.memo_type_id==memo_type_id && memo.memo_type==memo_type){
  return memo.memo_data;
}
}
return "";
}