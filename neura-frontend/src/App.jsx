import NeuraGoHome from "./NeuraGoHome";
import FlowPage from "./pages/FlowPage";
import { BrowserRouter, Routes, Route } from "react-router-dom";


<Route path="/flow" element={<FlowPage />} />

function App() {
  return <NeuraGoHome />;
}

export default App;
