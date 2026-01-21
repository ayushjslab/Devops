
import StudentForm from '../components/StudentForm';
import StudentList from '../components/StudentList';

export default function Home() {
  return (
    <main className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-extrabold text-gray-900 sm:text-5xl sm:tracking-tight lg:text-6xl">
            Student Registration Portal
          </h1>
          <p className="mt-5 max-w-xl mx-auto text-xl text-gray-500">
            Manage student records efficiently.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1">
            <StudentForm />
          </div>
          <div className="lg:col-span-2">
            <StudentList />
          </div>
        </div>
      </div>
    </main>
  );
}