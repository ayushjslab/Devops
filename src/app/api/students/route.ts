
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function GET() {
    await dbConnect();
    try {
        const students = await Student.find({});
        return NextResponse.json({ success: true, data: students });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to fetch students' }, { status: 400 });
    }
}

export async function POST(request: Request) {
    await dbConnect();
    try {
        const body = await request.json();
        const student = await Student.create(body);
        return NextResponse.json({ success: true, data: student }, { status: 201 });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to create student' }, { status: 400 });
    }
}
