<div class="well well-sm h3" id="connexion-password-recovery">
  <div class="text-end">
 <div class="btn btn-light btn-close" onclick="app.toggleViewById('connexion-password-recovery');$('#app').goTo();"></div>
 </div>

  <div class="flex-rows">


 <div class="form flex-1 text-center">
  <h3>Je ne connais pas mon code de récupération</h3>
  <div class="input-group">
    <div class="input-group-text"><span class="bi bi-house-door"></span></div> 
    <input type="text" class="form-control" list="list_schools" placeholder="Etablissement" id="retrieve_etablissement" value="" required/>
  </div>
  <div class="input-group">
    <div class="input-group-text"><span class="bi bi-people-fill"></span></div> 
    <input type="text" class="form-control" placeholder="Pseudo" id="retrieve_pseudo" value="" required/>
  </div>
  <br/>
  <button onclick="app.passwordRetrieveGetCode();" class="btn btn-primary"><span class="bi bi-save"></span> Envoyer</button>
</div>

<div class="form  flex-1 text-center aside">
  <h3>J'ai reçu mon code de récupération</h3>
  <div class="input-group">
    <div class="input-group-text"><span class="bi bi-house-door"></span></div>  
    <input type="text" class="form-control" list="list_schools" placeholder="Etablissement" id="retrieve_etablissement2" value="" required/>
  </div>
  <div class="input-group">
    <div class="input-group-text"><span class="bi bi-people-fill"></span></div>
    <input type="text" class="form-control" placeholder="Pseudo" id="retrieve_pseudo2" value="" required/>
  </div>
  <hr/>
  <div class="input-group">
   <div class="input-group-text"><span class="bi bi-chevron-right"></span></div> 
   <input type="password" class="form-control" placeholder="Nouveau mot de passe" id="retrieve_passe" value="" required/>
 </div>
 <div class="input-group">
   <div class="input-group-text"><span class="bi bi-chevron-right"></span></div> 
   <input type="password" class="form-control" placeholder="Confirmer le mot de passe" id="retrieve_passe2" value="" required/>
 </div>
 <div class="input-group">
   <div class="input-group-text"><span class="bi bi-chevron-right"></span></div>
   <input type="password" class="form-control" placeholder="Code de récupération" id="retrieve_token" value="" required/>
 </div>
 <br/>
 <button onclick="app.passwordRetrieveNew();" class="btn btn-primary"><span class="bi bi-check"></span> Valider</button>
</div>

</div>
</div>