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

class School {
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
     * @return School
     */
    public static function getInstance() {
      if (!(self::$_instance instanceof self))
        self::$_instance = new self();
      return self::$_instance;
    }
    public function get(){
      global $_,$password;


      if(!isset($_['nom_etablissement'])){
        $_SESSION['render']['statut']=false;
        return false;
      }


      $dir=strtolower(substr($_['nom_etablissement'],0,1));

      //On vérifie si l'établissement existe    
      if(!is_dir(_DATA_."schools/".$dir."/".$_['nom_etablissement']."/")){
      //Si une création de compte est demandée
       if(isset($_['create_account'])){
        MainControl::init('school','create');
        return true;
      }
      $_SESSION['render']['statut']=false;
      $_SESSION['render']['info'][] = array("Ce compte n'existe pas.","error");
      MainControl::init('render');
      return false;
    }
  }


  
  public function create(){
    global $_,$autorise_autres_etablissement,$password;
    if(!is_dir(_DATA_."schools/")){
     if (!mkdir(_DATA_."schools", 0777)) {      
      $_SESSION['render']['info'][] = array("Echec lors de la création des répertoires...","error");
      $_SESSION['render']['statut']=false;
      return false;
    }
  }
  if(!is_dir(_DATA_."disabled/")){
   if (!mkdir(_DATA_."disabled", 0777)) {      
    $_SESSION['render']['info'][] = array("Echec lors de la création des répertoires...","error");
    $_SESSION['render']['statut']=false;
    return false;
  }
}
if(!is_dir(_DATA_."jail/")){
 if (!mkdir(_DATA_."jail", 0777)) {      
  $_SESSION['render']['info'][] = array("Echec lors de la création des répertoires...","error");
  $_SESSION['render']['statut']=false;
  return false;
}
}
if (!isset($_["pass_etablissement"])) {
 $_SESSION['render']['statut']=false;
 return false;
}    
$dir=strtolower(substr($_['nom_etablissement'],0,1));

  //On créé le dossier en fonction de la première lettre
if(!is_dir(_DATA_."schools/".$dir.'/')){
 if (!mkdir(_DATA_."schools/".$dir.'/', 0777)) {      
  $_SESSION['render']['info'][] = array("Echec lors de la création des répertoires...","error");
  $_SESSION['render']['statut']=false;
  return false;
}
}     




// if(is_dir(_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/")){
//   $_SESSION['render']['info'][] =array("Cet établissement existe déjà.","error");
//   $_SESSION['render']['statut']=false;
//   return false;
// }
if(!$autorise_autres_etablissement){
  $_SESSION['render']['info'][] = array("Ce serveur n'héberge pas de nouveaux établissements.","error");
  $_SESSION['render']['statut']=false;
  MainControl::init('render','init');

}
if (!mkdir(_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."", 0777)) {      
  $_SESSION['render']['info'][] = array("Echec lors de la création des répertoires...","error");
  $_SESSION['render']['statut']=false;
  MainControl::init('render','init');

}
$dir_path=_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/files";
if(!is_dir($dir_path)){
  if (!mkdir($dir_path, 0777)) {
   $_SESSION['render']['info'][] = array("Echec lors de la création des répertoires...","error");
   $_SESSION['render']['statut']=false;
   MainControl::init('render','init');

 }
}
copy(_DATA_."db.sqlite", _DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/db.sqlite");
//copy(_DATA_.".htaccess", _DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/.htaccess");


$file=_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/pwd.php";
if (fopen($file, 'a+')!==false) {
  $passwordHash=password_hash($_['pass_etablissement'], PASSWORD_DEFAULT);
  $password=$passwordHash;
  file_put_contents($file, "<?php \$password='$passwordHash'; ?>");

  MainControl::init('school','bddUpdate');
  //$this->periodesInit();


  addOption(array("option_name"=>"quotaByUser","option_value"=>"52428800"));
  addOption(array("option_name"=>"premium","option_value"=>"0"));
  addOption(array("option_name"=>"subscriptions","option_value"=>"1"));

//  $_SESSION['render']['info'][] = array("L'établissement ".$_['nom_etablissement']." a été créé.","success");
  $_SESSION['render']['statut']=true;
  return true;
} 
else{        
  $_SESSION['render']['info'][] = array("L'écriture dans le dossier a échouée","error");
  $_SESSION['render']['statut']=false;
  return false;                
}

}
public function update(){
  global $_, $user;
  MainControl::init('users','get');
  MainControl::init('users','checkAdmin');
  //Ajout d'options diverses
  if(isset($_['options'])){
    $_['options']=json_decode(html($_['options']));
  //Listes des options modifiables par les utilisateurs admin
    $key_available=array('subscriptions','weeks','plugins');

    foreach ($_['options'] as $key => $value) {
      if(!in_array($key,$key_available)){continue;}
      updateOption($key,$value);
    }              
  }
  //Modification du mot de passe établissement
  if(isset($_['nouveau_passe']) && isset($_['nouveau_passe2'])){
    if(trim($_['nouveau_passe'])!=trim($_['nouveau_passe2'])){
     $_SESSION['render']['info'][] = array("Les mots de passe sont différents.","error");
     return;
   }
   $dir=strtolower(substr($_['nom_etablissement'],0,1));
   require_once(_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/pwd.php");
   if (!password_verify($_["old_passe"], $password)) {
     $_SESSION['render']['info'][] = array("L'ancien mot de passe ne correspond pas.","error");
     return;
   }
  // $dir=strtolower(substr($_['nom_etablissement'],0,1));
   $file=_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/pwd.php";
   $passwordHash=password_hash($_['nouveau_passe'], PASSWORD_DEFAULT);
   file_put_contents($file, "<?php \$password='$passwordHash'; ?>");

   $_SESSION['render']['info'][] = array("Le mot de passe a été changé.","success");
   $_SESSION['render']['statut']=false;
 }   

}
public function delete(){
  global $_, $user;
  MainControl::init('users','get');
  MainControl::init('users','checkAdmin');
  $dir=strtolower(substr($_['nom_etablissement'],0,1));
  rename(_DATA_.'schools/'.$dir.'/'.$_['nom_etablissement'],_DATA_.'disabled/'.$_['nom_etablissement']."_".time());
  $_SESSION['render']['info'][] = array("Le compte a été désactivé.","success");
  $_SESSION['render']['statut']=false;
  MainControl::init('render');        
  exit;
}
public function getAll(){
 global $_,$autorise_autres_etablissement;

$_SESSION['render']['statut']=true;
 $etablissements=getEtablissements();

 $etablissementsLST=array();
 foreach ($etablissements as $etablissement) {
  if(!in_array($etablissement, $etablissementsLST)){
    array_push($etablissementsLST, utf8_encode(utf8_decode($etablissement)));
  }
}
 
$_SESSION['render']['etablissementsLST']=$etablissementsLST;
$_SESSION['render']['etablissementsCRT']=$autorise_autres_etablissement;

}

public function renderConfig(){
  global $_, $user;
  MainControl::init('users','get');
  $_SESSION['render']['options']['subscriptions']=getOption('subscriptions')['option_value'];
  $admins=getAdmins();
  $_SESSION['render']['options']['admins']=$admins;
  if($user['user_type']=='admin' OR count($admins)==0){
    $_SESSION['render']['user']['admin']=true;
  }else{
    $_SESSION['render']['user']['admin']=false;
  }
}
public function backup(){
  global $_;
  $dir=strtolower(substr($_['nom_etablissement'],0,1));
  copy(_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/db.sqlite", _DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/db_backup_".time().".sqlite");  
}

/*private function periodesInit(){
  $month=intval(date('m'));
  $year=intval(date('Y'));
  if($month>=07){ 
    $annee="Année ".$year."/".($year+1);
    $start= mktime(0, 0, 0, 9  , 1, $year);
    $end= mktime(0, 0, 0, 8  , 31, $year+1);
  }else{
   $annee="Année ".($year-1)."/".$year;
   $start= mktime(0, 0, 0, 9  , 1, $year-1);
   $end= mktime(0, 0, 0, 8  , 31, $year);
 }
 $millesime=array();
 $millesime['periode_titre']=$annee;
 $millesime['periode_start']=$start;
 $millesime['periode_end']=$end;
 $millesime['periode_parent']=null;
 $millesime['periode_type']="m";
 $millesime_id=addPeriode($millesime);  

 $periode=array();
 if($month>=07){
   $periode['periode_start']= mktime(0, 0, 0, 9  , 1, $year);
   $periode['periode_end']=mktime(0, 0, 0, 8  , 31, $year+1);

 }else{
  $periode['periode_start']= mktime(0, 0, 0, 9  , 1, $year-1);
  $periode['periode_end']=mktime(0, 0, 0, 8  , 31, $year);
}

$periode['periode_titre']="Période par défaut";

$periode['periode_parent']=$millesime_id;
$periode['periode_type']="p";
$periode_id=addPeriode($periode); 

setPeriode($periode_id);   
}*/

public function bddUpdate(){ 

    //##########
    //BDD UPDATE
    //##########
  if(!tableExists('users','user_level')){
   tableStructureUPD("users");
 }; 
 if(!tableExists('options','option_value')){
  tableStructureUPD("options");
};
/*if(!tableExists('periodes','periode_lock_date')){
  tableStructureUPD("periodes");
};*/
/*if(!tableExists('legends','legend_id')){
  tableStructureUPD("legends");
};*/

/*if(!tableExists('disciplines','discipline_name')){
  tableStructureUPD("disciplines");
};*/
  //###################
if(!tableExists('eleves','eleve_picture')){
  tableStructureUPD("eleves");
}; 
  //################### 
/*if(!tableExists('classes','classe_millesimes')){
  tableStructureUPD("classes");
};*/
if(!tableExists('relations_eleves_classes','rec_id')){
  tableStructureUPD("relations_eleves_classes");
}; 
if(!tableExists('groupes','groupe_data')){
  tableStructureUPD("groupes");
};

//v2020COVID-19
if(tableExists('relations','relation_id')){
dropTable('relations');
}; 
if(tableExists('sociogrammes','sociogramme_id')){
dropTable('sociogrammes');
}; 

if(!tableExists('sociogrammesForms','sociogramme_questions')){
  tableStructureUPD("sociogrammesForms");
};
if(!tableExists('socioRelations','socioRelation_id')){
  tableStructureUPD("socioRelations");
};
if(!tableExists('sociogrammesSaves','sociogrammeSave_date')){
  tableStructureUPD("sociogrammesSaves");
};
/*if(!tableExists('plans','plan_id')){
  tableStructureUPD("plans");
};
if(!tableExists('controles','controle_type')){
  tableStructureUPD("controles");
};
if(!tableExists('notes','note_bonus')){
  tableStructureUPD("notes");
};*/
  //###################
/*if(!tableExists('defis','defi_token')){
  tableStructureUPD("defis");
};
if(!tableExists('etoiles','etoile_type')){
  tableStructureUPD("etoiles");
};*/
  //###################
/*if(!tableExists('messages','message_author_type')){
  tableStructureUPD("messages");
};  
if(!tableExists('relations_messagerie','rm_read')){
  tableStructureUPD("relations_messagerie");
}; */
  //###################
/*if(!tableExists('files','file_visibility')){
  tableStructureUPD("files");    
};
if(!tableExists('links','link_favicon')){
  tableStructureUPD("links");
};
if(!tableExists('shares','share_user')){
  tableStructureUPD("shares");
};*/
   //###################
/*if(!tableExists('items','item_feedbacks')){
  tableStructureUPD("items");
};
if(!tableExists('relations_eleves_items','rei_coefficient')){
  tableStructureUPD("relations_eleves_items");
};
if(!tableExists('filters','filter_name')){
  tableStructureUPD("filters");
};*/
      //###################
/*if(!tableExists('agenda','event_discipline')){         
  tableStructureUPD("agenda");    
};  
    //###################
if(!tableExists('appreciations','appreciation_id')){         
  tableStructureUPD("appreciations");    
};  */
    //###################
if(!tableExists('memos','memo_type_id')){         
  tableStructureUPD("memos");    
}; 
  //###################
/*if(!tableExists('feedbacks','feedback_description')){         
  tableStructureUPD("feedbacks");    
};   //###################
if(!tableExists('activities','activity_description')){         
  tableStructureUPD("activities");    
}; */   //###################
if(!tableExists('tokens','token_uuid')){         
  tableStructureUPD("tokens");    
}; 
}
}
?>