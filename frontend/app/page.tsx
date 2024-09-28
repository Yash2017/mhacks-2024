import SimpleForm from '../components/simple-form'

export default function Page() {
  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold mb-4 text-gray-800">Simple Form</h1>
      <SimpleForm />
    </div>
  )
}