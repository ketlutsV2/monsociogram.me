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

//session_start();
header("Access-Control-Allow-Origin: *");
header('Access-Control-Allow-Headers: X-Requested-With');

ini_set('memory_limit', '-1');
date_default_timezone_set('UTC');
setlocale(LC_TIME, 'fr_FR');

set_time_limit(300);


require_once 'models/function.php';

$_=array();
foreach($_POST as $key=>$val){
	if(!is_array($val)){
		$_[$key]=cleaningData($val);
	}
}
foreach($_GET as $key=>$val){
	$_[$key]=cleaningData($val);
}

if(isset($_POST['sessionParams'])){
	$params=json_decode($_POST['sessionParams'],true);
	foreach($params as $key=>$val){
		$_[$key]=cleaningData($val);
	}
}
if(isset($_GET['sessionParams'])){
	$params=json_decode($_GET['sessionParams'],true);
	foreach($params as $key=>$val){
		$_[$key]=cleaningData($val);
	}
}
if(isset($_['nom_etablissement'])){
	$_['nom_etablissement']=str_replace("/", "_", $_['nom_etablissement']);
}


define("_DB_", "db.sqlite");
define("_LOG_", "debug.log");

require_once 'config.php';

$_SESSION['render']=[];
$_SESSION['render']['info']=[];
$_SESSION['render']['statut']=true;

$user=null;
//$millesime=null;

require_once 'shemas.php';

require_once 'models/eleves.php';
require_once 'models/classes.php';
require_once 'models/relations.php';
require_once 'models/users.php';
//require_once 'models/periodes.php';
require_once 'models/groupes.php';
require_once 'models/options.php';
require_once 'models/sociogrammes.php';
require_once 'models/memos.php';
require_once 'models/tokens.php';
require_once 'mainControl.php';

require_once 'lib/is_email.php';

require_once("lib/vendor/autoload.php");


use Spipu\Html2Pdf\Html2Pdf;
error_reporting(E_ALL);
ini_set('display_errors', 0);
