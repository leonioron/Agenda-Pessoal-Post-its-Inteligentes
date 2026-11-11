# Agenda Pessoal & Quadro de Tarefas com Post-its Inteligentes

Sistema completo e local para gestão de rotina diária e semanal, combinando um quadro tátil de post-its para o dia a dia, visualizador de atividades da semana e um motor inteligente de recorrência espaçada que agenda automaticamente o próximo lembrete assim que uma tarefa é finalizada (ex.: banho do cachorro a cada 15 dias).

---

### User Review & Critical Decisions

> [!IMPORTANT]
> **Decisões de Design e Experiência Propostas para sua Avaliação:**
>
> 1. **Mecanismo de Recorrência Espaçada ("Lembrar Novamente")**:
>    - Ao concluir qualquer tarefa (ou clicar em seu botão de conclusão/lembrete), um modal/popover rápido oferece presets imediatos (`+3 dias`, `+7 dias`, `+15 dias`, `+30 dias` ou data customizada).
>    - Também é possível pré-configurar um intervalo padrão no cadastro da tarefa (ex: "Banho do Totó" já configurado para repetir a cada 15 dias), de modo que um simples clique arquiva a atual e projeta a próxima na agenda da semana correspondente.
> 2. **Layout Híbrido em Duas Visões Integradas**:
>    - **Quadro de Post-its Diários**: Notas adesivas coloridas (amarelo canário, verde menta, rosa suave, azul céu, lavanda, pêssego) com rotação sutil, marcação de prioridade, checklist e arrastar/reordenar.
>    - **Agenda Semanal Dinâmica**: Painel com navegação de semana (7 colunas de Segunda a Domingo com destaque para "Hoje"), agrupando compromissos com horário, prazos e lembretes automáticos gerados por tarefas concluídas.
> 3. **Persistência 100% Local (Local First)**:
>    - Armazenamento em `localStorage` com suporte a exportação e importação de backup em JSON, garantindo que nenhum dado saia do seu navegador e funcione perfeitamente offline.

---

### 1. Overview & Core Concept

- **O que faz**: Oferece uma central integrada de produtividade pessoal que une o aspecto tátil e visual de post-its de geladeira/mesa de trabalho com o rigor de uma agenda semanal e o acompanhamento de tarefas periódicas da vida doméstica e pessoal (cuidados com pets, manutenção da casa, exames, revisões e estudos).
- **Público-alvo**: Usuários que buscam organizar o dia sem sobrecarga de sistemas complexos, priorizando simplicidade, clareza visual e automação de hábitos recorrentes.
- **Valor Principal**: Elimina o esquecimento de tarefas não diárias (aquelas que acontecem de tempos em tempos) através da renovação contínua de lembretes no momento do cumprimento.

---

### 2. User Experience & Visual Design

#### A. Fluxos Principais do Usuário
1. **Adicionar Post-it Rápido**: Clique rápido em "+ Novo Post-it", escolha de cor do post-it, título, tags opcionais, horário limite (se houver) e regra de recorrência opcional.
2. **Concluir Tarefa e Ativar "Lembrar Novamente"**: Ao clicar no checkbox de conclusão, a nota recebe feedback visual imediato (riscado + confete sutil) e exibe o gatilho: *"Reagendar próxima ocorrência?"* com botões de 1 clique (`7 dias`, `15 dias`, `30 dias` ou data customizada). A nova ocorrência é automaticamente adicionada ao dia correto da Agenda Semanal.
3. **Navegar na Agenda Semanal**: Visualizar de segunda a domingo todos os compromissos agendados, com badges de status, contagem de tarefas e botão para adicionar direto no dia desejado.
4. **Filtros e Busca em Tempo Real**: Segmentação por categorias (Pessoal, Casa, Pet, Trabalho, Saúde) e busca instantânea por texto.

#### B. Identidade Visual & Tema
- **Direção Estética**: Minimalismo moderno e acolhedor (warm paper aesthetic), combinando a textura leve de post-its com tipografia nítida e espaçamentos generosos.
- **Paleta de Cores**:
  - Fundo principal: Bege/creme suave neutro (`#FDFBF7` / Dark: `#18181B`)
  - Cores dos Post-its: Amarelo Sol (`#FEF08A`), Menta Fresca (`#BBF7D0`), Pêssego (`#FED7AA`), Azul Céu (`#BAE6FD`), Lavanda (`#E9D5FF`), Rosa Coral (`#FECDD3`)
  - Acentos funcionais: Grafite neutro (`#1E293B`), Verde esmeralda para concluídos (`#16A34A`), Âmbar para hoje (`#D97706`)
- **Tipografia**:
  - Cabeçalhos e Títulos: *Plus Jakarta Sans* (moderna e com peso visual elegante)
  - Corpo e Post-its: *DM Sans* e fonte manuscrita leve opcional para títulos de notas (*Caveat* / handwriting touch sutil)
  - Horários e Prazos: *JetBrains Mono* / `tabular-nums` para alinhamento uniforme.
