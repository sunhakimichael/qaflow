import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import { I18nProvider } from "./i18n";
import { ModulePage, Overview } from "./pages/QaPages";
import { LabsPage } from "./pages/LabsPage";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Overview} />
      <Route path="/requirements/:id?">
        {params => <ModulePage kind="requirements" selectedId={params.id} />}
      </Route>
      <Route path="/test-cases/:id?">
        {params => <ModulePage kind="test-cases" selectedId={params.id} />}
      </Route>
      <Route path="/runs/:id?">
        {params => <ModulePage kind="runs" selectedId={params.id} />}
      </Route>
      <Route path="/reports">
        <ModulePage kind="reports" />
      </Route>
      <Route path="/bugs/:id?">
        {params => <ModulePage kind="bugs" selectedId={params.id} />}
      </Route>
      <Route path="/environments">
        <ModulePage kind="environments" />
      </Route>
      <Route path="/integrations">
        <ModulePage kind="integrations" />
      </Route>
      <Route path="/api-lab">
        <LabsPage kind="api" />
      </Route>
      <Route path="/db-lab">
        <LabsPage kind="db" />
      </Route>
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <I18nProvider>
        <ThemeProvider defaultTheme="light">
          <TooltipProvider>
            <Toaster />
            <Router />
          </TooltipProvider>
        </ThemeProvider>
      </I18nProvider>
    </ErrorBoundary>
  );
}
export default App;
