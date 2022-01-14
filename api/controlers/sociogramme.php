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

class Sociogramme{
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
     * @return Sociogramme
     */
    public static function getInstance() {
      if (!(self::$_instance instanceof self))
        self::$_instance = new self();
      return self::$_instance;
    }

    public function create(){
     global $_, $user;
     MainControl::init('users','get');

     $sociogramme['sociogramme_name']=$_['sociogramme_name'];
     $sociogramme['sociogramme_questions']=html($_POST['questions']);
     $sociogramme['sociogramme_date']=$_['time'];

     createSociogramme($sociogramme);
     MainControl::init('sociogramme','getAllSociogrammes');

   }

   public function getAllRelations(){
    global $_, $user;
    MainControl::init('users','get');
    $select="*";
    $_SESSION['render']['relations']=getAllRelations($select);
  }

  public function updateRelations(){
   global $_;
   MainControl::init('users','get');
   if(!isset($_['eleve_id'])){
     MainControl::init('render');        
     exit;
   }
   $eleve=getEleveById($_['eleve_id']);
   delRelationsByStudent($eleve['eleve_id'],$_['sociogramme_id']);
   $relations=json_decode(html($_POST['relations']),true);


   for ($i=0; $i < count($relations); $i++) { 

    addRelation($relations[$i],$_['sociogramme_id']);

  }

  
  MainControl::init('sociogramme','getAllRelations');
}
public function save(){
  global $_, $user;
  MainControl::init('users','get');
  $sociogramme['sociogramme_data']=html($_POST['data']);
  $sociogramme['sociogramme_user']=$user['user_id'];
  $sociogramme['sociogramme_classe']=$_['classe_id'];
  $sociogramme['sociogramme_id']=$_['sociogramme_id'];
  $sociogramme['sociogramme_picture']=$_['picture'];
  $sociogramme['sociogramme_date']=$_['time'];
  delSociogrammeSave($sociogramme);
  addSociogrammeSave($sociogramme);
  MainControl::init('sociogramme','getSociogrammesSave'); 
}

public function getSociogrammesSave(){
//  MainControl::init('periodes','getMillesime');
  $_SESSION['render']['userSociogrammesSave'] =getSociogrammesSave();
}

public function getAllSociogrammes(){
// MainControl::init('periodes','getMillesime');
  $_SESSION['render']['sociogrammes'] =getSociogrammesByUser();
}


public function update(){
 global $_, $user;
 MainControl::init('users','get');
 $sociogramme=[];
 $sociogramme['sociogramme_id']=$_['sociogramme_id'];
 $sociogramme['sociogramme_name']=$_['sociogramme_name'];
 $sociogramme['sociogramme_questions']=$_['sociogramme_questions'];
 updateSociogramme($sociogramme);
 MainControl::init('sociogramme','getAllSociogrammes');

}

public function delete(){
 global $_, $user;
 MainControl::init('users','get');
 $sociogramme=getSociogrammeById($_['sociogramme_id']);
 if($sociogramme['sociogramme_user']!=$user['user_id']){return false;}

 deleteSociogramme($_['sociogramme_id']);
 MainControl::init('sociogramme','getSociogrammesSave'); 
 MainControl::init('sociogramme','getAllSociogrammes');

}


public function deleteAllRelations(){
 global $_, $user;
 MainControl::init('users','get');
 $eleves=json_decode(html($_POST['eleves']),true);
 deleteRelationsByClasse($eleves,$_['sociogramme_id']);

 MainControl::init('sociogramme','getAllRelations');
}


}
?>