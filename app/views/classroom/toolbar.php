<div class="toolbar flex-rows" id="classroom-toolbar">  

  <div class="text-start flex-1">

    <button onclick="app.go('classroom/'+app.currentClasse.classe_id+'/import');" title="Ajouter une personne" class="btn btn-light">
      <span class="bi bi-person-plus-fill"></span>
     Nouvelles personnes 
    </button>

 <div class="btn btn-light ifCohortes large-screen" onclick="app.go('sociogrammes/'+app.currentClasse.classe_id+'');">
     <span class="bi bi-bullseye"> </span>
     <span class="large-screen">Créer un sociogramme</span>
   </div>



  <!--   <div class="btn btn-light ifCohortes large-screen" onclick="app.go('classroom/'+app.currentClasse.classe_id+'/groups');">
     <span class="bi bi-people-fill"> </span>
     <span class="large-screen">Générer des groupes</span>
   </div> -->

 </div>   

<div class="text-end large-screen">
  
   <button onclick="app.go('classroom/'+app.currentClasse.classe_id+'/config');" title="Configuration de la cohorte" class="btn btn-light">
      <span class="bi bi-gear"></span>
    </button>
</div>


</div>
