<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=iso-8859-15">
	<style>
		@page {			
			margin: 2em;
		}
		body { 
			font-family: verdana, sans-serif;
			font-size: 8pt;
		} 
		.cdt_title{
			font-weight: bold;
		}
		.cdt_item{
			border-left: 4px solid;
			padding-left: 5px;
		}
		.cdt_date{
			padding-bottom: 5px;
			padding-top: 5px;
		}
		.cdt_data{
			padding-left: 10px;
		}
		h1{
			width: 100%;
			text-align: center;
			margin-bottom: 30px;
		}
		h2{
			margin-bottom: 0px;
			margin-top: 5px;
			font-weight: bold;
		}
		h4{
			margin-bottom: 0px;
			margin-top: 0px;
		}
		.date{
			font-size: 10pt;
		}
		small{
			color: grey;
		}
		hr{
			margin-top: 15px;
		}
		.pdf-agenda-classe{
			page-break-before: always;
		}
	</style>
</head>
<body>
	<h1>
		Sociogram<small>.app</small> 
		<br/>
		<?php echo utf8_encode($_['export-pdf-classe']); ?>
		<?php if($_['agenda-export-date-start']!="" AND $_['agenda-export-date-end']!=""){ ?>

		<br/>
		<small class="date">
			Du <?php echo $_['agenda-export-date-start']; ?> au <?php echo $_['agenda-export-date-end']; ?>
		</small>
		<?php }?>
	</h1>
	<?php 
	echo utf8_encode($html_data);
	?>
</body>
</html>