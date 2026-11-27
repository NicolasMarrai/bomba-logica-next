# Segurança do painel admin

## Como funciona

- **Login:** e-mail e senha de uma conta do **Firebase Authentication**. A senha é conferida pelos servidores do Firebase e não aparece no código do site.
- **Permissão:** depois do login, o painel só abre se a conta estiver cadastrada em `/admins/<uid>` no Realtime Database.
- **Dados protegidos pelas regras do banco** (`database.rules.json`):
  - nomes, e-mails e telefones (`/submissions`) e participações (`/participants`) só podem ser lidos por admins;
  - cada visitante só cria a própria submissão e a própria participação, uma vez, e não pode marcar o prêmio como resgatado;
  - o estoque de prêmios só pode cair de 1 em 1 (no sorteio) ou ser ajustado por um admin;
  - limpar os dados exige ser admin.

Antes, a senha ficava em `NEXT_PUBLIC_ADMIN_PASSWORD`. Variáveis com prefixo `NEXT_PUBLIC_` vão para o código que o navegador baixa, então qualquer visitante conseguia ler a senha. Essa variável não é mais usada e pode ser apagada da Vercel.

## Passo a passo (uma vez)

1. **Ativar o login por e-mail:** Firebase Console → Authentication → Método de login → **E-mail/senha** → Ativar. Mantenha o **Anônimo** ativado (os visitantes usam).
2. **Criar a conta de admin:** Authentication → Usuários → **Adicionar usuário**, com seu e-mail e uma senha forte. Copie o **UID** da conta criada.
3. **Cadastrar como admin:** Realtime Database → Dados → crie o nó `admins` e, dentro dele, a chave com o UID copiado e o valor `true` (booleano):
   ```
   admins
     └── <UID>: true
   ```
4. **Publicar as regras:** Realtime Database → Regras → cole o conteúdo de `database.rules.json` → **Publicar**.
5. **Variáveis na Vercel:** Settings → Environment Variables → cadastre as variáveis do `.env.example` (ambiente Production) → **Redeploy**.

## Esqueci a senha

Authentication → Usuários → menu da conta → **Redefinir senha** (o Firebase envia um e-mail) ou apague a conta e crie outra (lembre de trocar o UID em `/admins`).

## Limitação conhecida

O sorteio roda no navegador do visitante. Mesmo com as regras, alguém com conhecimento técnico pode forçar `wonPrize: true` na própria participação. Para um sorteio à prova disso, o sorteio precisaria rodar no servidor (por exemplo, uma Cloud Function ou uma rota de API com o Firebase Admin SDK).
