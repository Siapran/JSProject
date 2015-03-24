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

/*function get_tree($dir) {
	$handle = opendir($dir);

	$res = "";

	while ($file = readdir($handle)) {
		if ($file != "." && $file != "..") {
			$res = "{";
			$res .= "'text': '" . $file . "'";
			$path = $dir.'/'.$file;
			if (is_dir($path)) {
				$res .= ", 'icon': './images/blue-folder.png'";
				$res .= ", 'children': [" . get_tree($path) . "]";
			} else {
				$res .= ", 'icon': './images/blue-document.png'";
			}
			$res .= "},";
		}
	}
	closedir($handle);

	return $res;
}*/

function get_tree($dir) {
	$handle = opendir($dir);

	while ($file = readdir($handle)) {
		if ($file[0] != ".") {
			echo "{";
			echo "'text': '" . $file . "'";
			$path = $dir.'/'.$file;
			if (is_dir($path)) {
				echo ", 'icon': './images/blue-folder.png'";
				echo ", 'children': [";
				get_tree($path);
				echo "]";
			} else {
				echo ", 'icon': './images/blue-document.png'";
			}
			echo "},";
		}
	}
	closedir($handle);
}

get_tree(".");

?>
