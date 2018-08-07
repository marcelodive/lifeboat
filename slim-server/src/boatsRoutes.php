<?php
use Slim\Http\Request;
use Slim\Http\Response;
use \RedBeanPHP\R as R;

// Routes
$app->get('/boats', function (Request $request, Response $response, array $args) {
    $boats = R::findAll('boats');

    header("Content-Type: application/json");
    echo json_encode($boats);
    exit;
});

$app->get('/{boat}/members', function (Request $request, Response $response, array $args) {
    $boat = $args['boat'];

    $response->getBody()->write(var_export($boat, true));
    return $response;
});








      