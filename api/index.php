<?php
  header('Content-Type: application/json');
  $output = array();
  // query the data from somewhere
  $output['data'] = "1234";
  echo json_encode($output); // json_encode creates the json-specific formatting
?>