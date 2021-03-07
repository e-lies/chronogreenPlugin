<?php
  require '../functions/database.php';
  header("Content-Type: application/json");
  if (!isset($_GET["database"])) {
    echo json_encode(["success" => false]);
    die();
  }
  echo json_encode(get_tables($pdo,$_GET["database"]));
  die();
 ?>
