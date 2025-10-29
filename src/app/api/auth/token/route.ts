
import { cookies } from 'next/headers';
import { initializeApp, getApps, cert } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { NextResponse } from 'next/server';

// Initialize Firebase Admin SDK
const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_KEY!);
if (!getApps().length) {
  initializeApp({
    credential: cert(serviceAccount),
  });
}

export async function GET() {
  try {
    const sessionCookie = cookies().get('session')?.value;
    if (!sessionCookie) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const decodedIdToken = await getAuth().verifySessionCookie(sessionCookie, true);
    const user = await getAuth().getUser(decodedIdToken.uid);

    const githubProviderData = user.providerData.find(
      (provider) => provider.providerId === 'github.com'
    );
    
    const providerJson = githubProviderData?.toJSON() as any;
    if (providerJson?.accessToken) {
      return NextResponse.json({ accessToken: providerJson.accessToken });
    }

    return NextResponse.json({ error: 'Access token not found' }, { status: 404 });

  } catch (error) {
    console.error('Error getting GitHub access token:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
