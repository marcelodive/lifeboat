<?php

use Slim\Http\Request;
use Slim\Http\Response;
use \RedBeanPHP\R as R;

// boats
$app->get('/boats', function ($request, $response, $args) {
    $this->logger->info("/boats");
    $boats = R::findAll('boats');
    return $response->withJson($boats);
});

$app->get('/boat/{id}/members/{selectedDate}', function ($request, $response, $args) {
    $boatId = $args['id'];
    $selectedDate = $args['selectedDate'];
    $this->logger->info("/boats/$boatId/members/$selectedDate");
    $boatMembers = R::find('members', " boat_id = $boatId ");

    foreach ($boatMembers as $member) {
        $presence  = R::findOne( 'presences', 
            ' member_id = ? AND boat_id = ? AND date = ?', 
            [$member['id'], $boatId, $selectedDate] 
        );
        
        $member->is_present = !empty($presence) ? $presence->is_present : false;
    }
    
    return $response->withJson($boatMembers);
});

$app->get('/boat/{id}/ministration/{selectedDate}', function ($request, $response, $args) {
    $boatId = $args['id'];
    $selectedDate = $args['selectedDate'];

    $this->logger->info("/boat/{id}/ministration/{selectedDate}");
    $ministration = R::findOne('ministrations',
        ' boat_id = ? AND date = ?',
        [$boatId, $selectedDate] 
    );
    return $response->withJson($ministration);
});

$app->post('/boat/ministration', function ($request, $response, $args) {
    $bodyData = $request->getParsedBody();
    $boatId = $bodyData['boatId'];
    $selectedDate = $bodyData['selectedDate'];
    $ministration = $bodyData['ministration'] ?? '';

    $this->logger->info("/boat/$boatId/ministration/$selectedDate");

    $ministrationBean  = R::findOne('ministrations', 
        ' boat_id = ? AND date = ?', 
        [$boatId, $selectedDate] 
    );

    if (empty($ministrationBean)) {
        $ministrationBean = R::dispense('ministrations');
        $ministrationBean->date = $selectedDate;
        $ministrationBean->boat_id = $boatId;
    }

    $ministrationBean->ministration = $ministration;

    return $response->withJson(R::store($ministrationBean));
});

$app->get('/boat/{id}/reunion-photo/{selectedDate}', function ($request, $response, $args) {
    $boatId = $args['id'];
    $selectedDate = $args['selectedDate'];

    $this->logger->info("/boat/{id}/reunion-photo/{selectedDate}");
    $reunionPhoto = R::findOne('photos',
        ' boat_id = ? AND date = ?',
        [$boatId, $selectedDate] 
    );
    return $response->withJson($reunionPhoto);
});

$app->post('/boat/reunion-photo', function ($request, $response, $args) {
    $bodyData = $request->getParsedBody();
    $boatId = $bodyData['boatId'];
    $selectedDate = $bodyData['selectedDate'];
    $photoReunionBase64 = $bodyData['photoBase64'];

    $this->logger->info("/boat/$boatId/reunion-photo/$selectedDate");    

    $reunionPhotoBean  = R::findOne('photos', 
        ' boat_id = ? AND date = ?', 
        [$boatId, $selectedDate] 
    );

    if (empty($reunionPhotoBean)) {
        $reunionPhotoBean = R::dispense('photos');
        $reunionPhotoBean->date = $selectedDate;
        $reunionPhotoBean->boat_id = $boatId;
    }

    $reunionPhotoBean->photo_b64 = $photoReunionBase64;

    return $response->withJson(R::store($reunionPhotoBean));
});



