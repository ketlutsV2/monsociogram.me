<div class="config_user box template_config template">

  <div class="flex-rows main" >  
    <div class="flex-1">

      <div class="flex-rows main-reverse user-config" id="user-main">
        <div class="flex-1">
          <span class="h3">Informations</span>
          <div class="input-group">
            <div class="input-group-text">
              <span class="bi bi-chevron-right"></span>
            </div>
            <input class="form-control" onchange="app.show('btn_save_config');" id="user_nom" placeholder="NOM"/>
          </div>       
          <div class="input-group">
            <div class="input-group-text">
              <span class="bi bi-chevron-right"></span>
            </div>
            <input class="form-control" onchange="app.show('btn_save_config');" id="user_prenom" placeholder="Prénom"/>
          </div>
          <br/>
          
          <div class="input-group">
            <div class="input-group-text">
              <span class="bi bi-envelope"></span>
            </div>
            <input class="form-control" onchange="app.show('btn_save_config');" id="user_mail" placeholder="Adresse mail"/>
          </div>
        </div>
        <div class="flex-1 flex-columns" id="config_avatar_block">
         
          <svg id="config_avatar" width="100" height="100" data-jdenticon-value="icon value"></svg>
          <div class="h3 config_pseudo" id="config_pseudo"></div>
        </div>

      </div>
      <br/>
      <div class="btn btn-danger" onclick="app.go('admin/delete');"><span class="bi bi-x"></span> Supprimer ce compte</div>
    </div>
    
<hr class="small-screen"/>

    <div class="flex-1 aside user-config text-center" id="user-security">
      <div class="h3 text-start">Mot de passe</div>
      <div class="input-group">
        <div class="input-group-text"><span class="bi bi-lock"></span></div>
        <input class="form-control" type="password" id="user_old_passe" placeholder="Ancien mot de passe"/>
      </div>
      <br/>
      <div class="input-group">
        <div class="input-group-text"><span class="bi bi-lock"></span></div>
        <input class="form-control" onkeypress="app.show('btn_save_config');" type="password" id="user_new_passe" placeholder="Nouveau mot de passe"/>
      </div>
      <div class="input-group">
        <div class="input-group-text"><span class="bi bi-lock"></span></div>
        <input class="form-control" type="password" id="user_new_passe_bis" placeholder="Nouveau mot de passe (encore)"/>
      </div>
    </div>
  </div>
  <button class="btn btn-primary config_btn" id="btn_save_config" onclick="app.userUPD();$(this).button('loading');" data-loading-text="Enregistrement...">
    <span class="bi bi-save"></span> Enregistrer
  </button>  

  <hr class="large-screen"/>

  <div class="flex-rows main user-config" id="user-events">


  </div>


</div>