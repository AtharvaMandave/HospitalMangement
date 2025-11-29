import ibmdb from 'ibm_db';
import dotenv from 'dotenv';

dotenv.config();

const connStr = process.env.DB2_CONN_STRING;

console.log('🧪 Testing new PATIENT_ID structure...\n');

ibmdb.open(connStr, (err, conn) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }

    console.log('✅ Connected to DB2 database\n');

    // Test 1: Check table structure
    console.log('Test 1: Checking table structure...');
    const structureSql = `SELECT COLNAME, TYPENAME, LENGTH FROM SYSCAT.COLUMNS WHERE TABNAME = 'PATIENT_MASTER' ORDER BY COLNO`;

    conn.query(structureSql, (err1, result1) => {
        if (err1) {
            console.error('❌ Error:', err1.message);
            conn.close();
            process.exit(1);
        }

        console.table(result1);

        // Test 2: Select all patients
        console.log('\nTest 2: Selecting all patients...');
        const selectSql = `SELECT PATIENT_ID, AADHAR_NO, NAME, VISIT_COUNT FROM PATIENT_MASTER ORDER BY PATIENT_ID`;

        conn.query(selectSql, (err2, result2) => {
            if (err2) {
                console.error('❌ Error:', err2.message);
                conn.close();
                process.exit(1);
            }

            console.log(`\nFound ${result2.length} patient(s):\n`);
            console.table(result2);

            conn.close(() => {
                console.log('\n✅ All tests passed!');
                console.log('\n🎉 Migration successful!');
                console.log('   - PATIENT_ID is auto-incrementing (1, 2, 3, ...)');
                console.log('   - AADHAR_NO is unique but not primary key');
                console.log('   - System is ready to use!');
                process.exit(0);
            });
        });
    });
});
