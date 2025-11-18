# MachPlan AI - Assistente Inteligente de Usinagem CNC

Sistema inteligente para análise de desenhos técnicos e geração de planos de usinagem CNC.

## 🚀 Deploy Rápido

### Pré-requisitos
- Conta no [Vercel](https://vercel.com)
- Conta no [Supabase](https://supabase.com)
- Chave API do [OpenAI](https://platform.openai.com)

### Configuração de Variáveis de Ambiente

**IMPORTANTE:** Configure estas variáveis no Vercel antes do deploy:

```bash
# Supabase (obtenha em: https://app.supabase.com/project/_/settings/api)
NEXT_PUBLIC_SUPABASE_URL=https://seu-projeto.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=sua_chave_anon_aqui

# OpenAI (obtenha em: https://platform.openai.com/api-keys)
# ⚠️ Use OPENAI_API_KEY (sem NEXT_PUBLIC_) para segurança
OPENAI_API_KEY=sk-sua-chave-openai-aqui
```

### Passos para Deploy no Vercel

1. **Conecte seu repositório:**
   - Faça push do código para GitHub/GitLab/Bitbucket
   - Acesse [vercel.com/new](https://vercel.com/new)
   - Importe seu repositório

2. **Configure as variáveis de ambiente:**
   - Na página de configuração do projeto
   - Adicione as 3 variáveis acima
   - ⚠️ **CRÍTICO:** Use `OPENAI_API_KEY` (sem `NEXT_PUBLIC_`)

3. **Deploy:**
   - Clique em "Deploy"
   - Aguarde o build completar (2-3 minutos)
   - Acesse seu app no link fornecido

### Configuração do Supabase

Execute o script SQL no Supabase SQL Editor:

```sql
-- Copie e execute o conteúdo de supabase-schema.sql
```

Depois, crie o bucket de storage:
1. Vá em Storage no Supabase
2. Crie um novo bucket chamado `drawings`
3. Configure como público

## 🛠️ Desenvolvimento Local

```bash
# Instalar dependências
npm install

# Configurar variáveis de ambiente
cp .env.example .env.local
# Edite .env.local com suas chaves

# Executar em desenvolvimento
npm run dev
```

## 📋 Checklist de Deploy

- [ ] Variáveis de ambiente configuradas no Vercel
- [ ] `OPENAI_API_KEY` sem prefixo `NEXT_PUBLIC_`
- [ ] Script SQL executado no Supabase
- [ ] Bucket `drawings` criado no Supabase Storage
- [ ] Build passou sem erros
- [ ] App acessível e funcionando

## ⚠️ Problemas Comuns

### Build falha com erro de OpenAI
**Causa:** Variável `NEXT_PUBLIC_OPENAI_API_KEY` exposta no cliente  
**Solução:** Use `OPENAI_API_KEY` (sem `NEXT_PUBLIC_`)

### Erro 500 nas análises
**Causa:** Chave OpenAI não configurada ou inválida  
**Solução:** Verifique se `OPENAI_API_KEY` está correta no Vercel

### Erro ao fazer upload de imagens
**Causa:** Bucket não criado ou configuração Supabase incorreta  
**Solução:** Verifique bucket `drawings` e variáveis Supabase

## 📚 Tecnologias

- Next.js 15 (App Router)
- React 19
- TypeScript
- Tailwind CSS v4
- Supabase (Database + Storage)
- OpenAI GPT-4o Vision
- Shadcn/ui Components

## 🔒 Segurança

- ✅ Chaves API mantidas server-side
- ✅ RLS habilitado no Supabase
- ✅ CORS configurado
- ✅ TypeScript para type safety
- ✅ Validação de inputs

## 📄 Licença

MIT
