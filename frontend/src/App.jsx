import Home from "./components/Home.jsx";
import Gallery from "./components/Gallery.jsx";
import History from "./components/History.jsx";
import Races from "./components/Races.jsx";
import Drivers from "./components/Drivers.jsx";
import Teams from "./components/Teams";
import TeamsAnalyzer from "./components/TeamsAnalyzer";
import AnalyzerHome from "./components/AnalyzerHome";
import DriverAnalyzer from "./components/DriverAnalyzer";
import Predictor from "./components/Predictor";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";





function App() {
  return (
    <BrowserRouter>
      <Layout>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/gallery" element={<Gallery />} />
          <Route path="/history" element={<History />} />
          <Route path="/races" element={<Races />} />
          <Route path="/drivers" element={<Drivers />} />
          {/* <Route path="/navbar" element={<Navbar />} /> */}
          {/* <Route path="/analyzer" element={<Analyzer />} /> */}
          <Route path="/teams" element={<Teams />} /> 
          <Route path="/predictor" element={<Predictor />} />
          <Route path="/analyzer" element={<AnalyzerHome />} />
          <Route path="/analyzer/drivers" element={<DriverAnalyzer />} />
          <Route path="/analyzer/teams" element={<TeamsAnalyzer />} />
        </Routes>

      </Layout>
    </BrowserRouter>


  );
}

export default App;
