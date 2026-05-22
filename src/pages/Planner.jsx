import Navbar from "../components/Navbar"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import API from "../services/api"

function Planner() {

  const navigate = useNavigate()

  const [formData, setFormData] = useState({
    destination: "",
    budget: "",
    days: "",
    interest: "",
  })

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    })
  }

const handleSubmit = async (e) => {

  e.preventDefault()

  try {

    const response = await API.post(
      "/trip/generate-trip",
      formData
    )

    navigate("/result", {
      state: {
        formData,
        tripPlan: response.data.tripPlan
      }
    })

  } catch (error) {

    console.log(error)

    alert("Failed to generate trip")

  }

}

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex justify-center items-center p-5">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md"
        >

          <h1 className="text-3xl font-bold mb-6 text-center">
            Plan Your Trip
          </h1>

          <input
            type="text"
            name="destination"
            placeholder="Destination"
            value={formData.destination}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            value={formData.budget}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <input
            type="number"
            name="days"
            placeholder="Number of Days"
            value={formData.days}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <select
            name="interest"
            value={formData.interest}
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-6"
          >

            <option value="">
              Select Interest
            </option>

            <option value="Adventure">
              Adventure
            </option>

            <option value="Nature">
              Nature
            </option>

            <option value="Food">
              Food
            </option>

            <option value="Beach">
              Beach
            </option>

          </select>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800 transition"
          >
            Generate Trip
          </button>

        </form>

      </div>
    </>
  )
}

export default Planner