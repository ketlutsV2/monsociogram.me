<div id="home-tutoriel" class="d-none template flex-columns box template_sociogrammes template_home template_classe">
	<div id="" class="flex-rows text-center mb-2 ">

		<div class="flex-1">
			<div class="fw-bold text-center">Étape 1 <input type="checkbox" id="tuto-step1-checkbox" class="tuto-checkbox">
			</div>
					
			Créé ta première cohorte.
			<br/>
			<button id="tuto-step1-btn" class="tuto-btn btn btn-light" onclick="app.renderClasseAdd();">
				<img src='assets/svg/all/003-group.svg' width="25"/>
				Nouvelle cohorte
			</button> 
		</div>

		<div class="flex-1 aside">
			<div class="fw-bold text-center">Étape 2 <input type="checkbox" id="tuto-step2-checkbox" class="tuto-checkbox"></div>
			Ajoute des personnes à ta cohorte.
			<br/>
			<button id="tuto-step2-btn" class="tuto-btn btn btn-light" onclick="app.go('#classroom/'+app.classes[0].classe_id+'/import');">
				<span class="bi bi-person-plus-fill"></span>
				Nouvelles personnes
			</button> 
		</div>

		<div class="flex-1 aside">
			<div class="fw-bold text-center">Étape 3 <input type="checkbox" id="tuto-step3-checkbox" class="tuto-checkbox"></div>
			Créé ton premier questionnaire.
			<br/>
			<button id="tuto-step3-btn" class="tuto-btn btn btn-light" onclick="app.go('#sociogrammes/add');">
				<img src='assets/svg/all/038-test.svg' width="25"/>
				Nouveau questionnaire
			</button> 
		</div>
			<div class="flex-1 aside">
			<div class="fw-bold text-center">Tout est prêt !</div>
			<br/>

			<button id="tuto-step4-btn" class="tuto-btn btn btn-light" onclick="app.go('#sociogrammes/'+app.classes[0].classe_id+'/'+app.sociogrammes[0].sociogramme_id);">
				Créer un sociogramme !				
			</button> 
		</div>

	</div>

	<div class="progress mb-2 ">
		<div id="tuto-progress" class="progress-bar" role="progressbar" style="width: 0%;" aria-valuenow="0" aria-valuemin="0" aria-valuemax="100"></div>
	</div>
</div>