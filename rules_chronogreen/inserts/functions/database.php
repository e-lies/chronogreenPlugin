<?php

$env_variables['DB_HOST'] = "127.0.0.1";
$env_variables['DB_NAME'] = "information_schema";
$env_variables['DB_USER'] = "root";
$env_variables['DB_PASS'] = "";

function connect_db($db_host ,$db_name, $db_user, $db_pass){
  try{
    $db = new PDO('mysql:host='.$db_host.';dbname='.$db_name.';charset=utf8mb4', $db_user, $db_pass);
  }catch(Exception $e){
    echo "no connect";
    throw $e;
  }
  return $db;
}
$pdo = connect_db($env_variables['DB_HOST'], $env_variables['DB_NAME'], $env_variables['DB_USER'],$env_variables['DB_PASS']);


function get_tables($pdo, $db){
  $tables = [];
  $sql = "SELECT DISTINCT(TABLE_NAME) from information_schema.columns where COLUMNS.TABLE_SCHEMA = ?; ";

  $query = $pdo->prepare($sql);

  $query->execute([$db]);

  $res =  $query->fetchAll(PDO::FETCH_NUM);
  foreach ($res as $table) {
    $tables[] = $table[0];
  }
  return $tables;
}

function get_columns($pdo, $db, $table){
  $cols = [];
  $sql = "SELECT DISTINCT(COLUMN_NAME) from information_schema.columns where COLUMNS.TABLE_SCHEMA = ? AND COLUMNS.TABLE_NAME = ?;";
  $query = $pdo->prepare($sql);

  $query->execute([$db, $table]);

  $res =  $query->fetchAll(PDO::FETCH_NUM);

  foreach ($res as $col) {
    $cols[] = $col[0];
  }
  return $cols;
}
 ?>
