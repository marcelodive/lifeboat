<?php

use Slim\Http\Request;
use Slim\Http\Response;
use \RedBeanPHP\R as R;

// boats
$app->get('/boats', function (Request $request, Response $response, array $args) {
    $this->logger->info("/boats");
    $boats = R::findAll('boats');
    return $response->withJson($boats);
});

$app->get('/boat/{id}/members/{selectedDate}', function (Request $request, Response $response, array $args) {
    $boatId = $args['id'];
    $selectedDate = $args['selectedDate'];
    $this->logger->info("/boats/$boatId/members/$selectedDate");
    $boatMembers = R::find('members', " boat_id = $boatId ");

    foreach ($boatMembers as $member) {
        $presence  = R::findOne( 'presence', 
            ' member_id = ? AND boat_id = ? AND date = ?', [$member['id'], $boatId, $selectedDate] );
        
        $member->isPresent = !empty($presence);
    }
    
    return $response->withJson($boatMembers);
});

// members
$app->get('/member/presence/{memberId}/{boatId}/{selectedDate}/{isPresent}', function (Request $request, Response $response, array $args) {
    $memberId = $args['memberId'];
    $boatId = $args['boatId'];
    $selectedDate = $args['selectedDate'];
    $isPresent = $args['isPresent'];

    $presence  = R::findOne( 'presence', 
        ' member_id = ? AND boat_id = ? AND date = ?', [$memberId, $boatId, $selectedDate] );

    if (empty($presence)){
        $presence = R::dispense( 'presence' );
        $presence['member_id'] = $memberId;
        $presence['boat_id'] = $boatId;
        $presence['date'] = $selectedDate;
    }

    $presence['is_present'] = $isPresent;
    return $response->withJson(R::store($presence));
});