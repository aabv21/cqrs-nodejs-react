import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import PostTable from "./components/PostTable";
import PostDetail from "./components/PostDetail";
import { Toaster } from "@/components/ui/sonner";
import "./App.css";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-background p-8 w-full">
        <Routes>
          <Route path="/" element={<PostTable />} />
          <Route path="/:id" element={<PostDetail />} />
        </Routes>
        <Toaster />
      </div>
    </Router>
  );
}

export default App;
