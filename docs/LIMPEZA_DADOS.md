# 🗑️ Sistema de Limpeza de Dados - Documentação

## Visão Geral

Sistema seguro para limpar dados de teste do Firebase antes do evento começar, com múltiplas camadas de proteção contra exclusões acidentais.

---

## 🔒 Camadas de Segurança

### 1. Autenticação
- ✅ Requer login com senha no painel admin
- ✅ Apenas administradores autenticados têm acesso

### 2. Modal de Confirmação
- ✅ Popup destacado em vermelho
- ✅ Ícone de alerta ⚠️
- ✅ Listagem clara do que será excluído

### 3. Confirmação Textual
- ✅ Usuário deve digitar "LIMPAR" manualmente
- ✅ Botão desabilitado até confirmação correta
- ✅ Previne cliques acidentais

### 4. Avisos Visuais
- 🔴 **Vermelho**: Perigo, ação destrutiva
- 🟡 **Amarelo**: Dica de uso apropriado
- ⚠️ **Ícones**: Reforçam a gravidade da ação

---

## 📋 O Que É Excluído

### Dados Removidos:
1. **Todas as submissões** (`/submissions`)
   - Nome, email, telefone
   - Timestamps
   - Informações de sistema

2. **Todos os participantes** (`/participants`)
   - Registros de quem já jogou
   - Status de prêmios ganhos

### Dados Preservados:
- ✅ **Contagem de prêmios** (`/prizes/remaining`)
- ✅ **Configurações do Firebase**
- ✅ **Regras de segurança**

---

## 🎯 Quando Usar

### ✅ Situações Apropriadas:

1. **Antes da Feira Começar**
   - Limpar testes feitos durante desenvolvimento
   - Reset para começar com dados limpos

2. **Entre Dias do Evento**
   - Se o evento durar vários dias
   - Recomeçar contagem diária

3. **Após Demo/Teste**
   - Remover participações de demonstração
   - Apresentações para avaliadores

### ❌ NÃO Use Durante:

1. **Durante o evento ativo**
   - Perde dados de participantes reais
   - Não há como recuperar

2. **Se houver ganhadores pendentes**
   - Pode gerar confusão sobre quem ganhou
   - Perda de registro de prêmios distribuídos

3. **Para testes isolados**
   - Use Firebase Console para exclusões específicas
   - Evite limpar tudo por um único teste

---

## 🔧 Como Usar

### Passo a Passo:

1. **Acesse o Painel Admin**
   ```
   https://seu-site.com/admin
   ```

2. **Faça Login**
   - Digite a senha configurada

3. **Localize o Botão**
   - Seção "Controle de Prêmios"
   - Canto direito: "Limpar Dados de Teste"

4. **Clique no Botão Vermelho**
   - Modal de confirmação aparecerá

5. **Leia os Avisos**
   - Quantidade de participações
   - Alertas de irreversibilidade

6. **Digite "LIMPAR"**
   - Exatamente assim, em maiúsculas
   - Campo aceita apenas texto exato

7. **Confirme a Exclusão**
   - Clique em "Excluir Tudo"
   - Aguarde a confirmação

8. **Verifique**
   - Dashboard deve mostrar 0 participantes
   - Tabela vazia

---

## 💻 Implementação Técnica

### Função Firebase (`lib/firebase.tsx`):

```typescript
export const clearAllData = async () => {
  const submissionsRef = ref(database, "submissions");
  const participantsRef = ref(database, "participants");
  
  await set(submissionsRef, null);
  await set(participantsRef, null);
};
```

### Estados React (`admin/page.tsx`):

```typescript
const [showClearModal, setShowClearModal] = useState(false);
const [clearConfirmText, setClearConfirmText] = useState("");
```

### Validação:

```typescript
if (clearConfirmText !== "LIMPAR") {
  alert("Digite 'LIMPAR' para confirmar a exclusão.");
  return;
}
```

---

## 🎨 Interface do Modal

### Elementos Visuais:

1. **Background Escuro**
   - `bg-black/80` com blur
   - Destaca o modal

2. **Border Vermelho**
   - `border-2 border-red-500`
   - Cor de perigo

3. **Ícone de Alerta**
   - Warning (Phosphor Icons)
   - 40px, vermelho

4. **Boxes Informativos**:
   - 🔴 Vermelho: Aviso irreversível
   - 🟡 Amarelo: Dica de uso

5. **Input de Confirmação**:
   - Font mono para clareza
   - Auto-focus ao abrir
   - Transforma em maiúsculas automaticamente

6. **Botões**:
   - Cinza: Cancelar (seguro)
   - Vermelho: Excluir (destrutivo)
   - Desabilitado até confirmação

