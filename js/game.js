const code = localStorage.getItem("gameCode");
const gameName = localStorage.getItem("gameName");
var full_array = Array.from({ length: 25 }, (_, i) => i + 1);
var f_r_copy = full_array;
var association_obj = {};
var association_obj_rev = {};
var last = [];
let c = [];
var ready = false;
var point = 0;
var ran_no = getRandomInt(100);
move = false;

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
    }
    last.push(c);
    c = [];
}

$(".bingo_table td").click(c => {
    if (move) {
        clicked_no = c.target.innerText;
        if (clicked_no != "*") {
            click_action(c.target.className);
            let num = association_obj[c.target.className];
            push('action', num, c.target.className, 'click', '');
            move = false;
            $("#move_of").text("Opponent's move.");
            $("#called_num").text("Number: " + clicked_no);
        }
    } else {
        console.log("not your move!");
    }
});

function click_action(cls) {
    let td = $("." + cls);
    td.text("*");
    var axix = td[0].className.split("_");
    checkBingo(axix);
    td[0].addEventListener("click", function () { }, false);
    td[0].style.cursor = "not-allowed";
}

function checkBingo(axix) {
    let x = axix[0] - 1;
    let y = axix[1] - 1;
    last[x][y] = 1;
    if (x == y) {
        let tot_xey = 0;
        for (i = 0; i < 5; i++) {
            tot_xey += last[i][i];
            if (tot_xey == 5) {
                point++;
            }
        }
    }
    if (x + y == 4) {
        let tot_xny = 0;
        for (j = 0; j < 5; j++) {
            tot_xny += last[j][4 - j];
            if (tot_xny == 5) {
                point++;
            }
        }
    }
    if (x == y && x + y == 4) {
        let tot_xey = 0;
        for (i = 0; i < 5; i++) {
            tot_xey += last[i][i];
            if (tot_xey == 5) {
                point++;
            }
        }
        let tot_xny = 0;
        for (j = 0; j < 5; j++) {
            tot_xny += last[j][4 - j];
            if (tot_xny == 5) {
                point++;
            }
        }
    }
    let tot_x = 0;
    for (i = 0; i < 5; i++) {
        tot_x += last[i][y];
        if (tot_x == 5) {
            point++;
        }
    }
    let tot_y = 0;
    for (j = 0; j < 5; j++) {
        tot_y += last[x][j];
        if (tot_y == 5) {
            point++;
        }
    }
    if (point > 4) {
        push('notify', null, null, 'win', 'This user winned.');
    }

    $("#point").text("Point: " + point);
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
            push('join', null, null, 'ready', ran_no);
            ready = true;
            alert(data.Gname + " joined the game.");
        }
        if (data.type == "ready") {
            if (data.message == ran_no) {
                window.location.reload();
            }
            if (data.message > ran_no) {
                push('action', null, null, 'first_move', null);
                move = true;
                $("#move_of").text("Your move.");
            }
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
            move = true;
            $("#move_of").text("Your move.");
            $("#called_num").text("Number: " + data.number);
        }
        if (data.type == "first_move") {
            move = false;
            $("#move_of").text("Opponent's move.");
        }
    }
});

channel.bind('game-notify-' + code, function (data) {
    data = data.data;
    if (data.type == "win") {
        alert("User " + data.Gname + " win the match.");
    } else {
        console.log("Notify event", data);
    }
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
    }).fail(e => {
        console.error("failed", e);
    });
}