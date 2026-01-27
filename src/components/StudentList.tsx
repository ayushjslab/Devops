
'use client';

import { useState, useEffect } from 'react';
import StudentForm from './StudentForm';
import { useQuery, useMutation } from '@apollo/client';
import { GET_STUDENTS } from '@/graphql/queries';
import { DELETE_STUDENT, UPDATE_STUDENT } from '@/graphql/mutations';
interface Student {
    id: string;
    name: string;
    email: string;
    age: number;
    course: string;
}

export default function StudentList() {
    const { data, loading, error } = useQuery(GET_STUDENTS);
    const [editingStudent, setEditingStudent] = useState<Student | null>(null);

    console.log(data)

    const [deleteStudent] = useMutation(DELETE_STUDENT, {
        refetchQueries: [GET_STUDENTS],
    });

    const [updateStudent] = useMutation(UPDATE_STUDENT, {
        refetchQueries: [GET_STUDENTS],
    });

    if (loading) return <div className="text-center p-4">Loading students...</div>;
    if (error) return <p className="text-red-500">Failed to load students</p>;

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this student?')) return;

        try {
            await deleteStudent({ variables: { id } });
        } catch (err) {
            console.error(err);
            alert('Delete failed');
        }
    };

    const students: Student[] = data.students;

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-gray-800">Registered Students</h2>
            </div>
            {editingStudent && (<div className="mb-8 border-b pb-8 border-gray-200"> <StudentForm editId={editingStudent.id} initialData={editingStudent} onCancel={() => setEditingStudent(null)} /> </div>)}

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
                            {students.map((student, index) => (
                                <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                                    <td className="py-3 px-6 text-left whitespace-nowrap font-medium">{student.name}</td>
                                    <td className="py-3 px-6 text-left">{student.email}</td>
                                    <td className="py-3 px-6 text-left">{student.age}</td>
                                    <td className="py-3 px-6 text-left">{student.course}</td>
                                    <td className="py-3 px-6 text-center">
                                        <div className="flex item-center justify-center gap-2">
                                            <button
                                                className="w-4 mr-2 transform hover:text-purple-500 hover:scale-110"
                                                title="Edit"
                                                onClick={() => setEditingStudent(student)}
                                            >
                                                ✏️
                                            </button>
                                            <button
                                                onClick={() => handleDelete(student.id)}
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
