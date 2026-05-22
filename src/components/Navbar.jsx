function Navbar() {
  return (
    <nav className="flex justify-between items-center p-5 bg-black text-white">
      <h1 className="text-2xl font-bold">AI Travel Planner</h1>

      <ul className="flex gap-6">
        <li className="cursor-pointer hover:text-yellow-400">Home</li>
        <li className="cursor-pointer hover:text-yellow-400">Planner</li>
      </ul>
    </nav>
  )
}

export default Navbar