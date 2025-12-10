# 📊 Como Adicionar Dados do Formulário no Google Sheets

## Guia Completo de Configuração

### 🎯 O que você vai conseguir:
- ✅ Salvar automaticamente todos os registros em uma planilha Google
- ✅ Upload de arquivos para o Google Drive
- ✅ Organização profissional dos dados
- ✅ Acesso compartilhado com sua equipe

---

## 📋 PASSO 1: Criar Projeto no Google Cloud

1. Acesse: https://console.cloud.google.com/
2. Clique em **"Selecionar projeto"** → **"Novo projeto"**
3. Nome do projeto: `Atividades Complementares`
4. Clique em **"Criar"**
5. Aguarde a criação (alguns segundos)

---

## 🔌 PASSO 2: Ativar as APIs Necessárias

### Google Sheets API:
1. No menu lateral, vá em **"APIs e Serviços"** → **"Biblioteca"**
2. Busque por: `Google Sheets API`
3. Clique em **"Ativar"**

### Google Drive API:
1. Ainda na Biblioteca de APIs
2. Busque por: `Google Drive API`
3. Clique em **"Ativar"**

---

## 🔑 PASSO 3: Criar Chave de API

1. Vá em **"APIs e Serviços"** → **"Credenciais"**
2. Clique em **"+ Criar Credenciais"**
3. Selecione **"Chave de API"**
4. **COPIE A CHAVE** que aparece (você vai precisar dela!)
5. Clique em **"Restringir chave"** (recomendado para segurança)
6. Em "Restrições de API", selecione:
   - ✅ Google Sheets API
   - ✅ Google Drive API
7. Clique em **"Salvar"**

---

## 📊 PASSO 4: Criar a Planilha no Google Sheets

1. Acesse: https://sheets.google.com/
2. Clique em **"+ Criar planilha em branco"**
3. Renomeie para: `Atividades Complementares - Registros`
4. Renomeie a primeira aba para: **Registros**

### Adicione os Cabeçalhos (primeira linha):

| A | B | C | D | E | F | G | H | I | J | K | L |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Data/Hora | Nome | Email | Matrícula | Total Pontos | Ensino | Pesquisa | Cultura | Representação | Atividades | Arquivos | Status |

5. **COPIE O ID DA PLANILHA** da URL:
   ```
   https://docs.google.com/spreadsheets/d/[ESTE_É_O_ID]/edit
   ```
   Exemplo: `1abc123def456ghi789jkl0mno`

---

## 📁 PASSO 5: Criar Pasta no Google Drive

1. Acesse: https://drive.google.com/
2. Clique em **"+ Novo"** → **"Nova pasta"**
3. Nome: `Atividades Complementares - Arquivos`
4. Abra a pasta criada
5. **COPIE O ID DA PASTA** da URL:
   ```
   https://drive.google.com/drive/folders/[ESTE_É_O_ID]
   ```
   Exemplo: `1xyz789abc456def123ghi456jkl`

---

## 🔓 PASSO 6: Configurar Permissões

### Para a Planilha:
1. Abra a planilha criada
2. Clique em **"Compartilhar"** (canto superior direito)
3. Em "Acesso geral", selecione:
   - **"Qualquer pessoa com o link"**
   - Permissão: **"Editor"**
4. Clique em **"Concluído"**

### Para a Pasta do Drive:
1. Clique com botão direito na pasta
2. Selecione **"Compartilhar"**
3. Em "Acesso geral", selecione:
   - **"Qualquer pessoa com o link"**
   - Permissão: **"Editor"**
4. Clique em **"Concluído"**

---

## ⚙️ PASSO 7: Configurar o Arquivo .env

Abra o arquivo `.env` e adicione estas linhas:

```env
# Configurações do Google Sheets e Drive
ENABLE_GOOGLE_INTEGRATION=true
GOOGLE_SHEETS_ID=COLE_AQUI_O_ID_DA_PLANILHA
GOOGLE_SHEETS_WORKSHEET=Registros
GOOGLE_DRIVE_FOLDER_ID=COLE_AQUI_O_ID_DA_PASTA
GOOGLE_API_KEY=COLE_AQUI_SUA_CHAVE_DE_API
```

