# TODO - Sistema de Videoaulas Univesp

## 🗄️ Backend - Banco de Dados e API

### Schema do Banco de Dados
- [x] Criar tabela `cursos` (id, eixo, nome)
- [x] Criar tabela `disciplinas` (id, codigo, nome, carga_horaria, ano_curso, bimestre_pedagogico, curso_id)
- [x] Criar tabela `professores` (id, nome)
- [x] Criar tabela `designers_instrucionais` (id, nome)
- [x] Criar tabela `ofertas_disciplinas` (id, disciplina_id, ano, bimestre_operacional, professor_id, di_id, tipo)
- [x] Criar tabela `videoaulas` (id, oferta_disciplina_id, semana, numero_aula, titulo, sinopse, link_youtube_original, slides_disponivel, status, id_tv_cultura, duracao_minutos, link_libras, link_audiodescricao, cc_legenda, link_download)

### Popular Banco de Dados
- [x] Criar script de seed para popular cursos
- [x] Criar script de seed para popular disciplinas
- [x] Criar script de seed para popular professores
- [x] Criar script de seed para popular designers instrucionais
- [x] Criar script de seed para popular ofertas de disciplinas
- [x] Criar script de seed para popular videoaulas

### API tRPC - Routers
- [x] Router `cursos` - listar todos os cursos
- [x] Router `cursos` - obter detalhes de um curso
- [x] Router `cursos` - listar disciplinas de um curso
- [x] Router `disciplinas` - listar todas as disciplinas (com filtros)
- [x] Router `disciplinas` - obter detalhes de uma disciplina
- [x] Router `disciplinas` - listar ofertas de uma disciplina
- [x] Router `videoaulas` - listar todas as videoaulas (com filtros avançados)
- [x] Router `videoaulas` - obter detalhes de uma videoaula
- [x] Router `videoaulas` - busca avançada por título, sinopse, professor, DI
- [x] Router `professores` - listar todos os professores
- [x] Router `professores` - obter detalhes de um professor
- [x] Router `professores` - listar videoaulas de um professor
- [x] Router `dis` - listar todos os designers instrucionais
- [x] Router `dis` - obter detalhes de um DI
- [x] Router `dis` - listar videoaulas de um DI
- [x] Router `stats` - estatísticas gerais (overview)
- [x] Router `stats` - estatísticas por curso
- [x] Router `stats` - estatísticas por bimestre
- [x] Router `stats` - estatísticas por status
- [x] Router `stats` - estatísticas de acessibilidade

## 🎨 Frontend - Interface Moderna

### Configuração Base
- [x] Configurar paleta de cores moderna (tema claro/escuro)
- [x] Configurar fontes do Google Fonts
- [x] Configurar tema claro/escuro com ThemeProvider (switchable)
- [x] Criar componente de alternância de tema (ThemeToggle)

### Layout e Navegação
- [x] Criar layout principal com header e navegação
- [x] Criar menu de navegação responsivo
- [x] Criar footer

### Páginas Principais
- [x] Página Home/Dashboard com estatísticas e gráficos
- [x] Página de Cursos (lista com cards)
- [ ] Página de Detalhes do Curso (com disciplinas)
- [x] Página de Disciplinas (lista com busca e filtros)
- [ ] Página de Detalhes da Disciplina (com ofertas e videoaulas)
- [x] Página de Videoaulas (lista completa com filtros avançados)
- [x] Página de Detalhes da Videoaula (player integrado)
- [x] Página de Professores (lista)
- [ ] Página de Detalhes do Professor (com videoaulas)
- [x] Página de Designers Instrucionais (lista)
- [ ] Página de Detalhes do DI (com videoaulas)
- [x] Página de Relatórios e Estatísticas

### Componentes Reutilizáveis
- [ ] Componente de Card de Curso
- [ ] Componente de Card de Disciplina
- [ ] Componente de Card de Videoaula
- [ ] Componente de Filtros Avançados
- [ ] Componente de Busca
- [ ] Componente de Player de Vídeo (YouTube embed)
- [ ] Componente de Estatísticas (cards com números)
- [ ] Componente de Gráficos (Recharts)
- [ ] Componente de Loading Skeleton
- [ ] Componente de Empty State

