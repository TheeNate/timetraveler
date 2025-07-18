
import { Router, Route, Switch } from "wouter";
import Navigation from "./components/Navigation";
import Home from "./pages/home";
import HazardAnalysisPage from "./pages/hazard-analysis";
import NotFound from "./pages/not-found";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <Navigation />
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/hazard-analysis" component={HazardAnalysisPage} />
          <Route component={NotFound} />
        </Switch>
      </div>
    </Router>
  );
}

export default App;
