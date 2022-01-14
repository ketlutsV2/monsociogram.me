var app=app || {}; 

app.classeElevesAddRender=function(){
 document.getElementById('classroom-addStudents').style.display = "block";
 document.getElementById("classroom-addStudents-liste").innerHTML="";
 app.elevesAddInputRender();
};