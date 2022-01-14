 <div class="box flex-columns" id="header">    
  <div class="main-reverse flex-rows">
   <div class="flex-1">
    <div class="large-screen">
      <a href="#home" title="MonSociogram.me">
        <img class="header-logo" src='assets/img/logo.svg' width="50"/>
      </a>
      <div class="btn-group">
        <div id="header-toolbar-after"></div>
      </div>
      <span class="title" id="titre"></span>
    </div>
  </div>

  <div class="small-screen">
    <div class="flex-rows title-bloc">
      <img class="header-logo" onclick="app.go('home');" src='assets/img/logo.svg' title="Accueil"/>
      <span class="title flex-rows"></span>
    </div>    
  </div>


  <div class="large-screen" id="header-toolbar-right"> 
    <div class=" flex-rows">
     <div class="text-end">
      <div class="btn-group">
       <a href="#user" class="btn btn-primary userView" title="Administration">
        <img src='assets/svg/all/016-settings-a.svg' width="20"/>
        <span class="home-pseudo"></span>
      </a> 
    </div>

    <a href="https://spinell.app/paiements/" target="_blank" rel="noreferrer" title="Soutenir le projet" class="btn btn-primary "><img src="assets/svg/all/coeur.svg" width="20"/> Soutenir</a>
    <span class='btn  btn-primary' onclick='app.deconnexion();' title="Déconnexion">

      <img  src='assets/svg/all/008-power-button-1.svg' width="20"/>
    </span>
  </div>
</div>
</div> 

</div>
</div>