import fs from 'fs';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
import jwt from 'jsonwebtoken';
import { Server as SocketIOServer } from 'socket.io';


// Routes imports (assuming these exist in your project)
import authRouter from './routes/authRoute.js';
import router from './routes/appointmentRoute.js';
import bookingRouter from './routes/bookingRoute.js';
import contactRouter from './routes/contactRoute.js';
import lifecachrouter from './routes/lifeCachRoute.js';
import couponRouter from './routes/couponRoute.js';
import Paymentrouter from './routes/paymentRoutes.js';
import adminRouter from './routes/adminRoute.js';
import teamRouter from './routes/teamRoute.js';
import Adminslotrouter from './routes/AdminslotRoute.js';

// Configurations
dotenv.config();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Initialize Express and HTTP server
const app = express();

const options = {
  key: fs.readFileSync('/etc/letsencrypt/live/myinnerside.com/privkey.pem'),
  cert: fs.readFileSync('/etc/letsencrypt/live/myinnerside.com/fullchain.pem'),
};

const server = https.createServer(options, app);

// Middleware
app.use(express.json());
app.use(cors({
  origin: '*',
  credentials: true
}));



// Socket.IO Configuration
const io = new SocketIOServer(server, {
  cors: {
     origin: 'https://myinnerside.com',
    methods: ['GET', 'POST'],
    credentials: true
  }
});

// Static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// // In-memory store for active calls
// const activeCalls = {};


// // Socket.IO Authentication Middleware
// io.use((socket, next) => {
//   const token = socket.handshake.auth.token;
//   if (!token) return next(new Error('Authentication error'));
  
//   jwt.verify(token, JWT_SECRET, (err, decoded) => {
//     if (err) return next(new Error('Authentication error'));
//     socket.user = decoded;
//     next();
//   });
// });

// // Socket.IO Connection Handler
// io.on('connection', (socket) => {
//   console.log(`User connected: ${socket.user.userId}`);

//   socket.on('join-call', ({ appointmentId }) => {
//     if (!activeCalls[appointmentId]) {
//       activeCalls[appointmentId] = {
//         participants: [],
//         offer: null,
//         answers: {},
//         iceCandidates: {}
//       };
//     }
    
//     const call = activeCalls[appointmentId];
    
//     if (!hasAccessToAppointment(socket.user, appointmentId)) {
//       return socket.emit('error', 'Unauthorized access to call');
//     }

//     call.participants.push(socket.user.userId);
//     socket.join(appointmentId);

//     // Notify others in the call
//     socket.to(appointmentId).emit('user-joined', { userId: socket.user.userId });

//     // Send existing offer/answers if any
//     if (call.offer) {
//       socket.emit('offer', { offer: call.offer, sender: call.offer.sender });
//     }

//     // Event handlers
//     socket.on('disconnect', () => {
//       handleDisconnect(socket, appointmentId, call);
//     });

//     socket.on('offer', (data) => {
//       handleOffer(socket, appointmentId, call, data);
//     });

//     socket.on('answer', (data) => {
//       handleAnswer(socket, appointmentId, call, data);
//     });

//     socket.on('ice-candidate', (data) => {
//       handleIceCandidate(socket, appointmentId, call, data);
//     });

//     socket.on('end-call', () => {
//       handleEndCall(socket, appointmentId);
//     });
//   });
// });

// // Helper functions
// function hasAccessToAppointment(user, appointmentId) {
//   // Implement your actual access control logic here
//   return true;
// }


// ... (keep all existing imports and initial setup code)

// In-memory store for active calls and pending requests
const activeCalls = {};
const pendingRequests = {};

