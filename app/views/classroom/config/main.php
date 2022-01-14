<div class="classroom-page" id="classe-config">
  <div class="text-end">
    <div class="btn btn-light btn-close large-screen" onclick="app.go('classroom/'+app.currentClasse.classe_id);">
  
  </div>
  </div>
	
  <div class="main flex-rows text-center">
   <div class="flex-4">
  
<div class="admin">  

    <div class="btn btn-light connexion-requise" onclick="app.renameClasse();">
      <span class="bi bi-pencil-square"> </span> 
      Renommer cette cohorte
    </div>
  
    <div class="btn btn-light connexion-requise" onclick="$('#classe-delete').css('display','block');">
      <span class="bi bi-trash"></span> 
      Supprimer cette cohorte
    </div>
  </div> 

  </div>


</div>

</div>

<?php
include('delete.php');
?>