### Funcionalidades
- [ ] Sistema de busca global
- [ ] Filtros por curso, disciplina, ano, bimestre, status
- [ ] Filtros por professor e DI
- [ ] Visualização em grid/lista
- [ ] Paginação de resultados
- [ ] Ordenação de resultados
- [ ] Exportação de relatórios (CSV)
- [ ] Links para versões acessíveis (Libras, Audiodescrição)
- [ ] Indicadores visuais de acessibilidade

## 🧪 Testes
- [x] Testes unitários dos routers tRPC
- [x] Testes de integração do banco de dados
- [x] Validação de dados processados
## 📚 Documentação
- [x] README.md principal do projeto
- [x] Documentação da estrutura do banco de dados
- [x] Documentação da API tRPC
- [x] Guia de contribuição
- [x] Documentação de deployração
- [ ] Documentação de estrutura de pastas
- [ ] Documentação de componentes do frontend
- [ ] Guia de contribuição

## 🚀 Deploy e Finalização
- [ ] Criar checkpoint final
- [ ] Publicar no GitHub
- [ ] Preparar para deploy


## 🐛 Bugs Reportados pelo Usuário

- [x] Página de Professores não está mostrando nomes dos professores - IDENTIFICADO: fórmulas VLOOKUP não resolvidas
- [x] Página de Designers Instrucionais mostrando apenas números - IDENTIFICADO: coluna DI vazia na maioria das linhas
- [x] Anos das videoaulas estão incorretos - IDENTIFICADO: estrutura da planilha mal interpretada
- [x] Revisar e corrigir dados nas planilhas originais - ENTENDIDO: células mescladas requerem forward fill
- [x] Reprocessar dados com lógica correta (Geral + Bimestres + Acessibilidade)
- [x] Repopular banco de dados com dados corrigidos
- [x] Validar integridade dos dados após correção
- [x] Testar todas as páginas com dados reais
- [x] Criar testes unitários para validação (20/20 passando)


## 🎨 Bugs de Contraste e Visibilidade (Tema Claro/Escuro)

- [x] Números "372" e "9" invisíveis no modo escuro (cards de Disciplinas e Cursos) - CORRIGIDO: mudado para text-foreground
- [x] Textos sobrepostos nos cards da home - CORRIGIDO: ajustado contraste
- [x] Verificar contraste de todas as páginas no modo escuro - CORRIGIDO: todos os números agora usam text-foreground
- [x] Verificar contraste de todas as páginas no modo claro - OK: já estava legível
- [x] Verificar gráficos e estatísticas (legibilidade) - CORRIGIDO: números mudados para text-foreground
- [x] Testar visibilidade final em ambos os temas - VALIDADO: todos os números visíveis em ambos os modos
- [x] Verificar se há outros elementos com problemas de contraste - VALIDADO: sem problemas encontrados


## 🐛 Bug de Sobreposição de Textos

- [x] Gráfico de pizza na página de Estatísticas: textos "Completas (todos): 0%" e "Com CC: 0%" sobrepostos - CORRIGIDO
- [x] Ajustar posicionamento das labels do Recharts para evitar sobreposição - CORRIGIDO: labels com valor 0 agora ocultas
- [x] Testar com diferentes valores para garantir que não há sobreposição - VALIDADO: sem sobreposição em ambos os temas


## 🐛 Bug de Fluxo de Navegação

- [x] Página de Disciplinas não está funcionando corretamente - CORRIGIDO
- [x] Fluxo Eixo → Curso → Disciplina não está claro - CORRIGIDO: filtros hierárquicos implementados
- [x] Esclarecer hierarquia: Eixo (área) → Curso (graduação) → Disciplina (matéria) - IMPLEMENTADO
- [x] Implementar navegação breadcrumb ou filtros hierárquicos - IMPLEMENTADO: 2 dropdowns + breadcrumb
- [x] Adicionar informações de eixo e curso na listagem de disciplinas - IMPLEMENTADO: eixo visível em cada card
- [x] Testar filtros e validar funcionamento - VALIDADO: filtros hierárquicos funcionando perfeitamente


## 🐛 Bug de Página de Detalhes do Curso

