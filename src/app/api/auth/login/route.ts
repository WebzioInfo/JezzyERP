import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import prisma from '@/db/prisma/client';
import { loginSchema } from '@/lib/schemas/authSchema';
import { createSessionCookie } from '@/lib/auth';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = loginSchema.parse(body);

        const user = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (!user) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        const isValid = await bcrypt.compare(data.password, user.passwordHash);

        if (!isValid) {
            return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
        }

        // Securely create session cookie (HttpOnly, Secure, SameSite)
        await createSessionCookie({
            userId: user.id,
            role: user.role
        });

        return NextResponse.json({ success: true, role: user.role }, { status: 200 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
