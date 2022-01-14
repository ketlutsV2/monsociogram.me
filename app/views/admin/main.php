<div class="box template_config template flex-columns" id="config-admin-bloc">

<div class="box template_config template" id="config_school_delete">
 <div class="well well-sm text-center">
      <div class="h2">Suppression du compte</div>
      <div class="h3">Attention !</div>
      <ul>
        <li>Toutes les données seront perdues.</li>
      </ul>
      <div class="btn-group">
        <button class="btn btn-light" onclick="app.go('user');">Annuler</button>
        <button class="btn btn-danger" data-loading-text="Suppression en cours..." id="config_school_delete_btn" onclick="app.etablissementDEL();"><span class="bi bi-x"></span> Supprimer ce compte !</button>
      </div>
    </div>

  </div>
  
</div>
