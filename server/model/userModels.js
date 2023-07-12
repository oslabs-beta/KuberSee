// import * as dotenv from "dotenv";
const { Client } = require('pg');
require('dotenv').config();
const { Pool } = require('pg');

const pool = new Pool({
  connectionString:
    'postgres://hmachemu:djK2F6WfEulBLS9WqON5GSumTIkDCz28@snuffleupagus.db.elephantsql.com/hmachemu',
});
pool.on('connect', (client) => {
  client.query('SET DATESTYLE = iso, mdy');
});

if (pool) {
  // mysql is started && connected successfully.
  console.log('Connection Success');
}

module.exports = {
  query: (text, params, callback) => {
    // console.log("executed query", text);
    return pool.query(text, params, callback);
  },
};
