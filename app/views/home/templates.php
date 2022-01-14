<template id="template-home-classes">
  {{#classes}}  
  {{#.}}
  <div class="home-classroom-btn" onclick="app.go('sociogrammes/{{classe_id}}');">
    <div class="home-classroom-box flex-columns">

      <div  class="home-classroom-name" style="border-color: {{color}}">
        {{classeNom}}
      </div> 



      <div class="flex-rows home-classroom-toolbar">
        <div class="flex-1 text-start">

          <a class="btn btn-light btn-sm" href="#classroom/{{classe_id}}" onclick="event.stopPropagation();">
            <span class="bi bi-person-plus-fill"></span>  {{classeNbEleves}} 
          </a>

        </div>

        <div class="flex-1">
          {{#hasEleves}} 
          <a class="btn btn-light btn-sm ifCohortes" href="#sociogrammes/{{classe_id}}" onclick="event.stopPropagation();">
            <span class="bi bi-bullseye"></span>  
          </a>
          {{/hasEleves}} 

        </div>
      </div>

    </div>

  </div>
  {{/.}}  

  {{/classes}}
</template>