# ✅ Checklist - Configuração Google Sheets

Use este checklist para garantir que tudo está configurado corretamente.

---

## 📋 Pré-requisitos

- [ ] Tenho uma conta Google (Gmail)
- [ ] Tenho acesso ao Google Cloud Console
- [ ] Tenho permissão para criar projetos no Google Cloud
- [ ] Li o guia `GOOGLE_SHEETS_SETUP.md` ou `GUIA_RAPIDO_GOOGLE.md`

---

## 🔧 Parte 1: Google Cloud Console

### Criar Projeto
- [ ] Acessei https://console.cloud.google.com/
- [ ] Criei um novo projeto
- [ ] Anotei o nome do projeto: ___________________________

### Ativar APIs
- [ ] Ativei a **Google Sheets API**
- [ ] Ativei a **Google Drive API**
- [ ] Confirmei que ambas aparecem como "Ativadas"

### Criar Credenciais
- [ ] Criei uma **Chave de API**
- [ ] Copiei a chave completa
- [ ] (Opcional) Restringi a chave às APIs necessárias
- [ ] Salvei a chave em local seguro

**Minha Chave de API:**
```
AIzaSy_________________________________
```

---

## 📊 Parte 2: Google Sheets

### Criar Planilha
- [ ] Acessei https://sheets.google.com/
- [ ] Criei uma nova planilha em branco
- [ ] Renomeei a planilha para: ___________________________
- [ ] Renomeei a primeira aba para: **Registros**

### Adicionar Cabeçalhos
Copie e cole na primeira linha (A1 até L1):

```
Data/Hora	Nome	Email	Matrícula	Total Pontos	Ensino	Pesquisa	Cultura	Representação	Atividades	Arquivos	Status
```

- [ ] Cabeçalhos adicionados na linha 1
- [ ] Formatei os cabeçalhos (negrito, cor de fundo)

### Configurar Permissões
- [ ] Cliquei em "Compartilhar"
- [ ] Selecionei "Qualquer pessoa com o link"
- [ ] Defini permissão como "Editor"
- [ ] Cliquei em "Concluído"

### Copiar ID
- [ ] Copiei o ID da URL da planilha
- [ ] Anotei o ID abaixo

**ID da Planilha:**
```
1_______________________________________
```

---

## 📁 Parte 3: Google Drive (Opcional)

### Criar Pasta
- [ ] Acessei https://drive.google.com/
- [ ] Criei uma nova pasta
- [ ] Nomeei a pasta: ___________________________

### Configurar Permissões
- [ ] Cliquei com botão direito → "Compartilhar"
- [ ] Selecionei "Qualquer pessoa com o link"
- [ ] Defini permissão como "Editor"
- [ ] Cliquei em "Concluído"

### Copiar ID
- [ ] Abri a pasta
- [ ] Copiei o ID da URL

**ID da Pasta:**
```
1_______________________________________
```

---

## ⚙️ Parte 4: Configuração Local

### Arquivo .env
- [ ] Localizei o arquivo `.env` no projeto
- [ ] Se não existe, copiei `.env.example` para `.env`
- [ ] Abri o arquivo `.env` em um editor de texto

### Adicionar Configurações
Copie e cole no final do arquivo `.env`:

```env
# ========================================
# Configurações do Google Sheets e Drive
# ========================================

# Habilitar integração (true para ativar)
ENABLE_GOOGLE_INTEGRATION=true

# ID da planilha (cole aqui o ID que você copiou)
GOOGLE_SHEETS_ID=

# Nome da aba na planilha
GOOGLE_SHEETS_WORKSHEET=Registros

# ID da pasta do Drive (opcional)
GOOGLE_DRIVE_FOLDER_ID=

# Chave da API do Google
GOOGLE_API_KEY=
```

- [ ] Colei as configurações no `.env`
- [ ] Preenchi `GOOGLE_SHEETS_ID` com o ID da planilha
- [ ] Preenchi `GOOGLE_API_KEY` com a chave de API
- [ ] (Opcional) Preenchi `GOOGLE_DRIVE_FOLDER_ID`
- [ ] Mudei `ENABLE_GOOGLE_INTEGRATION` para `true`
- [ ] Salvei o arquivo `.env`

---

## 🧪 Parte 5: Testar

