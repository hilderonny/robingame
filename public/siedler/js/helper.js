var Helper = {
    createProxy: function(obj) {
        var changehandler = {};
        obj.onchange = function(propertyname, handler) {
            if (!changehandler[propertyname]) changehandler[propertyname] = [];
            changehandler[propertyname].push(handler);
        };
        return new Proxy(obj, {
            set: function(obj, propertyname, value) {
                var before = obj[propertyname];
                obj[propertyname] = value;
                if (changehandler[propertyname]) changehandler[propertyname].forEach(function(handler) {
                    handler(before, value);
                });
            }
        });
    }
};