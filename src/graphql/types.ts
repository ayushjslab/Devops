// TypeScript type definitions for GraphQL operations
export interface Student {
    id: string;
    name: string;
    email: string;
    age?: number;
    course: string;
    createdAt: string;
}

export interface AddStudentInput {
    name: string;
    email: string;
    age?: number;
    course: string;
}

export interface UpdateStudentInput {
    id: string;
    name?: string;
    email?: string;
    age?: number;
    course?: string;
}
