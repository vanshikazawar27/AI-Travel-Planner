import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Planner from "./pages/Planner"
import Result from "./pages/Result"

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={<Home />}
      />

      <Route
        path="/planner"
        element={<Planner />}
      />

      <Route
        path="/result"
        element={<Result />}
      />
    </Routes>
  )
}

export default App