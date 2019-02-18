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

$app->get('/boat/{id}/meeting/{selectedDate}', function ($request, $response, $args) {
    $boatId = $args['id'];
    $selectedDate = $args['selectedDate'];

    $this->logger->info("/boat/{id}/meeting/{selectedDate}");
    $meeting = R::findOne('meetings',
        ' boat_id = ? AND date = ?',
        [$boatId, $selectedDate]
    );
    return $response->withJson($meeting);
});

$app->post('/boat/meeting', function ($request, $response, $args) {
    $bodyData = $request->getParsedBody();
    $boatId = $bodyData['boatId'];
    $selectedDate = $bodyData['selectedDate'];
    $meeting = $bodyData['meeting'] ?? '';

    $this->logger->info("/boat/$boatId/meeting/$selectedDate");

    $meetingBean  = R::findOne('meetings',
        ' boat_id = ? AND date = ?',
        [$boatId, $selectedDate]
    );

    if (empty($meetingBean)) {
        $meetingBean = R::dispense('meetings');
        $meetingBean->date = $selectedDate;
        $meetingBean->boat_id = $boatId;
    }

    $meetingBean->meeting = $meeting;

    return $response->withJson(R::store($meetingBean));
});

$app->post('/boat/meeting-photo', function ($request, $response, $args) {
    $bodyData = $request->getParsedBody();
    $boatId = $bodyData['boatId'];
    $selectedDate = $bodyData['selectedDate'];
    $photoMeetingBase64 = $bodyData['photoBase64'];

    $this->logger->info("/boat/$boatId/meeting-photo/$selectedDate");

    [$fileType, $base64HtmlData] = explode(';', $photoMeetingBase64);
    [,$fileExtension] = explode('/', $fileType);
    [,$encodedBase64] = explode(',', $base64HtmlData);
    $decodedBase64 = base64_decode($encodedBase64);

    $fileName = "${selectedDate}-${boatId}.${fileExtension}";

    file_put_contents("../images/meetings/photos/${fileName}", $decodedBase64);

    $meetingBean  = R::findOne('meeting',
        ' boat_id = ? AND date = ?',
        [$boatId, $selectedDate]
    );

    if (empty($meetingBean)) {
        $meetingBean = R::dispense('meeting');
        $meetingBean->date = $selectedDate;
        $meetingBean->boat_id = $boatId;
    }

    $meetingBean->photo = $fileName;

    return $response->withJson(R::store($meetingBean));
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
        $this->logger->info("/member/registry/$member[id]");
    } else {
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
