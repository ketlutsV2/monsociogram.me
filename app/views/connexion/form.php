 
<div class=" well well-sm">
 <form onsubmit="return false">
  <button onclick="app.connexionValidForm();" hidden></button>
  
 <div class="form-group">
   <div class="input-group">       
     <div class="input-group-text" id="prefix"></div>
     <input class="form-control" id="user_pseudo" name="user_pseudo" placeholder="Pseudo" />
   </div>
   <div class="input-group">
     <div class="input-group-text"><span class="bi bi-chevron-right"></span></div>
     <input class="form-control" id="user_passe" name="user_passe" placeholder="Mot de passe" type="password"/>
   </div>
   <div class="input-group" id="user_passe2_form">
     <div class="input-group-text"><span class="bi bi-chevron-right"></span></div>
     <input class="form-control" id="user_passe2" name="user_passe2" placeholder="Confirmez le mot de passe" type="password"/>
   </div>
   <br/>
   <div class="flex-rows">
    <div class="text-start flex-1">
      <a href="#" onclick=" $('#connexion-password-recovery').css('display','block').goTo();"> Mot de passe perdu ?</a>
      
    </div>
    <div class="text-end flex-1">
     <div id="connexion-btn-step1">
       <div class="form-group text-end">
        <button id="connexion-btn-user" class="btn btn-primary connexion-btn" onclick="$(this).button('loading');app.connexionValidForm();" data-loading-text="Connexion en cours..." type="submit"><span class='bi bi-box-arrow-in-right'></span> Connexion</button> 
        <br/>
        Rester connecté <input type="checkbox" id="connexion_auto"/>     
      </div>
    </div>
  </div>
</div>



</div>
<div>&nbsp</div>

<div id="connexion-btn-step2" class="text-center">
  <button class="btn btn-light float-left" onclick="app.connexionRender();">Annuler</button> 
  <button class="btn btn-primary float-right connexion-btn connexion-requise" onclick="$(this).button('loading');app.connexionValidForm();" data-loading-text="Création du compte..."  data-loading-text="Création en cours..." ><span class='bi bi-plus'></span> Créer ce compte</button> 
</div>
</form>

</div>