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
