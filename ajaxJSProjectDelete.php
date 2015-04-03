<?php
$dirname = $_POST["path"];
$filename = "./homedir/" . $dirname ;
if (is_dir($filename)) {
	rmdir("./homeDir/" . $_POST["path"]);
} else {
	unlink("./homeDir/" . $_POST["path"]);
}

?>
