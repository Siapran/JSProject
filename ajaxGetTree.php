<?php
function get_tree($dir) {
	$handle = opendir($dir);
	$res = "";
	$file = readdir($handle);

	while (false !== $file) {
		if ($file[0] != ".") {
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
			if (($file = readdir($handle)) !== false)
				$res .= ",";
		} else $file = readdir($handle);
	}

	closedir($handle);

	return $res;
}

echo "{ \"core\" : {
    \"data\" : [";
echo get_tree($_GET["dir"]);
// echo get_tree($_GET["dir"]);
echo "]
} }";

?>