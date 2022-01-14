<!-- Copyright 2022 Pierre GIRARDOT

This file is part of Sociogram.me.

Sociogram.me is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version GPL-3.0-or-later of the License.

Sociogram.me is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with Sociogram.me.  If not, see <https://www.gnu.org/licenses/>. -->
<!DOCTYPE html>
<html lang="fr">
<?php
require_once('views/_haut.php');
?>
<body class="flex-columns">
	<div id="app" class="flex-columns">
		<div id="infos"></div>   
		<div id="main" class="flex-columns">

			<?php 
			require_once('views/headers/main.php');
			require_once('views/connexion/main.php');
			require_once('views/splash/main.php');
			require_once('views/home/main.php');			
			require_once('views/classroom/main.php');
			require_once('views/user/main.php');
			require_once('views/admin/main.php');			
			require_once('views/student/main.php');
			require_once('views/sociogrammes/main.php');
			require_once('views/mentions/main.php');	
			?>

			<div id="footer" class="box">
				<img src='assets/img/logo.svg' width='20px'/> <a href="https://MonSociogram.me/">MonSociogram.me</a> | <span id="footer-version" class="large-screen"></span> | <a href="#mentions">Mentions légales</a> | <a href="https://www.buymeacoffee.com/loyowuvuxi" target="_blank"><img src="https://cdn.buymeacoffee.com/buttons/v2/default-yellow.png" alt="Buy Me A Coffee" style="height: 30px !important;width: 120px !important;" ></a> <span id="footer-plugin-bloc"></span>
			</div>
		</div>
	</div>	
	<?php
	require_once('views/_bas.php');		
	require_once('views/pdf/main.php');
	?>
</body>
</html>