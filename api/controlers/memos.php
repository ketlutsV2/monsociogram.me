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

class Memos {
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
     * @return Plans
     */
    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }
    public function add() {
        global $_, $user;
        MainControl::init('users','get');

        $memo['memo_user']=$user["user_id"];
        $memo['memo_data']=html($_POST['memo_data']);
        $memo['memo_type']=$_['memo_type'];          
        $memo['memo_type_id']=$_['memo_type_id'];
        addMemo($memo);
        MainControl::init('memos','getAll');
    }
    public function getAll(){
        MainControl::init('users','get');            
        $_SESSION['render']['userMemos']=getMemosByUser();
    }
}
?>