- [x] Ao clicar em um curso, página não existe (erro 404) - CORRIGIDO
- [x] Criar página de detalhes do curso (/cursos/:id) - IMPLEMENTADO
- [x] Listar todas as disciplinas do curso - IMPLEMENTADO
- [x] Mostrar informações do curso (nome, eixo, descrição) - IMPLEMENTADO
- [x] Adicionar estatísticas do curso (total de disciplinas, videoaulas) - IMPLEMENTADO
- [x] Implementar navegação breadcrumb (Início → Cursos → [Nome do Curso]) - IMPLEMENTADO
- [x] Adicionar rota no App.tsx - IMPLEMENTADO
- [x] Testar navegação e validar funcionamento - VALIDADO: página funcionando perfeitamente


## 🐛 Bug de Nested Anchor Tags

- [x] Erro: `<a>` cannot contain a nested `<a>` na página /cursos/:id - CORRIGIDO
- [x] Identificar onde está o nested anchor (breadcrumb + card de disciplina) - IDENTIFICADO: breadcrumb
- [x] Substituir Card wrapper por div com onClick em vez de Link - CORRIGIDO: removido <a> de dentro de <Link>
- [x] Testar e validar correção - VALIDADO: sem erros no console


## 🐛 Bugs de Associação de Disciplinas

- [x] Número de disciplinas por curso está incorreto (mostrando 11 quando deveria ser muito mais) - IDENTIFICADO
- [x] Lógica de associação não considera disciplinas compartilhadas entre cursos - IDENTIFICADO
- [x] Lógica não considera disciplinas comuns a todos os eixos - IDENTIFICADO
- [x] Lógica não considera disciplinas únicas de cada curso - IDENTIFICADO
- [x] Erro ao clicar no card da disciplina na página do curso - IDENTIFICADO
- [x] Revisar documento de instruções sobre estrutura de disciplinas - REVISADO
- [x] Criar tabela de relacionamento many-to-many (cursos_disciplinas) - IMPLEMENTADO
- [x] Modificar schema do banco de dados - IMPLEMENTADO e migrations aplicadas
- [x] Atualizar helpers de banco de dados (db.ts) - IMPLEMENTADO
- [x] Reprocessar CSVs de disciplinas mantendo múltiplas associações - CONCLUÍDO: 206 disciplinas únicas + 372 associações
- [x] Atualizar script de seed - CONCLUÍDO
- [x] Limpar e repopular banco de dados - CONCLUÍDO (206 disciplinas + 372 associações + 458 videoaulas)
- [ ] Desabilitar navegação para detalhes da disciplina temporariamente - PENDENTE
- [x] Atualizar routers para usar nova estrutura - CONCLUÍDO (campo 'curso' removido, filtros desabilitados temporariamente)
- [x] Atualizar frontend (Videoaulas.tsx, VideoaulaDetalhes.tsx, Disciplinas.tsx) para não usar campo 'curso' - CONCLUÍDO
- [x] Testar e validar contagem correta - VALIDADO: todos os cursos com número correto de disciplinas (43, 43, 50, 32, 53, 36, 41, 41, 33)

**NOTA:** Checkpoint intermediário salvo. Próximos passos: atualizar seed.ts, routers.ts e frontend.

- [x] Corrigir erro de chaves duplicadas na página /disciplinas (disciplina ID 60032 aparece duplicada) - CORRIGIDO: getDisciplinasComCurso agora agrupa disciplinas únicas com array de cursos

## 🎯 Redesign da Página de Videoaulas (Dashboard)

- [x] Tornar cards de disciplina clicáveis (navegação para /videoaulas com filtro pré-aplicado)
- [x] Criar componente de estatísticas do dashboard (total, por ano, por bimestre, acessibilidade)
- [x] Criar barra de busca avançada (ano, bimestre, disciplina, código, ID TV Univesp)
- [x] Redesenhar visualização: remover cards, criar tabelas agrupadas por bimestre
- [x] Implementar tabelas com estrutura da planilha original (colunas: Semana, Aula, Título, Sinopse, etc.)
- [x] Adicionar indicadores visuais de acessibilidade nas tabelas (Libras, Audiodescrição, CC)
- [x] Testar navegação de disciplina → videoaulas com filtro aplicado)
- [x] Validar layout de dashboard e tabelas agrupadas

## 📊 Inserção de Dados Históricos (2024 e 2023)

