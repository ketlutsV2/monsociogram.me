<!-- ###LIBRARIES### --> 
<script src="assets/lib/jquery-3.5.1.min.js"></script>  
<script src="assets/lib/DataTables/datatables.min.js"></script>
<script src="assets/lib/jquery-ui-1.12.1.custom/jquery-ui.min.js"></script>
<script src="assets/lib/bootstrap-5.0.0/dist/js/bootstrap.min.js"></script>
<script src="assets/lib/json2.min.js"></script>
<script src="assets/lib/json_sans_eval.js"></script>
<script src="assets/lib/mustache.min.js"></script>
<script src="assets/lib/handlebars-v4.5.3.js"></script>
<script src="assets/lib/md5.js"></script>
<script src="assets/lib/jquery.ui.touch-punch.min.js"></script>
<script src="assets/lib/sweetalert/sweetalert.min.js"></script>
<script src="assets/lib/jdenticon-3.1.0/dist/jdenticon.min.js"></script>
<script src="assets/lib/select2/dist/js/select2.min.js"></script>
<script src="assets/lib/interact.min.js"></script>



 <script src="assets/lib/html2pdf/dist/html2pdf.bundle.min.js"></script>
 <script src="assets/lib/html2canvas.min.js"></script>

<!-- ###Sociogram### --> 
<script src="config.js"></script>



<?php
$version="20211006";
function includeJs($dir){
	global $version;
	$dossier = opendir($dir);
	while($fichier = readdir($dossier)){
		if(is_file($dir.'/'.$fichier) && $fichier !='/' && $fichier !='.' && $fichier != '..' && !strpos($fichier, "deprecated")){
			echo '<script src="'.$dir.'/'.$fichier.'?'.$version.'"></script>'.PHP_EOL;
		}else{
			if(is_dir($dir.'/'.$fichier) && $fichier !='/' && $fichier !='.' && $fichier != '..'){
				includeJs($dir.'/'.$fichier);
			}
		}
	}
	closedir($dossier);
}
includeJs('assets/plugins');

?>
<script src="public/sociogram.js?<?php echo $version; ?>"></script>