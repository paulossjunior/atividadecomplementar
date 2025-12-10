# Sistema de Coleta de Dados de Estudantes

Um sistema moderno e acessível para gerenciar registros de estudantes e atividades complementares em instituições educacionais.

## 🚀 Características

- **Interface Moderna**: Design responsivo e acessível seguindo padrões WCAG 2.1 AA
- **Gestão de Estudantes**: Registro, busca e gerenciamento de dados de estudantes
- **Atividades Complementares**: Criação e organização de atividades educacionais
- **Integração Google Sheets**: Salva automaticamente os registros em planilha Google (opcional)
- **Envio de Emails**: Notificações automáticas via EmailJS (opcional)
- **Validação Robusta**: Validação em tempo real com feedback acessível
- **Responsivo**: Otimizado para dispositivos móveis, tablets e desktop
- **Acessibilidade**: Navegação por teclado, leitores de tela e alto contraste

## 🛠️ Tecnologias

- **Astro**: Framework para sites estáticos
- **TypeScript**: Tipagem estática para JavaScript
- **CSS Moderno**: Grid, Flexbox e variáveis CSS
- **Componentes Acessíveis**: ARIA, semântica HTML5

## 📁 Estrutura do Projeto

```
src/
├── components/          # Componentes reutilizáveis
│   ├── ActivityForm.astro
│   ├── ActivityManager.astro
│   ├── Breadcrumb.astro
│   ├── StudentForm.astro
│   └── StudentList.astro
├── data/               # Dados JSON
│   ├── activities.json
│   └── students.json
├── layouts/            # Layouts de página
│   └── Layout.astro
├── pages/              # Páginas da aplicação
│   ├── index.astro     # Página inicial
│   ├── register.astro  # Registro de estudantes
│   ├── students.astro  # Gerenciamento de estudantes
│   └── activities.astro # Gerenciamento de atividades
├── styles/             # Estilos globais
│   └── global.css
├── types/              # Definições TypeScript
│   └── index.ts
└── utils/              # Utilitários e serviços
    ├── accessibilityUtils.ts
    ├── activityService.ts
    ├── dataManager.ts
    ├── formValidation.ts
    ├── integrationTest.ts
    ├── mobileUtils.ts
    ├── searchUtils.ts
    ├── studentService.ts
    └── validation.ts
```

## 🚀 Como Executar

1. **Instalar dependências**:
   ```bash
   npm install
   ```

2. **Configurar integrações (opcional)**:
   
   **Para Google Sheets:**
   - Copie `.env.example` para `.env`
   - Siga o guia completo em `GOOGLE_SHEETS_SETUP.md`
   - Ou use o guia rápido em `GUIA_RAPIDO_GOOGLE.md`
   
   **Para EmailJS:**
   - Siga o guia em `EMAILJS_SETUP.md`

3. **Executar em desenvolvimento**:
   ```bash
   npm run dev
   ```

4. **Construir para produção**:
   ```bash
   npm run build
   ```

5. **Visualizar build de produção**:
   ```bash
   npm run preview
   ```

## 📋 Funcionalidades

### Gestão de Estudantes
- ✅ Registro de novos estudantes
- ✅ Validação de dados em tempo real
- ✅ Busca e filtros avançados
- ✅ Associação com múltiplas atividades
- ✅ Exportação de dados (CSV)

### Gestão de Atividades
- ✅ Criação e edição de atividades
- ✅ Estatísticas de participação
- ✅ Visualização de estudantes inscritos
- ✅ Validação de dados

### Acessibilidade
- ✅ Navegação por teclado
- ✅ Suporte a leitores de tela
- ✅ Alto contraste
- ✅ Foco visível
- ✅ ARIA labels e roles
- ✅ Estrutura semântica

### Design Responsivo
- ✅ Layout adaptável (320px - 1920px)
- ✅ Otimização para touch
- ✅ Tipografia fluida
- ✅ Imagens responsivas

## 🧪 Testes

Execute os testes de integração no console do navegador:

```javascript
// No console do navegador (modo desenvolvimento)
window.runIntegrationTests()
```

Os testes verificam:
- Funcionalidade básica do sistema
- Validação de formulários
- Recursos de acessibilidade
- Design responsivo

## 📱 Compatibilidade

### Navegadores Suportados
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

### Dispositivos
- Desktop (1024px+)
- Tablet (768px - 1023px)
- Mobile (320px - 767px)

## 🎯 Padrões de Acessibilidade

O sistema segue as diretrizes WCAG 2.1 AA:

- **Perceptível**: Alto contraste, texto alternativo
- **Operável**: Navegação por teclado, sem convulsões
- **Compreensível**: Linguagem clara, comportamento previsível
- **Robusto**: Compatível com tecnologias assistivas

## 🔧 Configuração

### Integrações Opcionais

#### Google Sheets (Opcional)
Salve automaticamente os registros em uma planilha Google:

1. **Guia Completo**: Veja `GOOGLE_SHEETS_SETUP.md` para instruções detalhadas
2. **Guia Rápido**: Veja `GUIA_RAPIDO_GOOGLE.md` para configuração em 5 minutos

**Configuração no `.env`:**
```env
ENABLE_GOOGLE_INTEGRATION=true
GOOGLE_SHEETS_ID=seu_id_da_planilha
GOOGLE_SHEETS_WORKSHEET=Registros
GOOGLE_DRIVE_FOLDER_ID=seu_id_da_pasta
GOOGLE_API_KEY=sua_chave_api
```

#### EmailJS (Opcional)
Envie notificações por email automaticamente:

1. **Guia**: Veja `EMAILJS_SETUP.md` para instruções completas

**Configuração no `.env`:**
```env
EMAILJS_SERVICE_ID=seu_service_id
EMAILJS_TEMPLATE_ID=seu_template_id
EMAILJS_USER_ID=seu_user_id
DESTINATION_EMAIL=email1@exemplo.com,email2@exemplo.com
```

### Variáveis CSS Personalizáveis

```css
:root {
  --color-primary: #2563eb;
  --color-secondary: #64748b;
  --color-success: #10b981;
  --color-warning: #f59e0b;
  --color-error: #ef4444;
  /* ... mais variáveis */
}
```

### Dados Iniciais

Edite os arquivos em `src/data/` para configurar atividades iniciais:

```json
// src/data/activities.json
[
  {
    "id": "act-001",
    "name": "Nome da Atividade",
    "description": "Descrição detalhada",
    "createdAt": "2024-01-15T10:00:00.000Z",
    "studentCount": 0
  }
]
```

## 📄 Licença

Este projeto é de código aberto e está disponível sob a licença MIT.

## 🤝 Contribuição

Contribuições são bem-vindas! Por favor:

1. Faça um fork do projeto
2. Crie uma branch para sua feature
3. Commit suas mudanças
4. Push para a branch
5. Abra um Pull Request

## 📞 Suporte

Para dúvidas ou problemas:

1. Verifique a documentação
2. Execute os testes de integração
3. Consulte os comentários no código
4. Abra uma issue no repositório