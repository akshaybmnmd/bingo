const code = localStorage.getItem("gameCode");
const gameName = localStorage.getItem("gameName");
var full_array = Array.from({ length: 25 }, (_, i) => i + 1);
var f_r_copy = full_array;
var association_obj = {};
var association_obj_rev = {};
var last = [];
let c = [];
var ready = false;
// var count = 1;

// for(i=1;i<26;i++){

// }

function getRandomInt(max) {
    min = 1;
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

for (i = 1; i < 6; i++) {
    for (j = 1; j < 6; j++) {
        c.push(0);
        let key = getRandomInt(f_r_copy.length) - 1;
        let num = f_r_copy[key];
        $("." + i + "_" + j).text(num);
        f_r_copy.splice(key, 1);
        association_obj[i + "_" + j] = num;
        association_obj_rev[num] = i + "_" + j;
        // count++
    }
    last.push(c);
    c = [];
}

$(".bingo_table td").click(c => {
    click_action(c.target.className);
    let num = association_obj[c.target.className];
    push('action', num, c.target.className, 'click', '');
});

function click_action(cls) {
    let td = $("." + cls);
    td.text("*");
    var axix = td[0].className.split("_");
    checkBingo(axix);
}

function checkBingo(axix) {
    last[axix[0] - 1][axix[1] - 1] = 1;
}

$("#bingo").text("Bingo (" + code + ")");

Pusher.logToConsole = false;

var pusher = new Pusher('95e635b3a3c3d9f104b0', {
    cluster: 'ap2'
});

var channel = pusher.subscribe('game-' + code);

channel.bind('game-join-' + code, function (data) {
    data = data.data;
    if (data.Gname != gameName && data.Gname != undefined) {
        if (!ready) {
            push('join', null, null, 'ready', '');
            ready = true;
            alert(data.Gname + " joined the game.");
        }
        if (data.type == "ready") {
            if (!ready) {
                ready = true;
            }
        }
    }
});

channel.bind('game-action-' + code, function (data) {
    data = data.data;
    if (data.Gname != gameName && data.Gname != undefined) {
        if (data.type == "click") {
            cls = association_obj_rev[data.number];
            click_action(cls);
        }
    }
});

channel.bind('game-notify-' + code, function (data) {
    console.error("Notify event", data);
});

channel.bind('game-event-' + code, function (data) {
    console.error("Undefined event on pusher!", data);
});

push('join', null, null, 'join', '');

function push(event = 'non', number, col_id, type, message) {
    $.ajax({
        url: "https://akshays.link/pusher/",
        data: {
            event: event,
            Gname: gameName,
            type: type,
            number: number,
            col_id: col_id,
            message: message,
            gameCode: code
        },
        type: "POST"
    }).done(data => {
        // console.log("sucess", data);
    }).fail(e => {
        console.error("failed", e);
    });
}