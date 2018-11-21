var pg = require("pg");

var Db = {

    Pools: {},

    getPool: function(databasename) {
        var pool = Db.Pools[databasename];
        if (!pool) {
            pool = new pg.Pool({
                host: '127.0.0.1',
                port: 5432,
                database: databasename,
                user: 'postgres',
                password: 'postgres'
            });
            Db.Pools[databasename] = pool;
        }
        return pool;
    },

    initVoxelHoxel: async() => {
        if ((await Db.query(`postgres`, `SELECT 1 FROM pg_database WHERE datname = 'voxelhoxel';`)).rowCount === 0) {
            await Db.query(`postgres`, `CREATE DATABASE voxelhoxel;`);
        }
        if ((await Db.query(`voxelhoxel`, `SELECT 1 FROM pg_tables WHERE tablename = 'models';`)).rowCount === 0) {
            await Db.query(`voxelhoxel`, `CREATE TABLE models (id SERIAL NOT NULL PRIMARY KEY);`);
        }
        await Db.query(`voxelhoxel`, `ALTER TABLE models ADD COLUMN IF NOT EXISTS name TEXT;`);
        await Db.query(`voxelhoxel`, `ALTER TABLE models ADD COLUMN IF NOT EXISTS thumbnail TEXT;`);
        await Db.query(`voxelhoxel`, `ALTER TABLE models ADD COLUMN IF NOT EXISTS data JSON;`);
    },

    init: async() => {
        await Db.initVoxelHoxel();
    },

    query: async(databasename, query) => {
        //console.log(databasename, query);
        const pool = Db.getPool(databasename);
        const client = await pool.connect();
        var result = undefined;
        try {
            result = await client.query(query);
        } catch(error) {
            console.log(error);
        } finally {
            client.release();
        }
        return result;
    }

}

module.exports.Db = Db;