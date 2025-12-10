# 🚀 Guia Rápido - Google Sheets em 5 Minutos

## Configuração Expressa

### 1️⃣ Google Cloud (2 min)
```
1. Acesse: https://console.cloud.google.com/
2. Criar novo projeto
3. Ativar APIs: "Google Sheets API" e "Google Drive API"
4. Criar credenciais → Chave de API → COPIAR
```

### 2️⃣ Google Sheets (1 min)
```
1. Criar nova planilha: https://sheets.google.com/
2. Renomear aba para: "Registros"
3. Adicionar cabeçalhos na linha 1:
   Data/Hora | Nome | Email | Matrícula | Total Pontos | Ensino | 
   Pesquisa | Cultura | Representação | Atividades | Arquivos | Status
4. Compartilhar → "Qualquer pessoa com o link" → Editor
5. COPIAR ID da URL
```

### 3️⃣ Google Drive (1 min)
```
1. Criar pasta: https://drive.google.com/
2. Compartilhar → "Qualquer pessoa com o link" → Editor
3. COPIAR ID da URL
```

### 4️⃣ Configurar .env (1 min)
```env
ENABLE_GOOGLE_INTEGRATION=true
GOOGLE_SHEETS_ID=cole_id_da_planilha_aqui
GOOGLE_SHEETS_WORKSHEET=Registros
GOOGLE_DRIVE_FOLDER_ID=cole_id_da_pasta_aqui
GOOGLE_API_KEY=cole_chave_api_aqui
```

### 5️⃣ Testar
```bash
npm run dev
```
Preencha e envie um registro → Verifique na planilha!

---

**📖 Guia completo:** Veja `GOOGLE_SHEETS_SETUP.md` para detalhes
