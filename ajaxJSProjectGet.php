<?php
$f = fopen("./homeDir/" . $_POST["file"] , "r");
if (filesize("./homeDir/" . $_POST["file"]) > 0) {
	$data = fread($f, );

	echo $data;
}

?>
