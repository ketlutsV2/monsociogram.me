<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-15">
	<style>
		body { 
			font-family: verdana, sans-serif;
			font-size: 8pt;
			text-align: center;
			word-wrap: break-word;
		} 
		small{
			color: grey;
		}
	</style>
</head>
<body>
	<h1>
		Sociogram<small>.app</small> 
	</h1>
	<h2>
		<small>	
			<?=  $_['share_text'] ?>
		</small>
	</h2>
	<?php
	for ($i=0; $i < 35; $i++) { 
		echo $qrcode;
	}
	?>
</body>
</html>