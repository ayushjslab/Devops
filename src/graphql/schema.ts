import { makeExecutableSchema } from "@graphql-tools/schema";
import Student from "@/models/Student";
import dbConnect from "@/lib/db";

const typeDefs = `
    type Student {
        id: ID!
        name: String!
        email: String!
        age: Int
        course: String!
        createdAt: String!
    }
    
    type Query {
        students: [Student]
        student(id: ID!): Student
    }
    
    type Mutation {
        addStudent(name: String!, email: String!, age: Int, course: String!): Student!
        updateStudent(id: ID!, name: String, email: String, age: Int, course: String): Student!
        deleteStudent(id: ID!): Student!
    }
`
const resolvers = {
    Query: {
        students: async () => {
            await dbConnect();
            return await Student.find({});
        },
        student: async (_: any, { id }: { id: string }) => {
            await dbConnect();
            return await Student.findById(id);
        }
    },
    Mutation: {
        addStudent: async (_: any, args: any) => {
            await dbConnect();
            const student = new Student(args);
            return await student.save();
        },
        updateStudent: async (_: any, { id, ...updates }: any) => {
            await dbConnect();
            const student = await Student.findByIdAndUpdate(
                id,
                { $set: updates },
                { new: true, runValidators: true }
            );
            return student;
        },
        deleteStudent: async (_: any, { id }: { id: string }) => {
            await dbConnect();
            const student = await Student.findByIdAndDelete(id);
            return student;
        }
    }
}

export const schema = makeExecutableSchema({
    typeDefs,
    resolvers
})