---

## 📊 Estatísticas Mostradas no Modal

```javascript
<li>Todas as {submissions.length} participações</li>
```

- Número dinâmico
- Mostra exatamente quantos registros serão perdidos
- Ajuda na decisão consciente

---

## 🚨 Tratamento de Erros

### Try-Catch:

```typescript
try {
  await clearAllData();
  alert("Todos os dados foram removidos com sucesso!");
} catch (e) {
  console.error("Erro ao limpar dados:", e);
  alert("Erro ao limpar os dados. Verifique o console.");
}
```

### Possíveis Erros:

1. **Permissões Firebase**
   - Verificar regras de segurança
   - Admin deve ter permissão de escrita

2. **Conexão Internet**
   - Operação requer conexão ativa
   - Retry automático do Firebase

3. **Timeout**
   - Se muitos dados, pode demorar
   - Firebase gerencia automaticamente

---

## 🔄 Após a Limpeza

### O Que Acontece:

1. **Dashboard Atualiza**
   - Firebase Realtime atualiza interface
   - Cards mostram 0 participantes

2. **Gráficos Vazios**
   - Dispositivos: sem dados
   - Navegadores: sem dados
   - Sistemas: sem dados

3. **Tabela Vazia**
   - Nenhuma linha exibida
   - Pronto para novos participantes

4. **Prêmios Intactos**
   - Contagem NÃO é afetada
   - Continue com o estoque atual

---

## 💡 Boas Práticas

### Antes de Limpar:

1. **Backup Manual** (Opcional)
   ```
   Firebase Console → Realtime Database → Export JSON
   ```

2. **Avise a Equipe**
   - Comunique outros administradores
   - Evite confusão

3. **Verifique o Momento**
   - Nenhum participante ativo
   - Não há fila de pessoas esperando

### Depois de Limpar:

1. **Confirme a Limpeza**
   - Verifique se dashboard está zerado
   - Teste uma participação nova

2. **Ajuste Prêmios se Necessário**
   - Reset para quantidade inicial
   - Ex: 30 bombons

3. **Comunique o Reset**
   - Informe que sistema está pronto
   - Nova contagem iniciada

---

## 🆘 Recuperação de Dados

### ⚠️ IMPORTANTE:
**NÃO HÁ RECUPERAÇÃO AUTOMÁTICA!**

### Opções Limitadas:

1. **Backup Manual Prévio**
   - Se você exportou JSON antes
   - Importar de volta no Firebase Console

2. **Firebase Backup Automatizado**
   - Se configurado previamente
   - Consultar Google Cloud backups

3. **Não Configurado = Perda Total**
   - Por isso as múltiplas confirmações!

---

## 🎯 Alternativas à Limpeza Total

### Se Precisa Remover Apenas Alguns Dados:

1. **Firebase Console**
   - Acesse: console.firebase.google.com
   - Navegue até Realtime Database
   - Exclua itens específicos manualmente

2. **Função de Exclusão Específica** (Future)
   - Adicionar botão para excluir por ID
   - Exclusão cirúrgica de testes

3. **Filtros no Dashboard**
   - Criar flag "isTest" nas submissões
   - Filtrar visualização sem excluir

---

## 📝 Checklist Pré-Feira

Antes do evento começar:

- [ ] Testar todo o fluxo (sorteio, admin, etc)
- [ ] Usar botão "Limpar Dados de Teste"
- [ ] Confirmar dashboard zerado
- [ ] Configurar prêmios para quantidade inicial
- [ ] Testar 1 participação real
- [ ] Verificar se aparece no admin
- [ ] Sistema pronto! ✅

---

## 🛡️ Segurança Firebase

### Regras Recomendadas:

```json
{
  "rules": {
    "submissions": {
      ".read": "auth.uid != null",
      ".write": "auth.uid != null"
    },
    "participants": {
      ".read": "auth.uid != null",
      ".write": "auth.uid != null"
    },
    "prizes": {
      ".read": true,
      ".write": "auth.uid != null"
    }
  }
}
```

- Apenas usuários autenticados podem escrever
- Protege contra exclusões não autorizadas
- Mesmo anônimos precisam de auth token

---

## 🎓 Resumo

| Característica | Status |
|----------------|--------|
| Múltiplas confirmações | ✅ |
| Aviso visual claro | ✅ |
| Proteção contra acidentes | ✅ |
| Preserva contagem de prêmios | ✅ |
| Reversível | ❌ (por design) |
| Tempo de execução | ~1-2 segundos |
| Requer conexão | ✅ |

---

**Desenvolvido para ENTEC 2025 - UNIUBE Campus Aeroporto** 🎓

**Use com responsabilidade!** ⚠️
