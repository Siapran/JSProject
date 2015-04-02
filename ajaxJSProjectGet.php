<?php
	$path = "./homeDir/" . $_POST["file"];

	$handle = fopen($path, 'r');
	$data = fread($handle, filesize($path));
	fclose($handle);

	echo $data;
?>
