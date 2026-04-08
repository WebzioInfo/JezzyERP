import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import prisma from '@/db/prisma/client';
import { registerSchema } from '@/lib/schemas/authSchema';

const JWT_SECRET = process.env.JWT_SECRET || 'secret';

export async function POST(req: NextRequest) {
    try {
        const body = await req.json();
        const data = registerSchema.parse(body);

        // Check if user exists
        const existingUser = await prisma.user.findUnique({
            where: { email: data.email }
        });

        if (existingUser) {
            return NextResponse.json({ error: 'Email already in use' }, { status: 400 });
        }

        const hashedPassword = await bcrypt.hash(data.password, 10);

        // Create Admin User
        const user = await prisma.user.create({
            data: {
                email: data.email,
                passwordHash: hashedPassword,
                role: 'ADMIN' // First user is Admin
            }
        });

        const token = jwt.sign(
            { userId: user.id, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        return NextResponse.json({ token, role: user.role }, { status: 201 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 400 });
    }
}
