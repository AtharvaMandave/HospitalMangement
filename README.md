# Hospital Patient Visit Tracking & Deduplication System

A full-stack web application for managing hospital patient visit records using Aadhar-based deduplication.

## 🎯 Features

- **Bulk Upload**: Import CSV/TXT files containing daily patient visit records
- **Smart Deduplication**: Automatically detects existing patients using Aadhar number
- **Department History Tracking**: Maintains comma-separated visit history for each patient
- **Patient Search**: Quick lookup by 12-digit Aadhar number
- **Modern UI**: Responsive design with Tailwind CSS

## 🏗️ Architecture

### Backend
- **Node.js** with Express.js
- **IBM DB2** database
- RESTful API architecture
- File upload with Multer
- CSV parsing with csv-parser

### Frontend
- **React 19** with Vite
- **React Router** for navigation
- **Axios** for API calls
- **Tailwind CSS** for styling

## 📋 Prerequisites

- Node.js (v16 or higher)
- IBM DB2 database access
- DB2 CLI tools (for table creation)

## 🚀 Setup Instructions

### Database Setup

1. Connect to your DB2 database:
```bash
db2 connect to HOSPDB user db2admin using Atharva@123
```

2. Create the PATIENT_MASTER table:
```bash
cd backend/db_scripts
db2 -tf create_table.sql
```

Or manually execute:
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
```

### Backend Setup

1. Navigate to backend directory:
```bash
cd backend
```

2. Install dependencies (if not already done):
```bash
npm install
```

3. Configure environment variables in `.env`:
```env
DB2_CONN_STRING=DATABASE=HOSPDB;HOSTNAME=127.0.0.1;PORT=25000;PROTOCOL=TCPIP;UID=db2admin;PWD=Atharva@123;
PORT=4000
```

4. Start the backend server:
```bash
npm start
```

Server will run on: `http://localhost:4000`

### Frontend Setup

1. Navigate to frontend directory:
```bash
cd frontend
```

2. Dependencies are already installed (react-router-dom, axios)

3. Start the development server:
```bash
npm run dev
```

Application will run on: `http://localhost:5173`

## 🔌 API Endpoints

### POST /api/uploadFile
Upload CSV/TXT file with patient records
- **Input**: FormData with 'file' field
- **Response**: Summary of new/updated patients

### POST /api/addVisit
Add single patient visit
- **Input**: JSON with patient data
- **Response**: Created/updated patient record

### GET /api/patient/:aadhar
Get patient by Aadhar number
- **Input**: 12-digit Aadhar in URL
- **Response**: Patient details with visit history

### GET /api/allPatients
Get all patients
- **Response**: Array of all patient records

### GET /api/stats
Get system statistics
- **Response**: Total patient count

### GET /health
Health check endpoint
- **Response**: System status

## 📁 File Format

### CSV Format
```csv
AADHAR_NO,NAME,AGE,GENDER,ADDRESS,PHONE,DEPARTMENT_VISITED
123456789012,Rajesh Kumar,45,M,123 MG Road Mumbai,9876543210,Heart
234567890123,Priya Sharma,32,F,456 Park Street Kolkata,9876543211,Fracture
```

### Required Fields
- **AADHAR_NO**: 12-digit number (required)
- **NAME**: Patient name (required)
- **DEPARTMENT_VISITED**: Department name (required)

### Optional Fields
- **AGE**: Integer
- **GENDER**: M/F/O
- **ADDRESS**: Text
- **PHONE**: 10-15 digits

## 🔄 Deduplication Logic

1. When a record is uploaded/added:
   - System checks if Aadhar exists in database
   - **If NEW**: Creates new patient record
   - **If EXISTS**: Appends new department to DEPARTMENT_VISITED field
   
2. Department concatenation example:
   - First visit: "Heart"
   - Second visit: "Heart, Fracture"
   - Third visit: "Heart, Fracture, Skin"

## 🧪 Testing

### Test with Sample Data

A sample CSV file is provided at `backend/sample_data.csv`

1. Open the application: `http://localhost:5173`
2. Navigate to Upload page
3. Upload `sample_data.csv`
4. Verify the summary shows correct counts
5. Upload the same file again to test deduplication
6. Search for patient "123456789012" to verify department concatenation

### Manual Testing Checklist

- [ ] Upload CSV file successfully
- [ ] Verify new patients are created
- [ ] Upload same file to test deduplication
- [ ] Verify departments are concatenated correctly
- [ ] Search patient by Aadhar
- [ ] View patient details and visit history
- [ ] Test with invalid Aadhar (should show error)
- [ ] Test file upload with invalid format

## 📂 Project Structure

```
Project/
├── backend/
│   ├── db_scripts/
│   │   └── create_table.sql
│   ├── public/
│   │   └── temp/              # Temporary file uploads
│   ├── src/
│   │   ├── config/
│   │   │   └── db2.js
│   │   ├── controllers/
│   │   │   └── patientController.js
│   │   ├── db/
│   │   │   └── index.js
│   │   ├── middlewares/
│   │   │   ├── errorHandler.js
│   │   │   └── multer.middleware.js
│   │   ├── models/
│   │   │   └── Patient.model.js
│   │   ├── routes/
│   │   │   └── patient.routes.js
│   │   ├── services/
│   │   │   └── fileParser.js
│   │   ├── utils/
│   │   │   └── validators.js
│   │   ├── app.js
│   │   └── index.js
│   ├── .env
│   ├── package.json
│   └── sample_data.csv
│
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── FileUpload.jsx
    │   │   ├── PatientInfo.jsx
    │   │   └── SearchPatient.jsx
    │   ├── pages/
    │   │   ├── Home.jsx
    │   │   ├── SearchPage.jsx
    │   │   └── UploadPage.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.css
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    └── vite.config.js
```

## 🛠️ Technologies Used

### Backend
- Express.js 5.1
- IBM DB2 (ibm_db 3.3.4)
- Multer 2.0.2 (file uploads)
- CSV-parser 3.2.0
- CORS
- Cookie-parser
- Dotenv

### Frontend
- React 19.2
- React Router DOM
- Axios
- Vite 7.2
- Tailwind CSS 4.1

## 🐛 Troubleshooting

### Backend won't start
- Check if DB2 connection string is correct in `.env`
- Verify DB2 service is running
- Check if port 4000 is available

### Frontend won't start
- Run `npm install` to ensure dependencies are installed
- Check if port 5173 is available
- Clear browser cache

### File upload fails
- Ensure `backend/public/temp/` directory exists
- Check file size (max 5MB)
- Verify file format (CSV or TXT only)

### Database connection error
- Verify DB2 service is running on port 25000
- Check credentials in `.env`
- Ensure PATIENT_MASTER table exists

## 📝 Notes

- Department visit history is stored as comma-separated values (max 500 characters)
- Uploaded files are automatically deleted after processing
- System prevents duplicate departments in visit history
- All API responses follow consistent JSON format

## 👥 Support

For issues or questions, please check:
1. Console logs (browser and terminal)
2. Network tab in browser DevTools
3. DB2 error logs

## 📄 License

This project is for educational/internal use.
# HospitalMangement
