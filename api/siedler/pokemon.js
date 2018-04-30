var router = require('express').Router();

router.get('/', async (req, res) => {
    result = {
        "type": "Feature",
        "geometry": {
            "type": "Point",
            "coordinates": [11.062, 50.9905]
        },
        "properties": {
            "name": "Dinagat Islands"
        }
    };
    res.send(result);
});

module.exports = router;