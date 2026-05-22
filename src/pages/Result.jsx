import Navbar from "../components/Navbar"
import { useLocation } from "react-router-dom"

function Result() {
        const location = useLocation()

        const tripData = location.state
  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 p-6 md:p-10">

        {/* Heading */}
        <h1 className="text-4xl font-bold mb-8 text-center">
          Your AI Travel Plan
        </h1>

        {/* Trip Overview */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Trip Overview
          </h2>

          <p className="mb-2">
            <span className="font-semibold">Destination:</span>  {tripData.destination}
          </p>

          <p className="mb-2">
            <span className="font-semibold">Duration:</span> {tripData.days} Days
          </p>

          <p>
            <span className="font-semibold">Budget:</span> ₹{tripData.budget}
          </p>

        </div>

        {/* Day 1 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Day 1
          </h2>

          <ul className="list-disc pl-5 space-y-2">
            <li>Visit Baga Beach</li>
            <li>Enjoy water sports</li>
            <li>Lunch at beachside cafe</li>
            <li>Watch sunset at Anjuna Beach</li>
          </ul>

        </div>

        {/* Day 2 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Day 2
          </h2>

          <ul className="list-disc pl-5 space-y-2">
            <li>Visit Fort Aguada</li>
            <li>Explore local markets</li>
            <li>Try Goan seafood</li>
            <li>Night party at Tito’s Lane</li>
          </ul>

        </div>

        {/* Day 3 */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Day 3
          </h2>

          <ul className="list-disc pl-5 space-y-2">
            <li>Morning dolphin trip</li>
            <li>Relax at Palolem Beach</li>
            <li>Shopping and return journey</li>
          </ul>

        </div>

        {/* Budget Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Estimated Budget
          </h2>

          <div className="space-y-2 text-lg">

            <p>Hotel: ₹5000</p>
            <p>Food: ₹3000</p>
            <p>Transport: ₹2500</p>
            <p>Activities: ₹3000</p>

            <p className="font-bold text-xl mt-4">
              Total: ₹13500
            </p>

          </div>

        </div>

        {/* Weather Section */}
        <div className="bg-white p-6 rounded-2xl shadow-lg mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Weather Forecast
          </h2>

          <p className="text-lg">
            🌤️ 28°C | Clear Sky
          </p>

        </div>

        {/* Hotels */}
        <div className="bg-white p-6 rounded-2xl shadow-lg">

          <h2 className="text-2xl font-bold mb-4">
            Recommended Hotels
          </h2>

          <ul className="space-y-3">

            <li className="border p-4 rounded-lg">
              ⭐ Sea View Resort — ₹2500/night
            </li>

            <li className="border p-4 rounded-lg">
              ⭐ Beach Paradise Hotel — ₹1800/night
            </li>

            <li className="border p-4 rounded-lg">
              ⭐ Goa Residency — ₹2200/night
            </li>

          </ul>

        </div>

      </div>
    </>
  )
}

export default Result