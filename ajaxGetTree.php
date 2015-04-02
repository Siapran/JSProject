<?php
function get_tree($dir) {
	$res = "";

	$handle = opendir($dir);
	$files = array();
	$dirs = array();

	while (($file = readdir($handle)) !== false)
		if ($file[0] != ".")
			if (is_dir($dir."/".$file))
				$dirs[] = $file;
			else
				$files[] = $file;

	closedir($handle);

	sort($files);
	sort($dirs);
	$files = array_merge($dirs, $files);

	for ($i=0; $i < count($files); $i++) {
		$file = $files[$i];
		$res .= "{";
		$res .= "\"text\": \"".$file."\"";
		$path = $dir."/".$file;
		if (is_dir($path)) {
			$res .= ", \"icon\": \"images/blue-folder.png\"";
			$res .= ", \"children\": [".get_tree($path)."]";
		} else {
			$res .= ", \"icon\": \"images/blue-document.png\"";
		}
		$res .= "}";
		if ($i + 1 != count($files)) {
			$res .= ",";
		}
	}

	return $res;
}

// echo "{ \"core\" : {
    \"data\" : [";
// echo get_tree("homeDir");
echo get_tree($_GET["dir"]);
echo "]"

// echo "}," . "\"plugins\" : " . "[\"contextmenu\", \"sort\", \"dnd\", \"state\"] }";

?>