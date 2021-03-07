<?php
  if (isset($_GET["database"])) {
    header('Content-Type: application/json');
    header('Content-Disposition: attachment; filename="'.$_GET["database"].'_inserts_rules.json"');
    echo file_get_contents('./rules/'.$_GET["database"].'.json');
  }
 ?>
