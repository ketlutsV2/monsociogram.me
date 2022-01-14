<div class="flex-columns home-page " id="home-classrooms">   
  <div class="btn-toolbar">
   <button class="btn btn-light" onclick="app.renderClasseAdd();">
    <img src='assets/svg/all/003-group.svg' width="25"/>
    Nouvelle cohorte
  </button> 

</div>

<div class="flex-1" id="cohortes-liste-bloc">
 <div class="bold text-start mb-3"> Choisis une cohorte.</div>
 <div id="home-classrooms-liste"></div>
</div>
</div>

<?php require_once('templates.php');