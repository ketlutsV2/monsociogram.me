<div id="sociogramme_form" class="sociogramme-bloc">
  <div class="text-end">
    <div class="btn btn-light btn-close" onclick="app.go('sociogrammes/'+app.sociogrammeCurrentClasse);"></div>
  </div>
  <!-- <div class="" id="sociogramme-edition-title"></div> -->

  <div class="flex-rows main">

    <div class="flex-1">

<div class="form-floating">
   <input class="form-control" type="text" id="sociogramme-name"/>
  <label for="floatingInput">Nom du questionnaire</label>
</div>  
 <hr/>
      <div class="">Modèles</div>
      <button class=" btn btn-light" onclick="app.sociogrammeAddModele('simple');">Simple (3 questions)</button>
      <button class=" btn btn-light" onclick="app.sociogrammeAddModele('avance');">Avancé (4 questions)</button>

     
      <br/>  

 <br/>  


      <div class="btn-toolbar justify-content-between footer-mobile-toolbar">


       

        <button class="btn btn-primary" onclick="app.sociogrammeCreate();"><span class="bi bi-save"></span> Enregistrer</button>
        <button class="btn btn-danger" id="sociogramme-delete-button" onclick="app.sociogrammeDelete();"><span class="bi bi-trash"></span> Supprimer</button>
      </div>

    </div>


    <div class="flex-1 aside">
 <button class="btn btn-light" onclick="app.sociogrammeAddQuestion();"><span class="bi bi-plus"></span> Ajouter une question</button>
      <table class="table">
        <thead>
          <tr>
            <th>Questions</th>
            <th>Points</th>
            <th>Couleur des liens</th>
          </tr>
        </thead>
        <tbody id='sociogramme_questions'>


        </tbody>
      </table>



     
    </div>



  </div>






</div>