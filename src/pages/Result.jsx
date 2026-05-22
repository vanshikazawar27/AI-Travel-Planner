import Navbar from "../components/Navbar"
import { useLocation } from "react-router-dom"

function Result() {

  const location = useLocation()

  const { formData, tripPlan } = location.state

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6 md:p-10">

        <h1 className="text-4xl font-bold text-center mb-8">
          Your AI Travel Plan
        </h1>

        {/* Trip Overview */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Trip Overview
          </h2>

          <p className="mb-2">
            <span className="font-semibold">
              Destination:
            </span>

            {" "}
            {formData.destination}
          </p>

          <p className="mb-2">
            <span className="font-semibold">
              Days:
            </span>

            {" "}
            {formData.days}
          </p>

          <p className="mb-2">
            <span className="font-semibold">
              Budget:
            </span>

            {" "}
            ₹{formData.budget}
          </p>

          <p>
            <span className="font-semibold">
              Interest:
            </span>

            {" "}
            {formData.interest}
          </p>

        </div>

        {/* AI Generated Itinerary */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-4">
            AI Generated Itinerary
          </h2>

          <pre className="whitespace-pre-wrap text-gray-700 leading-7">
            {tripPlan}
          </pre>

        </div>

      </div>
    </>
  )
}

export default Result