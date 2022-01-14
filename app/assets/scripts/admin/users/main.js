var app=app || {};

app.buildUsersIndex=function(){ 
  app.usersIndex=[];
  for (var i = 0, lng = app.users.length; i < lng; i++) {
    app.users[i].user_pseudo=ucfirst(app.users[i].user_pseudo);
    app.usersIndex[app.users[i].user_id]=app.users[i];
  }
}
app.getUserById=function(user_id){
  return app.usersIndex[user_id]||false;  
}
