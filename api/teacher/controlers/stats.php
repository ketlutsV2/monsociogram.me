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

class Stats {
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
     * @return Stats
     */
    public static function getInstance() {
        if (!(self::$_instance instanceof self))
            self::$_instance = new self();
        return self::$_instance;
    }
    public function set() {
        global $_, $user;
        MainControl::init('users','get');

        $pdo = new PDO('sqlite:'._DATA_.'stats.db');
        $pdo->setAttribute(PDO::ATTR_DEFAULT_FETCH_MODE, PDO::FETCH_ASSOC);
        $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

        $stmt = $pdo->prepare("SELECT user_id FROM users 
            WHERE user_pseudo=:user_pseudo 
            AND user_school=:user_school  
            LIMIT 1");
        $stmt->execute(  array(':user_pseudo' => $user['user_pseudo'],
            ':user_school' => $_['nom_etablissement']
        ));
        $userStats=$stmt->fetch();   

        if($userStats==false){
            $stmt = $pdo->prepare("INSERT INTO users (user_pseudo,user_school,user_connexionLastDate,user_connexionFirstDate,user_premium) 
                VALUES (:user_pseudo,:user_school,:user_connexionLastDate,:user_connexionFirstDate,:user_premium)");
            $stmt->execute(
                array(':user_pseudo' => $user['user_pseudo'],
                    ':user_school' => $_['nom_etablissement'],
                    ':user_connexionLastDate' => time(),
                    ':user_connexionFirstDate' => time(),
                    ':user_premium' => 0
                )
            );
        }else{
            $time=time();
            $stmt = $pdo->prepare("UPDATE users SET user_connexionLastDate=$time WHERE user_id=".$userStats['user_id']." LIMIT 1");
            $stmt->execute();

        }
    }
    
}
?>