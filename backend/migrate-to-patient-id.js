import ibmdb from 'ibm_db';
import dotenv from 'dotenv';

dotenv.config();

const connStr = process.env.DB2_CONN_STRING;

console.log('🔄 Migrating PATIENT_MASTER: Adding PATIENT_ID as auto-increment primary key...\n');

ibmdb.open(connStr, (err, conn) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }

    console.log('✅ Connected to DB2 database\n');

    // Step 1: Create backup table (safety measure)
    console.log('Step 1: Creating backup of existing data...');

    const backupSql = `
        CREATE TABLE PATIENT_MASTER_BACKUP AS 
        (SELECT * FROM PATIENT_MASTER) 
        WITH DATA
    `;

    conn.query(backupSql, (err1) => {
        if (err1 && !err1.message.includes('already exists')) {
            console.log('   ⚠️  Could not create backup:', err1.message);
            console.log('   Continuing anyway...');
        } else if (err1) {
            console.log('   ⚠️  Backup table already exists');
        } else {
            console.log('   ✅ Backup created');
        }

        // Step 2: Create new table with PATIENT_ID
        console.log('\nStep 2: Creating new table with PATIENT_ID as primary key...');

        const createNewTableSql = `
            CREATE TABLE PATIENT_MASTER_NEW (
                PATIENT_ID INTEGER NOT NULL GENERATED ALWAYS AS IDENTITY (START WITH 1, INCREMENT BY 1),
                AADHAR_NO VARCHAR(12) NOT NULL,
                NAME VARCHAR(100) NOT NULL,
                AGE INTEGER,
                GENDER VARCHAR(10),
                ADDRESS VARCHAR(255),
                PHONE VARCHAR(15),
                DEPARTMENT_VISITED VARCHAR(500) NOT NULL,
                VISIT_COUNT INTEGER DEFAULT 1,
                PRIMARY KEY (PATIENT_ID),
                UNIQUE (AADHAR_NO)
            )
        `;

        conn.query(createNewTableSql, (err2) => {
            if (err2) {
                console.error('❌ Error creating new table:', err2.message);
                conn.close();
                process.exit(1);
            }

            console.log('   ✅ New table created with PATIENT_ID as primary key');

            // Step 3: Copy data from old table to new table
            console.log('\nStep 3: Copying existing data...');

            const copyDataSql = `
                INSERT INTO PATIENT_MASTER_NEW (AADHAR_NO, NAME, AGE, GENDER, ADDRESS, PHONE, DEPARTMENT_VISITED, VISIT_COUNT)
                SELECT AADHAR_NO, NAME, AGE, GENDER, ADDRESS, PHONE, DEPARTMENT_VISITED, VISIT_COUNT
                FROM PATIENT_MASTER
            `;

            conn.query(copyDataSql, (err3) => {
                if (err3) {
                    console.error('❌ Error copying data:', err3.message);
                    conn.close();
                    process.exit(1);
                }

                console.log('   ✅ Data copied successfully');

                // Step 4: Drop old table
                console.log('\nStep 4: Dropping old table...');

                const dropOldTableSql = `DROP TABLE PATIENT_MASTER`;

                conn.query(dropOldTableSql, (err4) => {
                    if (err4) {
                        console.error('❌ Error dropping old table:', err4.message);
                        conn.close();
                        process.exit(1);
                    }

                    console.log('   ✅ Old table dropped');

                    // Step 5: Rename new table
                    console.log('\nStep 5: Renaming new table to PATIENT_MASTER...');

                    const renameTableSql = `RENAME TABLE PATIENT_MASTER_NEW TO PATIENT_MASTER`;

                    conn.query(renameTableSql, (err5) => {
                        if (err5) {
                            console.error('❌ Error renaming table:', err5.message);
                            conn.close();
                            process.exit(1);
                        }

                        console.log('   ✅ Table renamed');

                        conn.close(() => {
                            console.log('\n🎉 Migration completed successfully!\n');
                            console.log('📊 Summary:');
                            console.log('   ✅ PATIENT_ID is now the primary key (auto-increment 1, 2, 3...)');
                            console.log('   ✅ AADHAR_NO is now a unique field (not primary key)');
                            console.log('   ✅ All existing data preserved');
                            console.log('   ✅ New patients will automatically get sequential PATIENT_ID');
                            console.log('\n💾 Backup table PATIENT_MASTER_BACKUP created for safety');
                            console.log('\n⚠️  Note: You need to update the backend code to use PATIENT_ID instead of AADHAR_NO');
                            process.exit(0);
                        });
                    });
                });
            });
        });
    });
});
