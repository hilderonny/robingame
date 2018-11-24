const router = require('express').Router();
const Db = require('../../utils/db').Db;

router.get('/models', async(req, res) => {
    const result = await Db.query(`voxelhoxel`, `SELECT id, name FROM models;`);
    res.send(result.rows);
});

router.get('/models/data/:id', async(req, res) => {
    const result = await Db.query(`voxelhoxel`, `SELECT id, data FROM models WHERE id='${req.params.id}';`);
    res.send(result.rowCount > 0 ? result.rows[0] : {});
});

router.get('/models/thumbnail/:id', async(req, res) => {
    const result = await Db.query(`voxelhoxel`, `SELECT id, thumbnail FROM models WHERE id='${req.params.id}';`);
    if (!result || result.rowCount < 1) return res.sendStatus(404);
    const parts = result.rows[0].thumbnail.split(',');
    const buffer = new Buffer(parts[1], 'base64');
    const type = parts[0].split(';')[0].split(':')[1];
    res.writeHead(200, {'Content-Type': type });
    res.end(buffer, 'binary');
});

router.post('/models', async(req, res) => {
    const model = req.body;
    if (!model.id) {
        if (!model.data) model.data = {};
        if (!model.thumbnail) model.thumbnail = '';
        const result = await Db.query(`voxelhoxel`, `INSERT INTO models (name, thumbnail, data) VALUES ('${model.name}', '${model.thumbnail}', '${JSON.stringify(model.data)}') RETURNING id;`);
        if (result && result.rows && result.rowCount > 0) res.send({ id: result.rows[0].id });
    } else {
        const keys = Object.keys(model);
        if (keys.includes('name')) await Db.query(`voxelhoxel`, `UPDATE models SET name='${model.name}' WHERE id='${model.id}';`);
        if (keys.includes('thumbnail')) await Db.query(`voxelhoxel`, `UPDATE models SET thumbnail='${model.thumbnail}' WHERE id='${model.id}';`);
        if (model.data) await Db.query(`voxelhoxel`, `UPDATE models SET data='${JSON.stringify(model.data)}' WHERE id='${model.id}';`);
        res.send({ id: model.id });
    }
});

module.exports = router;