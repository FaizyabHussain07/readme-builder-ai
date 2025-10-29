
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // Instruct the browser to clear the session cookie
    cookies().set('session', '', { expires: new Date(0), path: '/' });
    return NextResponse.json({ message: 'Logged out successfully' }, { status: 200 });
  } catch (error) {
    console.error('Error logging out:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
