



export const dynamic = 'force-dynamic';

import connectToDatabase from '../../../../../lib/mongodb'; // Adjust the import path as needed
import ThemeSettings from '../../../../../models/ThemeSettings'; // Import the ThemeSettings schema
import { NextResponse } from 'next/server';

// GET request to retrieve theme settings
export async function GET() {
  try {
    await connectToDatabase();

    // Fetch the theme settings without requiring authentication
    const themeSettings = await ThemeSettings.findOne();
    if (!themeSettings) {
      return NextResponse.json({ message: 'Theme settings not found' }, { status: 404 });
    }

    return NextResponse.json({ themeSettings }, { status: 200 });
  } catch (error) {
    console.error('Error fetching theme settings:', error);
    return NextResponse.json({ message: 'Internal server error' }, { status: 500 });
  }
}
