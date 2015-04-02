<?php

	$path = "homeDir/" . $_POST["file"]

	if (!file_exists(dirname($path))) {
		mkdir(dirname($path), 0777, true);
	}
	$handle = fopen($path, 'w') or die('Cannot open file:  '.$path);
	fwrite($handle, $data);
	fclose($handle);

?>