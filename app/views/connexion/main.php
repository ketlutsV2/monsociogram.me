<div class="template_connexion box" id="connexion-header">
  <span class="h1">  
    <a href="#home" title="MonSociogram.me"><img src='assets/img/logo.svg' width="50" /></a>
    <span>
      MonSociogram<span class="small">.me</span>
    </span>
  </span>
</div>

<div class="template template_connexion box">
  <div class="flex-rows main">
    <div class="main-reverse flex-rows flex-3">
      <div class="flex-1 flex-columns" id="connexion-menu">
        <div class="btn-group-vertical">
          <button class="btn btn-light" id="connexion-menu-nouvelEtablissement" autocomplete="off" onclick="app.renderCreateAccountForm('etablissement');"><span class='bi bi-plus'></span> Créer un compte</button> 
        </div>
      </div>
      <div class="flex-2 text-center" id="connexion-user-form">    
        <?php require_once('form.php'); ?>
        
      </div>
    </div>
    <div class="flex-1 text-center">
      <!-- ASIDE -->
    </div>
  </div>

  <?php require_once('recovery.php'); ?>

  <div class="clearfix"></div>
  <div id="connexion-plugins-bloc"></div>
</div>