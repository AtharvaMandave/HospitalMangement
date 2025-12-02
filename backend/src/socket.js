import { Server } from 'socket.io';

let io = null;

/**
 * Initialize Socket.io instance
 * @param {Object} server - HTTP server instance
 */
export const initializeSocket = (server) => {
    io = new Server(server, {
        cors: {
            origin: 'http://localhost:5173',
            credentials: true,
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log('✅ Client connected:', socket.id);

        socket.on('disconnect', () => {
            console.log('❌ Client disconnected:', socket.id);
        });

        socket.on('join_queue_board', () => {
            socket.join('queue_board');
            console.log('📺 Client joined queue board:', socket.id);
        });
    });

    console.log('🔌 Socket.io initialized');
    return io;
};

/**
 * Get Socket.io instance
 * @returns {Object} Socket.io instance
 */
export const getIO = () => {
    if (!io) {
        throw new Error('Socket.io not initialized. Call initializeSocket first.');
    }
    return io;
};

/**
 * Emit queue update event to all connected clients
 * @param {Object} queueData - Updated queue data
 */
export const emitQueueUpdate = (queueData) => {
    if (io) {
        io.to('queue_board').emit('queue_updated', queueData);
        console.log('📡 Queue update emitted');
    }
};
