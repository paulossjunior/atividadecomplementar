# Configuração do EmailJS

Este documento explica como configurar o EmailJS para envio automático de emails com os registros de atividades complementares.

## 📧 Passo a Passo

### 1. Criar Conta no EmailJS
1. Acesse [emailjs.com](https://www.emailjs.com/)
2. Clique em "Sign Up" e crie uma conta gratuita
3. Confirme seu email

### 2. Configurar Serviço de Email
1. No dashboard, clique em "Email Services"
2. Clique em "Add New Service"
3. Escolha seu provedor (Gmail, Outlook, Yahoo, etc.)
4. Siga as instruções para conectar sua conta
5. Anote o **Service ID** gerado (ex: `service_abc123`)

### 3. Criar Template de Email
1. Clique em "Email Templates"
2. Clique em "Create New Template"
3. Use este template como base:

```
Assunto: Registro de Atividades - {{student_name}}

Corpo do Email:
Novo registro de atividades complementares recebido.

DADOS DO ESTUDANTE:
Nome: {{student_name}}
Email: {{student_email}}
Matrícula: {{student_id}}
Total de Pontos: {{total_points}}/15

DETALHES:
{{message}}

---
Este email foi enviado automaticamente pelo sistema de registro de atividades complementares.
```

4. Salve o template e anote o **Template ID** (ex: `template_xyz789`)

### 4. Obter User ID (Public Key)
1. Vá em "Account" → "General"
2. Copie o **Public Key** (ex: `user_def456`)

### 5. Configurar Variáveis de Ambiente
1. Copie o arquivo `.env.example` para `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edite o arquivo `.env` com suas credenciais:
   ```env
   EMAILJS_SERVICE_ID=service_abc123
   EMAILJS_TEMPLATE_ID=template_xyz789
   EMAILJS_USER_ID=user_def456
   DESTINATION_EMAIL=coordenacao@escola.edu.br
   MAX_FILE_SIZE_MB=5
   ALLOWED_FILE_TYPES=.pdf,.jpg,.jpeg,.png,.doc,.docx
   ```

### 6. Configurar Múltiplos Destinatários (Opcional)

Para enviar o registro para múltiplas pessoas, adicione os emails separados por vírgula:

```env
DESTINATION_EMAIL=coordenacao@escola.edu.br,secretaria@escola.edu.br,diretor@escola.edu.br
```

**Importante:**
- Separe os emails por vírgula
- Não use espaços entre os emails
- O sistema enviará uma cópia para cada email listado
- Todos receberão o mesmo conteúdo e anexos

### 7. Testar Configuração
1. Reinicie o servidor de desenvolvimento
2. Preencha um registro completo
3. Clique em "Enviar Registro de Atividades Complementares"
4. Revise o resumo no modal
5. Confirme o envio
6. Verifique se o email chegou em todos os destinos

## 🔧 Solução de Problemas

### Email não está sendo enviado
- Verifique se as credenciais estão corretas no `.env`
- Confirme se o serviço de email está ativo no EmailJS
- Verifique o console do navegador para erros

### Template não funciona
- Certifique-se de que as variáveis `{{student_name}}`, `{{message}}`, etc. estão no template
- Teste o template no dashboard do EmailJS

### Limite de emails
- Conta gratuita: 200 emails/mês
- Para mais emails, considere upgrade para plano pago

## 📋 Variáveis Disponíveis no Template

- `{{to_email}}` - Email de destino
- `{{student_name}}` - Nome do estudante
- `{{student_email}}` - Email do estudante  
- `{{student_id}}` - Matrícula do estudante
- `{{total_points}}` - Total de pontos obtidos
- `{{message}}` - Detalhes completos das atividades
- `{{attachments}}` - Arquivos anexados (se houver)

## 📎 Configurações de Upload

### **MAX_FILE_SIZE_MB**
- Define o tamanho máximo permitido para arquivos anexados
- Valor padrão: 5 MB
- Ajuste conforme necessário (ex: 10 para 10MB)

### **ALLOWED_FILE_TYPES**
- Define quais tipos de arquivo são aceitos
- Formato: extensões separadas por vírgula
- Padrão: `.pdf,.jpg,.jpeg,.png,.doc,.docx`
- Exemplos de customização:
  - Apenas PDF: `.pdf`
  - PDF e imagens: `.pdf,.jpg,.jpeg,.png`
  - Adicionar outros: `.pdf,.jpg,.jpeg,.png,.doc,.docx,.txt,.zip`

### **Tipos MIME Suportados:**
- `.pdf` - Documentos PDF
- `.jpg`, `.jpeg` - Imagens JPEG
- `.png` - Imagens PNG
- `.doc` - Documentos Word antigos
- `.docx` - Documentos Word modernos

## 🔒 Segurança

- O arquivo `.env` não é commitado no Git
- As credenciais ficam apenas no servidor
- Use emails institucionais para maior segurança
- Limite o tamanho de arquivos para evitar sobrecarga
- Restrinja tipos de arquivo para maior segurança