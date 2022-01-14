 <div class="sociogramme-bloc flex-rows main" id="sociogramme-toolbar">

  <div class="flex-1 text-start flex-rows">


          
    <div class="btn btn-light sociogrammes-classes-toolbar me-2" title="Tableau de synthèse" onclick="app.go('sociogrammes/'+app.sociogrammeCurrentClasse+'/'+app.sociogramme.current+'/synthese');">
      <span class="bi bi bi-table"></span> Synthèse
    </div>

    <a class="btn btn-light me-2" id="sociogrammes-create-button" href="#sociogrammes/add">
      <img src='assets/svg/all/038-test.svg' width="25"/>
      Nouveau questionnaire
    </a> 

    <div class="sociogrammes-classes-toolbar">
     <button class="btn btn-light" id="sociogramme-scissors-btn" onclick="app.sociogrammeRelationsReset();" title="Supprimer toutes les relations"><span class="  bi bi-scissors"></span>  Supprimer les relations     
     </button>  
     <button class="btn btn-light" id="sociogramme-sociogroups-btn" onclick="app.sociogrammeGroupsDetectorRender();" title="Détecter et créer les groupes"><span class="bi bi-people-fill"> </span>  Sauvegarder ses groupes    
     </button>  
   </div>

 </div>




 <div class="text-end sociogramme-classe" id="sociogramme-smalltoolbar">


  <button class="btn btn-light" onclick="app.sociogrammeElevesPositionsReset();" title="Réinitialiser les positions"><span class="bi bi-arrow-repeat"></span>
  </button>

  <div class="btn-group">
    <div class="btn btn-light" id="sociogramme-zoom-out-btn" onclick="app.sociogrammeZoom(-0.05);">
      <span class="bi bi-zoom-out"></span>
    </div>
    <div class="btn btn-light" id="sociogramme-zoom-in-btn" onclick="app.sociogrammeZoom(0.05);">
      <span class="bi bi-zoom-in"></span>
    </div>
  </div>

  <div class="btn-group">         
   <a class="btn btn-light" href="#" target="_blank" rel="noreferrer" id="classroom-sociogramme-export" onclick="app.sociogrammePictureGet();" title="Exporter l'image"><span class="bi bi-image"></span>
   </a> 
   
 </div>

 <div class="btn-group small-screen">    
  <span class="btn btn-light" onclick="app.go('sociogrammes/'+app.sociogrammeCurrentClasse+'/'+app.sociogramme.current+'/options');"><span class="bi bi-gear"></span></span>
</div>


</div>




</div> 


<div id="sociogramme_noRelations" class="sociogramme-classe">Cliquez sur une personne pour définir des relations.</div>