// Socket.IO Connection Handler
io.on('connection', (socket) => {
  console.log(`User connected: ${socket.user.userId}`);

  // Store user's socket ID for direct messaging
  socket.join(`user_${socket.user.userId}`);

  // Handle call requests
  socket.on('call-request', ({ appointmentId, targetUserId }) => {
    // Validate the request
    if (!hasAccessToAppointment(socket.user, appointmentId)) {
      return socket.emit('error', 'Unauthorized call request');
    }

    // Store the pending request
    pendingRequests[appointmentId] = {
      from: socket.user.userId,
      to: targetUserId,
      timestamp: new Date()
    };

    // Forward the call request to the target user
    io.to(`user_${targetUserId}`).emit('call-request', {
      appointmentId,
      callerInfo: {
        userId: socket.user.userId,
        name: socket.user.name || 'Anonymous',
        avatar: socket.user.avatar || null
      },
      timestamp: new Date()
    });
  });

  // Handle call acceptance
  socket.on('accept-call', ({ appointmentId }) => {
    const request = pendingRequests[appointmentId];
    if (!request || request.to !== socket.user.userId) {
      return socket.emit('error', 'Invalid call acceptance');
    }

    // Notify the caller that the call was accepted
    io.to(`user_${request.from}`).emit('call-accepted', {
      appointmentId,
      calleeId: socket.user.userId
    });

    // Both parties will now join the call room
    delete pendingRequests[appointmentId];
  });

  // Handle call rejection
  socket.on('reject-call', ({ appointmentId, reason }) => {
    const request = pendingRequests[appointmentId];
    if (!request || request.to !== socket.user.userId) {
      return socket.emit('error', 'Invalid call rejection');
    }

    // Notify the caller that the call was rejected
    io.to(`user_${request.from}`).emit('call-rejected', {
      appointmentId,
      reason: reason || 'Call declined'
    });

    delete pendingRequests[appointmentId];
  });

  // Existing join-call handler (modified to include validation)
  socket.on('join-call', ({ appointmentId }) => {
    if (!activeCalls[appointmentId]) {
      activeCalls[appointmentId] = {
        participants: [],
        offer: null,
        answers: {},
        iceCandidates: {}
      };
    }
    
    const call = activeCalls[appointmentId];
    
    if (!hasAccessToAppointment(socket.user, appointmentId)) {
      return socket.emit('error', 'Unauthorized access to call');
    }

    call.participants.push(socket.user.userId);
    socket.join(appointmentId);

    // Notify others in the call
    socket.to(appointmentId).emit('user-joined', { 
      userId: socket.user.userId,
      userInfo: {
        name: socket.user.name,
        avatar: socket.user.avatar
      }
    });

    // Send existing offer/answers if any
    if (call.offer) {
      socket.emit('offer', { 
        offer: call.offer, 
        sender: call.offer.sender 
      });
    }

    // Existing event handlers...
    socket.on('disconnect', () => {
      handleDisconnect(socket, appointmentId, call);
    });

    socket.on('offer', (data) => {
      handleOffer(socket, appointmentId, call, data);
    });

    socket.on('answer', (data) => {
      handleAnswer(socket, appointmentId, call, data);
    });

    socket.on('ice-candidate', (data) => {
      handleIceCandidate(socket, appointmentId, call, data);
    });

    socket.on('end-call', () => {
      handleEndCall(socket, appointmentId);
    });
  });

  // Handle call timeouts
  socket.on('call-timeout', ({ appointmentId }) => {
    const request = pendingRequests[appointmentId];
    if (request) {
      io.to(`user_${request.from}`).emit('call-timeout', { appointmentId });
      delete pendingRequests[appointmentId];
    }
  });
});

// Enhanced hasAccessToAppointment function
async function hasAccessToAppointment(user, appointmentId) {
  try {
    // In a real implementation, you would:
    // 1. Check if the appointment exists
    // 2. Verify the user is a participant
    // 3. Check if the current time is within the appointment window
    return true;
  } catch (err) {
    console.error('Access check error:', err);
    return false;
  }
}

// ... (keep all existing helper functions and route handlers)

// New route to fetch call history
app.get('/api/call-history/:userId', async (req, res) => {
  // Implement your call history retrieval logic
});

// ... (keep the rest of your existing code)

function handleDisconnect(socket, appointmentId, call) {
  console.log(`User disconnected: ${socket.user.userId}`);
  const index = call.participants.indexOf(socket.user.userId);
  if (index > -1) {
    call.participants.splice(index, 1);
  }
  socket.to(appointmentId).emit('user-left', { userId: socket.user.userId });
}

function handleOffer(socket, appointmentId, call, data) {
  call.offer = { ...data.offer, sender: socket.user.userId };
  socket.to(appointmentId).emit('offer', { 
    offer: data.offer, 
    sender: socket.user.userId 
  });
}

function handleAnswer(socket, appointmentId, call, data) {
  call.answers[socket.user.userId] = data.answer;
  socket.to(appointmentId).emit('answer', { 
    answer: data.answer, 
    sender: socket.user.userId 
  });
}

function handleIceCandidate(socket, appointmentId, call, data) {
  if (!call.iceCandidates[socket.user.userId]) {
    call.iceCandidates[socket.user.userId] = [];
  }
  call.iceCandidates[socket.user.userId].push(data.candidate);
  socket.to(appointmentId).emit('ice-candidate', { 
    candidate: data.candidate, 
    sender: socket.user.userId 
  });
}

function handleEndCall(socket, appointmentId) {
  socket.to(appointmentId).emit('call-ended', { 
    userId: socket.user.userId 
  });
  delete activeCalls[appointmentId];
}

// Routes
app.use('/api/auth', authRouter);
app.use('/api/appointments', router);
app.use('/api', bookingRouter);
app.use('/api', contactRouter);
app.use('/api/lifecoach', lifecachrouter);
app.use('/api/coupons', couponRouter);
app.use('/api/payment', Paymentrouter);
app.use('/api/admin', adminRouter);
app.use('/api/team', teamRouter);
app.use('/api', Adminslotrouter);

// Health check endpoint
app.get('/', (req, res) => {
  res.json({ status: 'Server is running', socketIO: 'Available at /socket.io/' });
});

// Database connection and server start
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    const PORT = process.env.PORT || 5000;
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Socket.IO available at ws://localhost:${PORT}`);
    });
  })
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });