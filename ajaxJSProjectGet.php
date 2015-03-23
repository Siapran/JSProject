<?php

$f = fopen(".jsprojectOpenedDocs" . , "r");
$data = fread($f, filesize(".jsprojectOpenedDocs"));
/* fichier1, ichier2, fichier3 */
$files = explode("|", $data);

echo json_encode($files, true);

?>
