import { executeQuery } from './src/config/db2.js';

console.log('🔍 Checking table schema...\n');

async function checkSchema() {
    try {
        // Check which schema the table is in
        console.log('📋 Looking for PATIENT_MASTER table in all schemas...');
        const schemas = await executeQuery(
            "SELECT TABSCHEMA, TABNAME, OWNER FROM SYSCAT.TABLES WHERE TABNAME = 'PATIENT_MASTER'"
        );

        if (schemas.length > 0) {
            console.log('✅ Found table!');
            console.log('Schema:', schemas[0].TABSCHEMA);
            console.log('Table:', schemas[0].TABNAME);
            console.log('Owner:', schemas[0].OWNER);
            console.log('\n');

            // Try to query the table with schema
            const fullTableName = `${schemas[0].TABSCHEMA}.PATIENT_MASTER`;
            console.log(`📋 Trying to query: ${fullTableName}`);

            const count = await executeQuery(`SELECT COUNT(*) AS TOTAL FROM ${fullTableName}`);
            console.log('✅ Query successful!');
            console.log('Total rows:', count[0].TOTAL);
            console.log('\n');

            // Show current schema
            const currentSchema = await executeQuery('VALUES CURRENT SCHEMA');
            console.log('Current schema:', currentSchema[0]['1']);

            console.log('\n✅ Diagnosis complete!');
            console.log(`\nThe table is in schema: ${schemas[0].TABSCHEMA}`);
            console.log(`Full table name: ${fullTableName}`);

        } else {
            console.log('❌ Table not found in any schema');
        }

    } catch (error) {
        console.error('❌ Error:', error.message);
    }

    process.exit(0);
}

checkSchema();
