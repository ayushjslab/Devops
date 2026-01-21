
import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IStudent extends Document {
    name: string;
    email: string;
    age: number;
    course: string;
    createdAt: Date;
}

const StudentSchema: Schema = new Schema({
    name: {
        type: String,
        required: [true, 'Please provide a name for this student.'],
        maxlength: [60, 'Name cannot be more than 60 characters'],
    },
    email: {
        type: String,
        required: [true, 'Please provide an email for this student.'],
        unique: true,
    },
    age: {
        type: Number,
    },
    course: {
        type: String,
        required: [true, 'Please specify a course.'],
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

const Student: Model<IStudent> = mongoose.models.Student || mongoose.model<IStudent>('Student', StudentSchema);

export default Student;
