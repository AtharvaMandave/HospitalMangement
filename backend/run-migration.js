import ibmdb from 'ibm_db';
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config();

const connStr = process.env.DB2_CONN_STRING;

if (!connStr) {
    console.error('❌ DB2_CONN_STRING not found in .env file');
    process.exit(1);
}

console.log('🔄 Running database migration: Adding VISIT_COUNT column...\n');

const sqlFile = path.join(__dirname, 'db_scripts', 'add_visit_count.sql');
const sql = fs.readFileSync(sqlFile, 'utf8');

// Split by semicolons and filter out empty statements
const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s && !s.startsWith('--') && s.toLowerCase() !== 'commit');

ibmdb.open(connStr, (err, conn) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }

    console.log('✅ Connected to DB2 database\n');

    let completed = 0;
    const executeNext = (index) => {
        if (index >= statements.length) {
            console.log('\n✅ Migration completed successfully!');
            console.log(`   Executed ${completed} SQL statements`);
            conn.close(() => {
                process.exit(0);
            });
            return;
        }

        const statement = statements[index];
        console.log(`Executing statement ${index + 1}/${statements.length}...`);

        conn.query(statement, (err, result) => {
            if (err) {
                // Check if error is because column already exists
                if (err.message.includes('already exists') || err.state === '42711') {
                    console.log(`⚠️  Column already exists, skipping...`);
                    executeNext(index + 1);
                } else {
                    console.error(`❌ Error executing statement ${index + 1}:`, err.message);
                    conn.close(() => {
                        process.exit(1);
                    });
                }
            } else {
                completed++;
                console.log(`✅ Statement ${index + 1} executed successfully`);
                executeNext(index + 1);
            }
        });
    };

    executeNext(0);
});
