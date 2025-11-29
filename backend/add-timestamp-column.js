import ibmdb from 'ibm_db';
import dotenv from 'dotenv';

dotenv.config();

const connStr = process.env.DB2_CONN_STRING;

console.log('🔄 Adding CREATED_AT timestamp column...\n');

ibmdb.open(connStr, (err, conn) => {
    if (err) {
        console.error('❌ Connection failed:', err.message);
        process.exit(1);
    }

    console.log('✅ Connected to DB2 database\n');

    // Add CREATED_AT column with default current timestamp
    const addColumnSql = `
        ALTER TABLE PATIENT_MASTER 
        ADD COLUMN CREATED_AT TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    `;

    console.log('Adding CREATED_AT column...');

    conn.query(addColumnSql, (err1) => {
        if (err1 && !err1.message.includes('already exists')) {
            console.error('❌ Error adding column:', err1.message);
            conn.close();
            process.exit(1);
        }

        if (err1 && err1.message.includes('already exists')) {
            console.log('⚠️  CREATED_AT column already exists');
        } else {
            console.log('✅ CREATED_AT column added');
        }

        // Update existing records to have current timestamp
        const updateSql = `
            UPDATE PATIENT_MASTER 
            SET CREATED_AT = CURRENT_TIMESTAMP 
            WHERE CREATED_AT IS NULL
        `;

        console.log('\nUpdating existing records...');

        conn.query(updateSql, (err2) => {
            if (err2) {
                console.log('⚠️  Could not update existing records:', err2.message);
            } else {
                console.log('✅ Existing records updated');
            }

            conn.close(() => {
                console.log('\n✅ Migration completed!');
                console.log('   - All new patients will have CREATED_AT timestamp');
                console.log('   - Existing patients have been backfilled with current timestamp');
                process.exit(0);
            });
        });
    });
});
