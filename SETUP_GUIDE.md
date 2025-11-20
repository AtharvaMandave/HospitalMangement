# 🏥 Hospital Patient Visit Tracking System - Setup Instructions

## ✅ Current Status

- ✅ Backend server: Running on port 4000
- ✅ Frontend server: Running on port 5173  
- ✅ Database connection: Working
- ⚠️ Database table: **NOT CREATED YET**

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create the Database Table

You have **two options** to create the `PATIENT_MASTER` table:

#### **Option A: Using DB2 Command Line (Recommended)**

1. Open Command Prompt or PowerShell
2. Run these commands:

```bash
# Connect to DB2 database
db2 connect to HOSPDB user db2admin using Atharva@123

# Create the table
db2 -tvf "d:\MAINFRAME PROJECT\Project\Project\backend\db_scripts\create_table.sql"

# Verify table creation
db2 "SELECT TABNAME FROM SYSCAT.TABLES WHERE TABNAME = 'PATIENT_MASTER'"

# Disconnect
db2 disconnect HOSPDB
```

#### **Option B: Using DB2 Control Center/GUI Tool**

1. Open your DB2 GUI tool (Control Center, DBeaver, etc.)
2. Connect to database `HOSPDB`
3. Open file: `backend/db_scripts/create_table.sql`
4. Execute the SQL script

#### **Option C: Manual SQL Execution**

Copy and paste this SQL into your DB2 client:

```sql
CREATE TABLE PATIENT_MASTER (
    AADHAR_NO CHAR(12) NOT NULL PRIMARY KEY,
    NAME VARCHAR(50),
    AGE INTEGER,
    GENDER CHAR(1),
    ADDRESS VARCHAR(100),
    PHONE VARCHAR(15),
    DEPARTMENT_VISITED VARCHAR(500),
    CREATED_AT TIMESTAMP DEFAULT CURRENT TIMESTAMP
);

CREATE INDEX IDX_PATIENT_NAME ON PATIENT_MASTER(NAME);
```

---

### Step 2: Verify Database Setup

After creating the table, run the test script:

```bash
cd "d:\MAINFRAME PROJECT\Project\Project\backend"
node test-db.js
```

**Expected output:**
```
✅ PATIENT_MASTER table exists
✅ Test patient inserted
✅ Retrieved patient: ...
✅ Department visit updated
✅ Department visits: Cardiology, Neurology
✅ Total patients in database: X
🎉 All database tests passed successfully!
```

---

### Step 3: Test the Application

1. **Open Browser**: Navigate to `http://localhost:5173`

2. **Test File Upload**:
   - Click on "Upload Patient Records"
   - Upload the sample file: `backend/sample_data.csv`
   - Verify summary shows:
     - New Patients Added: 5
     - Existing Patients Updated: 0

3. **Test Duplicate Handling**:
   - Upload the same file again
   - Verify summary shows:
     - New Patients Added: 0
     - Existing Patients Updated: 2 (Rajesh and Priya have duplicate entries)

4. **Test Patient Search**:
   - Click on "Search Patient"
   - Enter Aadhar: `123456789012`
   - Verify details show:
     - Name: Rajesh Kumar
     - Department visits: Heart, Fracture (if uploaded twice)

---

## 🧪 Testing Checklist

After completing setup, verify these features:

- [ ] Table created successfully
- [ ] Database test script passes all tests
- [ ] Backend server running without errors
- [ ] Frontend loads at http://localhost:5173
- [ ] Can upload CSV file
- [ ] Upload summary displays correctly
- [ ] Can search patient by Aadhar
- [ ] Patient details display correctly
- [ ] Department visits show as comma-separated
- [ ] Uploading same file updates existing records

---

## 🔍 Troubleshooting

### "Table already exists" error
**Solution**: Table is already created, you can skip Step 1

### "Connection failed" error
**Solution**: 
1. Check if DB2 service is running
2. Verify credentials in `backend/.env`
3. Test connection: `db2 connect to HOSPDB user db2admin using Atharva@123`

### "DB2_CONN_STRING not found" error
**Solution**: 
- This is now fixed! Restart backend server
- Environment variables are loaded correctly

### Backend server won't start
**Solution**:
```bash
cd backend
npm install
npm start
```

### Frontend won't load
**Solution**:
```bash
cd frontend
npm install
npm run dev
```

---

## 📁 Sample Data Format

The `sample_data.csv` file contains:

```csv
AADHAR_NO,NAME,AGE,GENDER,ADDRESS,PHONE,DEPARTMENT_VISITED
123456789012,Rajesh Kumar,45,M,123 MG Road Mumbai,9876543210,Heart
234567890123,Priya Sharma,32,F,456 Park Street Kolkata,9876543211,Fracture
345678901234,Amit Patel,28,M,789 Anna Salai Chennai,9876543212,Skin
456789012345,Sneha Reddy,55,F,321 Brigade Road Bangalore,9876543213,Heart
567890123456,Vijay Singh,40,M,654 Connaught Place Delhi,9876543214,Neurology
123456789012,Rajesh Kumar,45,M,123 MG Road Mumbai,9876543210,Fracture
234567890123,Priya Sharma,32,F,456 Park Street Kolkata,9876543211,Skin
```

Notice:
- Lines 6-7 are duplicates (same Aadhar) with different departments
- This tests the deduplication feature

---

## 🎯 What Happens Next

Once the table is created:

1. ✅ All API endpoints will work
2. ✅ File upload will process records
3. ✅ Patient search will return results
4. ✅ Department concatenation will work correctly

---

## 📞 Need Help?

If you encounter any issues:

1. Check backend console for errors
2. Check browser console (F12) for frontend errors
3. Run `node test-db.js` to diagnose database issues
4. Verify both servers are running
5. Check network tab in browser DevTools

---

## 🎉 Success Indicators

You'll know everything is working when:

- ✅ Backend shows: "Server is running at port 4000"
- ✅ Backend shows: "DB2 Config - Connection String Loaded: Yes ✅"
- ✅ Frontend loads without errors
- ✅ Can navigate between pages
- ✅ File upload shows success message
- ✅ Patient search returns data

---

**Current Time**: Ready to test!
**Next Action**: Create the database table using one of the options above
