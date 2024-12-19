


// import jwt from 'jsonwebtoken';
// import { NextResponse } from 'next/server';
// import User from '@/models/User'; // Assuming User is your model for users
// import mongoose from 'mongoose';
// import Chat from '@/models/Chat';


// const JWT_SECRET = process.env.JWT_SECRET;

// async function connectToDatabase() {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.MONGODB_URI);
//   }
// }

// export async function GET(req) {
//   try {
//     await connectToDatabase();

//     // Get the authorization header
//     const authHeader = req.headers.get('authorization');
//     if (!authHeader || !authHeader.startsWith('Bearer ')) {
//       return NextResponse.json({ message: 'Unauthorized: Missing or invalid authorization header' }, { status: 401 });
//     }

//     // Extract token from the header
//     const token = authHeader.split(' ')[1];
//     let decodedToken;

//     try {
//       // Verify the token
//       decodedToken = jwt.verify(token, JWT_SECRET);
//     } catch (error) {
//       return NextResponse.json({ message: 'Invalid token' }, { status: 401 });
//     }

//     // Fetch the user from the token
//     const user = await User.findById(decodedToken.userId);

//     if (!user || user.role !== 'admin') {
//       return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
//     }

//     // If user is admin, continue with logic
//     return NextResponse.json({ message: 'Authorized: Admin access granted' });
//   } catch (error) {
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }


// export async function POST(req) {
//   try {
//     await connectToDatabase();
//     const { messageId, response } = await req.json(); // Extract data from the request body

//     if (!messageId || !response) {
//       return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
//     }

//     // Create a new chat message or update an existing one
//     const newMessage = new Chat({
//       message: response,
//       sender: 'admin', // You may want to set this dynamically
//       receiver: messageId,
//       createdAt: new Date(),
//     });

//     await newMessage.save();

//     return NextResponse.json(newMessage, { status: 201 });
//   } catch (error) {
//     console.error('Error creating/updating message:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }


export const dynamic = 'force-dynamic';
import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import Chat from '@/models/Chat'; // Import your Chat model
import User from '@/models/User'; // Assuming User is your model for admin

const JWT_SECRET = process.env.JWT_SECRET;

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// GET: Fetch chat messages for admin
export async function GET(req) {
  try {
    await connectToDatabase();


    const authHeader = req.headers.get("authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return NextResponse.json({ message: "Unauthorized: Missing or invalid authorization header" }, { status: 401 });
    }

    const token = authHeader.split(" ")[1];
    let decodedToken;

    try {
      decodedToken = jwt.verify(token, JWT_SECRET);
    } catch (error) {
      return NextResponse.json({ message: "Invalid token" }, { status: 401 });
    }


    const user = await User.findById(decodedToken.userId);
    if (!user || user.role !== 'admin') {
      return NextResponse.json({ message: 'Unauthorized: User not found or not an admin' }, { status: 401 });
    }


    // Fetch all messages from users to the admin
    const messages = await Chat.find().sort({ createdAt: -1 }); // Sort by latest messages
    return NextResponse.json(messages, { status: 200 });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}



// POST: Admin replies to a message
export async function POST(req) {
  try {
    await connectToDatabase();
    const { messageId, response } = await req.json(); // Extract message ID and admin response

    console.log("messageId", messageId)
    console.log("response", response)
    if (!messageId || !response) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Create a new chat message as admin reply
    const newMessage = new Chat({
      message: response,
      sender: 'admin', // Admin ID or just 'admin'
      receiver: messageId,
      createdAt: new Date(),
    });

    await newMessage.save();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error creating/updating message:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}


