<?php

use Slim\Http\Request;
use Slim\Http\Response;
use \RedBeanPHP\R as R;

// require_once('./controller/member.controller.php');

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
        
        $member->is_present = !empty($presence) ? $presence->is_present : false;
    }
    
    return $response->withJson($boatMembers);
});

// members
$app->post('/member/presence', function ($request, $response, $args) {
    $bodyData = $request->getParsedBody();
    $memberId = $bodyData['memberId'];
    $boatId = $bodyData['boatId'];
    $selectedDate = $bodyData['selectedDate'];
    $isPresent = $bodyData['isPresent'];

    $this->logger->info("/member/presence/$memberId/$boatId/$selectedDate/$isPresent");

    $presence  = R::findOne('presence', 
        ' member_id = ? AND boat_id = ? AND date = ?', [$memberId, $boatId, $selectedDate] );

    if (empty($presence)){
        $presence = R::dispense('presence');
        $presence['member_id'] = $memberId;
        $presence['boat_id'] = $boatId;
        $presence['date'] = $selectedDate;
    }
    $presence['is_present'] = $isPresent;

    return $response->withJson(R::store($presence));
});


$app->post('/member/registry', function ($request, $response, $args) {
    $bodyData = $request->getParsedBody();
    $member = $bodyData['member'];
    $memberBean = R::dispense('members');

    if (isset($member['id'])) {
        $memberBean->id = $member['id'];
        $this->logger->info("/member/registry/$member[id]");
    } else {
        $this->logger->info("/member/registry/");
    }

    $memberBean->name = $member['name'];
    $memberBean->phone = $member['phone'];
    $memberBean->birthday = $member['birthday'];
    $memberBean->isMember = $member['isMember'];
    $memberBean->isDiscipleship = $member['isDiscipleship'];
    $memberBean->hasDepartment = $member['hasDepartment'];
    $memberBean->hasRhema = $member['hasRhema'];
    $memberBean->boat_id = $member['boat_id'];

    return $response->withJson(R::store($memberBean));
});