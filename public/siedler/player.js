var Player = new Proxy({
    _changehandler: {},
    clickradius: 50, // 50 ist für den Anfang ganz gut, wenn der Zoom auf Stufe 17 steht
    onchange: function(propname, handler) {
        if (!Player._changehandler[propname]) Player._changehandler[propname] = [];
        Player._changehandler[propname].push(handler);
    }
}, {
    get: function(obj, prop) {
        return obj[prop];
    },
    set: function(obj, prop, value) {
        var before = obj[prop];
        obj[prop] = value;
        if (obj._changehandler[prop]) obj._changehandler[prop].forEach(function(handler) {
            handler(before, value);
        });
    }
});