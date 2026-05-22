import { Link } from "react-router-dom"

function Navbar() {
  return (
    <nav className="flex justify-between items-center px-8 py-5 bg-black text-white">

      <h1 className="text-2xl font-bold">
        AI Travel Planner
      </h1>

      <div className="flex gap-6 text-lg">

        <Link
          to="/"
          className="hover:text-yellow-400 transition"
        >
          Home
        </Link>

        <Link
          to="/planner"
          className="hover:text-yellow-400 transition"
        >
          Planner
        </Link>

      </div>

    </nav>
  )
}

export default Navbar