<div class="classroom-page" id="classroom-addStudents">


<div class="flex-colums">

  <div class="flex-rows">
    <div>
     <div class="btn-toolbar">  

       
       <div onclick="$(this).button('loading');app.submitEleveForm();" class="btn btn-primary classroom-addStudents-btn" data-loading-text="Enregistrement..."><span class="bi bi-save"></span> Enregistrer</div>
       
     </div>
   </div>
   <div class="flex-1 text-end">
     <div class="btn btn-light btn-close" onclick="app.go('classroom/'+app.currentClasse.classe_id);">  
     </div> 
   </div>
 </div>


 
 <div class="flex-rows">
  <div class="flex-1 flex-columns">

   <div class="h4">Nouvelles personnes</div>
   
   <div class="btn-toolbar">  

     <div  class="btn btn-light me-2" onclick="app.elevesAddInputRender();"><span class="bi bi-plus"></span> Nouvelle personne</div>  
     
     
   </div>
   <div id="classroom-addStudents-liste"></div>  
 </div> 

 <div class="flex-colums flex-1 aside large-screen">
  

  
     <div class="h4"> 
      Importer depuis un tableur<br/>
      <small>
        Colonne 1 : NOM  / Colonne 2 : Prénom<br/>
        Vous pourrez vérifier des données avant d'enregistrer.
      </small>
    </div>
    <textarea id="import-tableur" class="form-control" placeholder="Copier/Coller depuis le tableur."></textarea>
    <div class="text-center">
      <button class="btn btn-light" id="import-tableur-btn" onclick="$(this).button('loading');app.importFromTableur();" data-loading-text="Import en cours...">    
        <span class="bi bi-cloud-upload"></span> Importer
      </button>
    </div>


  
  
</div>

</div>
</div>

</div>