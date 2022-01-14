<div class="template template_eleve flex-columns flex-1">

    <div id='eleve-edit' class="eleve-page box flex-1"> 

       <div class="text-end">
         <div class="btn btn-light btn-close" onclick="app.go('classroom/'+app.currentClasse.classe_id);">  
         </div> 
     </div>

     <div class="flex-rows main">
         <div class="flex-3">
            <div class="flex-rows main">

              <div class="flex-1">

                 <div class="form-floating">
                    <input type="text" class="form-control" id="eleve_nom" onkeypress="app.show('eleve_infos_save');" placeholder="DOE">
                    <label for="floatingInput">NOM</label>
                </div>

                <div class="form-floating">
                 <input type="text" class="form-control" id="eleve_prenom" onkeypress="app.show('eleve_infos_save');" placeholder="John">
                 <label for="floatingInput">Prénom</label>
             </div>

             <div>&nbsp</div>

             <div class="flex-rows">

                 <div id="eleve_infos_save" class="btn-toolbar">
                    <div class="btn btn-primary connexion-requise float-right" onclick="app.eleveInfosUpdate();$(this).button('loading');" data-loading-text="Enregistrement..." id="eleve_infos_save_btn">
                       <span class="bi bi-save"></span> 
                       Enregistrer
                   </div> 

               </div>
               <div class="flex-1 text-end">
                 <div class="btn btn-light admin connexion-requise" onclick="app.studentDelete();">
                    <span class="bi bi-x"></span> 
                    <span>Supprimer cette personne</span>
                </div>

            </div>
        </div> 

    </div>

    <div class="flex-1 aside">

        <div class="flex-columns main text-center">
            <div class="flex-1" id="student-edit-picture"></div>

            <div class="flex-3">
              <div class="input-group mb-3">
                 <input type="file" class="form-control" id="eleve-picture-input" accept="image/*" onchange="app.studentPictureSelect(this);app.show('eleve_infos_save');" />
                 <button class="btn btn-outline-secondary" type="button" onclick="app.studentPictureSelectDelete();"><span class="bi bi-x" ></span></button>

             </div>
         </div>

     </div>
 </div>
</div>
</div>
</div>
</div>

</div>