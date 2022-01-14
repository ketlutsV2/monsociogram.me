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

class Eleves {
      /**
     *
     * @var Instance
     */
      private static $_instance;
    /**
     * Empêche la création externe d'instances.
     */
    private function __construct() {}
    /**
     * Empêche la copie externe de l'instance.
     */
    private function __clone() {}
    /**
     * 
     * @return Eleves
     */
    public static function getInstance() {
      if (!(self::$_instance instanceof self))
        self::$_instance = new self();
        return self::$_instance;
      }
      public function getAll(){
     global $_, $user;
        MainControl::init('users','get');
        $select="*";
        $_SESSION['render']['eleves']=getAllEleves($select);
        $_SESSION['render']['elevesByClasses']=getElevesByClasses();     
      }

     public function add(){
     global $_, $user;
       MainControl::init('users','get');
       MainControl::init('users','checkAdmin');
       if(isset($_POST["eleves"])){
        $eleves=json_decode(html($_POST["eleves"]),true);
        $classe=$_["id"];
        $_["classe_id"]=$_["id"];
        foreach ($eleves as $eleve) {              
          /*if(!isset($eleve['eleve_genre'])){
            $eleve['eleve_genre']="H";
          }*/
          $eleve['eleve_nom']=trim($eleve['eleve_nom']);
          $eleve['eleve_prenom']=trim($eleve['eleve_prenom']);
         // $eleve['eleve_genre']=ucfirst(trim($eleve['eleve_genre']));
        // $eleve['eleve_birthday']=ucfirst(trim($eleve['eleve_birthday']));
          if($eleve['eleve_nom']!="" || $eleve['eleve_prenom']!=""){
            addEleve($eleve,$classe);  
          }
        }
      }
      MainControl::init('eleves','getAll');   
    }
    public function update(){
     global $_, $user;
      MainControl::init('users','get');      
      MainControl::init('users','checkAdmin');
      if(!isset($_['eleve_id'])){
        MainControl::init('render');        
        exit;
      }
      $eleve=getEleveById($_['eleve_id']);
      if($eleve==false){
        MainControl::init('render');        
        exit;
      }
      //On effectue les changements
      if(isset($_['eleve_nom']))
      {
        $eleve['eleve_nom']=$_['eleve_nom'];
        $eleve['eleve_prenom']=$_['eleve_prenom'];
        if($eleve['eleve_nom']=="" AND $eleve['eleve_prenom']==""){
          $_SESSION['render']['info'][] =array("Le NOM et le Prénom ne peuvent pas être vides.","error");   
          MainControl::init('render');        
          exit;
        }
      }
     updateEleve($eleve);
   }

   public function updateStudents(){
     global $_, $user;
    MainControl::init('users','get');
    MainControl::init('users','checkAdmin');
    $studentsToUpdate=json_decode(html($_POST['students']),true);     
    $new_student=[];
   foreach ($studentsToUpdate as $student) {
    $new_student['eleve_id']=$student;
    updateEleve($new_student);
  }
  MainControl::init('eleves','getAll');
}

public function addPicture(){
     global $_, $user;
  MainControl::init('users','get');
  MainControl::init('users','checkAdmin');
  $eleve=getEleveById($_['eleve_id']);

  $name=time()."_".genereRandomStringNb(10).".file";

  $dir=strtolower(substr($_['nom_etablissement'],0,1));
  $dir_path=_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/files";
  $uploaddir = $dir_path.'/';
  $uploadfile = $uploaddir . $name;
// Création d'une liste blanche des extensions autorisées
  $controle_extensions_autorisees = ['jpg', 'png', 'gif'];
// Récupération du nom du fichier
  $fichier_upload_nom = $_FILES['file']['name'];
// Récupération de l'extension du fichier
  $fichier_extension =  strtolower(pathinfo($fichier_upload_nom, PATHINFO_EXTENSION));
// Vérification de l'extension du fichier
  if(!in_array($fichier_extension, $controle_extensions_autorisees)){
    $_SESSION['render']['info'][] =array("L'extension du fichier n'est pas autorisée.","error");  
    return; 
  }
  $controle_type_mime_autorises = ['image/gif', 'image/jpeg', 'image/pjpeg', 'image/png'];
  $fichier_mime_type = mime_content_type($_FILES['file']['tmp_name']);
// On vérifie que le type MIME appartient à la liste blanche
  if(!in_array($fichier_mime_type, $controle_type_mime_autorises)){
    $_SESSION['render']['info'][] =array($fichier_mime_type."Le type du fichier n'est pas autorisée.","error"); 
    return;
  }
  if(is_file($uploaddir . $eleve['eleve_picture'])){
    unlink($uploaddir . $eleve['eleve_picture']);
  }
  thumbnails($_FILES['file']['tmp_name'],$fichier_extension,$uploadfile);
  $eleve['eleve_picture']=$name;
  updateEleve($eleve); 
  $_SESSION['render']['picture']=$name;
}

public function deletePicture(){
     global $_, $user;
  MainControl::init('users','get');
  MainControl::init('users','checkAdmin');
  $eleve=getEleveById($_['eleve_id']);  
  $dir=strtolower(substr($_['nom_etablissement'],0,1));
  $dir_path=_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/files";
  $uploaddir = $dir_path.'/';
  if(is_file($uploaddir . $eleve['eleve_picture'])){
    unlink($uploaddir . $eleve['eleve_picture']);
  }
  $eleve['eleve_picture']="";
  updateEleve($eleve); 
}

public function getPicture(){
 global $_,$user; 
 MainControl::init('users','get');
 $dir=strtolower(substr($_['nom_etablissement'],0,1));
 $dir_path=_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/files";
 $uploaddir = $dir_path.'/';
 $uploadfile = $uploaddir . $_['file'];
 if(is_file($uploadfile)){
  echo file_get_contents($uploadfile);
}
exit;
}

public function delete(){
     global $_, $user;
  MainControl::init('users','get');
  MainControl::init('users','checkAdmin'); 
  MainControl::init('school','backup');
  $eleves=json_decode(html($_POST['eleves']),true);
  deleteEleve($eleves);    
  MainControl::init('eleves','getAll');
}
}
?>