<div class="flex-rows">
    <div>
       <div class="classroom-students-groupe-toolbar large-screen">
    <div class="float-left btn-group" id='classroomSociogroupsToolbar' style="display: none;">    
     <div class="btn btn-light" title="Cohésion des groupes" onclick="$('.classroom-groupes-cohesion').toggleClass('hide');">
        <span class="bi bi-people-fill"></span> Cohésion
    </div>
  
</div> 
<div class="btn btn-light" onclick="app.classroomsGroupsPrint();">
    <span class="bi bi-printer"> Imprimer</span> 
</div>    
<div id="classroom-groupes-doSave" class="btn btn-light" onclick="app.renderGroupSave();"><span class="bi bi-save"></span> Sauvegarder</div>

</div>
    </div>
    <div class="flex-1 text-end">
     <div class="btn btn-light btn-close large-screen" onclick="app.go('sociogrammes/'+app.currentClasse.classe_id+'/'+app.sociogramme.current);">  
     </div> 
   </div>
 </div>




