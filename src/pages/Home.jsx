import Navbar from "../components/Navbar"
import { useNavigate } from "react-router-dom"

function Home() {

  const navigate = useNavigate()

  return (
    <>
      <Navbar />

      <div className="h-screen flex flex-col justify-center items-center bg-cover bg-center text-white"
        style={{
          backgroundImage:
            "url('https://images.unsplash.com/photo-1507525428034-b723cf961d3e')",
        }}
      >

        <h1 className="text-5xl font-bold mb-6">
          Plan Your Dream Trip with AI
        </h1>

        <p className="text-xl mb-8">
          Smart itineraries, budgets, hotels & weather
        </p>

        <button
          onClick={() => navigate("/planner")}
          className="bg-yellow-400 text-black px-6 py-3 rounded-lg font-bold hover:bg-yellow-300"
        >
          Start Planning
        </button>

      </div>
    </>
  )
}

export default Home