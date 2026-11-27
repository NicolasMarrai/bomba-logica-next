# Projeto Sorteio Relâmpago - Conscientização sobre Golpes de Phishing

## Sobre o Projeto

Este é um projeto interativo desenvolvido para a **ENTEC 2025** da **UNIUBE - Campus Aeroporto**.

O objetivo principal é educar e conscientizar os usuários sobre os perigos da **Engenharia Social** através de **sorteios falsos** e **captura de dados pessoais**. A aplicação simula um site de sorteio aparentemente legítimo que, ao capturar os dados do usuário, revela os perigos dessa prática e ensina como identificar e evitar golpes similares.

Após a conscientização, os usuários têm a oportunidade de participar de um sorteio **verdadeiro** de bombons Ouro Branco, demonstrando a diferença entre práticas éticas e golpes.

## Tecnologias Utilizadas

O projeto foi construído com um conjunto de tecnologias modernas para criar uma experiência de usuário rápida, responsiva e interativa:

-   **Framework:** [Next.js](https://nextjs.org/) (com App Router)
-   **Linguagem:** [TypeScript](https://www.typescriptlang.org/)
-   **Estilização:** [Tailwind CSS](https://tailwindcss.com/)
-   **Componentes e Ícones:** [React](https://react.dev/) e [Phosphor Icons](https://phosphoricons.com/)
-   **Backend e Autenticação:** [Firebase](https://firebase.google.com/) (Realtime Database + Auth)
-   **Deployment:** [Vercel](https://vercel.com/)

## Funcionalidades

### 1. Página de Sorteio Falso
- Interface colorida e atraente simulando um sorteio legítimo
- Cronômetro regressivo criando senso de urgência
- Coleta de dados básicos (nome, email, telefone)
- Mensagem de alerta após submissão revelando o perigo

### 2. Página de Conscientização
- Explicação detalhada sobre golpes de sorteios falsos
- Demonstração de como os dados coletados podem ser usados maliciosamente
- Dicas práticas de segurança digital
- Sorteio verdadeiro de bombons após leitura do conteúdo

### 3. Sistema de Sorteio Legítimo
- Sorteio com 25% de chance de ganhar
- Controle de participação única por usuário
- Modal animado com resultado
- Sistema de resgate presencial

### 4. Painel Administrativo
- Visualização de todos os participantes
- Controle de estoque de prêmios em tempo real
- Dados do sistema e horário de participação
- Login com conta do Firebase Authentication e permissão em `/admins`; dados protegidos pelas regras do banco

## 📚 Documentação Adicional

Este projeto possui documentação técnica detalhada na pasta `/docs`:

- **[GUIA_FEIRA.md](GUIA_FEIRA.md)** - 🎯 Guia prático para apresentação na ENTEC
- **[docs/ADMIN_DASHBOARD.md](docs/ADMIN_DASHBOARD.md)** - Documentação do painel administrativo
- **[docs/SEGURANCA_ADMIN.md](docs/SEGURANCA_ADMIN.md)** - Login do admin, regras do banco e passo a passo de configuração
- **[docs/ANIMACOES.md](docs/ANIMACOES.md)** - Sistema completo de animações
- **[docs/LIMPEZA_DADOS.md](docs/LIMPEZA_DADOS.md)** - Manual de limpeza de dados de teste
- **[docs/MUDANCAS.md](docs/MUDANCAS.md)** - Histórico de mudanças do projeto
- **[docs/MELHORIAS_FUTURAS.md](docs/MELHORIAS_FUTURAS.md)** - Sugestões de evolução

## 🚀 Como Executar

### Pré-requisitos
- Node.js 18+ instalado
- Conta no Firebase (Realtime Database configurado)

### Instalação

```bash
# Clone o repositório
git clone https://github.com/NicolasMarrai/bomba-logica-next.git

# Entre na pasta do projeto
cd bomba-logica-next

# Instale as dependências
npm install

# Configure as variáveis de ambiente
# Copie .env.example para .env.local e preencha com as credenciais do Firebase
```

### Executar em Desenvolvimento

```bash
npm run dev
```

Acesse: `http://localhost:3000`

### Build para Produção

```bash
npm run build
npm start
```

## 🎪 Preparação para a ENTEC

Consulte o **[GUIA_FEIRA.md](GUIA_FEIRA.md)** para instruções completas de como:
- Configurar o QR Code
- Preparar o material
- Usar o painel administrativo
- Apresentar o projeto aos visitantes

## 📊 Estrutura do Projeto

```
bomba-logica-next/
├── src/
│   └── app/
│       ├── page.tsx              # Página inicial (sorteio falso)
│       ├── conscientizacao/      # Página educativa
│       └── admin/                # Painel administrativo
├── components/
│   └── ui/                       # Componentes reutilizáveis
├── lib/
│   └── firebase.tsx              # Configuração e funções do Firebase
├── public/                       # Arquivos estáticos (logos, favicons)
├── docs/                         # Documentação técnica detalhada
└── GUIA_FEIRA.md                # Guia prático para a feira
```

## 🔐 Segurança e Privacidade

- Dados coletados: nome, email e telefone (opcional)
- Uso educacional e demonstrativo apenas
- Recomenda-se implementar LGPD compliance para uso em produção real

## 👥 Equipe

**UNIUBE - Campus Aeroporto**  
Projeto desenvolvido para a ENTEC 2025

## 📄 Licença

Este projeto é de código aberto para fins educacionais.

## Convenções de Código

-   **Idioma:** Todos os comentários em **português**
-   **JSDoc:** Documentação completa de funções e componentes
-   **TypeScript:** Tipagem estrita em todo o projeto