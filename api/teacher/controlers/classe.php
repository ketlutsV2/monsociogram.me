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

class Classe {
      /**
     *
     * @var Instance
     */
      private static $_instance;
    /**
     *
     * @var classe
     */
    private $classe;
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
     * @return Classe
     */
    public static function getInstance() {
      if (!(self::$_instance instanceof self))
        self::$_instance = new self();
      return self::$_instance;
    }

    public function get(){
      //global $millesime;
      MainControl::init('users','get');
     // MainControl::init('periodes','getMillesime');
      $_SESSION['render']['classes']=getClasses();
    }    

    public function add(){
     global $_, $user;
     MainControl::init('users','get');     
     MainControl::init('users','checkAdmin');
    // MainControl::init('periodes','getMillesime');
     if (isset($_['classe_nom'])){        
      $classe_nom=trim($_["classe_nom"]);
      $_SESSION['classe_nom']=$classe_nom;
      if($classe_nom==""){           
        $_SESSION['render']['info'][] =array("Il faut choisir un nom pour la cohorte.","error");  
        MainControl::init('render');
      }
      if(existClasse($classe_nom)!=false){
       $_SESSION['render']['info'][] =array("Cette cohorte existe déjà.","error");      
       MainControl::init('render');     
     }
     $new_classe_id=addClasse($classe_nom);
     $_SESSION['render']['new_classe_id']=$new_classe_id;
     MainControl::init('classe','get');
     $_SESSION['render']['elevesByClasses']=getElevesByClasses();  
   }
 }
 
 public function delete(){
  global $_,$user;
  MainControl::init('users','get');
  MainControl::init('users','checkAdmin');   
  MainControl::init('school','backup');
  delClasse($_['classe_id']); 
  MainControl::init('classe','get');
  $_SESSION['render']['elevesByClasses']=getElevesByClasses();  
}

public function update(){
  global $_,$user;
  MainControl::init('users','get');  
  if(!isset($_['classe_id'])){
   MainControl::init('render');  
 }
 $this->classe=getOneClasse($_['classe_id']);
 
 if(isset($_['classe_nom']))
 {
  $this->classe['classe_nom']=$_['classe_nom'];
  if(existClasse($this->classe['classe_nom'])!=false){
   $_SESSION['render']['info'][] = array('Une autre cohorte porte déjà ce nom.','error');
   MainControl::init('render');        
   exit;
 }
}
updateClasse($this->classe);
MainControl::init('classe','get');
$_SESSION['render']['elevesByClasses']=getElevesByClasses();   
}

}
?>