import Navbar from "../components/Navbar"
import { useState } from "react"

function Planner() {

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

  const handleSubmit = (e) => {
    e.preventDefault()

    console.log(formData)
  }

  return (
    <>
      <Navbar />

      <div className="min-h-screen bg-gray-100 flex justify-center items-center">

        <form
          onSubmit={handleSubmit}
          className="bg-white p-8 rounded-xl shadow-lg w-[400px]"
        >

          <h1 className="text-3xl font-bold mb-6 text-center">
            Plan Your Trip
          </h1>

          <input
            type="text"
            name="destination"
            placeholder="Destination"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <input
            type="number"
            name="budget"
            placeholder="Budget"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <input
            type="number"
            name="days"
            placeholder="Number of Days"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-4"
          />

          <select
            name="interest"
            onChange={handleChange}
            className="w-full p-3 border rounded-lg mb-6"
          >
            <option value="">Select Interest</option>
            <option value="Adventure">Adventure</option>
            <option value="Nature">Nature</option>
            <option value="Food">Food</option>
            <option value="Beach">Beach</option>
          </select>

          <button
            type="submit"
            className="w-full bg-black text-white p-3 rounded-lg hover:bg-gray-800"
          >
            Generate Trip
          </button>

        </form>

      </div>
    </>
  )
}

export default Planner