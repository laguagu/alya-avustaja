import 'server-only';
import { SignJWT, jwtVerify } from 'jose';
import { cookies } from 'next/headers';
import type { SessionPayload } from '@/app/_auth/definitions';
import { sessions } from '@/db/drizzle/schema';
import { db } from '@/db/drizzle/db'; 
import { redirect } from 'next/navigation';

const secretKey = process.env.SECRET;
const key = new TextEncoder().encode(secretKey);

export async function encrypt(payload: SessionPayload) {
  return new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(key);
}

export async function decrypt(session: string | undefined = '') {
  try {
    const { payload } = await jwtVerify(session, key, {
      algorithms: ['HS256'],
    });
    return payload;
  } catch (error) {
    console.log('Failed to verify session');
    return null;
  }
}

export async function createSession(id: number, role: string): Promise<void> {
  const expiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);

  // 1. Create a session in the database
  const data = await db
    .insert(sessions)
    .values({
      userId: id,
      expiresAt,
    })
    // Return the session ID
    .returning({ id: sessions.id });

  const sessionId = data[0].id;
  console.log('sessionId', sessionId);

  // 2. Encrypt the session ID
  const sessionPayload: SessionPayload = { userId: id, role, expiresAt, sessionId };
  const encryptedSession = await encrypt(sessionPayload);

  // 3. Store the session in cookies for optimistic auth checks
  cookies().set('session', encryptedSession , {
    httpOnly: true,
    secure: true,
    expires: expiresAt,
    sameSite: 'lax',
    path: '/',
  });

}

export async function verifySession() {
  const cookie = cookies().get('session')?.value;
  const session = await decrypt(cookie);

  if (!session?.userId) {
    redirect('/');
  }

  return { isAuth: true, userId: Number(session.userId), role: session.role };
}


// export async function refreshSession(sessionId: number) {
//   const newExpiresAt = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);

//   await db
//     .update(sessions)
//     .set({ expiresAt: newExpiresAt })
//     .where(eq(sessions.id, sessionId));

//   const user = await db.query.users.findFirst({
//     where: eq(users.id, (await db.query.sessions.findFirst({
//       where: eq(sessions.id, sessionId)
//     }))?.userId),
//     columns: {
//       id: true,
//       role: true,
//     },
//   });

//   if (user) {
//     const sessionPayload: SessionPayload = { 
//       userId: user.id, 
//       role: user.role, 
//       expiresAt: newExpiresAt, 
//       sessionId 
//     };
//     const encryptedSession = await encrypt(sessionPayload);

//     cookies().set('session', encryptedSession, {
//       httpOnly: true,
//       secure: true,
//       expires: newExpiresAt,
//       sameSite: 'lax',
//       path: '/',
//     });
//   }
// }

export function deleteSession() {
  cookies().delete('session');
  redirect('/');
}