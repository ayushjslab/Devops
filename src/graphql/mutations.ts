import { gql } from "@apollo/client";

export const ADD_STUDENT = gql`
  mutation AddStudent($name: String!, $email: String!, $age: Int, $course: String!) {
    addStudent(name: $name, email: $email, age: $age, course: $course) {
      id
      name
      email
      age
      course
      createdAt
    }
  }
`;

export const UPDATE_STUDENT = gql`
  mutation UpdateStudent($id: ID!, $name: String, $email: String, $age: Int, $course: String) {
    updateStudent(id: $id, name: $name, email: $email, age: $age, course: $course) {
      id
      name
      email
      age
      course
      createdAt
    }
  }
`;

export const DELETE_STUDENT = gql`
  mutation DeleteStudent($id: ID!) {
    deleteStudent(id: $id) {
      id
      name
      email
    }
  }
`;
