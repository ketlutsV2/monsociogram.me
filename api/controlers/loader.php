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

class Loader {
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
     * @return Loader
     */
    public static function getInstance() {
      if (!(self::$_instance instanceof self))
        self::$_instance = new self();
        return self::$_instance;
    }
    public function init() {    ; 
       $_SESSION['render']['home']=true;         
       MainControl::init('users','get');
        //OPTIONS DE L'ETABLISSEMENT
       MainControl::init('school','renderConfig'); 
       //USERS
       MainControl::init('users','getProfil'); 
       MainControl::init('users','getAll');            
       MainControl::init('memos','getAll');//OK
       //ELEVES
       MainControl::init('eleves','getAll');
        //CLASSES
       MainControl::init('classe','get');//OK
       MainControl::init('groupes','getAll');//OK
        //SOCIOGRAMMES
       MainControl::init('sociogramme','getAllRelations');
       MainControl::init('sociogramme','getSociogrammesSave');//OK
       MainControl::init('sociogramme','getAllSociogrammes');//OK
   }
}
?>