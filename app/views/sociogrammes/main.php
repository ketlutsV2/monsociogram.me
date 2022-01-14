<div class="template box flex-columns template_sociogrammes">
  <?php
  include('toolbar.php');
  include('form.php');
  include('synthese.php');
  ?>


  <div class="flex-rows main flex-1 sociogramme-bloc" style="position: relative;" id="sociogramme-main">
    <div class="flex-1 sociogramme-bloc" id="sociogramme-student-form-block">
      <div id="sociogramme-student-form"></div>
    </div>


    <div class="flex-4 flex-columns sociogramme-bloc" id="sociogramme-render">

     <div id="questionnaires-liste-bloc" class="">
       <div class="bold text-start mb-2">Choisis un questionnaire.</div>
       <div id="sociogrammes-tab" class="">  </div>

     
       <div class="bold text-start mb-2"><span class="bi bi-arrow-return-right"></span> Mes questionnaires</div>
       <div id="questionnaires-liste" class=""></div>
     </div>



     <div id="classroom-sociogramme" class="text-center flex-1 sociogramme-bloc sociogramme-classe">
       <canvas id="sociogramme-canvas" onmouseover="app.sociogrammeMouseOver();" onmouseout="app.sociogrammeMouseOut();" onmousedown="app.start_move();" onmouseup="app.end_move();" onclick="app.sociogrammeMouseClick();">
       </canvas>
     </div>
   </div>


   <?php
   include('aside.php');
   ?>
 </div> 



</div>

<?php
include('templates.php');
?>