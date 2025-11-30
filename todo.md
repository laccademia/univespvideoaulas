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
- [ ] README.md principal do projeto
- [ ] Documentação da estrutura do banco de dados
- [ ] Documentação da API (endpoints tRPC)
- [ ] Documentação de instalação e configuração
- [ ] Documentação de estrutura de pastas
- [ ] Documentação de componentes do frontend
- [ ] Guia de contribuição

## 🚀 Deploy e Finalização
- [ ] Criar checkpoint final
- [ ] Publicar no GitHub
- [ ] Preparar para deploy
