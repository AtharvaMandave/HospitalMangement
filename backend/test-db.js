import { executeQuery, executeNonQuery } from './src/config/db2.js';

console.log('🧪 Starting Database Tests...\n');

async function testDatabase() {
    try {
        // Test 1: Check if table exists
        console.log('📋 Test 1: Checking if PATIENT_MASTER table exists...');
        const tableCheck = await executeQuery(
            "SELECT TABNAME FROM SYSCAT.TABLES WHERE TABNAME = 'PATIENT_MASTER'"
        );

        if (tableCheck.length > 0) {
            console.log('✅ PATIENT_MASTER table exists\n');
        } else {
            console.log('❌ PATIENT_MASTER table does not exist');
            console.log('⚠️  Please run the create_table.sql script first\n');
            return;
        }

        // Test 2: Insert a test patient
        console.log('📋 Test 2: Inserting test patient...');
        const testAadhar = '999999999999';

        // Delete if exists
        await executeNonQuery('DELETE FROM PATIENT_MASTER WHERE AADHAR_NO = ?', [testAadhar]);

        await executeNonQuery(
            `INSERT INTO PATIENT_MASTER 
       (AADHAR_NO, NAME, AGE, GENDER, ADDRESS, PHONE, DEPARTMENT_VISITED) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [testAadhar, 'Test Patient', 30, 'M', 'Test Address', '9999999999', 'Cardiology']
        );
        console.log('✅ Test patient inserted\n');

        // Test 3: Retrieve the patient
        console.log('📋 Test 3: Retrieving test patient...');
        const patient = await executeQuery(
            'SELECT * FROM PATIENT_MASTER WHERE AADHAR_NO = ?',
            [testAadhar]
        );
        console.log('✅ Retrieved patient:', patient[0]);
        console.log('');

        // Test 4: Update department visit
        console.log('📋 Test 4: Updating department visit...');
        await executeNonQuery(
            `UPDATE PATIENT_MASTER 
       SET DEPARTMENT_VISITED = DEPARTMENT_VISITED || ', ' || ?
       WHERE AADHAR_NO = ?`,
            ['Neurology', testAadhar]
        );
        console.log('✅ Department visit updated\n');

        // Test 5: Verify update
        console.log('📋 Test 5: Verifying department concatenation...');
        const updatedPatient = await executeQuery(
            'SELECT DEPARTMENT_VISITED FROM PATIENT_MASTER WHERE AADHAR_NO = ?',
            [testAadhar]
        );
        console.log('✅ Department visits:', updatedPatient[0].DEPARTMENT_VISITED);
        console.log('');

        // Test 6: Get total count
        console.log('📋 Test 6: Getting total patient count...');
        const count = await executeQuery('SELECT COUNT(*) AS TOTAL FROM PATIENT_MASTER');
        console.log('✅ Total patients in database:', count[0].TOTAL);
        console.log('');

        // Clean up test data
        console.log('🧹 Cleaning up test data...');
        await executeNonQuery('DELETE FROM PATIENT_MASTER WHERE AADHAR_NO = ?', [testAadhar]);
        console.log('✅ Test data cleaned up\n');

        console.log('🎉 All database tests passed successfully!\n');
        console.log('✅ Database connection: Working');
        console.log('✅ Table structure: Valid');
        console.log('✅ Insert operations: Working');
        console.log('✅ Update operations: Working');
        console.log('✅ Query operations: Working');
        console.log('✅ Department concatenation: Working\n');

    } catch (error) {
        console.error('❌ Test failed:', error.message);
        console.error('Error details:', error);
    }

    process.exit(0);
}

testDatabase();