### Exemplo preenchido:
```env
ENABLE_GOOGLE_INTEGRATION=true
GOOGLE_SHEETS_ID=1abc123def456ghi789jkl0mno
GOOGLE_SHEETS_WORKSHEET=Registros
GOOGLE_DRIVE_FOLDER_ID=1xyz789abc456def123ghi456jkl
GOOGLE_API_KEY=AIzaSyAbc123Def456Ghi789Jkl012Mno345Pqr
```

---

## 🧪 PASSO 8: Testar a Integração

1. **Reinicie o servidor** de desenvolvimento:
   ```bash
   npm run dev
   ```

2. **Preencha um registro** completo no formulário

3. **Anexe um arquivo** de comprovação

4. **Envie o formulário**

5. **Verifique**:
   - ✅ Nova linha apareceu na planilha do Google Sheets
   - ✅ Arquivo foi salvo na pasta do Google Drive
   - ✅ Link do arquivo está na coluna "Arquivos" da planilha

---

## 📊 Como os Dados Aparecem na Planilha

Exemplo de registro salvo:

| Data/Hora | Nome | Email | Matrícula | Total | Ensino | Pesquisa | Cultura | Rep. | Atividades | Arquivos | Status |
|-----------|------|-------|-----------|-------|--------|----------|---------|------|------------|----------|--------|
| 10/12/2024 15:30 | João Silva | joao@email.com | 12345 | 8 | 5 | 3 | 0 | 0 | 1.1 - Monitoria (5 pts); 2.1 - IC (3 pts) | comprovante.pdf: [link] | EM ANDAMENTO |

---

## 🔧 Solução de Problemas

### ❌ Erro: "Google API não carregada"
**Solução:**
- Verifique sua conexão com internet
- Confirme que as APIs estão ativadas no Google Cloud
- Limpe o cache do navegador

### ❌ Erro: "API Key inválida"
**Solução:**
- Verifique se copiou a chave completa
- Confirme que as APIs estão habilitadas para essa chave
- Gere uma nova chave se necessário

### ❌ Erro: "Permissão negada"
**Solução:**
- Verifique se a planilha está compartilhada como "Editor"
- Confirme se a pasta do Drive tem permissão de edição
- Tente tornar público "Qualquer pessoa com o link"

### ❌ Arquivos não aparecem no Drive
**Solução:**
- Verifique se o ID da pasta está correto
- Confirme se a pasta tem permissões de escrita
- Teste fazer upload manual na pasta

---

## 🔒 Dicas de Segurança

1. **Restrinja a API Key** apenas às APIs necessárias
2. **Monitore o uso** no Google Cloud Console
3. **Não compartilhe** sua chave de API publicamente
4. **Use domínios específicos** se possível (em produção)
5. **Revogue chaves antigas** quando não precisar mais

---

## 💡 Recursos Adicionais

### Análise de Dados:
- Use fórmulas no Google Sheets para estatísticas
- Crie gráficos automáticos
- Exporte relatórios em PDF

### Organização:
- Crie abas por semestre: "2024-1", "2024-2"
- Use filtros para buscar alunos específicos
- Adicione formatação condicional (ex: verde para FORMADO)

### Backup:
- Configure backup automático da planilha
- Exporte dados periodicamente
- Mantenha cópias de segurança

---

## 📞 Precisa de Ajuda?

Se encontrar problemas:
1. Verifique os logs no console do navegador (F12)
2. Confirme todas as configurações no `.env`
3. Teste as permissões manualmente
4. Revise cada passo deste guia

---

## ✅ Checklist Final

Antes de usar em produção, confirme:

- [ ] Projeto criado no Google Cloud
- [ ] Google Sheets API ativada
- [ ] Google Drive API ativada
- [ ] Chave de API criada e restrita
- [ ] Planilha criada com cabeçalhos
- [ ] Pasta do Drive criada
- [ ] Permissões configuradas (Editor)
- [ ] Arquivo `.env` configurado
- [ ] Teste realizado com sucesso
- [ ] Dados aparecem na planilha
- [ ] Arquivos salvos no Drive

---

**Pronto! Agora seu sistema está integrado com Google Sheets e Drive! 🎉**
