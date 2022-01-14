<div class="flex-1 aside sociogramme-classe" id="sociogramme-options">
 <div class="text-end">
    <div class="btn btn-light btn-close small-screen" onclick="app.go('sociogrammes/'+app.sociogramme.current+'/'+app.sociogrammeCurrentClasse);">
    </div> 
  </div>
<div class="h5">Filtres</div>



<div id="sociogrammeFilters"></div>


  <hr class="sociogramme-option"/>
<div class="sociogramme-option">

  Placement automatique
  <label class="switch">
    <input type="checkbox"  id="sociogrammeViewRangs" onchange="app.sociogrammeRenderRangsToggle();">
    <span class="slider round"></span>
  </label>
</div>

<div class="sociogramme-option sociogramme-rangs">
 Inverser les rangs
 <label class="switch">
  <input type="checkbox"  id="sociogrammeReverse" onchange="app.sociogrammeReverseToggle(this.checked);">
  <span class="slider round"></span>
</label>
</div>

<hr/>
  <div class="h5 text-center">Générateur</div>
  <hr class="small-screen" />
  <div id="groupes-info"></div>

  <input type="range" oninput="app.groupesInfoUpdate();" min="2" class="groupes-slider" id="groupsGenerator-groupsNb" name="groupsGenerator-groupsNb"/>
  <br/>
  <div  class="btn btn-light" onclick="app.getGroupes();"><span class="bi bi-arrow-repeat"></span> Générer</div>

  <hr/>
  <ul class="text-start" id="groupesOptions">
    <li>
     <input type="checkbox" id="sociogroupes" onchange="app.classroomGroupsCheckboxsRules('sociogroupes');" /> <label for="sociogroupes">Sociogroupes</label> 
    
  </li>

</ul>



<div id="classroom-groupes-save-bloc">
 <hr/>
 <div class="h5 text-center">Sauvegarde</div>

 <div id="classroom-groupes-selectSave" class="text-start"></div>
</div>

</div>