- [x] Identificar planilhas de videoaulas de 2024 e 2023 disponíveis
- [x] Processar dados das planilhas 2024 (Geral + Bimestres + Acessibilidade)
- [x] Processar dados das planilhas 2023 (Geral + Bimestres + Acessibilidade)
- [x] Atualizar script de seed para incluir dados históricos
- [x] Executar seed e popular banco de dados (224 videoaulas inseridas)
- [x] Validar contagem total de videoaulas por ano (682 total: 458 de 2025 + 224 históricas)
- [x] Testar dashboard com filtros de ano (2023, 2024, 2025)

## 🔍 Correção: Verificar e Processar TODAS as Videoaulas 2024/2023

- [x] Analisar estrutura completa da planilha Videoaulas 2024 (todas as abas)
- [x] Verificar contagem real de videoaulas em cada aba
- [x] Identificar por que apenas 224 de 1205 foram inseridas (problema: células mescladas não tratadas)
- [x] Corrigir script de processamento para capturar todos os dados (forward fill aplicado)
- [x] Reprocessar planilhas 2024 e 2023 completamente (1.205 videoaulas processadas)
- [x] Validar contagem final contra planilhas originais (1.887 videoaulas totais no sistema)

## 🔧 Resolver Limite de 1000 Videoaulas

- [x] Investigar onde o limite de 1000 está sendo aplicado (frontend, linha 45 de Videoaulas.tsx)
- [x] Verificar se é limitação do MySQL driver ou query (não, era limite hardcoded no frontend)
- [x] Corrigir para exibir todas as 1.887 videoaulas (limite aumentado de 1000 para 10000)
- [x] Validar contagem correta na página de Videoaulas (1887 exibidas corretamente)

## 📊 Gráficos Interativos de Visualização

- [x] Instalar biblioteca de gráficos (Recharts)
- [x] Criar gráfico de barras: Distribuição de videoaulas por ano
- [x] Criar gráfico de pizza: Cobertura de acessibilidade (Libras, Audiodescrição, CC)
- [x] Criar gráfico de linha: Evolução temporal de videoaulas
- [x] Criar gráfico de barras empilhadas: Videoaulas por ano e bimestre
- [x] Adicionar página de Visualizações no menu de navegação
- [x] Testar interatividade e responsividade dos gráficos

## 🎨 Ajustar Cores e Visibilidade dos Gráficos

- [x] Ajustar cores dos gráficos para melhor contraste com tema escuro
- [x] Melhorar visibilidade das labels e legendas
- [x] Garantir que texto seja legível em ambos os temas (claro e escuro)
- [x] Validar contraste em todos os gráficos

## 🐛 Corrigir Contagem de Cursos nas Disciplinas

- [x] Investigar por que disciplinas do ciclo básico mostram "+8 outros cursos" ou "+9 outros cursos" incorretamente
- [x] Corrigir lógica de contagem de cursos associados
- [x] Validar que disciplinas compartilhadas mostram contagem correta

## 🔐 Sistema Administrativo Completo

### Sistema de Permissões
- [x] Adicionar campo `role` na tabela de usuários (admin/user) - JÁ EXISTIA
- [x] Criar middleware `adminProcedure` no backend para proteger rotas administrativas - JÁ EXISTIA
- [x] Implementar verificação de permissões no frontend (AuthContext + useAuth hook)

### Painel Administrativo
- [x] Criar layout AdminLayout com navegação lateral
- [x] Criar página inicial do painel admin (/admin)
- [x] Adicionar menu de navegação com seções: Videoaulas, Disciplinas, Cursos, Professores, Designers

### CRUD de Videoaulas
- [x] Criar página de listagem de videoaulas (/admin/videoaulas)
- [x] Criar formulário de criação de videoaula
- [x] Criar formulário de edição de videoaula
- [x] Implementar exclusão de videoaula com confirmação (AlertDialog)
- [x] Adicionar procedures no backend: createVideoaula, updateVideoaula, deleteVideoaula
- [x] Validar campos obrigatórios e formatos

### CRUD de Disciplinas
- [x] Criar página de listagem de disciplinas (/admin/disciplinas)
- [x] Criar formulário de criação de disciplina
- [x] Criar formulário de edição de disciplina
- [x] Implementar exclusão de disciplina com confirmação
- [x] Gerenciar associações disciplina-curso (many-to-many)
- [x] Adicionar procedures no backend: createDisciplina, updateDisciplina, deleteDisciplina

