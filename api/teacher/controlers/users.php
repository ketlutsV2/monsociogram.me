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

class Users {  
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
     * @return Users
     */
    public static function getInstance() {
      if (!(self::$_instance instanceof self))
        self::$_instance = new self();
      return self::$_instance;
    }

    public function getAll(){
     MainControl::init('users','get');
     $_SESSION['render']['users']=getUsers("user_id,user_pseudo,user_matiere,user_nom,user_prenom,user_type,user_mail");
   }

   public function sessionInit(){
    global $_, $user;

    $user=verifUser(strtolower($_["pseudo_utilisateur"]), $_["pass_utilisateur"]);

    if($user!==false){
      MainControl::init('school','bddUpdate'); 
      $sessionId=$this->getGUID();

      $_SESSION['render']['statut']=true;
      $updateUser['user_id']=$user['user_id'];
      $updateUser['user_sessionID']=$sessionId;
      updateUser($updateUser);
      $_SESSION['render']['sessionID']=$sessionId;

      return;
    }

    $_SESSION['render']['statut']=false;
    $_SESSION['render']['info'][] = array("Le mot de passe et le pseudo ne correspondent pas.","error");
    $this->add_banned_ip();
    return;
  }

  public function get(){
    global $_, $user;    
    if($user!=null){
      return;
    }
    if(!isset($_["pseudo_utilisateur"])){
     $_SESSION['render']['statut']=false;     
     MainControl::init('render');
     exit;   
   }

   deleteExpiredTokens();

   $user=getUserBySessionID($_["sessionID"]);

   if ($user==false) {
    $_SESSION['render']['statut']=false;
    $_SESSION['render']['info'][] = array("La session est expirée.","error");
    
    MainControl::init('render');
    exit;         
  }else{
    MainControl::init('stats','set'); 
    $_SESSION['render']['statut']=true;
  }
}

private function getGUID(){
  if (function_exists('com_create_guid')){
   $uuid= com_create_guid();
 }else{
  mt_srand((double)microtime()*10000);
  $charid = strtoupper(md5(uniqid(rand(), true)));
  $hyphen = chr(45);
  $uuid = chr(123)
  .substr($charid, 0, 8).$hyphen
  .substr($charid, 8, 4).$hyphen
  .substr($charid,12, 4).$hyphen
  .substr($charid,16, 4).$hyphen
  .substr($charid,20,12)
  .chr(125);
}
addToken($uuid);
return $uuid;
}

public function create(){
  global $_, $user;
  if (!isset($_["pass_etablissement"])) {
   $_SESSION['render']['statut']=false;
   return false;
 }
 MainControl::init('school','get');
 echo $_['nom_etablissement'];
 $dir=strtolower(substr($_['nom_etablissement'],0,1));
 require_once(_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/pwd.php");
 if (!password_verify($_["pass_etablissement"], $password)) {
  $_SESSION['render']['info'][] =array("Le mot de passe et le pseudo ne correspondent pas.","error");
  $_SESSION['render']['statut']=false;
  MainControl::init('render');
  exit;
}    
$subscriptions=getOption('subscriptions');
if ($subscriptions['option_value']==0) {
 $_SESSION['render']['statut']=false;
 $_SESSION['render']['info'][] =array("Les inscriptions sont fermées.","error");               
 return false;
}
if (existUser(strtolower($_["pseudo_utilisateur"]))) {
 $_SESSION['render']['statut']=false;
 $_SESSION['render']['info'][] =array("Ce compte existe déjà.","error");  
 return false;
}
$passwordHash = password_hash($_["pass_utilisateur"], PASSWORD_DEFAULT);

$type="user";
if(count(getAdmins())==0){
 $type="admin";   
}
$new_user=array('user_nom'=>'',
  'user_prenom'=>'',
  'user_pseudo'=>strtolower($_["pseudo_utilisateur"]),
  'user_password'=>$passwordHash,
  'user_type'=>$type,
  'user_mail' =>'',    
);
addUser($new_user);
$_SESSION['render']['statut']=true;
}

public function delete(){
 global $_, $user;
 MainControl::init('users','get');
 MainControl::init('users','checkAdmin');
 $user_id = $_['user_id'];

 if($user['user_id']== $user_id){
  $_SESSION['render']['info'][] =array("Vous ne pouvez pas supprimer votre compte.","error");            
  MainControl::init('render');        
  exit;
}
$userToRemove=getUserById($user_id);
delUser($userToRemove);
MainControl::init('users','getAll');
}

public function update(){
  //MISE A JOUR D'UN UTILISATEUR
  global $_, $user;
  MainControl::init('users','get'); 
  $user_id=$_['user_id'];

  if($user_id!=$user['user_id']){
    MainControl::init('users','checkAdmin');
  }
  $userToUpdate=array();
  $userToUpdate['user_id']=$user_id;

  //NOM
  if(isset($_['nom'])){
    $userToUpdate['user_nom']=$_['nom'];
    $_SESSION['render']['user']['nom']= $_['nom'];
  }
  //PRENOM
  if(isset($_['prenom'])){
    $userToUpdate['user_prenom']=$_['prenom'];
    $_SESSION['render']['user']['prenom']= $_['prenom'];
  }  
  //MAIL
  if(isset($_['mail'])){
    if(is_email($_['mail']) || $_['mail']==""){               
     $_SESSION['render']['user']['mail']= $_['mail'];
     $userToUpdate['user_mail']=$_['mail'];
   }else{
    $_SESSION['render']['info'][] = array('Cette adresse mail n\'est pas valide.',"error");
  }
}
//MOT DE PASSE
if(isset($_POST['new_passe'])){
  if($_POST['new_passe']!="" && $_POST['new_passe_bis']!=""){ 
    if($_POST['new_passe_bis']==$_POST['new_passe']){ 
      if(verifUser(strtolower($_["pseudo_utilisateur"]), $_POST['old_passe'])){
       $result=updateUserPassword($_POST['new_passe']);
       if($result){
         $_SESSION['render']['info'][] = array("Votre mot de passe a été modifié.","success");
         $_SESSION['render']['statut']=false;         
       }
     }else{
       $_SESSION['render']['info'][] = array('L\'ancien mot de passe ne correspond pas.',"error");
     }    
   }else{
     $_SESSION['render']['info'][] = array('Les mots de passe sont différents.',"error");
   }
 }
}
//CONFIGURATION
if(isset($_['user_config'])){
 $userToUpdate['user_config']=$_POST['user_config'];
}


//MISE A JOUR
updateUser($userToUpdate);
MainControl::init('users','getAll');
}


public function deconnexion(){
  global $user;
  MainControl::init('users','get');

  deleteTokenByUUID($user['sessionID']);


  $_SESSION['render']['statut']=false;
  MainControl::init('render');
  exit;
}


public function getProfil(){
  global $user;
  MainControl::init('users','get');
  $_SESSION['render']['user']['matiere']="";
 if(!isset($user['user_mail']) OR trim($user['user_mail'])==""){
   $_SESSION['render']['user']['mail']="";
 }else{
   $_SESSION['render']['user']['mail']= $user['user_mail'];
 }
 $_SESSION['render']['user']['nom']= $user['user_nom'];
 $_SESSION['render']['user']['prenom']= $user['user_prenom'];
 if(isset($user['user_config'])){
  $_SESSION['render']['user']['user_config']=$user['user_config'];
}
$_SESSION['render']['user']['user_id']= $user['user_id'];
}



public function passwordRecovery(){
  global $_;
  if(!isset($_['retrieve_etablissement']) || $_['retrieve_etablissement']==''){
   $_SESSION['render']['info'][] = array("Ce compte n'existe pas.","error");
   return;
 }
 $_['nom_etablissement']=$_['retrieve_etablissement'];
 $dir=strtolower(substr($_['nom_etablissement'],0,1));
 if(!is_dir(_DATA_."schools/".$dir.'/'.$_['nom_etablissement']."/")){
   $_SESSION['render']['info'][] = array("Ce compte n'existe pas.","error");
   return;
 }
 if(!isset($_['retrieve_pseudo'])){
   $_SESSION['render']['info'][] = array("Le pseudo est nécessaire.","error");
   return;
 }
 $user=existUser($_['retrieve_pseudo']);


 if($user==false){
   $_SESSION['render']['info'][] = array("Cet établissement et ce pseudo ne correspondent pas.","error");
    $this->add_banned_ip();
   return;
 }
 if(!isset($_['action'])){
  return;
}


if($_['action']=="getCode"){
  if(trim($user['user_mail'])==""){
   $_SESSION['render']['info'][] = array("Aucune adresse mail n'est définie pour ce compte...","error");
   return;
 }
 $new_token=genereRandomStringNb(6);
 updateUserToken($new_token,$user['user_id']);
 $html="
 Bonjour,
 Vous recevez cet e-mail car un changement de mot de passe a été demandé pour l'identifiant ".$_['retrieve_pseudo'].".
 Voici votre code de récupération :
 ".$new_token."
 Cordialement,
 Pierre Girardot.
 ";
 sendmail($user['user_mail'],'MonSociogram.me - Récupération de mot de passe',''.$html.'','ketluts@ketluts.net','text/html');

 $_SESSION['render']['info'][]=array("Votre code de récupération a été envoyé à l'adresse ".$user['user_mail'].".","success");
}
else{
  if(!isset($_['retrieve_token']) || $_['retrieve_token']==null || $_['retrieve_token']=="null"){
   $_SESSION['render']['info'][] = array("Le code de récupération est nécessaire.","error");
   return;
 }
 if(trim($_['retrieve_passe'])!=trim($_['retrieve_passe2'])){
   $_SESSION['render']['info'][] = array("Les mots de passe sont différents.","error");
   return;
 }
 $result=updateUserPasswordWithToken($_['retrieve_pseudo'],$_['retrieve_token'],trim($_['retrieve_passe']));
 if($result){
   $_SESSION['render']['info'][] = array("Votre mot de passe a été modifié.","success");
   updateUserToken("",$user['user_id']);
 }
 else{
   $_SESSION['render']['info'][] = array("Le pseudo et le code de récupération ne correspondent pas.","error");
 }
}
}

public function checkAdmin(){
  if (isAdmin()==false) {
    $_SESSION['render']['info'][] = array("Contactez un administrateur pour effectuer cette opération.","alert");
    MainControl::init('render');        
    exit;
  }
  return true;
}

private function checkIP($ip=null) {
  $banned=false;
  if(empty($ip)){$ip=$_SERVER['REMOTE_ADDR'];}
  $file=_DATA_.'jail/ip_'.md5($ip).'.php';
  if(!is_file($file)){
    $banned=false;
  }
  else{
    global $auto_restrict;
    require_once($file);
    if ($auto_restrict["banned_ip"]['nb']>=5){
            $banned=true; // below max login fails 
          }
          if ($auto_restrict["banned_ip"]['date']<@date('U')){
           $this->remove_banned_ip();
             $banned=false;// old banishment 
           }
         }
         if($banned){
           $_SESSION['render']['info'][] = array("Votre IP a été bannie pour quelques minutes.","error");
           MainControl::init('render');
           exit;    
         }
       }
       /**
* Inspiré d'auto_restrict
 * @author bronco@warriordudimanche.com / www.warriordudimanche.net
 * @copyright open source and free to adapt (keep me aware !)
 * @version 3.1 - one user only version / version mono utilisateur
*/
private function add_banned_ip($ip=null){
 if(empty($ip)){$ip=$_SERVER['REMOTE_ADDR'];}
 $file=_DATA_.'jail/ip_'.md5($ip).'.php';
 if(!is_file($file)){
  $auto_restrict["banned_ip"]['nb']=1;
  $auto_restrict["banned_ip"]['date']=@date('U')+90;
  file_put_contents($file,'<?php /*Banned IP*/ $auto_restrict["banned_ip"]='.var_export($auto_restrict["banned_ip"],true).' ?>');
}
else{
  global $auto_restrict;
  require_once($file);
  $auto_restrict["banned_ip"]['nb']++;
  $auto_restrict["banned_ip"]['date']=@date('U')+90;
  file_put_contents($file,'<?php /*Banned IP*/ $auto_restrict["banned_ip"]='.var_export($auto_restrict["banned_ip"],true).' ?>');
}
}
private function remove_banned_ip($ip=null){
 if(empty($ip)){$ip=$_SERVER['REMOTE_ADDR'];}
 $file=_DATA_.'jail/ip_'.md5($ip).'.php';
 unlink($file);
}
}
?>