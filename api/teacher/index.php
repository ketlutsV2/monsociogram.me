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

if (isset($_GET['go'])) {
	require_once 'boot.php';
	$method='init';
     if(isset($_['q'])){          
      $method=$_['q'];
          }   
          // $_SESSION['render']['info'][] = array("Maintenance en cours (30min).","success");
          // $_SESSION['render']['statut']=false;

	MainControl::init($_GET['go'],$method);
	
	MainControl::init('render');   
} else {
	require_once 'boot.php';
	$_SESSION['render']['statut']=false;
	MainControl::init('render');   
}
?>