<?php

if (rename("./homeDir/" . $_POST["oldpath"] , "./homeDir/" . $_POST["newpath"] ))
	echo "move from " + $_POST["oldpath"] + " to " + $_POST["newpath"];
else
	echo "FALSE";

?>
