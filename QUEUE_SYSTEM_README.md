# Real-Time Queue Board System 🚀

## Overview
This is a **Real-Time Queue Management System** built with **Socket.io** for live updates. It features an airport-style display board that updates instantly when patients are added or their status changes.

## Features
- ✅ **Real-Time Updates**: Queue board updates instantly without page refresh
- ✅ **Department-Based Queues**: Separate queues for each department
- ✅ **Queue Management**: Doctors can call next patient and mark as complete
- ✅ **Live Display Board**: Public-facing board for waiting rooms
- ✅ **WebSocket Communication**: Bi-directional real-time updates

## Architecture

### Backend
- **Socket.io Server**: WebSocket server for real-time communication
- **Queue Model**: Database operations for QUEUE_MASTER table
- **Queue Controller**: API endpoints for queue management
- **Real-time Events**: Emits `queue_updated` event on any change

### Frontend
- **Queue Board** (`/queue`): Public display page with live updates
- **Queue Management** (`/queue-management`): Admin page to manage queues
- **Queue Control**: Component to add patients to queue

## Setup Instructions

### 1. Database Setup
Run the queue table creation script:
```bash
cd backend/db_scripts
setup-queue.bat
```

This creates the `QUEUE_MASTER` table with the following structure:
- `QUEUE_ID`: Auto-incrementing primary key
- `PATIENT_ID`: Reference to patient
- `AADHAR_NO`: Patient's Aadhar number
- `PATIENT_NAME`: Patient's name
- `DEPARTMENT`: Department name
- `STATUS`: WAITING | IN_PROGRESS | DONE
- `QUEUE_NUMBER`: Queue position per department
- `CREATED_AT`: Timestamp
- `UPDATED_AT`: Timestamp

### 2. Backend Dependencies
Socket.io is already installed. If needed:
```bash
cd backend
npm install socket.io
```

### 3. Frontend Dependencies
Socket.io-client is already installed. If needed:
```bash
cd frontend
npm install socket.io-client
```

### 4. Restart Servers
**Important**: You must restart both servers for Socket.io to initialize:

Backend:
```bash
cd backend
npm start
```

Frontend:
```bash
cd frontend
npm run dev
```

## Usage

### Adding Patients to Queue
1. Go to **Search Page** (`/search`)
2. Search for a patient by Patient ID
3. Click on a department button in the "Add to Queue" section
4. Patient is added to the queue with status "WAITING"

### Managing Queue (Doctor/Admin)
1. Go to **Queue Management** (`/queue-management`)
2. Select a department or view all
3. Click **"Call Next"** to move the next waiting patient to "IN_PROGRESS"
4. Click **"Complete"** to mark the current patient as "DONE"

### Viewing Live Board (Public Display)
1. Go to **Queue Board** (`/queue`)
2. This page updates automatically in real-time
3. Shows current patient being served and waiting queue
4. Perfect for display in waiting rooms

## API Endpoints

### Queue Management
- `POST /api/queue/add` - Add patient to queue
- `GET /api/queue/active` - Get all active queue entries
- `GET /api/queue/department/:department` - Get queue by department
- `PUT /api/queue/status/:id` - Update queue status
- `POST /api/queue/call-next/:department` - Call next patient
- `POST /api/queue/complete/:id` - Mark patient as done

## WebSocket Events

### Client → Server
- `join_queue_board` - Join the queue board room

### Server → Client
- `queue_updated` - Emitted when queue changes (add/update/complete)

## Departments
The system supports the following departments:
- ❤️ Cardiology
- 🧠 Neurology
- 🦴 Orthopedics
- 🏥 General
- 👶 Pediatrics
- 🚨 Emergency

## Demo Flow

### Scenario 1: Patient Visit
1. Admin searches for patient
2. Adds patient to "Cardiology" queue
3. **Live Board** instantly shows patient in Cardiology waiting list
4. Doctor opens **Queue Management**
5. Clicks "Call Next" for Cardiology
6. **Live Board** instantly shows patient as "Now Serving"
7. Doctor clicks "Complete"
8. **Live Board** removes patient from display

### Scenario 2: Multiple Departments
1. Add patients to different departments
2. Open **Live Board** on a large screen
3. Each department shows its own queue
4. Updates happen instantly across all connected clients

## Technical Highlights

### Real-Time Architecture
- Uses **Socket.io** for WebSocket communication
- Server emits events to all connected clients
- Clients join a "queue_board" room for targeted updates
- Automatic reconnection on disconnect

### Queue Logic
- Auto-generates queue numbers per department
- Maintains separate queues for each department
- Status workflow: WAITING → IN_PROGRESS → DONE
- Old completed entries auto-cleanup (24 hours)

### UI/UX
- **Live Board**: Dark theme, large text, perfect for displays
- **Queue Management**: Clean admin interface
- **Real-time indicators**: Connection status, pulse animations
- **Responsive design**: Works on all screen sizes

## Troubleshooting

### Queue Board Not Updating
1. Check if backend Socket.io initialized (look for "🔌 Socket.io initialized" in logs)
2. Check browser console for WebSocket connection
3. Verify CORS settings allow localhost:5173

### "No patients in queue" but patients exist
1. Check if patients have STATUS = 'WAITING' or 'IN_PROGRESS'
2. Run: `SELECT * FROM QUEUE_MASTER WHERE STATUS IN ('WAITING', 'IN_PROGRESS')`

### Socket.io Connection Failed
1. Ensure backend is running on port 4000
2. Check firewall settings
3. Verify CORS configuration in `socket.js`

## Future Enhancements
- 📊 Queue analytics and wait time tracking
- 🔔 Audio notifications when patient is called
- 📱 SMS notifications to patients
- 🎯 Priority queue for emergencies
- 📈 Department performance metrics

---

**Built with ❤️ using Socket.io, React, and IBM DB2**
