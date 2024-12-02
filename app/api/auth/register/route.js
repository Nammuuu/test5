// import { NextResponse } from 'next/server';
// import connectToDatabase from '../../../../lib/mongodb';
// import User from '../../../../models/User';
// import bcrypt from 'bcryptjs';

// export async function POST(req) {
//   try {
//     const { email, username, password } = await req.json();

//     if (!email || !username || !password) {
//       return NextResponse.json({ message: 'Email, username, and password are required' }, { status: 400 });
//     }

//     await connectToDatabase();

//     const existingUser = await User.findOne({ $or: [{ email }, { username }] });
//     if (existingUser) {
//       return NextResponse.json({ message: 'User with this email or username already exists' }, { status: 422 });
//     }

//     const hashedPassword = bcrypt.hashSync(password, 10);

//     const newUser = new User({
//       email,
//       username,
//       password: hashedPassword,
//     });

//     await newUser.save();

//     return NextResponse.json({ 
//       message: 'User created successfully', 
//       user: { email, username } 
//     }, { status: 201 });
//   } catch (error) {
//     console.error('Error during registration:', error);
//     return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
//   }
// }



import { NextResponse } from 'next/server';
import connectToDatabase from '../../../../lib/mongodb';
import User from '../../../../models/User';
import bcrypt from 'bcryptjs';

export async function POST(req) {
  try {
    const { email, username, password } = await req.json();

    if (!email || !username || !password) {
      return NextResponse.json({ message: 'Email, username, and password are required' }, { status: 400 });
    }

    await connectToDatabase();

    const existingUser = await User.findOne({ $or: [{ email }, { username }] });
    if (existingUser) {
      return NextResponse.json({ message: 'User with this email or username already exists' }, { status: 422 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({
      email,
      username,
      password: hashedPassword,
    });

    await newUser.save();

    return NextResponse.json({ 
      message: 'User created successfully', 
      user: { email, username } 
    }, { status: 201 });
  } catch (error) {
    console.error('Error during registration:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
