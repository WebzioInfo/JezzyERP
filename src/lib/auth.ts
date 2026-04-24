import { jwtVerify, SignJWT } from "jose";
import { cache } from "react";
import { cookies } from "next/headers";
import { env } from "./env";

const SECRET_KEY = new TextEncoder().encode(env.JWT_SECRET);
const SESSION_COOKIE_NAME = "jezzy_session";

export interface SessionPayload {
    userId: string;
    role: string;
}

export async function createSessionCookie(payload: SessionPayload) {
    const expires = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 Day

    const token = await new SignJWT({ ...payload })
        .setProtectedHeader({ alg: "HS256" })
        .setExpirationTime("1d")
        .setIssuedAt()
        .sign(SECRET_KEY);

    const cookieStore = await cookies();

    cookieStore.set(SESSION_COOKIE_NAME, token, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        path: "/",
        expires,
    });
}

export const verifySessionCookie = cache(async (): Promise<SessionPayload | null> => {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (!token) return null;

    try {
        const { payload } = await jwtVerify(token, SECRET_KEY, {
            algorithms: ["HS256"],
        });
        return payload as unknown as SessionPayload;
    } catch (error) {
        return null;
    }
});

export async function destroySessionCookie() {
    const cookieStore = await cookies();
    cookieStore.delete(SESSION_COOKIE_NAME);
}
