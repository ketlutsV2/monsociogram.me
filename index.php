<?php

$pdo = new PDO('sqlite:data/stats.db');
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
$lastMonthTime=time()-2592000;


$stmt = $pdo->prepare("SELECT * FROM users 
        WHERE user_connexionLastDate>=$lastMonthTime");
    $stmt->execute();

   $nbUserActif=count($stmt->fetchAll());   


function getNbEtablissements(){
    $dossier_url="data/schools";
    $etablissements=array();
    if($dossier = opendir($dossier_url)){
        while(false !== ($alpha = readdir($dossier)))
        {
            if(is_dir($dossier_url.'/'.$alpha) AND $alpha!="." AND $alpha!=".."){
                if($sous_dossier = opendir($dossier_url.'/'.$alpha)){
                    $k=0;
                    while(false !== ($fichier = readdir($sous_dossier)))
                    {
                        if(is_dir($dossier_url.'/'.$alpha.'/'.$fichier) AND $fichier!="." AND $fichier!=".." AND $fichier!="files"){

                            array_push($etablissements, $fichier);
                            $k++;
                        }
                    }
                    if($k==0){
                        array_push($etablissements, $alpha);
                    }
                }
            }
        }
    }
    return count($etablissements);
}

$nbEtablissements=getNbEtablissements();

?>
<!DOCTYPE html>
<html lang="fr">
<head>
	<title>MonSociogram.me</title>
	<meta name="author" content="Pierre GIRARDOT" />
	<meta name="description" content="Sociogram vous permet de générer des sociogrammes, d'analyser les relations au sein d'un groupe de personne, d'une cohorte." />
	<meta name="keywords" content="classe, élèves, gestion, sociogramme, sociogram, cohorte, sociale, relation" />
	<meta http-equiv="Content-type" content="text/html; charset=utf-8">
	<meta name="viewport" content="initial-scale=1">


	<!-- ###FAVICONS### --> 
	<link rel="apple-touch-icon" sizes="180x180" href="app/assets/favicons/apple-touch-icon.png">
	<link rel="icon" type="image/png" sizes="32x32" href="app/assets/favicons/favicon-32x32.png">
	<link rel="icon" type="image/png" sizes="16x16" href="app/assets/favicons/favicon-16x16.png">
	<link rel="manifest" href="app/assets/favicons/site.webmanifest">
	<link rel="mask-icon" href="app/assets/favicons/safari-pinned-tab.svg" color="#808080">
	<meta name="apple-mobile-web-app-title" content="MonSociogram.me">
	<meta name="application-name" content="MonSociogram.me">
	<meta name="msapplication-TileColor" content="#2d89ef">
	<meta name="theme-color" content="#ffffff">

	<!-- ###LIBRAIRIES### --> 
	<link rel="stylesheet" href="app/assets/lib/icons-1.4.0/font/bootstrap-icons.css">
	<link href="app/assets/lib/educational-icons/flaticon.css" rel="stylesheet" type="text/css"/>
	<link href="app/public/sociogram.css"  rel="stylesheet" type="text/css"/>


</head>
<body>
	<div id="app" class="flex-columns" >

		<div class="box flex-rows main">
			<div class="">
				<div class="h1">
				<img src='app/assets/img/logo.svg' width="50" />
				<span>
					MonSociogram<span class="small">.me</span>
				</span>
				</div>
			</div>


	<div class="text-end flex-1">
<a href="app" class="btn btn-primary"><span class="bi bi-chevron-right"></span> Accèder à l'application</a>

	</div>


		</div>





<div class="flex-columns flex-1 box">

<div class="fs-4 mb-2 mt-4">
  	<strong>Analysez vos groupes grâce au sociogramme !</strong>
  </div>

  

<div class="flex-rows main mb-4">


	 <div class="flex-3 flex-columns main-reverse">

  <p class="card-text">
      <ul>
        <li>Visualiser facilement les relations sociales ou professionnes entre individus</li>
        <li>Détecter les leaders (positifs ou négatifs) ou les personnes isolées, rejetées</li>
        <li>Générer des groupes d'affinités (sociogroupes)</li>
        <li>Générer des groupes aléatoires</li>
      </ul>
    </p>

<div class="text-center">
	
	    	<a href="app"><img src="assets/ecrans.png" width="90%" /></a>
</div>

    </div>

<hr class="small-screen"/>

    <div class="flex-1 text-center fs-6">
    	
	Cette application est payante, mais <strong>le prix est libre</strong> ! 

    	<br/>
    		<br/>
    	<strong>Soutenez le projet !</strong>
    		<br/>
 	<br/>
		<a href="https://spinell.app/paiements" rel="noreferrer" target="_blank" class="btn btn-primary"><span class="bi bi-heart-fill"></span> Accèder au paiement !</a>
			<br/>
				<br/>
			ou
				<br/>
<br/>

<img src="assets/paypal_QRCode.png" width="120" /><br/>
Scannez moi !

	<br/>
		<br/>
	ou
<br/>
	<br/>

<a href="https://www.buymeacoffee.com/loyowuvuxi" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="width: 150px !important;" ></a> 

    </div>
</div>
 
<div class="h4 flex-rows" style="color: white;">
	<div class="flex-1">
		<?php echo $nbEtablissements; ?> établissements
		
	</div>

	<div class="flex-1">
			<?php echo $nbUserActif; ?> utilisateurs actifs
	</div>
</div>

 


  </div>
  
	<div id="footer" class="box">
				<img src='app/assets/img/logo.svg' width='20px'/> <a href="https://MonSociogram.me/" target="_blank" rel="noreferrer">MonSociogram.me</a> | <a href="app">Mentions légales</a>
			</div>

	</div>
	<script src="app/assets/lib/jquery-3.5.1.min.js"></script>  
	<script src="app/assets/lib/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
	<script src="app/assets/lib/bootstrap-5.0.0/dist/js/bootstrap.min.js"></script>
</body>
</html>
