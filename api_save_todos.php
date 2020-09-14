<?php
  require_once('conn.php');
  header('Content-Type: application/json; charset=utf-8');
  header('Access-Control-Allow-Origin: *');

  $content = $_POST['content'];
  $id = '';

  if(!empty($_POST['id'])) {
    $id = $_POST['id'];
    $sql = "UPDATE ai86109_w12_todos SET content=? WHERE id=?";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('si', $content, $id);
    $result = $stmt->execute();

    if(!$result) {
      $json = array(
        "ok" => false,
        "message" => $conn->error
      );
      $response = json_encode($json);
      echo $response;
      die();
    }
    $json = array(
      "ok" => true,
      "id" => $id
    );
    $response = json_encode($json);
    echo $response;
  } else {
    $sql = "INSERT INTO ai86109_w12_todos(content) VALUES(?)";
    $stmt = $conn->prepare($sql);
    $stmt->bind_param('s', $content);
    $result = $stmt->execute();
    
    if(!$result) {
      $json = array(
        "ok" => false,
        "message" => $conn->error
      );
      $response = json_encode($json);
      echo $response;
      die();
    }
    $id = $conn->insert_id;

    $json = array(
      "ok" => true,
      "id" => $id
    );
    $response = json_encode($json);
    echo $response;
  }
?>