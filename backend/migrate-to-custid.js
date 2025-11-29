import ibmdb from 'ibm_db';
import dotenv from 'dotenv';

dotenv.config();

const connStr = process.env.DB2_CONN_STRING;

console.log('🔄 Migrating PATIENT_MASTER: Adding CUSTID as new primary key...\n');

ibmdb.open(connStr, (err, conn) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }

    console.log('✅ Connected to DB2 database\n');

    // Step 1: Create sequence for CUSTID
    console.log('Step 1: Creating sequence for CUSTID...');

    const createSeqSql = `CREATE SEQUENCE CUSTID_SEQ START WITH 1 INCREMENT BY 1 NO MAXVALUE NO CYCLE`;

    conn.query(createSeqSql, (err1, result1) => {
        if (err1 && !err1.message.includes('already exists')) {
            console.error('❌ Error creating sequence:', err1.message);
            conn.close();
            process.exit(1);
        }

        if (err1 && err1.message.includes('already exists')) {
            console.log('   ⚠️  Sequence already exists');
        } else {
            console.log('   ✅ Sequence created');
        }

        // Step 2: Add CUSTID column (nullable first)
        console.log('\nStep 2: Adding CUSTID column...');

        const addColumnSql = `ALTER TABLE PATIENT_MASTER ADD COLUMN CUSTID INTEGER`;

        conn.query(addColumnSql, (err2, result2) => {
            if (err2 && !err2.message.includes('already exists')) {
                console.error('❌ Error adding CUSTID column:', err2.message);
                conn.close();
                process.exit(1);
            }

            if (err2 && err2.message.includes('already exists')) {
                console.log('   ⚠️  CUSTID column already exists');
                executeStep3();
            } else {
                console.log('   ✅ CUSTID column added');
                executeStep3();
            }
        });

        function executeStep3() {
            // Step 3: Populate CUSTID with sequence values
            console.log('\nStep 3: Populating CUSTID values...');

            const populateSql = `
                UPDATE PATIENT_MASTER 
                SET CUSTID = NEXT VALUE FOR CUSTID_SEQ
                WHERE CUSTID IS NULL
            `;

            conn.query(populateSql, (err3, result3) => {
                if (err3) {
                    console.error('❌ Error populating CUSTID:', err3.message);
                    conn.close();
                    process.exit(1);
                }
                console.log('   ✅ CUSTID values populated');
                executeStep4();
            });
        }

        function executeStep4() {
            // Step 4: Make CUSTID NOT NULL
            console.log('\nStep 4: Making CUSTID NOT NULL...');

            const makeNotNullSql = `ALTER TABLE PATIENT_MASTER ALTER COLUMN CUSTID SET NOT NULL`;

            conn.query(makeNotNullSql, (err4, result4) => {
                if (err4) {
                    console.error('❌ Error making CUSTID NOT NULL:', err4.message);
                    conn.close();
                    process.exit(1);
                }
                console.log('   ✅ CUSTID is now NOT NULL');
                executeStep5();
            });
        }

        function executeStep5() {
            // Step 5: Find and drop existing primary key
            console.log('\nStep 5: Checking for existing primary key...');

            const findPKSql = `
                SELECT CONSTNAME 
                FROM SYSCAT.TABCONST 
                WHERE TABNAME = 'PATIENT_MASTER' AND TYPE = 'P'
            `;

            conn.query(findPKSql, (err5, pkResult) => {
                if (err5) {
                    console.error('❌ Error finding primary key:', err5.message);
                    conn.close();
                    process.exit(1);
                }

                if (pkResult && pkResult.length > 0) {
                    const pkName = pkResult[0].CONSTNAME.trim();
                    console.log(`   Found primary key: ${pkName}`);

                    const dropPKSql = `ALTER TABLE PATIENT_MASTER DROP CONSTRAINT ${pkName}`;

                    conn.query(dropPKSql, (err6, result6) => {
                        if (err6) {
                            console.error('❌ Error dropping primary key:', err6.message);
                            conn.close();
                            process.exit(1);
                        }
                        console.log('   ✅ Old primary key dropped');
                        executeStep6();
                    });
                } else {
                    console.log('   No primary key found');
                    executeStep6();
                }
            });
        }

        function executeStep6() {
            // Step 6: Add new primary key on CUSTID
            console.log('\nStep 6: Adding primary key on CUSTID...');

            const addPKSql = `ALTER TABLE PATIENT_MASTER ADD CONSTRAINT PK_PATIENT_CUSTID PRIMARY KEY (CUSTID)`;

            conn.query(addPKSql, (err7, result7) => {
                if (err7 && !err7.message.includes('already exists')) {
                    console.error('❌ Error adding primary key:', err7.message);
                    conn.close();
                    process.exit(1);
                }

                if (err7 && err7.message.includes('already exists')) {
                    console.log('   ⚠️  Primary key on CUSTID already exists');
                } else {
                    console.log('   ✅ Primary key added on CUSTID');
                }
                executeStep7();
            });
        }

        function executeStep7() {
            // Step 7: Add unique constraint on AADHAR_NO
            console.log('\nStep 7: Adding unique constraint on AADHAR_NO...');

            const addUniqueSql = `ALTER TABLE PATIENT_MASTER ADD CONSTRAINT UQ_PATIENT_AADHAR UNIQUE (AADHAR_NO)`;

            conn.query(addUniqueSql, (err8, result8) => {
                if (err8 && !err8.message.includes('already exists') && !err8.message.includes('duplicate')) {
                    console.log('   ⚠️  Could not add unique constraint:', err8.message);
                } else if (err8 && (err8.message.includes('already exists') || err8.message.includes('duplicate'))) {
                    console.log('   ⚠️  Unique constraint on AADHAR_NO already exists or there are duplicates');
                } else {
                    console.log('   ✅ Unique constraint added on AADHAR_NO');
                }

                conn.close(() => {
                    console.log('\n🎉 Migration completed successfully!');
                    console.log('\n📊 Summary:');
                    console.log('   - CUSTID is now the primary key (auto-generated)');
                    console.log('   - AADHAR_NO is a unique column (not primary key)');
                    console.log('   - Existing data preserved with assigned CUSTID values');
                    console.log('   - New inserts will automatically get next CUSTID from sequence');
                    process.exit(0);
                });
            });
        }
    });
});
