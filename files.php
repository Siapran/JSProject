<?php 

function writeFile($path, $data)
{
	// on crée le chemin vers le fichier de façon récursive si il n'existe pas
	if (!file_exists(dirname($path))) {
		mkdir(dirname($path), 0777, true);
	}
	$handle = fopen($path, 'w') or die('Cannot open file:  '.$path);
	fwrite($handle, $data);
}

function readFile($path)
{
	$handle = fopen($path, 'r');
	$data = fread($handle,filesize($path));
	return $data;
}

function deleteFile($path)
{
	unlink($path);
}

function getTree($root)
{
	/* faudra que je fasse un scandir() récursif et j'ai pas le courage tout de suite */
}

?>