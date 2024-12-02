



// app/api/chat/route.js

// import { NextResponse } from 'next/server';
// import mongoose from 'mongoose';
// import Chat from '@/models/Chat'; // Import Chat model

// // Connect to MongoDB
// async function connectToDatabase() {
//   if (mongoose.connection.readyState === 0) {
//     await mongoose.connect(process.env.MONGODB_URI);
//   }
// }

// // GET: Fetch messages for a specific user or all messages for admin
// export async function GET(req) {
//   try {
//     await connectToDatabase();
//     const userId = req.nextUrl.searchParams.get('userId');

//     let messages;
//     if (userId) {
//       // Fetch messages for a specific user
//       messages = await Chat.find({ $or: [{ sender: userId }, { receiver: userId }] }).sort({ createdAt: 1 });
//     } else {
//       // Fetch all messages for admin view
//       messages = await Chat.find().sort({ createdAt: 1 });
//     }

//     return NextResponse.json(messages);
//   } catch (error) {
//     console.error('Error fetching messages:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }

// // POST: User or Admin sends a message
// export async function POST(req) {
//   try {
//     await connectToDatabase();
//     const { sender, receiver, message } = await req.json();

//     if (!sender || !receiver || !message) {
//       return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
//     }

//     // Save the message in the database
//     const newMessage = new Chat({ sender, receiver, message, createdAt: new Date() });
//     await newMessage.save();

//     return NextResponse.json(newMessage, { status: 201 });
//   } catch (error) {
//     console.error('Error saving message:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }













import { NextResponse } from 'next/server';
import mongoose from 'mongoose';
import Chat from '@/models/Chat'; // Adjust the path to your Chat model

// Connect to MongoDB
async function connectToDatabase() {
  if (mongoose.connection.readyState === 0) {
    await mongoose.connect(process.env.MONGODB_URI);
  }
}

// GET: Fetch messages for a specific user or all messages for admin
export async function GET(req) {
  try {
    await connectToDatabase();
    const userId = req.nextUrl.searchParams.get('userId');

    let messages;
    if (userId) {
      // Fetch messages for a specific user
      messages = await Chat.find({
        $or: [{ sender: userId }, { receiver: userId }]
      }).sort({ createdAt: 1 });
    } else {
      // Fetch all messages for admin
      messages = await Chat.find().sort({ createdAt: 1 });
    }

    return NextResponse.json(messages);
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}

// POST: User or Admin sends a message
export async function POST(req) {
  try {
    await connectToDatabase();
    const { sender, receiver, message } = await req.json();

    if (!sender || !receiver || !message) {
      return NextResponse.json({ message: 'Missing required fields' }, { status: 400 });
    }

    // Save the message to the database
    const newMessage = new Chat({ sender, receiver, message, createdAt: new Date() });
    await newMessage.save();

    return NextResponse.json(newMessage, { status: 201 });
  } catch (error) {
    console.error('Error saving message:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
