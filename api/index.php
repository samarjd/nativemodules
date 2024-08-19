<?php

$route = isset($_GET['route']) ? $_GET['route'] : '';

$routes = array(
  'user' => 'App\Controllers\UserController',
  'product' => 'App\Controllers\ProductController',
  'order' => 'App\Controllers\OrderController'
);

if (array_key_exists($route, $routes)) {
  try {
    $controller = $routes[$route];
    $controllerFile = __DIR__ . '/controllers/' . basename(str_replace('App\\Controllers\\', '', $controller)) . '.php';

    require_once($controllerFile);
    $controllerInstance = new $controller();
    $controllerInstance->handle($_POST);
  } catch (Exception $e) {
    $output = array(
      'error' => $e->getMessage()
    );
    echo json_encode($output);
  }
} else {
  $output = array(
    'error' => 'Invalid route'
  );
  echo json_encode($output);
}
