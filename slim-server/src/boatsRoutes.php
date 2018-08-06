<?php
use Slim\Http\Request;
use Slim\Http\Response;
use \RedBeanPHP\R as R;

// Routes
$app->get('/boats', function (Request $request, Response $response, array $args) {
    $boats = R::find('boats');

    $response->getBody()->write(var_export($boats, true));
    return $response;
});

$app->get('/{boat}/members', function (Request $request, Response $response, array $args) {
    $boat = $args['boat'];

    $response->getBody()->write(var_export($boat, true));
    return $response;
});








      