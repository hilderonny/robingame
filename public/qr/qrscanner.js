var campreview, isrunning;

function quersumme(zahlentext, maximum) {
    var qs = 0;
    for(var i = 0; i < zahlentext.length; i++) {
        qs += parseInt(zahlentext[i]);
    }
    if (qs > maximum) qs = quersumme(qs.toString());
    return qs;
}

function ordinalzahlen(text) {
    var result = "";
    for(var i = 0; i < text.length; i++) {
        result += text.charCodeAt(i);
    }
    return result;
}

function start() {
    if (isrunning) return;

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
    var resultdiv = document.querySelector('#result');
    var caughtpokemon = document.querySelector('#caughtpokemon');
    qrcode.callback = function (result) {
        var ordinal = ordinalzahlen(result);
        var qs = quersumme(ordinal, 807); // Mit Ultrasonne sind es 807 Pokemon
        // Ausgabe
        var number = "000" + qs;
        number = number.substring(number.length - 3);
        var src = "pokemon/" + number + ".png";
        caughtpokemon.src = src;
        resultdiv.innerHTML = result + " - " + ordinal + " - " + qs + " - " + src;
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

