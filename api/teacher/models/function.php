<?php
// Copyright 2022 Pierre GIRARDOT

// This file is part of Sociogram.me.

// Sociogram.me is free software: you can redistribute it and/or modify
// it under the terms of the GNU General Public License as published by
// the Free Software Foundation, either version GPL-3.0-or-later of the License.

// Sociogram.me is distributed in the hope that it will be useful,
// but WITHOUT ANY WARRANTY; without even the implied warranty of
// MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
// GNU General Public License for more details.

// You should have received a copy of the GNU General Public License
// along with Sociogram.me.  If not, see <https://www.gnu.org/licenses/>.

function logs($info) {
    $log = fopen(_DATA_. '/' . _LOG_, "a+");
    fputs($log, $info);
    fputs($log, "\n");
    fclose($log);
}
function sqliteConnect() {
    global $_;
    $dir=strtolower(substr($_['nom_etablissement'],0,1));
    if(!is_dir(_DATA_."schools/".$dir."/".$_['nom_etablissement']."/") OR !isset($_['nom_etablissement'])){
        $_SESSION['render']['statut']=false;
        $_SESSION['render']['info'][] = array("Ce compte n'existe pas.","error");
        MainControl::init('render');
        exit;
    }

    try {
        $pdo = new PDO('sqlite:'._DATA_.'schools/'.$dir.'/'. $_['nom_etablissement'] . '/' . _DB_);
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION); // ERRMODE_WARNING | ERRMODE_EXCEPTION | ERRMODE_SILENT
        return $pdo;
    } catch (Exception $e) {
        echo "Impossible d'accéder à la base de données SQLite : " . $e->getMessage();
        die();
    }
}
/**
 * Check if a table exists in the current database.
 *
 * @param PDO $pdo PDO instance connected to a database.
 * @param string $table Table to search for.
 * @return bool TRUE if table exists, FALSE if no table found.
 */

function tableExists($table,$entree) {
  $pdo = sqliteConnect();
    // Try a select statement against the table
    // Run it in try/catch in case PDO is in ERRMODE_EXCEPTION.
  try {
    $result = $pdo->query("SELECT 1 FROM $table WHERE $entree='1' LIMIT 1");
} catch (Exception $e) {
        // We got an exception == table not found
    return FALSE;
}
    // Result is either boolean FALSE (no table found) or PDOStatement Object (table found)
return $result !== FALSE;
}

function tableStructureUPD($table){
    global ${"shema_".$table};
    $pdo = sqliteConnect();
    $n=0;
    foreach (${"shema_".$table} as $key=>$column) {     
        if(!tableExists($table,$key)){
            if($n==0){
                $stmt = $pdo->prepare("CREATE TABLE IF NOT EXISTS $table (".$column.")");
                    $stmt->execute(); 
                }else{
              //  logs($column);
                    $stmt = $pdo->prepare("ALTER TABLE $table ADD COLUMN ".$column."");
                    $stmt->execute(); 
                }
            }
            $n++;
        }
    }

    function dropTable($table){
        $pdo = sqliteConnect();
        $stmt = $pdo->prepare("DROP TABLE '".$table."'");
        $stmt->execute(); 
    }

    function genereRandomStringNb($nb) {
        $tpass = array();
        $id = 0;
        for ($i = 65; $i < 90; $i++) {
            $tpass[$id++] = chr($i);
        }
        $passwd = "";
        for ($i = 0; $i < $nb; $i++) {
            $passwd.=$tpass[rand(0, $id - 1)];
        }
        return $passwd;
    }

    function getEtablissements(){
        $dossier_url=_DATA_."schools";
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
        return $etablissements;
    }

    function updateEtablissementPassword($new_password){
        global $_;
        $dir=strtolower(substr($_['nom_etablissement'],0,1));
        $file=_DATA_."schools/". $dir.'/'.$_['nom_etablissement']."/pwd.php";
        $passwordHash=password_hash($new_password, PASSWORD_DEFAULT);
        $password=$passwordHash;
        file_put_contents($file, "<?php \$password='$passwordHash'; ?>");
    }

    function sendmail($to,$subject='message',$msg,$from=null,$format='text/plain'){
        echo $format;
        $r="\r\n";$header='';
        $msg=wordwrap($msg, 70,$r);
        if ($format!='text/plain'){$msg=htmlspecialchars($msg);}
        if (!empty($from)){$header.='From: '.$from.$r;}
        $header='Content-Type: text/plain; charset="utf-8"'.$r.'Content-Transfer-Encoding: 8bit'.$r.$header;
        return mail($to,$subject,$msg,$header);
    }


    function thumbnails($img,$extension,$path) {
     if (in_array($extension,Array('jpg','jpeg'))) {
       $img_src_resource = imagecreatefromjpeg($img);   
   } elseif ($extension == "png") {
    $img_src_resource = @imagecreatefrompng($img);
} elseif ($extension == "gif") {
    $img_src_resource = @imagecreatefromgif($img);
}
if ($img_src_resource == false) {
    return false;
}
$width = imagesx($img_src_resource);
$height = imagesy($img_src_resource);
if ($width < 300 && $height < 300) {
    imagejpeg($img_src_resource, $path,50);
} else {
    if ($width <= $height) {
        $nHeight = 300 * $height / $width;
        $nWidth = 300 * $width / $height;
        $img_temp = imagecreatetruecolor($nWidth, 300);
        imagecopyresized($img_temp, $img_src_resource, 0, 0, 0, 0, $nWidth, 300, $width, $height);
    } else {
        $nWidth = 300 * $width / $height;
        $nHeight = 300 * $height / $width;
        $img_temp = imagecreatetruecolor(300, $nHeight);
        imagecopyresized($img_temp, $img_src_resource, 0, 0, 0, 0, 300, $nHeight, $width, $height);
    }
    imagejpeg($img_temp,$path,50);
    imagedestroy($img_temp);
}
}


function html($dirty_data){
    $clean_data=strip_tags(trim($dirty_data), '<p><a><ul><li><em><u><s><strong>');
    return $clean_data;
}

function cleaningData($dirty_data){
    return htmlspecialchars(trim($dirty_data), ENT_QUOTES);
}