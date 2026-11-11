# 📝 Agenda Pessoal & Post-its Inteligentes

Uma aplicação web moderna, ágil e focada em privacidade (**100% Local-First**) para organizar tarefas do dia a dia e compromissos semanais com o aspecto tátil e acolhedor de notas adesivas (post-its).

Conta com um **motor de recorrência inteligente pós-conclusão**: ao concluir uma tarefa periódica (como dar banho no cachorro, regar plantas ou trocar um filtro), o sistema pergunta quando você quer ser lembrado novamente e já agenda a próxima ocorrência automaticamente no dia correto da semana.

---

## ✨ Funcionalidades Principais

- 📌 **Quadro Tátil de Post-its Diários**:
  - Notas adesivas coloridas (*Amarelo Sol, Menta Fresca, Pêssego Quente, Azul Céu, Lavanda e Rosa Coral*).
  - Inclinação angular sutil e efeito visual de fita adesiva para uma sensação autêntica de papel.
  - Subtarefas / checklist interativo dentro de cada nota.
  - Classificação por prioridade (*Alta, Média, Baixa*) e categoria (*Pet, Casa, Saúde, Trabalho, Estudos, Geral*).
  - Filtros rápidos (*Todas, Para Hoje, Pendentes, Recorrentes, Concluídas*) e busca instantânea por texto.

- 📅 **Agenda Semanal de 7 Dias**:
  - Visualização de Segunda a Domingo com destaque para o dia atual (**Hoje**).
  - Navegação fluida entre semanas (*Anterior, Semana Atual, Próxima*).
  - Botão de adicionar compromisso com hora marcada diretamente na coluna do dia.
  - Contador de atividades por dia e status de conclusão.

- ⏰ **Lembretes com Recorrência Inteligente**:
  - Ao marcar uma tarefa como concluída, abre-se a janela para reagendamento com opções de 1 clique:
    - **+3 dias** (Em breve)
    - **+7 dias** (1 semana)
    - **+15 dias** (Quinzena / Banho do Pet)
    - **+30 dias** (1 mês)
    - **+90 dias** (Trimestral)
    - **Intervalo personalizado em dias** ou **seletor de data no calendário**.
  - A tarefa atual é arquivada como concluída e a nova ocorrência é automaticamente projetada na agenda da semana correspondente.

- 🔒 **100% Local & Privado (Local-First)**:
  - Todas as anotações são salvas diretamente no `localStorage` do seu navegador.
  - Nenhum dado pessoal é transmitido para servidores externos.
  - Ferramenta integrada de **Backup (Exportar e Importar JSON)** para salvar ou transferir suas notas.

- 🌗 **Visões Flexíveis & Modo Escuro**:
  - Alternância rápida entre: **Quadro de Post-its**, **Agenda Semanal** ou **Visão Dividida (Split Screen)**.
  - Suporte completo e com alto contraste a **Modo Claro** e **Modo Escuro**.

---

## 🛠️ Tecnologias Utilizadas

- **React 19** com **TypeScript**
- **Vite 8** (Build tool ultrarrápido)
- **Tailwind CSS v4** (Estilização utilitária e responsiva)
- **Lucide React** (Ícones modernos e consistentes)
- **Motion** (Transições e micro-interações fluidas)

---

## 💻 Como Instalar e Rodar Localmente

### Pré-requisitos
Certifique-se de ter o **Node.js** (versão 18 ou superior) instalado em seu computador.
Você pode verificar abrindo o terminal e digitando:
```bash
node -v
```

---

### Passo a Passo

1. **Baixar ou clonar os arquivos do projeto**:
   ```bash
   git clone <URL_DO_REPOSITORIO>
   cd agenda-pessoal
   ```
   *(Ou descompacte o arquivo zip na pasta de sua preferência e abra o terminal nela).*

2. **Instalar as dependências**:
   Execute o comando abaixo para instalar todas as bibliotecas necessárias:
   ```bash
   npm install
   ```

3. **Iniciar o servidor de desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Acessar a aplicação**:
   Abra o seu navegador de preferência e acesse:
   ```text
   http://localhost:3000
   ```

---

## 🚀 Scripts Disponíveis

No arquivo `package.json`, você encontrará os seguintes scripts:

| Comando | Descrição |
| :--- | :--- |
| `npm run dev` | Inicia o servidor local de desenvolvimento na porta `3000` |
| `npm run build` | Compila o projeto TypeScript e gera os arquivos otimizados para produção na pasta `dist/` |
| `npm run preview` | Permite visualizar localmente o resultado da pasta de produção `dist/` |
| `npm run lint` | Executa a validação de tipos TypeScript sem gerar arquivos (`tsc --noEmit`) |
| `npm run clean` | Remove a pasta de build anterior |

---

## 📂 Estrutura de Pastas do Projeto

```text
├── index.html                 # Ponto de entrada HTML (fontes e metadados)
├── package.json               # Dependências e scripts do projeto
├── vite.config.ts             # Configuração do Vite e Tailwind CSS
├── tsconfig.json              # Configurações do compilador TypeScript
└── src/
    ├── main.tsx               # Montagem da aplicação React
    ├── App.tsx                # Componente raiz, gestão de estado e persistência
    ├── index.css              # Estilos globais e variantes do Tailwind
    ├── types/
    │   └── index.ts           # Interfaces de Tarefa, Cores, Categorias e Visões
    ├── data/
    │   └── initialTasks.ts    # Tarefas de demonstração iniciais
    ├── utils/
    │   ├── dateUtils.ts       # Funções de cálculo de semana, datas relativas e formatação
    │   └── themeUtils.ts      # Paleta tátil dos post-its, categorias e prioridades
    └── components/
        ├── TopBar.tsx          # Cabeçalho, busca, alternador de visão e tema
        ├── PostItBoard.tsx     # Quadro de notas com filtros de status e categorias
        ├── PostItCard.tsx      # Cartão de post-it com checklist e ações rápidas
        ├── WeeklyAgenda.tsx    # Grade semanal de 7 dias com agendamentos
        ├── RecurrenceModal.tsx # Janela para reagendar tarefas concluídas
        ├── TaskModal.tsx       # Janela para criar ou editar post-its
        └── BackupModal.tsx     # Janela para exportar / importar JSON
```

---

## 💾 Dica de Uso & Backup

Como a agenda funciona de forma totalmente local no seu navegador:
- Você não precisa de login ou internet para utilizar o app.
- Recomendamos clicar no ícone de **Escudo / Backup** no canto superior direito periodicamente para exportar um arquivo `.json` das suas tarefas, permitindo guardar uma cópia de segurança ou migrar para outro navegador.
