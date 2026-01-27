'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useMutation } from '@apollo/client';
import { ADD_STUDENT, UPDATE_STUDENT } from '@/graphql/mutations';
import { GET_STUDENTS } from '@/graphql/queries';

interface StudentFormProps {
    editId?: string;
    initialData?: {
        name: string;
        email: string;
        age: number;
        course: string;
    };
    onSuccess?: () => void;
    onCancel?: () => void;
}

export default function StudentForm({ editId, initialData, onSuccess, onCancel }: StudentFormProps) {
    const router = useRouter();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        age: '',
        course: '',
    });
    const [error, setError] = useState('');

    const [addStudent, { loading: addLoading }] = useMutation(ADD_STUDENT, {
        refetchQueries: [{ query: GET_STUDENTS }],
        onCompleted: () => {
            setFormData({ name: '', email: '', age: '', course: '' });
            if (onSuccess) {
                onSuccess();
            } else {
                router.refresh();
            }
        },
        onError: (err: any) => {
            setError(err.message || 'Failed to add student');
        }
    });

    const [updateStudent, { loading: updateLoading }] = useMutation(UPDATE_STUDENT, {
        refetchQueries: [{ query: GET_STUDENTS }],
        onCompleted: () => {
            if (onSuccess) {
                onSuccess();
            } else {
                router.refresh();
            }
        },
        onError: (err: any) => {
            setError(err.message || 'Failed to update student');
        }
    });

    const loading = addLoading || updateLoading;

    useEffect(() => {
        if (initialData) {
            setFormData({
                name: initialData.name,
                email: initialData.email,
                age: initialData.age.toString(),
                course: initialData.course,
            });
        }
    }, [initialData]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        const variables = {
            name: formData.name,
            email: formData.email,
            age: formData.age ? parseInt(formData.age) : undefined,
            course: formData.course,
        };

        try {
            if (editId) {
                await updateStudent({
                    variables: {
                        id: editId,
                        ...variables
                    }
                });
            } else {
                await addStudent({ variables });
            }
        } catch (err) {
            // Error is handled by onError callback
            console.error('Mutation error:', err);
        }
    };

    return (
        <div className="bg-white p-6 rounded-lg shadow-md mb-6">
            <h2 className="text-2xl font-bold mb-4 text-gray-800">{editId ? 'Edit Student' : 'Register New Student'}</h2>
            {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Name</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="John Doe"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="john@example.com"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Age</label>
                    <input
                        type="number"
                        name="age"
                        value={formData.age}
                        onChange={handleChange}
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="20"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">Course</label>
                    <input
                        type="text"
                        name="course"
                        value={formData.course}
                        onChange={handleChange}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        placeholder="Computer Science"
                    />
                </div>
                <div className="flex items-center gap-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        {loading ? 'Processing...' : (editId ? 'Update Student' : 'Register Student')}
                    </button>
                    {editId && onCancel && (
                        <button
                            type="button"
                            onClick={onCancel}
                            className="bg-gray-500 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
                        >
                            Cancel
                        </button>
                    )}
                </div>
            </form>
        </div>
    );
}
