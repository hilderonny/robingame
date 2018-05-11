var campreview, isrunning;

function start() {
    if (isrunning) return;

    console.log("start");

    // Init camera
    campreview = document.querySelector('#campreview');
    navigator.mediaDevices.getUserMedia({
        video: {
            width: { exact: 1920 },
            height: { exact: 1080 },
            advanced: [{ facingMode: "environment" }],
        }
    }).then(function (stream) {
        campreview.srcObject = stream;
    });

    // Prepare canvas
    var canvas = document.createElement('canvas');
    var context = canvas.getContext("2d");

    // Prepare QR reader from llqrcode
    var resultdiv = document.querySelector('#result')
    qrcode.callback = function (result) {
        resultdiv.innerHTML = result;
    };

    // Trigger scan
    function scan() {
        var width = campreview.videoWidth;
        var height = campreview.videoHeight;
        canvas.width = width;
        canvas.height = height;
        context.drawImage(campreview, 0, 0, width, height);
        qrcode.canvas_qr2 = canvas;
        qrcode.qrcontext2 = context;
        try {
            qrcode.decode();
        } catch (error) { }
        if (isrunning) setTimeout(scan, 250);
    }
    isrunning = true;
    scan();

}

window.addEventListener("load", start);

window.addEventListener("focus", start);

window.addEventListener("blur", function () {
    if (!campreview) return;

    isrunning = false;

    campreview.srcObject.getTracks().forEach(function (track) {
        track.stop();
    });
    campreview.srcObject = null;
});

