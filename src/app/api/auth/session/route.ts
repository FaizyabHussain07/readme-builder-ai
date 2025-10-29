
import { cookies } from 'next/headers';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { NextResponse } from 'next/server';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY || '{}');
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

// 7 days
const expiresIn = 60 * 60 * 24 * 7 * 1000;

export async function POST(request: Request) {
  const { idToken } = await request.json();

  try {
    const decodedIdToken = await getAuth().verifyIdToken(idToken);

    // Only process if the user just signed in in the last 5 minutes.
    if (new Date().getTime() / 1000 - decodedIdToken.auth_time < 5 * 60) {
      const sessionCookie = await getAuth().createSessionCookie(idToken, { expiresIn });
      const options = {
        name: 'session',
        value: sessionCookie,
        maxAge: expiresIn,
        httpOnly: true,
        secure: true,
      };

      // Set cookie.
      cookies().set(options.name, options.value, options);

      return NextResponse.json({ status: 'success' }, { status: 200 });
    }

    return NextResponse.json({ error: 'Recent sign-in required.' }, { status: 401 });
  } catch (error) {
    console.error('Error creating session cookie:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
