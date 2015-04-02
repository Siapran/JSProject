<?php 
$dirname = $_POST["dirname"];
$filename = "./homedir/" . $dirname ;
echo $filename;
if (!file_exists($filename)) {
    mkdir($filename, 0777, true);
    echo "The directory $dirname was successfully created.";
    exit;
} else {
    echo "The directory $dirname exists.";
}

 ?>