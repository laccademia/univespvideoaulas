import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Cursos from "./pages/Cursos";
import CursoDetalhes from "./pages/CursoDetalhes";
import Disciplinas from "./pages/Disciplinas";
import Videoaulas from "./pages/Videoaulas";
import VideoaulaDetalhes from "./pages/VideoaulaDetalhes";
import Professores from "./pages/Professores";
import DesignersInstrucionais from "./pages/DesignersInstrucionais";
import Estatisticas from "./pages/Estatisticas";
import Visualizacoes from "./pages/Visualizacoes";
import AdminDashboard from "./pages/admin/AdminDashboard";
import VideoaulasAdmin from "./pages/admin/VideoaulasAdmin";
import NovaVideoaula from "./pages/admin/NovaVideoaula";

function Router() {
  return (
    <Switch>
      <Route path={"/"} component={Home} />
      <Route path={"/cursos"} component={Cursos} />
      <Route path={"/cursos/:id"} component={CursoDetalhes} />
      <Route path={"/disciplinas"} component={Disciplinas} />
      <Route path={"/videoaulas"} component={Videoaulas} />
      <Route path={"/videoaulas/:id"} component={VideoaulaDetalhes} />
      <Route path={"/professores"} component={Professores} />
      <Route path={"/designers-instrucionais"} component={DesignersInstrucionais} />
      <Route path={"/estatisticas"} component={Estatisticas} />
      <Route path={"/visualizacoes"} component={Visualizacoes} />
      <Route path={"/admin"} component={AdminDashboard} />
      <Route path={"/admin/videoaulas"} component={VideoaulasAdmin} />
      <Route path={"/admin/videoaulas/nova"} component={NovaVideoaula} />
      <Route path={"/404"} component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider
        defaultTheme="light"
        switchable
      >
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
