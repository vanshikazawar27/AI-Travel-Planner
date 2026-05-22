import Navbar from "../components/Navbar"

function Result() {

  return (
    <>
      <Navbar />

      <div className="p-10 bg-gray-100 min-h-screen">

        <h1 className="text-4xl font-bold mb-8">
          Your AI Travel Plan
        </h1>

        <div className="bg-white p-6 rounded-xl shadow-md mb-6">

          <h2 className="text-2xl font-bold mb-4">
            Day 1
          </h2>

          <p>
            Visit beaches and enjoy local food.
          </p>

        </div>

        <div className="bg-white p-6 rounded-xl shadow-md">

          <h2 className="text-2xl font-bold mb-4">
            Estimated Budget
          </h2>

          <p>Hotel: ₹5000</p>
          <p>Food: ₹3000</p>
          <p>Travel: ₹2000</p>

        </div>

      </div>
    </>
  )
}

export default Result