### Preparar Ambiente
- [ ] Abri o terminal no diretório do projeto
- [ ] Parei o servidor se estiver rodando (Ctrl+C)
- [ ] Executei `npm run dev`
- [ ] Servidor iniciou sem erros

### Verificar Console
- [ ] Abri o navegador em http://localhost:4321
- [ ] Abri o Console do navegador (F12)
- [ ] Vi a mensagem: "🔄 Google Sheets habilitado - inicializando..."
- [ ] Vi a mensagem: "✅ Google API inicializada com sucesso"
- [ ] Não vi erros em vermelho

### Enviar Registro de Teste
- [ ] Preenchi o formulário com dados de teste:
  - Nome: Teste Google Sheets
  - Email: teste@email.com
  - Matrícula: 99999
- [ ] Adicionei pelo menos uma atividade
- [ ] (Opcional) Anexei um arquivo
- [ ] Cliquei em "Enviar"
- [ ] Marquei o checkbox de confirmação
- [ ] Cliquei em "Confirmar e Enviar"

### Verificar Resultado
- [ ] Vi mensagem: "⏳ Processando envio..."
- [ ] Vi mensagem: "🔄 Salvando no Google Sheets..."
- [ ] Vi mensagem de sucesso
- [ ] Não vi mensagens de erro

### Verificar Planilha
- [ ] Abri a planilha no Google Sheets
- [ ] Vi uma nova linha com os dados do teste
- [ ] Todos os campos estão preenchidos corretamente
- [ ] Data/hora está correto
- [ ] Status está correto (FORMADO ou EM ANDAMENTO)

---

## 🎉 Parte 6: Finalização

### Limpeza
- [ ] Deletei o registro de teste da planilha (opcional)
- [ ] Confirmei que tudo está funcionando

### Documentação
- [ ] Li o arquivo `RESUMO_GOOGLE_SHEETS.md`
- [ ] Vi o exemplo em `EXEMPLO_PLANILHA.md`
- [ ] Entendi como funciona

### Segurança
- [ ] Não compartilhei minha chave de API publicamente
- [ ] Configurei restrições na chave (opcional mas recomendado)
- [ ] Verifiquei as permissões da planilha

---

## 🚨 Solução de Problemas

### Se algo não funcionar:

#### Erro: "Google API não carregada"
- [ ] Verifiquei minha conexão com internet
- [ ] Confirmei que as APIs estão ativadas no Google Cloud
- [ ] Limpei o cache do navegador

#### Erro: "API Key inválida"
- [ ] Verifiquei se copiei a chave completa
- [ ] Confirmei que não há espaços extras
- [ ] Gerei uma nova chave se necessário

#### Erro: "Permissão negada"
- [ ] Verifiquei se a planilha está compartilhada
- [ ] Confirmei que a permissão é "Editor"
- [ ] Tentei tornar público "Qualquer pessoa com o link"

#### Dados não aparecem na planilha
- [ ] Verifiquei se o ID da planilha está correto
- [ ] Confirmei que o nome da aba é "Registros"
- [ ] Olhei o console do navegador para erros

---

## 📞 Recursos de Ajuda

Se precisar de ajuda:

1. **Guia Completo**: `GOOGLE_SHEETS_SETUP.md`
2. **Guia Rápido**: `GUIA_RAPIDO_GOOGLE.md`
3. **Resumo**: `RESUMO_GOOGLE_SHEETS.md`
4. **Exemplo**: `EXEMPLO_PLANILHA.md`
5. **Console**: Pressione F12 e veja a aba Console
6. **Logs**: Procure por mensagens com 🔄, ✅ ou ❌

---

## ✅ Status Final

Marque quando tudo estiver funcionando:

- [ ] ✅ Google Cloud configurado
- [ ] ✅ APIs ativadas
- [ ] ✅ Chave de API criada
- [ ] ✅ Planilha criada e configurada
- [ ] ✅ Arquivo .env configurado
- [ ] ✅ Teste realizado com sucesso
- [ ] ✅ Dados aparecendo na planilha
- [ ] ✅ Sistema pronto para uso!

---

**🎊 Parabéns! Sua integração com Google Sheets está completa e funcionando!**

**Data de conclusão:** ___/___/______

**Configurado por:** _______________________________

---

## 📝 Notas Adicionais

Use este espaço para anotar informações importantes:

```
_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________

_____________________________________________________________
```
