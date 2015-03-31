<?php
$f = fopen("./homeDir/" . $_POST["file"] , "r");
$data = fread($f, filesize(("./homeDir/" . $_POST["file"])));

echo $data;

?>
