# 🎯 Guia Rápido para a Feira - ENTEC 2025

## 📱 Como Funciona o Projeto

### Fluxo do Usuário

1. **Visitante acessa o site** (via QR Code ou link direto)
2. **Vê o sorteio relâmpago** com cronômetro e promessa de ganhar bombom
3. **Preenche o formulário** com nome, email e telefone (opcional)
4. **Recebe o alerta** revelando que caiu em um golpe educacional
5. **É direcionado para a página de conscientização** com explicações detalhadas
6. **Após 8 segundos** de leitura, aparece o modal do sorteio VERDADEIRO
7. **Resultado do sorteio**:
   - ✅ **Ganhou (25% de chance)**: Mostra a tela para a equipe e resgata o bombom
   - ❌ **Não ganhou**: Recebe mensagem educativa

---

## 🎪 Preparação para a Feira

### Materiais Necessários

- [ ] **30 bombons Sonho de Valsa** (ou mais se esperar muita demanda)
- [ ] **QR Code impresso** grande e visível
- [ ] **Cartaz explicativo** chamativo
- [ ] **Tablet/notebook** para mostrar o painel admin
- [ ] **Conexão com internet** estável

### Sugestão de Cartaz

```
┌─────────────────────────────────┐
│  🎁 SORTEIO RELÂMPAGO! 🎁       │
│                                 │
│  Ganhe um Sonho de Valsa!       │
│  É só escanear o QR Code!       │
│                                 │
│      [QR CODE AQUI]            │
│                                 │
│  ⚡ Rápido e fácil!             │
│  📱 Escaneie agora!             │
└─────────────────────────────────┘
```

---

## 🔐 Painel Administrativo

### Acessar o Painel

1. Abra: `https://seu-site.com/admin`
2. Digite a senha configurada no `.env.local`
3. Mantenha aberto durante a feira

### O que você vê no painel:

- **Prêmios restantes**: Quantidade de bombons disponíveis
- **Participantes**: Lista em tempo real com:
  - Nome do participante
  - Email
  - Telefone
  - Sistema operacional e navegador
  - Horário de participação
  - Se ganhou ou não

### Controle de Estoque

1. Inicie com 30 prêmios (ou a quantidade que você tiver)
2. O sistema decrementa automaticamente a cada vitória
3. Você pode ajustar manualmente se necessário

---

## 🎲 Sistema de Sorteio

### Regras

- ✅ **25% de chance** de ganhar (1 em 4)
- ✅ **1 participação por pessoa** (controlado por autenticação anônima do Firebase)
- ✅ **Limite de prêmios**: Quando acabam os bombons, o sorteio continua mas avisa que não há mais prêmios

### Resgate do Prêmio

Quando alguém ganhar:
1. A pessoa verá uma mensagem de vitória no modal
2. Peça para **mostrar a tela do celular** com a mensagem de vitória
3. Confira no painel admin se realmente ganhou (precaução contra fraude)
4. Entregue o bombom! 🍫

---

## 💬 Como Apresentar o Projeto

### Pitch Rápido (30 segundos)

> "Nosso projeto é uma experiência interativa que ensina sobre segurança digital. Simulamos um sorteio falso para capturar dados e depois revelamos os perigos dessa prática. É divertido, educativo, e no final tem um sorteio de verdade de bombons!"

### Explicação Completa (2-3 minutos)

1. **Contexto**: "Golpes de sorteios falsos são extremamente comuns nas redes sociais e WhatsApp"

2. **Demonstração**: "Veja como é fácil criar um site que parece legítimo" (mostre o site)

3. **Perigo**: "Coletamos apenas nome e email, mas golpistas reais usam esses dados para spam, phishing e até roubo de identidade"

4. **Educação**: "Após a 'pegadinha', ensinamos como identificar sorteios falsos e se proteger"

5. **Gamificação**: "E para tornar mais engajador, fazemos um sorteio verdadeiro de bombons!"

6. **Tecnologia**: "Usamos Next.js, TypeScript, Firebase e Tailwind CSS"

---

## 🚨 Resolução de Problemas

### "Já participei e quero tentar de novo"
> "O sistema permite apenas uma participação por dispositivo para garantir que todos tenham chance igual. Mas você pode trazer um amigo!"

### "Não ganhei, posso tentar de novo?"
> "Infelizmente não, mas você ganhou algo mais importante: conhecimento sobre segurança digital!"

### "O site não carrega"
> Verifique:
> - Conexão com internet
> - Se o Firebase está configurado corretamente
> - Se o site foi deployado (Vercel)

### "Os prêmios acabaram"
> "Os bombons acabaram, mas o objetivo educacional foi alcançado! Obrigado por participar."

---

## 📊 Estatísticas para Acompanhar

Durante a feira, anote:
- [ ] Total de participantes
- [ ] Quantos ganharam prêmios
- [ ] Taxa de engajamento (pessoas que escanearam vs. que completaram)
- [ ] Feedback dos visitantes
- [ ] Perguntas mais frequentes

---

## 🎓 Pontos Educacionais Importantes

### Dados que NÃO coletamos (destaque isso!)
- ❌ CPF
- ❌ Senhas
- ❌ Dados bancários
- ❌ Endereço completo
- ❌ Informações sensíveis

### Por que isso é seguro
- ✅ Projeto educacional
- ✅ Dados mínimos e não sensíveis
- ✅ Conforme LGPD
- ✅ Transparente sobre o propósito

---

## 📞 Contatos de Emergência

Durante a feira, tenha à mão:

- **Email do Firebase**: [seu-email]
- **Link do GitHub**: [repositório]
- **Link do site**: [URL da Vercel]
- **Senha do admin**: [guarde em local seguro]

---

## ✨ Dicas para Engajar Mais Visitantes

1. **Seja entusiasta**: "Quer ganhar um bombom de graça? É super rápido!"
2. **Mostre o painel**: Visitantes adoram ver estatísticas em tempo real
3. **Explique depois**: Primeiro deixe eles experimentarem, depois explique a tecnologia
4. **Conte histórias**: "Já tivemos X pessoas participando e Y ganharam!"
5. **Seja honesto**: "É um projeto educacional sobre segurança, mas o bombom é de verdade!"

---

## 🎉 Boa Sorte na Feira!

Lembre-se: o objetivo principal é **educar sobre segurança digital** de forma divertida e interativa. Os bombons são apenas o incentivo! 🍫

**Divirta-se e aproveite!** 🚀
