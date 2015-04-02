<?php

	if (!file_exists(dirname("homeDir/" .$_POST["file"]))) {
		mkdir(dirname("homeDir/" .$_POST["file"]), 0777, true);
	}
	$handle = fopen("homeDir/" . $_POST["file"], 'w') or die('Cannot open file:  '.$_POST["file"]);
	fwrite($handle, $_POST["content"]);
	fclose($handle);


?>