




import nodemailer from 'nodemailer';
// import connectToDatabase from '../../../../';
// import User from '../../../../../models/User';

import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
// import UserProfile from '../../../models/UserProfile';
import User from '../../../../models/User';
import jwt from 'jsonwebtoken';
import { IncomingForm } from 'formidable';
import fs from 'fs';
// Disable body parsing for Next.js as we'll use formidable for file handling
// export const config = {
//     api: {
//       bodyParser: false,
//     },
//   };

export async function GET(req) {
  try {
    await connectToDatabase();
    const users = await User.find({}, 'email'); // Fetch only email field
    return NextResponse.json({ users }, { status: 200 });
  } catch (error) {
    return NextResponse.json({ message: 'Error fetching users' }, { status: 500 });
  }
}

// export async function POST(req) {
//   try {
//     await connectToDatabase();
//     const { subject, message, externalEmails } = await req.json();

//     // Get all user emails
//     const users = await User.find({}, 'email');
//     const userEmails = users.map(user => user.email);

//     // Combine user emails and external emails
//     const allEmails = [...userEmails, ...externalEmails];

//     // Setup nodemailer transport
//     const transporter = nodemailer.createTransport({
//       service: 'gmail', // or another service
//       auth: {
//         user: process.env.EMAIL_USER,
//         pass: process.env.EMAIL_PASSWORD,
//       },
//     });


// console.log("transporter", transporter)


//     const mailOptions = {
//       from: process.env.EMAIL_USER,
//       to: allEmails, // Send to all users and external emails
//       subject,
//       text: message,
//     };

//     // Send the email
//     await transporter.sendMail(mailOptions);

//     return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
//   } catch (error) {
//     console.error('Error sending emails:', error);
//     return NextResponse.json({ message: 'Failed to send emails' }, { status: 500 });
//   }
// }



export async function POST(req) {
    try {
      await connectToDatabase();
  
      // Use the correct import for formidable
      const form = new IncomingForm();
      form.uploadDir = './tmp'; // Temp directory to store uploaded files
      form.keepExtensions = true;
  
      const data = await new Promise((resolve, reject) => {
        form.parse(req, (err, fields, files) => {
          if (err) reject(err);
          resolve({ fields, files });
        });
      });
  
      const { subject, message, externalEmails } = data.fields;
      const attachments = Object.values(data.files).map(file => ({
        filename: file.originalFilename,
        path: file.filepath,
      }));
  
      // Get all user emails
      const users = await User.find({}, 'email');
      const userEmails = users.map(user => user.email);
  
      // Combine user emails and external emails
      const allEmails = [...userEmails, ...(JSON.parse(externalEmails))];
  
      // Setup nodemailer transport
      const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASSWORD,
        },
      });
  
      // Send individual emails to each recipient
      for (const email of allEmails) {
        const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject,
          text: message,
          attachments, // Attach images
        };
  
        await transporter.sendMail(mailOptions);
      }
  
      // Cleanup uploaded files
      attachments.forEach(att => fs.unlinkSync(att.path));
  
      return NextResponse.json({ message: 'Emails sent successfully' }, { status: 200 });
    } catch (error) {
      console.error('Error sending emails:', error);
      return NextResponse.json({ message: 'Failed to send emails' }, { status: 500 });
    }
  }