// members
$app->post('/member/presence', function ($request, $response, $args) {
    $bodyData = $request->getParsedBody();
    $memberId = $bodyData['memberId'];
    $boatId = $bodyData['boatId'];
    $selectedDate = $bodyData['selectedDate'];
    $isPresent = $bodyData['isPresent'];

    $this->logger->info("/member/presence/$memberId/$boatId/$selectedDate/$isPresent");

    $presence  = R::findOne('presences', 
        ' member_id = ? AND boat_id = ? AND date = ?', 
        [$memberId, $boatId, $selectedDate] 
    );

    if (empty($presence)){
        $presence = R::dispense('presences');
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
        $memberBean->createdAt = $member['created_at'];
        $this->logger->info("/member/registry/$member[id]");
    } else {
        $memberBean->createdAt = date('Y-m-d H:i:s');
        $this->logger->info("/member/registry/");
    }

    $memberBean->name = $member['name'];
    $memberBean->phone = $member['phone'];
    $memberBean->birthday = $member['birthdayToDB'];
    $memberBean->isMember = $member['is_member'] ?? false;
    $memberBean->isDiscipleship = $member['is_discipleship'] ?? false;
    $memberBean->hasDepartment = $member['has_department'] ?? false;
    $memberBean->hasRhema = $member['has_rhema'] ?? false;
    $memberBean->boat_id = $member['boat_id'];
    $memberBean->lastEdit = date('Y-m-d H:i:s');
    $memberBean->id = R::store($memberBean);

    return $response->withJson($memberBean);
});


$app->post('/member/disconnect', function ($request, $response, $args) {
    $bodyData = $request->getParsedBody();

    $memberId = $bodyData['memberId'];
    $justification = $bodyData['justification'];

    $memberBean = R::load('members', $memberId);

    if (isset($memberId)) {
        $this->logger->info("/member/delete/$memberId");
    }

    $memberBean->disconnected = true;
    $memberBean->justification = $justification;

    return $response->withJson(R::store($memberBean));
});


//statistics
$app->get('/statistics', function ($request, $response, $args) {
    $this->logger->info("/statistics");

    $numActiveBoats = R::getAll('
        SELECT count(DISTINCT boat_id) as count FROM presences
        WHERE presences.date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
    ')[0]['count'];

    $numActiveMembers = R::getAll('
        SELECT count(DISTINCT member_id) as count FROM presences
        WHERE presences.date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
    ')[0]['count'];

    $numMinistrations = R::getAll('
        SELECT count(id) as count FROM ministrations
        WHERE date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
    ')[0]['count'];

    $numPhotos = R::getAll('
        SELECT count(id) as count FROM `photos` 
        WHERE date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
        ')[0]['count'];

    $numRegisteredPresences = R::getAll('
        SELECT count(id) as count FROM presences
        WHERE date >= DATE_SUB(NOW(), INTERVAL 3 MONTH) AND is_present = "true"
    ')[0]['count'];

    $mostPresentMembers = R::getAll('
        SELECT COUNT(*) AS num_presences,
            members.name AS member_name,
            boats.name AS boat_name
        FROM presences JOIN boats ON boats.id = presences.boat_id
            JOIN members ON presences.member_id = members.id
        WHERE date >= DATE_SUB(NOW(), INTERVAL 3 MONTH)
        GROUP BY presences.member_id
        ORDER BY num_presences DESC
        LIMIT 5
    ');

    $randMinistrations = R::getAll('
        SELECT ministrations.date, ministration, boats.name
        FROM ministrations JOIN boats ON boats.id = ministrations.boat_id
        WHERE date >= DATE_SUB(NOW(), INTERVAL 3 MONTH) 
            AND ministration IS NOT NULL AND ministration <> ""
        ORDER BY RAND()
        LIMIT 5
    ');

    $randPhoto = R::getAll('
        SELECT photos.*, boats.name
        FROM photos
        JOIN boats ON boats.id = photos.boat_id
        WHERE date >= DATE_SUB(NOW(), INTERVAL 3 MONTH) 
        ORDER BY RAND()
        LIMIT 2
    ');

    $statistics = [
        'boatStatistics' => [
            'botes' => $numActiveBoats,
            'membros' => $numActiveMembers,
            'ministrações' => $numMinistrations,
            'fotos' => $numPhotos,
            'presenças registradas' => $numRegisteredPresences
        ], 
        'mostPresentMembers' => $mostPresentMembers,
        'randMinistrations' => $randMinistrations,
        'randPhoto' => $randPhoto
    ];

    return $response->withJson($statistics);
});