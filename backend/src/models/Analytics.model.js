import { executeQuery } from '../config/db2.js';

/**
 * Get comprehensive analytics data
 * @returns {Promise<Object>} Analytics data
 */
export const getAnalytics = async () => {
    try {
        // Total patients
        const totalPatientsQuery = 'SELECT COUNT(*) AS TOTAL FROM PATIENT_MASTER';
        const totalResult = await executeQuery(totalPatientsQuery);
        const totalPatients = totalResult[0].TOTAL;

        // Today's patients
        const todayQuery = `
            SELECT COUNT(*) AS TODAY_COUNT 
            FROM PATIENT_MASTER 
            WHERE DATE(CREATED_AT) = CURRENT_DATE
        `;
        const todayResult = await executeQuery(todayQuery);
        const todayCount = todayResult[0].TODAY_COUNT;

        // Patients by department (simplified)
        const deptQuery = `
            SELECT 
                CASE 
                    WHEN DEPARTMENT_VISITED LIKE '%Cardiology%' THEN 'Cardiology'
                    WHEN DEPARTMENT_VISITED LIKE '%Neurology%' THEN 'Neurology'
                    WHEN DEPARTMENT_VISITED LIKE '%Orthopedics%' THEN 'Orthopedics'
                    WHEN DEPARTMENT_VISITED LIKE '%General%' THEN 'General'
                    WHEN DEPARTMENT_VISITED LIKE '%Pediatrics%' THEN 'Pediatrics'
                    WHEN DEPARTMENT_VISITED LIKE '%Emergency%' THEN 'Emergency'
                    ELSE 'Other'
                END AS DEPARTMENT,
                COUNT(*) AS COUNT
            FROM PATIENT_MASTER
            WHERE DEPARTMENT_VISITED IS NOT NULL
            GROUP BY 
                CASE 
                    WHEN DEPARTMENT_VISITED LIKE '%Cardiology%' THEN 'Cardiology'
                    WHEN DEPARTMENT_VISITED LIKE '%Neurology%' THEN 'Neurology'
                    WHEN DEPARTMENT_VISITED LIKE '%Orthopedics%' THEN 'Orthopedics'
                    WHEN DEPARTMENT_VISITED LIKE '%General%' THEN 'General'
                    WHEN DEPARTMENT_VISITED LIKE '%Pediatrics%' THEN 'Pediatrics'
                    WHEN DEPARTMENT_VISITED LIKE '%Emergency%' THEN 'Emergency'
                    ELSE 'Other'
                END
            ORDER BY COUNT DESC
        `;
        const departmentStats = await executeQuery(deptQuery);

        // Gender distribution
        const genderQuery = `
            SELECT 
                CASE 
                    WHEN GENDER = 'M' THEN 'Male'
                    WHEN GENDER = 'F' THEN 'Female'
                    ELSE 'Other'
                END AS GENDER_LABEL,
                COUNT(*) AS COUNT
            FROM PATIENT_MASTER
            WHERE GENDER IS NOT NULL
            GROUP BY GENDER
        `;
        const genderStats = await executeQuery(genderQuery);

        // Age distribution
        const ageQuery = `
            SELECT 
                CASE 
                    WHEN AGE < 18 THEN '0-17'
                    WHEN AGE >= 18 AND AGE <= 35 THEN '18-35'
                    WHEN AGE >= 36 AND AGE <= 50 THEN '36-50'
                    WHEN AGE >= 51 AND AGE <= 65 THEN '51-65'
                    WHEN AGE > 65 THEN '65+'
                    ELSE 'Unknown'
                END AS AGE_GROUP,
                COUNT(*) AS COUNT
            FROM PATIENT_MASTER
            WHERE AGE IS NOT NULL
            GROUP BY 
                CASE 
                    WHEN AGE < 18 THEN '0-17'
                    WHEN AGE >= 18 AND AGE <= 35 THEN '18-35'
                    WHEN AGE >= 36 AND AGE <= 50 THEN '36-50'
                    WHEN AGE >= 51 AND AGE <= 65 THEN '51-65'
                    WHEN AGE > 65 THEN '65+'
                    ELSE 'Unknown'
                END
        `;
        const ageStats = await executeQuery(ageQuery);

        // Registration trend (last 7 days)
        const trendQuery = `
            SELECT 
                DATE(CREATED_AT) AS VISIT_DATE,
                COUNT(*) AS COUNT
            FROM PATIENT_MASTER
            WHERE CREATED_AT >= CURRENT_DATE - 7 DAYS
            GROUP BY DATE(CREATED_AT)
            ORDER BY DATE(CREATED_AT)
        `;
        const trendStats = await executeQuery(trendQuery);

        // Frequent visitors (top 5)
        const frequentQuery = `
            SELECT NAME, VISIT_COUNT, DEPARTMENT_VISITED
            FROM PATIENT_MASTER
            WHERE VISIT_COUNT IS NOT NULL
            ORDER BY VISIT_COUNT DESC
            FETCH FIRST 5 ROWS ONLY
        `;
        const frequentVisitors = await executeQuery(frequentQuery);

        // Average visits (safe calculation)
        const avgQuery = `
            SELECT 
                CAST(SUM(VISIT_COUNT) AS DECIMAL(10,2)) / CAST(COUNT(*) AS DECIMAL(10,2)) AS AVG_VISITS
            FROM PATIENT_MASTER
            WHERE VISIT_COUNT IS NOT NULL
        `;
        const avgResult = await executeQuery(avgQuery);
        const avgVisits = avgResult[0].AVG_VISITS ? parseFloat(avgResult[0].AVG_VISITS).toFixed(1) : 0;

        return {
            totalPatients,
            todayCount,
            avgVisits,
            departmentStats,
            genderStats,
            ageStats,
            trendStats,
            frequentVisitors
        };
    } catch (error) {
        console.error('❌ Error in getAnalytics:', error);
        throw error;
    }
};
