import ibmdb from 'ibm_db';
import dotenv from 'dotenv';

dotenv.config();

const connStr = process.env.DB2_CONN_STRING;

console.log('🔍 Checking current PATIENT_MASTER table structure...\n');

ibmdb.open(connStr, (err, conn) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }

    console.log('✅ Connected to DB2 database\n');

    // Query to get table structure
    const sql = `
        SELECT 
            COLNAME, 
            TYPENAME, 
            LENGTH, 
            NULLS,
            DEFAULT,
            KEYSEQ
        FROM SYSCAT.COLUMNS 
        WHERE TABNAME = 'PATIENT_MASTER' 
        ORDER BY COLNO
    `;

    conn.query(sql, (err, result) => {
        if (err) {
            console.error('❌ Error querying table structure:', err.message);
            conn.close();
            process.exit(1);
        }

        console.log('📋 Current PATIENT_MASTER table structure:\n');
        console.table(result);

        // Check for existing constraints
        const constraintSql = `
            SELECT 
                CONSTNAME,
                TYPE,
                COLNAME
            FROM SYSCAT.TABCONST TC
            LEFT JOIN SYSCAT.KEYCOLUSE KC ON TC.CONSTNAME = KC.CONSTNAME
            WHERE TC.TABNAME = 'PATIENT_MASTER'
        `;

        conn.query(constraintSql, (err2, result2) => {
            if (err2) {
                console.error('❌ Error querying constraints:', err2.message);
            } else {
                console.log('\n🔐 Current constraints:\n');
                console.table(result2);
            }

            conn.close(() => {
                console.log('\n✅ Structure check completed');
                process.exit(0);
            });
        });
    });
});
