const router = require('express').Router();
const Db = require('../../utils/db').Db;

router.get('/models', async(req, res) => {
    const result = await Db.query(`voxelhoxel`, `SELECT id, name, thumbnail FROM models;`);
    res.send(result.rows);
});

router.get('/models/:id', async(req, res) => {
    const result = await Db.query(`voxelhoxel`, `SELECT * FROM models WHERE id='${req.params.id}';`);
    res.send(result.rows);
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
        res.send(200);
    }
});

module.exports = router;