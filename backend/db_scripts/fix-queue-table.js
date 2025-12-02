import { executeQuery, executeNonQuery } from '../src/config/db2.js';

const fixQueueTable = async () => {
    try {
        console.log('🔍 Checking for existing QUEUE_MASTER table...');

        // Check if table exists in any schema
        const checkSql = `
            SELECT TABSCHEMA, TABNAME 
            FROM SYSCAT.TABLES 
            WHERE TABNAME = 'QUEUE_MASTER'
        `;

        const existing = await executeQuery(checkSql, []);

        if (existing.length > 0) {
            console.log(`📋 Found table in schema: ${existing[0].TABSCHEMA}`);
            console.log('🗑️  Dropping existing table...');
            await executeNonQuery(`DROP TABLE ${existing[0].TABSCHEMA}.QUEUE_MASTER`, []);
        }

        console.log('📋 Creating QUEUE_MASTER table in DB2ADMIN schema...');

        const sql = `
            CREATE TABLE DB2ADMIN.QUEUE_MASTER (
                QUEUE_ID INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
                PATIENT_ID INTEGER NOT NULL,
                AADHAR_NO VARCHAR(12) NOT NULL,
                PATIENT_NAME VARCHAR(100) NOT NULL,
                DEPARTMENT VARCHAR(50) NOT NULL,
                STATUS VARCHAR(20) NOT NULL DEFAULT 'WAITING',
                QUEUE_NUMBER INTEGER NOT NULL,
                CREATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                UPDATED_AT TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
                PRIMARY KEY (QUEUE_ID)
            )
        `;

        await executeNonQuery(sql, []);

        console.log('✅ QUEUE_MASTER table created successfully in DB2ADMIN schema!');
        console.log('');
        console.log('🎉 Queue system is now ready!');
        console.log('  - Add patients to queue from Search page');
        console.log('  - Manage queue at /queue-management');
        console.log('  - View live board at /queue');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    }
};

fixQueueTable();
