
'use client';

import { useState, useEffect } from 'react';
import StudentForm from './StudentForm';

interface Student {
    _id: string;
    name: string;
    email: string;
    age: number;
    course: string;
}

export default function StudentList() {
    const [students, setStudents] = useState<Student[]>([]);
    const [loading, setLoading] = useState(true);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    const fetchStudents = async () => {
        try {
            const res = await fetch('/api/students');
            const data = await res.json();
            if (data.success) {
                setStudents(data.data);
            }
        } catch (error) {
            console.error('Failed to fetch students', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudents();
    }, []);

    // Expose this function to parent or just use it here if we merge views
    // Actually, we can just make this component self-contained for the listing part
    // But we want to refresh the list when a new student is added.
    // We can pass a prop or use a shared state context, but for simplicity:
    // We'll let the parent handle the "Add New" form, but wait...
    // The user asked for "student can register, show all register user".
    // Let's put both on the same page for a simple dashboard.

    // So this component will assume it's part of a page that might trigger updates.
    // Alternatively, we can export `fetchStudents` or use a refresh trigger.

    // Let's allow the parent to trigger refresh, or simpler: 
    // Just auto-refresh on some interval or when the user manually refreshes?
    // No, let's just expose a way to refresh or pass `onStudentAdded` prop if needed.

    // Actually, I'll update the plan: simple dashboard.
    // I will make the Page component hold the state to refresh the list.
    // But wait, the list loads on mount.
    // I'll add a `key` to this component in the parent to force re-render when a new student is added?
    // Or better, just put the list here and let it manage itself, but how does the "Register" form tell it to update?

    // Refactor: I will combine them in the Page or make the List accept a "refreshTrigger" prop.
    // Let's just create the component first. I'll include a way to trigger refresh from outside if needed, 
    // or just rely on the parent to manage the source of truth if I lift state up.
    // Lifting state up to `page.tsx` is better.

    // BUT, to keep files clean, I'll keep them separate and maybe use a callback.

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            const res = await fetch(`/api/students/${id}`, {
                method: 'DELETE',
            });
            const data = await res.json();
            if (data.success) {
                setStudents(students.filter((s) => s._id !== id));
            } else {
                alert(data.error);
            }
        } catch (error) {
            console.error(error);
            alert('Failed to delete');
        }
    };

    const handleEditClick = (student: Student) => {
        setEditingStudent(student);
    };

    const handleEditSuccess = () => {
        setEditingStudent(null);
        fetchStudents();
    };

    if (loading) return <div className="text-center p-4">Loading students...</div>;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Registered Students</h2>
                <button
                    onClick={fetchStudents}
                    className="text-sm bg-gray-100 hover:bg-gray-200 text-gray-800 py-1 px-3 rounded"
                >
                    Refresh List
                </button>
            </div>

            {editingStudent && (
                <div className="mb-8 border-b pb-8 border-gray-200">
                    <StudentForm
                        editId={editingStudent._id}
                        initialData={editingStudent}
                        onSuccess={handleEditSuccess}
                        onCancel={() => setEditingStudent(null)}
                    />
                </div>
            )}

            {students.length === 0 ? (
                <p className="text-gray-500 text-center">No students registered yet.</p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white">
                        <thead>
                            <tr className="bg-gray-100 text-gray-600 uppercase text-sm leading-normal">
                                <th className="py-3 px-6 text-left">Name</th>
                                <th className="py-3 px-6 text-left">Email</th>
                                <th className="py-3 px-6 text-left">Age</th>
                                <th className="py-3 px-6 text-left">Course</th>
                                <th className="py-3 px-6 text-center">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="text-gray-600 text-sm font-light">
                            {students.map((student) => (
                                <tr key={student._id} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{student.name}</td>
                                    <td className="py-3 px-6 text-left">{student.email}</td>
                                    <td className="py-3 px-6 text-left">{student.age}</td>
                                    <td className="py-3 px-6 text-left">{student.course}</td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center gap-2">
                                            <button
                                                onClick={() => handleEditClick(student)}
                                                className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                                                title="Edit"
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student._id)}
                                                className="w-4 transform hover:text-red-500 hover:scale-110"
                                                title="Delete"
                                            >
                                                🗑️
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
