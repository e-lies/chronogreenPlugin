<?php
  require '../functions/database.php';
  header("Content-Type: application/json");
  if (!isset($_GET["database"]) || !isset($_GET["table"])) {
    echo json_encode(["success" => false]);
    die();
  }
  echo json_encode(get_columns($pdo,$_GET["database"], $_GET["table"]));
  die();
 ?>