- **Interações & Movimento**:
  - Micro-interações ao pairar (elevação suave do post-it com sombra difusa).
  - Animação suave de transição entre dias e semanas.
  - Alternância de visualização rápida: "Quadro de Post-its", "Agenda Semanal" ou "Visão Dividida (Split Screen)".

---

### 3. Key Product Decisions & Trade-Offs

| Decisão | Opção Escolhida | Racional & Benefício | Alternativas Descartadas |
| :--- | :--- | :--- | :--- |
| **Persistência** | `localStorage` estruturado + Export/Import JSON | Instantâneo, zero latência, roda 100% offline no navegador sem necessidade de banco em nuvem ou login. | Backend com banco de dados remoto (aumentaria atrito de autenticação sem necessidade para uso individual local). |
| **Recorrência Inteligente** | Janela de agendamento disparada pela conclusão ("Event-Driven Recurrence") | Resolve o problema real do usuário: se o cachorro tomou banho 3 dias atrasado, o próximo banho deve ser 15 dias após o dia em que *realmente* tomou, e não em data fixa rígida. | Recorrência de calendário rígida padrão (que acumula tarefas atrasadas desnecessárias). |
| **Organização dos Post-its** | Grade responsiva flexível com filtros por status e cor | Permite visualização limpa tanto em monitores ultrawide quanto em notebooks e tablets sem sobreposição caótica. | Canvas livre infinito absoluto (tende a perder notas fora da área visível em telas menores). |

---

### 4. Technical Architecture & Data Strategy

#### A. Diagrama de Arquitetura & Componentes

```
┌────────────────────────────────────────────────────────────────────────┐
│                        Agenda Pessoal App (Root)                       │
├────────────────────────────────────────────────────────────────────────┤
│ [TopBar]: Data Atual · Busca · Alternador de Visão · + Novo Post-it   │
├──────────────────────────────────┬─────────────────────────────────────┤
│      VISÃO 1: QUADRO DE POST-ITS  │      VISÃO 2: AGENDA DA SEMANA       │
│ ┌──────────────────────────────┐ │ ┌─────────────────────────────────┐ │
│ │ Filtros: Hoje/Todas/Pendente │ │ │ Barra de Semana (< Semana Atual >) │ │
│ │ Categorias (Casa, Pet, etc.) │ │ ├─────┬─────┬─────┬─────┬───┬───┤ │
│ │                              │ │ │ Seg │ Ter │ Qua │ Qui │Sex│Sáb│Dom│ │
│ │ ┌─────────┐  ┌─────────┐     │ │ ├─────┼─────┼─────┼─────┼───┼───┤ │
│ │ │Post-it 1│  │Post-it 2│ ... │ │ │Event│Event│ ... │Hoje │   │   │ │
│ │ └─────────┘  └─────────┘     │ │ └─────┴─────┴─────┴─────┴───┴───┘ │
│ └──────────────────────────────┘ └─────────────────────────────────┘ │
├────────────────────────────────────────────────────────────────────────┤
│ Modais: [Criar/Editar Post-it] · [Lembrar Novamente / Recorrência]     │
│ Camada de Armazenamento: LocalStorage Engine (Tasks, Events, Settings) │
└────────────────────────────────────────────────────────────────────────┘
```

#### B. Modelo de Dados

- **Item (Task / Post-it)**:
  - `id`: string (uuid)
  - `title`: string
  - `description`: string opcional
  - `color`: string (yellow, green, orange, blue, purple, pink)
  - `date`: string (YYYY-MM-DD)
  - `time`: string opcional (HH:mm)
  - `category`: 'geral' | 'casa' | 'pet' | 'trabalho' | 'saude' | 'estudos'
  - `completed`: boolean
  - `completedAt`: string ISO opcional
  - `recurringConfig`: `{ enabled: boolean; defaultDays: number; label: string }`
  - `checklist`: array de `{ id: string; text: string; done: boolean }`

- **Histórico & Próximas Atividades**:
  - Cálculo dinâmico para a Agenda Semanal alimentada tanto por eventos pontuais quanto pelas tarefas com data agendada.

#### C. Componentes a Implementar
- `App.tsx`: Gestor de estado principal, abas de visualização, motor de sincronização local.
- `PostItBoard.tsx`: Grade responsiva com animações de entrada/saída, rotações angulares dinâmicas (-1.5deg a 1.5deg para realismo) e cards de notas.
- `PostItCard.tsx`: Cartão de nota com botões de ação rápida, cor personalizada, checklist e gatilho de conclusão.
- `WeeklyAgenda.tsx`: Grade dos 7 dias da semana atual com seletor de semana, slots de horários e eventos do dia.
- `RecurrenceModal.tsx`: Diálogo focado para configurar ou disparar o reagendamento espaçado (ex.: "Lembrar daqui a 15 dias").
- `TaskModal.tsx`: Criação e edição de tarefas/compromissos com formulário intuitivo.
- `mockData.ts`: Dados iniciais de demonstração (incluindo "Banho do cachorro", "Regar plantas", "Revisão do carro", "Academia") para que o app já inicialize útil e completo.

---
Pronto para iniciar a implementação assim que você aprovar o plano!
