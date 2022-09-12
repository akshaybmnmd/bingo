// $.ajax({
//     url: "https://akshays.link/pusher/",
//     type: "GET"
// }).done(data => {
//     console.log("sucess", data);
// }).fail(e => {
//     console.error("failed", e);
// });

$("#gameCode").submit(e => {
    e.preventDefault();
    console.log($("#code").val());
    localStorage.setItem("gameCode", $("#code").val());
    localStorage.setItem("gameName", $("#name").val());
    window.location.replace("game")
});