import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { ModulePage, Overview } from "./pages/QaPages";
import { LabsPage } from "./pages/LabsPage";

function Router() {
  return <Switch>
    <Route path="/" component={Overview} />
    <Route path="/requirements"><ModulePage kind="requirements" /></Route>
    <Route path="/test-cases"><ModulePage kind="test-cases" /></Route>
    <Route path="/runs"><ModulePage kind="runs" /></Route>
    <Route path="/reports"><ModulePage kind="reports" /></Route>
    <Route path="/bugs"><ModulePage kind="bugs" /></Route>
    <Route path="/environments"><ModulePage kind="environments" /></Route>
    <Route path="/integrations"><ModulePage kind="integrations" /></Route>
    <Route path="/api-lab"><LabsPage kind="api" /></Route>
    <Route path="/db-lab"><LabsPage kind="db" /></Route>
    <Route path="/404" component={NotFound} />
    <Route component={NotFound} />
  </Switch>;
}

function App() {
  return <ErrorBoundary><ThemeProvider defaultTheme="light"><TooltipProvider><Toaster /><Router /></TooltipProvider></ThemeProvider></ErrorBoundary>;
}
export default App;
