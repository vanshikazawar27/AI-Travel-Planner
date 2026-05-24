import { Routes, Route } from "react-router-dom"

import Home from "./pages/Home"
import Planner from "./pages/Planner"
import Result from "./pages/Result"
import NotFound from "./pages/NotFound"

function App() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/planner" element={<Planner />} />
      <Route path="/result" element={<Result />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
