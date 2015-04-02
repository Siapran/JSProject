<?php

function write_file($path, $data) {
	// on crée le chemin vers le fichier de façon récursive si il n'existe pas
	if (!file_exists(dirname($path))) {
		mkdir(dirname($path), 0777, true);
	}
	$handle = fopen($path, 'w') or die('Cannot open file:  '.$path);
	fwrite($handle, $data);
	fclose($handle);
}

function read_file($path) {
	$handle = fopen($path, 'r');
	$data = fread($handle, filesize($path));
	fclose($handle);
	return $data;
}

function delete_file($path) {
	unlink($path);
}

function rename_file($path, $newpath) {
	rename($path, $newpath);
}

?>