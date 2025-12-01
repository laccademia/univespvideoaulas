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
import EditarVideoaula from "./pages/admin/EditarVideoaula";
import ProfessoresAdmin from "./pages/admin/ProfessoresAdmin";
import NovoProfessor from "./pages/admin/NovoProfessor";
import EditarProfessor from "./pages/admin/EditarProfessor";
import DisciplinasAdmin from "./pages/admin/DisciplinasAdmin";
import NovaDisciplina from "./pages/admin/NovaDisciplina";
import EditarDisciplina from "./pages/admin/EditarDisciplina";

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
      <Route path="/admin/videoaulas/:id/editar" component={EditarVideoaula} />
      <Route path="/admin/professores" component={ProfessoresAdmin} />
      <Route path="/admin/professores/novo" component={NovoProfessor} />
      <Route path="/admin/professores/:id/editar" component={EditarProfessor} />
      <Route path="/admin/disciplinas" component={DisciplinasAdmin} />
      <Route path="/admin/disciplinas/nova" component={NovaDisciplina} />
      <Route path="/admin/disciplinas/:id/editar" component={EditarDisciplina} />
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
