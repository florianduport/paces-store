<?php 

	$name = ""." test";
	if($_POST["name"] != null)
	{
		$name = $_POST["name"];
	} 
?>
<p>Bonjour <?=$name ?></p>

<form method="post">
	<input type="text" name="name" value=""/>
	<input type="submit" value="Envoyer" />
</form>