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
import DesignersAdmin from "./pages/admin/designers/DesignersAdmin";
import NovoDesigner from "./pages/admin/designers/NovoDesigner";
import EditarDesigner from "./pages/admin/designers/EditarDesigner";
import CursosAdmin from "./pages/admin/cursos/CursosAdmin";
import NovoCurso from "./pages/admin/cursos/NovoCurso";
import EditarCurso from "./pages/admin/cursos/EditarCurso";
import ImportarAcessibilidade from "./pages/admin/import/ImportarAcessibilidade";
import ImportarDisciplinas from "./pages/admin/import/ImportarDisciplinas";
import ImportarVideoaulas from "./pages/admin/import/ImportarVideoaulas";
import HistoricoImportacoes from "./pages/admin/import/HistoricoImportacoes";

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
      <Route path="/admin/designers" component={DesignersAdmin} />
      <Route path="/admin/designers/novo" component={NovoDesigner} />
      <Route path="/admin/designers/:id/editar" component={EditarDesigner} />
      <Route path="/admin/cursos" component={CursosAdmin} />
      <Route path="/admin/cursos/novo" component={NovoCurso} />
      <Route path="/admin/cursos/:id/editar" component={EditarCurso} />
      <Route path="/admin/importar/acessibilidade" component={ImportarAcessibilidade} />
      <Route path="/admin/importar/disciplinas" component={ImportarDisciplinas} />
      <Route path="/admin/importar/videoaulas" component={ImportarVideoaulas} />
      <Route path="/admin/importacoes/historico" component={HistoricoImportacoes} />
      <Route path="/404" component={NotFound} />
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
