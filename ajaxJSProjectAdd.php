<?php

$f = fopen("./" . $_POST["path"] . "", "w");
$fileJSProject = fopen(".jsprojectOpenedDocs", "w");
fwrite($fileJSProject, $_POST["myOpenedDocs"]);
fwrite($f, $_POST["myContent"]);
echo "ok";
header("Access-Control-Allow-Origin: *");


?>