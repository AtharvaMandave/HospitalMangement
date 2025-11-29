import ibmdb from 'ibm_db';
import dotenv from 'dotenv';

dotenv.config();

const connStr = process.env.DB2_CONN_STRING;

console.log('🔄 Adding VISIT_COUNT column to PATIENT_MASTER table...\n');

ibmdb.open(connStr, (err, conn) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }

    console.log('✅ Connected to DB2 database\n');

    // First, try to add the column
    const alterSql = 'ALTER TABLE PATIENT_MASTER ADD COLUMN VISIT_COUNT INTEGER DEFAULT 1';

    console.log('Executing: ALTER TABLE PATIENT_MASTER ADD COLUMN VISIT_COUNT INTEGER DEFAULT 1');

    conn.query(alterSql, (err1, result1) => {
        if (err1) {
            if (err1.message.includes('already exists') || err1.state === '42711') {
                console.log('⚠️  Column VISIT_COUNT already exists');
                conn.close();
                process.exit(0);
            } else {
                console.error('❌ Error adding column:', err1.message);
                conn.close();
                process.exit(1);
            }
            return;
        }

        console.log('✅ Column VISIT_COUNT added successfully\n');

        // Now update existing records
        const updateSql = `
            UPDATE PATIENT_MASTER
            SET VISIT_COUNT = LENGTH(DEPARTMENT_VISITED) - LENGTH(REPLACE(DEPARTMENT_VISITED, ',', '')) + 1
            WHERE DEPARTMENT_VISITED IS NOT NULL
        `;

        console.log('Updating existing records with visit counts...');

        conn.query(updateSql, (err2, result2) => {
            if (err2) {
                console.error('❌ Error updating records:', err2.message);
                console.log('⚠️  Column was added but existing records may have VISIT_COUNT = 1');
            } else {
                console.log('✅ Existing records updated successfully');
            }

            conn.close(() => {
                console.log('\n✅ Migration completed!');
                process.exit(0);
            });
        });
    });
});
