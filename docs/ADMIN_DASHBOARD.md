# 📊 Dashboard Administrativo - Documentação

## Visão Geral

O painel administrativo foi aprimorado com infográficos e estatísticas em tempo real para monitoramento eficiente do sorteio durante a feira.

---

## 🎯 Cards de Estatísticas (Topo)

### 1. Total de Participantes (Azul)
- **Ícone**: Users + TrendUp
- **Métrica**: Número total de pessoas que participaram
- **Cor**: Gradiente azul (#2563EB → #1E3A8A)
- **Informação**: Contagem simples e direta

### 2. Ganhadores (Verde)
- **Ícone**: CheckCircle + Gift
- **Métrica**: Quantidade de pessoas que ganharam
- **Percentual**: Taxa de vitória sobre o total
- **Cor**: Gradiente verde (#16A34A → #15803D)
- **Exemplo**: "12 ganhadores (24.5% de vitórias)"

### 3. Sem Prêmio (Vermelho)
- **Ícone**: XCircle + ChartBar
- **Métrica**: Quantidade de pessoas que não ganharam
- **Percentual**: Taxa sobre o total de participantes
- **Cor**: Gradiente vermelho (#DC2626 → #991B1B)
- **Propósito**: Transparência sobre tentativas sem sucesso

### 4. Prêmios Restantes (Amarelo/Laranja)
- **Ícone**: Gift
- **Métrica**: Bombons ainda disponíveis
- **Status**: "Disponível" ou "Esgotado"
- **Cor**: Gradiente amarelo-laranja (#CA8A04 → #EA580C)
- **Info adicional**: Quantidade já distribuída

---

## 📈 Seção de Análise Detalhada

### Resumo Rápido (Acima da Tabela)
Grid 2x2 (ou 4 colunas em desktop) com:

1. **Última Participação**
   - Horário do último cadastro
   - Formato: HH:MM

2. **Taxa de Vitória**
   - Percentual calculado em tempo real
   - Comparação com meta teórica de 25%

3. **Emails Únicos**
   - Detecta participações duplicadas
   - Set() para contar emails distintos

4. **Com Telefone**
   - Quantos preencheram telefone (opcional)
   - Percentual de engajamento extra

---

## 📊 Infográficos de Distribuição

### 1. Dispositivos Utilizados
**Localização**: Abaixo da tabela, primeira coluna

**Métricas mostradas**:
- Desktop
- Mobile
- Tablet
- Outros

**Visualização**:
- Barra horizontal azul
- Número absoluto à direita
- Percentual visual na barra

**Como funciona**:
```javascript
// Agrupa por tipo de dispositivo
const devices = submissions.reduce((acc, sub) => {
  const device = sub.systemInfo?.device || "desktop";
  acc[device] = (acc[device] || 0) + 1;
  return acc;
}, {});
```

### 2. Navegadores Mais Usados
**Localização**: Abaixo da tabela, segunda coluna

**Métricas mostradas**:
- Chrome
- Firefox
- Safari
- Edge
- Opera
- Outros

**Ordenação**: Decrescente (mais usado primeiro)
**Limite**: Top 5 navegadores
**Cor da barra**: Verde

### 3. Sistemas Operacionais
**Localização**: Abaixo da tabela, terceira coluna

**Métricas mostradas**:
- Windows
- Android
- iOS
- macOS
- Linux

**Ordenação**: Decrescente
**Cor da barra**: Roxo

---

## 🍰 Gráfico de Pizza (Circular)

### Distribuição de Resultados

**Localização**: Seção "Análise Geral", lado esquerdo

**Componente**: SVG Circle com stroke-dasharray
**Cores**:
- Verde (#10B981): Ganhadores
- Cinza (#374151): Não ganhadores

**Centro do gráfico**:
- Percentual grande (32px, bold)
- Label "Vitórias" (14px, cinza)

**Legenda lateral**:
- ✅ Verde: "X Ganharam - Receberam prêmios"
- ⬜ Cinza: "X Não Ganharam - Tentaram a sorte"

**Cálculo do arco**:
```javascript
// Circunferência = 2 * π * r = 2 * π * 80 = 502.4
const winPercentage = (winners / total) * 100;
const arcLength = (winPercentage / 100) * 502.4;
```

---

## 📉 Métricas de Engajamento

### Localização: Seção "Análise Geral", lado direito

### 1. Barra "Preencheram Telefone"
- **Cor**: Azul (#3B82F6)
- **Métrica**: % de participantes que forneceram telefone
- **Importância**: Mede nível de confiança/engajamento

### 2. Barra "Taxa de Sucesso"
- **Cor**: Verde (#10B981)
- **Métrica**: % de ganhadores
- **Meta teórica**: 25% (indicado abaixo)
- **Propósito**: Validar se o sorteio está justo

### 3. Totalizadores
- Participações totais
- Emails únicos (detecta duplicatas)

---

## 🎨 Paleta de Cores Utilizada

| Elemento | Cor | Hex Code |
|----------|-----|----------|
| Fundo principal | Cinza escuro | #111827 |
| Cards | Cinza médio | #1F2937 |
| Participantes | Azul | #2563EB |
| Ganhadores | Verde | #16A34A |
| Sem prêmio | Vermelho | #DC2626 |
| Prêmios | Amarelo-Laranja | #CA8A04 |
| Barras navegador | Verde | #10B981 |
| Barras sistema | Roxo | #8B5CF6 |
| Barras dispositivo | Azul | #3B82F6 |

---

## 🔄 Atualizações em Tempo Real

Todas as métricas são calculadas dinamicamente a partir do array `submissions`:

```javascript
// Exemplo de cálculo reativo
const totalParticipants = submissions.length;
const winners = submissions.filter(s => s.wonPrize).length;
const winRate = (winners / totalParticipants) * 100;
```

**Firebase Realtime Database** garante que:
- Novos participantes aparecem instantaneamente
- Estatísticas se atualizam automaticamente
- Não precisa refresh manual

---

## 📱 Responsividade

### Desktop (lg: 1024px+)
- Cards: 4 colunas
- Infográficos: 3 colunas
- Análise geral: 2 colunas

### Tablet (md: 768px - 1023px)
- Cards: 2 colunas
- Infográficos: 2 colunas
- Análise geral: 1 coluna

### Mobile (< 768px)
- Cards: 1 coluna (stack vertical)
- Infográficos: 1 coluna
- Análise geral: 1 coluna

---

## 💡 Insights que os Infográficos Fornecem

### Para a Equipe durante a Feira:

1. **Engajamento em Tempo Real**
   - Ver quando a feira está mais movimentada
   - Identificar picos de participação

2. **Perfil do Público**
   - Dispositivos mais usados (mobile vs desktop)
   - Sistemas operacionais prevalentes
   - Navegadores preferidos

3. **Validação do Sorteio**
   - Taxa de vitória próxima aos 25% teóricos = justo
   - Desvios significativos = investigar

4. **Controle de Estoque**
   - Prêmios restantes visível o tempo todo
   - Alerta visual quando acabar

5. **Qualidade dos Dados**
   - % que fornece telefone = confiança do público
   - Emails únicos vs total = detecta tentativas múltiplas

---

## 🎯 Melhorias Futuras Possíveis

### Gráficos Adicionais:
- 📈 Linha do tempo (participações por hora)
- 📊 Histograma de horários de pico
- 🗺️ Mapa de calor (se coletar localização)

### Exportação:
- 📄 Botão para exportar CSV
- 📊 Gerar PDF com relatório
- 📧 Enviar resumo por email

### Filtros:
- 🔍 Filtrar por período
- 🏆 Ver apenas ganhadores
- 📱 Filtrar por dispositivo

---

## 🛠️ Tecnologias Utilizadas

- **React Hooks**: useState, useEffect
- **SVG**: Gráficos customizados
- **Tailwind CSS**: Estilização responsiva
- **Phosphor Icons**: Ícones modernos
- **Firebase**: Dados em tempo real
- **TypeScript**: Type safety

---

## 📚 Como Usar Durante a Feira

1. **Login**: Acesse `/admin` com o e-mail e a senha da conta de admin (veja `SEGURANCA_ADMIN.md`)
2. **Monitore**: Deixe o painel aberto durante o evento
3. **Observe**: Cards de estatísticas mostram visão geral
4. **Analise**: Role para baixo para ver detalhes técnicos
5. **Ajuste**: Use o controle de prêmios se necessário

**Dica**: Use em tablet ou notebook para melhor visualização! 📱💻

---

**Desenvolvido para ENTEC 2025 - UNIUBE Campus Aeroporto** 🎓
