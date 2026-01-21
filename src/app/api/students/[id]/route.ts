
import dbConnect from '@/lib/db';
import Student from '@/models/Student';
import { NextResponse } from 'next/server';

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const deletedStudent = await Student.findByIdAndDelete(id);
        if (!deletedStudent) {
            return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: {} });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to delete student' }, { status: 400 });
    }
}

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    await dbConnect();
    const { id } = await params;

    try {
        const body = await request.json();
        const student = await Student.findByIdAndUpdate(id, body, {
            new: true,
            runValidators: true,
        });
        if (!student) {
            return NextResponse.json({ success: false, error: 'Student not found' }, { status: 404 });
        }
        return NextResponse.json({ success: true, data: student });
    } catch (error) {
        return NextResponse.json({ success: false, error: 'Failed to update student' }, { status: 400 });
    }
}
