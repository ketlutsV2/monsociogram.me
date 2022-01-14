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

class Ping{
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
     * @return Defis
     */
    public static function getInstance() {
      if (!(self::$_instance instanceof self))
        self::$_instance = new self();
      return self::$_instance;
    }
    public function init(){
      global $_;

    }
    

  }
?>