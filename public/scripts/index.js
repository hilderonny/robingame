function addPoint() {
    var pointsDiv = document.getElementById("points");
    var pointsString = localStorage.getItem("points");
    var points = pointsString ? parseInt(pointsString) + 1 : 0;
    pointsDiv.innerHTML = points;
    localStorage.setItem("points", points);
}

window.addEventListener("load", function() {

    window.applicationCache.addEventListener('updateready', function(e) {
        window.applicationCache.swapCache();
        window.location.reload();
    })
    window.applicationCache.update();

    window.setInterval(addPoint, 1000);

    addPoint();

});
