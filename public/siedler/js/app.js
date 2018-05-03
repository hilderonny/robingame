var map = new Map();
var player = new Player();

window.addEventListener("load", () => {

    document.body.appendChild(map.domElement);
    document.body.appendChild(player.domElement);

    map.show("map");

    // setInterval(() => {
    //     player.clickRadius += 1;
    // }, 1000);
   
});