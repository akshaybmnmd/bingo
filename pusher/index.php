<?php
    require __DIR__ . '/vendor/autoload.php';

    header("Access-Control-Allow-Origin: *");
    header('Content-Type: application/json; charset=utf-8');

    $request = $_REQUEST;

    $event = $_REQUEST["event"];
    $gameCode = $_REQUEST["gameCode"];

    $options = array( 'cluster' => 'ap2', 'useTLS' => true );
    $pusher = new Pusher\Pusher( '95e635b3a3c3d9f104b0', '2842bb68798a779080b0', '1475882', $options );

    $data['data'] = $request;
    switch($event){
        case "join":
            $pusher->trigger('game-'.$gameCode, 'game-join-'.$gameCode, $data);
            break;
        case "action":
            $pusher->trigger('game-'.$gameCode, 'game-action-'.$gameCode, $data);
            break;
        case "notify":
            $pusher->trigger('game-'.$gameCode, 'game-notify-'.$gameCode, $data);
            break;
        default:
            $pusher->trigger('game-'.$gameCode, 'game-event-'.$gameCode, $data);
    }

    $myJSON = json_encode($request);

    echo $myJSON;
?>