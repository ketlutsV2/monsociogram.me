<template id="template-sociogrammes-form">
  {{#questions}}
  <td>
   <input type="text" id="sociogramme-question-{{nb}}-intitule" placeholder="Intitulé" value="{{intitule}}"/>
 </td>
 <td>
  <select class="form-control" id="sociogramme-question-{{nb}}-points">
   <option value="-5">-5</option>
   <option value="-4">-4</option>
   <option value="-3">-3</option>
   <option value="-2">-2</option>
   <option value="-1">-1</option>
   <option value="0">0</option>
   <option value="1" selected="">1</option>
   <option value="2">2</option>
   <option value="3">3</option>
   <option value="4">4</option>
   <option value="5">5</option>
 </select>
</td>
<td>
  <input id="sociogramme-question-{{nb}}-color" class="form-control sociogramme_question_color" type="color" value="{{color}}">
</td>
{{/questions}}
</template>


<template id="template-sociogrammes-liste">
  <option value="-3" disabled="disabled" style="display: none;" selected="selected">Mes sociogrammes</option>
<!--   <option value="add">Ajouter un sociogramme...</option> -->
  {{#sociogrammes}}
  <option value="{{sociogramme_id}}">{{sociogramme_name}}</option>
  {{/sociogrammes}}
</template>



<template id="template-sociogrammes-relations-form">
  <div class="close" onclick=" app.sociogrammeByClasse(app.sociogrammeCurrentClasse); ">
    <span class="btn btn-close"></span>
  </div>

  <select class="form-control" id="sociogrammeCurrentStudentSelect" onchange="app.sociogrammeStudentForm(this.value);">
    {{#eleves}} 
    <option value="{{eleve_id}}">{{eleve_nom_prenom}}</option>
    {{/eleves}} 
  </select>

  <hr/>

  {{#questions}} 
  <div class="student-relations-select-title" title="{{points}}" style="border-color:{{question_color}};">
    <span class="bi flaticon-cell9"> </span> {{question_intitule}} 
    <div class="list-group">
     <select id="socioRelation_{{question_id}}" onchange="app.saveRelations();" class="student-relations-select connexion-requise form-control">
       <option value="false" selected>Choisir une personne</option>
       {{#eleves}} 
       <option value="{{eleve_id}}">{{eleve_nom_prenom}}</option>
       {{/eleves}} 
     </select>
   </div>
 </div>
 {{/questions}}
 
</template>