### CRUD de Cursos
- [ ] Criar página de listagem de cursos (/admin/cursos)
- [ ] Criar formulário de criação de curso
- [ ] Criar formulário de edição de curso
- [ ] Implementar exclusão de curso com confirmação
- [ ] Adicionar procedures no backend: createCurso, updateCurso, deleteCurso

### CRUD de Professores
- [x] Criar página de listagem de professores (/admin/professores)
- [x] Criar formulário de criação de professor
- [x] Criar formulário de edição de professor
- [x] Implementar exclusão de professor com confirmação
- [x] Adicionar procedures no backend: createProfessor, updateProfessor, deleteProfessor

### CRUD de Designers Instrucionais
- [ ] Criar página de listagem de designers (/admin/designers)
- [ ] Criar formulário de criação de designer
- [ ] Criar formulário de edição de designer
- [ ] Implementar exclusão de designer com confirmação
- [ ] Adicionar procedures no backend: createDesigner, updateDesigner, deleteDesigner

### Melhorias de UX
- [ ] Adicionar mensagens de sucesso/erro (toast notifications)
- [ ] Implementar loading states em formulários
- [ ] Adicionar confirmação antes de exclusões
- [ ] Implementar busca e filtros nas listagens administrativas
- [ ] Adicionar paginação nas tabelas administrativas

## 📝 Implementar Formulário de Edição de Videoaulas

- [x] Criar página EditarVideoaula.tsx (/admin/videoaulas/:id/editar)
- [x] Carregar dados existentes da videoaula via trpc.videoaulas.getById
- [ ] Preencher formulário com dados existentes
- [ ] Implementar atualização via trpc.admin.videoaulas.update
- [ ] Adicionar rota no App.tsx
- [ ] Testar edição e validar funcionamento

## 🐛 Corrigir Erro de Select.Item Vazio

- [x] Identificar Select.Item com value vazio em NovaVideoaula.tsx (linhas 255 e 277)
- [x] Corrigir para usar value não-vazio ou filtrar itens vazios (alterado para value="0")
- [x] Testar formulário de nova videoaula

## 📚 CRUD de Disciplinas e Professores

### CRUD de Professores
- [x] Criar backend procedures (create, update, delete) para professores
- [x] Criar helpers no db.ts para CRUD de professores
- [x] Criar página de listagem de professores (/admin/professores)
- [x] Criar formulário de criação de professor
- [x] Criar formulário de edição de professor
- [x] Implementar exclusão com confirmação
- [x] Testar fluxo completo

### CRUD de Disciplinas
- [x] Criar backend procedures (create, update, delete) para disciplinas
- [x] Criar helpers no db.ts para CRUD de disciplinas
- [x] Criar página de listagem de disciplinas (/admin/disciplinas)
- [x] Criar formulário de criação de disciplina com seleção múltipla de cursos
- [x] Criar formulário de edição de disciplina
- [x] Implementar gestão de relacionamento many-to-many com cursos
- [x] Implementar exclusão com confirmação
- [x] Testar fluxo completo


## 🎯 CRUD de Designers Instrucionais e Cursos (Sessão Atual)

### Backend - Procedures
- [x] Adicionar procedures de Designers Instrucionais (create, update, delete)
- [x] Adicionar procedures de Cursos (create, update, delete)

### Frontend - CRUD de Designers Instrucionais
- [x] Criar página de listagem (/admin/designers)
- [x] Criar formulário de criação
- [x] Criar formulário de edição
- [x] Implementar exclusão com confirmação
- [x] Adicionar rota no App.tsx
- [x] Testar fluxo completo

### Frontend - CRUD de Cursos
- [x] Criar página de listagem (/admin/cursos)
- [x] Criar formulário de criação (eixo + nome)
- [x] Criar formulário de edição
- [x] Implementar exclusão com confirmação
- [x] Adicionar rota no App.tsx
- [x] Testar fluxo completo


## 🔍 Filtros Avançados na Listagem Administrativa de Videoaulas

- [x] Adicionar dropdown de filtro por curso
- [x] Adicionar dropdown de filtro por disciplina
- [x] Adicionar dropdown de filtro por ano (já existia)
- [x] Adicionar dropdown de filtro por bimestre (já existia)
- [x] Implementar botão "Limpar Filtros"
- [x] Atualizar contador de resultados com filtros aplicados
- [x] Testar combinações de filtros
- [x] Validar funcionamento completo
