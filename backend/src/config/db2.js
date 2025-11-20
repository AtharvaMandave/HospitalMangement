import ibmdb from 'ibm_db';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from backend/.env
dotenv.config({ path: path.join(__dirname, '../../.env') });

const pool = new ibmdb.Pool();
const connectionString = process.env.DB2_CONN_STRING;

console.log('🔍 DB2 Config - Connection String Loaded:', connectionString ? 'Yes ✅' : 'No ❌');

/**
 * Get a connection from the DB2 connection pool
 * @returns {Promise<Object>} DB2 connection object
 */
export const getConnection = () => {
    return new Promise((resolve, reject) => {
        if (!connectionString) {
            reject(new Error('DB2_CONN_STRING not found in environment variables'));
            return;
        }

        pool.open(connectionString, (err, connection) => {
            if (err) {
                console.error('❌ Error getting DB2 connection:', err);
                reject(err);
                return;
            }
            resolve(connection);
        });
    });
};

/**
 * Execute a parameterized SQL query
 * @param {string} sql - SQL query with ? placeholders
 * @param {Array} params - Parameters for the query
 * @returns {Promise<Array>} Query results
 */
export const executeQuery = (sql, params = []) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getConnection();

            connection.query(sql, params, (err, result) => {
                if (err) {
                    console.error('❌ Query execution error:', err);
                    if (connection) connection.close();
                    reject(err);
                    return;
                }

                if (connection) connection.close();
                resolve(result);
            });
        } catch (error) {
            if (connection) connection.close();
            reject(error);
        }
    });
};

/**
 * Execute a non-query SQL statement (INSERT, UPDATE, DELETE)
 * @param {string} sql - SQL statement
 * @param {Array} params - Parameters for the statement
 * @returns {Promise<Object>} Execution result
 */
export const executeNonQuery = (sql, params = []) => {
    return new Promise(async (resolve, reject) => {
        let connection;
        try {
            connection = await getConnection();

            connection.query(sql, params, (err, result) => {
                if (connection) connection.close();

                if (err) {
                    console.error('❌ Non-query execution error:', err);
                    reject(err);
                    return;
                }

                resolve(result);
            });
        } catch (error) {
            if (connection) connection.close();
            reject(error);
        }
    });
};

export { pool };
