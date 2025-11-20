import ibmdb from 'ibm_db';
import dotenv from 'dotenv';

dotenv.config();

const pool = new ibmdb.Pool();

const connectionString = process.env.DB2_CONN_STRING;

function dbConnect() {
  return new Promise((resolve, reject) => {
    if (!connectionString) {
      reject(
        new Error(
          'DB2 connection string not provided. Set DB2_CONN_STRING in your environment.'
        )
      );
      return;
    }

    pool.open(connectionString, (err, connection) => {
      if (err) {
        reject(err);
        return;
      }

      console.log("✅ Connected to IBM DB2 database successfully.");
      resolve(connection);
    });
  });
}

export default dbConnect;
