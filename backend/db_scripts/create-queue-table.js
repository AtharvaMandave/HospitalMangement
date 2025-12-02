import { executeNonQuery } from '../src/config/db2.js';

const createQueueTable = async () => {
    try {
        console.log('📋 Creating QUEUE_MASTER table...');

        const sql = `
            CREATE TABLE QUEUE_MASTER (
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

        console.log('✅ QUEUE_MASTER table created successfully!');
        console.log('');
        console.log('You can now use the Queue Management features:');
        console.log('  - Add patients to queue from Search page');
        console.log('  - Manage queue at /queue-management');
        console.log('  - View live board at /queue');

        process.exit(0);
    } catch (error) {
        console.error('❌ Error creating table:', error.message);
        if (error.message.includes('SQL0601N')) {
            console.log('ℹ️  Table already exists - you can proceed!');
            process.exit(0);
        }
        process.exit(1);
    }
};

createQueueTable();
