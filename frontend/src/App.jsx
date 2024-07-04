import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import "./App.css";
import Events from "./modules/Events/pages/EventsPage";
import PrivateRoute from "./utils/PrivateRoute";

function App() {
  return (
    <Routes>
      <Route path="/events" element={<Events />} />
    </Routes>
  );
}

export default App;
