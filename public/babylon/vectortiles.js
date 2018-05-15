function VectorTileFeature(pbf, end, extent, keys, values) {

    this.properties = {};
    this.keys = keys;
    this.values = values;
    this.pbf = pbf;

    pbf.readFields(this.readFeature, this, end);

}

VectorTileFeature.prototype.readFeature = function (tag, feature, pbf) {
    if (tag == 1) feature.id = pbf.readVarint();
    else if (tag == 2) feature.readTag(pbf, feature);
    else if (tag == 3) feature.type = pbf.readVarint();
    else if (tag == 4) feature.pos = pbf.pos;
};

VectorTileFeature.prototype.readTag = function (pbf, feature) {
    var end = pbf.readVarint() + pbf.pos;
    while (pbf.pos < end) {
        var key = feature.keys[pbf.readVarint()],
            value = feature.values[pbf.readVarint()];
        feature.properties[key] = value;
    }
};

VectorTileFeature.prototype.geometry = function () {
    var pbf = this.pbf;
    pbf.pos = this.pos;

    var end = pbf.readVarint() + pbf.pos;
    var cmd = 1;
    var length = 0;
    var x = 0;
    var y = 0;
    var lines = [];
    var line;

    while (pbf.pos < end) {
        if (length <= 0) {
            var cmdLen = pbf.readVarint();
            cmd = cmdLen & 0x7;
            length = cmdLen >> 3;
        }

        length--;

        if (cmd === 1 || cmd === 2) {
            x += pbf.readSVarint();
            y += pbf.readSVarint();

            if (cmd === 1) { // moveTo
                if (line) lines.push(line);
                line = [];
            }

            line.push({x:x, y:y});

        } else if (cmd === 7) {

            // Workaround for https://github.com/mapbox/mapnik-vector-tile/issues/90
            if (line) {
                line.push({x:line[0].x, y:line[0].y}); // closePolygon
            }

        } else {
            throw new Error('unknown command ' + cmd);
        }
    }

    if (line) lines.push(line);

    return lines;
};


function VectorTileLayer(pbf, end) {

    this.keys = [];
    this.features = [];
    this.values = [];
    this.pbf = pbf;

    pbf.readFields(this.readLayer, this, end);

}

VectorTileLayer.prototype.readLayer = function (tag, layer, pbf) {
    switch (tag) {
        case 15: layer.version = pbf.readVarint(); break;
        case 1: layer.name = pbf.readString(); break;
        case 5: layer.extent = pbf.readVarint(); break;
        case 2: layer.features.push(pbf.pos); break;
        case 3: layer.keys.push(pbf.readString()); break;
        case 4: layer.values.push(layer.readValueMessage(pbf)); break;
        default: throw new Error("Unknown layer tag: " + tag);
    }
};

VectorTileLayer.prototype.readValueMessage = function (pbf) {
    var value = null;
    var end = pbf.readVarint() + pbf.pos;
    while (pbf.pos < end) {
        var tag = pbf.readVarint() >> 3;
        switch (tag) {
            case 1: value = pbf.readString(); break;
            case 2: value = pbf.readFloat(); break;
            case 3: value = pbf.readDouble(); break;
            case 4: value = pbf.readVarint64(); break;
            case 5: value = pbf.readVarint(); break;
            case 6: value = pbf.readSVarint(); break;
            case 7: value = pbf.readBoolean(); break;
            default: throw new Error("Unknown value message tag: " + tag);
        }
    }
    return value;
};

VectorTileLayer.prototype.feature = function (i) {

    if (i < 0 || i >= this.features.length) throw new Error('feature index out of bounds');
    this.pbf.pos = this.features[i];
    var end = this.pbf.readVarint() + this.pbf.pos;

    return new VectorTileFeature(this.pbf, end, this.extent, this.keys, this.values);

};

function VectorTile(vectorTilePbf) {

    this.layers = vectorTilePbf.readFields(this.readTile, {});
}

VectorTile.prototype.readTile = function (tag, layers, pbf) {
    if (tag === 3) {
        var layer = new VectorTileLayer(pbf, pbf.readVarint() + pbf.pos);
        if (layer.features.length) layers[layer.name] = layer;
    }
};
