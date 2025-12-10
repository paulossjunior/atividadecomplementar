# 📊 Exemplo de Planilha Google Sheets

## Como sua planilha vai ficar

### Linha 1 - Cabeçalhos (você cria manualmente):
```
| Data/Hora | Nome | Email | Matrícula | Total Pontos | Ensino | Pesquisa | Cultura | Representação | Atividades | Arquivos | Status |
```

### Linhas seguintes - Dados (preenchidos automaticamente):

#### Exemplo 1 - Estudante em andamento:
```
| 10/12/2024 14:30:25 | João Silva | joao@email.com | 12345 | 8 | 5 | 3 | 0 | 0 | 1.1 - Monitoria (5 pts); 2.1 - Iniciação Científica (3 pts) | comprovante_monitoria.pdf; comprovante_ic.pdf | EM ANDAMENTO |
```

#### Exemplo 2 - Estudante formado:
```
| 10/12/2024 15:45:10 | Maria Santos | maria@email.com | 67890 | 16 | 6 | 5 | 3 | 2 | 1.1 - Monitoria (6 pts); 2.1 - IC (5 pts); 3.1 - Teatro (3 pts); 4.1 - Representante (2 pts) | doc1.pdf; doc2.pdf; doc3.pdf; doc4.pdf | FORMADO |
```

#### Exemplo 3 - Estudante iniciante:
```
| 10/12/2024 16:20:00 | Pedro Costa | pedro@email.com | 11111 | 3 | 0 | 3 | 0 | 0 | 2.2 - Artigo Publicado (3 pts) | artigo.pdf | EM ANDAMENTO |
```

---

## 📋 Detalhes das Colunas

### Coluna A - Data/Hora
- **Formato**: DD/MM/AAAA HH:MM:SS
- **Exemplo**: 10/12/2024 14:30:25
- **Gerado**: Automaticamente no momento do envio

### Coluna B - Nome
- **Formato**: Texto livre
- **Exemplo**: João Silva
- **Origem**: Campo "Nome Completo" do formulário

### Coluna C - Email
- **Formato**: email@dominio.com
- **Exemplo**: joao@email.com
- **Origem**: Campo "Email" do formulário

### Coluna D - Matrícula
- **Formato**: Texto/Número
- **Exemplo**: 12345
- **Origem**: Campo "Matrícula" do formulário

### Coluna E - Total Pontos
- **Formato**: Número
- **Exemplo**: 8
- **Cálculo**: Soma de todos os pontos das atividades
- **Máximo**: Sem limite (mas formatura requer 15)

### Coluna F - Ensino
- **Formato**: Número
- **Exemplo**: 5
- **Cálculo**: Soma dos pontos de atividades do Eixo 1 (Ensino)

### Coluna G - Pesquisa
- **Formato**: Número
- **Exemplo**: 3
- **Cálculo**: Soma dos pontos de atividades do Eixo 2 (Pesquisa)

### Coluna H - Cultura
- **Formato**: Número
- **Exemplo**: 0
- **Cálculo**: Soma dos pontos de atividades do Eixo 3 (Cultura)

### Coluna I - Representação
- **Formato**: Número
- **Exemplo**: 0
- **Cálculo**: Soma dos pontos de atividades do Eixo 4 (Representação)

### Coluna J - Atividades
- **Formato**: Lista separada por ponto e vírgula
- **Exemplo**: 1.1 - Monitoria (5 pts); 2.1 - Iniciação Científica (3 pts)
- **Conteúdo**: ID, nome e pontos de cada atividade

### Coluna K - Arquivos
- **Formato**: Lista de nomes separados por ponto e vírgula
- **Exemplo**: comprovante1.pdf; comprovante2.pdf
- **Conteúdo**: Nomes dos arquivos anexados

### Coluna L - Status
- **Formato**: Texto fixo
- **Valores possíveis**:
  - `FORMADO` - Se total de pontos >= 15
  - `EM ANDAMENTO` - Se total de pontos < 15

---

## 🎨 Dicas de Formatação

### Formatação Condicional (opcional):

#### Para a coluna Status (L):
1. Selecione a coluna L (exceto cabeçalho)
2. Menu: Formatar → Formatação condicional
3. Regra 1:
   - Se o texto contém: `FORMADO`
   - Cor de fundo: Verde claro (#d4edda)
   - Cor do texto: Verde escuro (#155724)
4. Regra 2:
   - Se o texto contém: `EM ANDAMENTO`
   - Cor de fundo: Amarelo claro (#fff3cd)
   - Cor do texto: Amarelo escuro (#856404)

#### Para a coluna Total Pontos (E):
1. Selecione a coluna E (exceto cabeçalho)
2. Menu: Formatar → Formatação condicional
3. Regra:
   - Se o valor >= 15
   - Cor de fundo: Verde claro
   - Negrito

### Filtros:
1. Selecione a linha de cabeçalhos
2. Menu: Dados → Criar filtro
3. Agora você pode filtrar por qualquer coluna

### Congelar Cabeçalhos:
1. Clique na linha 1
2. Menu: Visualizar → Congelar → 1 linha
3. Cabeçalhos ficam visíveis ao rolar

---

## 📊 Fórmulas Úteis

### Adicione em uma aba separada "Estatísticas":

#### Total de Registros:
```
=COUNTA(Registros!A:A)-1
```

#### Total de Formados:
```
=COUNTIF(Registros!L:L,"FORMADO")
```

#### Total em Andamento:
```
=COUNTIF(Registros!L:L,"EM ANDAMENTO")
```

#### Média de Pontos:
```
=AVERAGE(Registros!E:E)
```

#### Maior Pontuação:
```
=MAX(Registros!E:E)
```

#### Menor Pontuação:
```
=MIN(Registros!E:E)
```

#### Média por Eixo:
```
Ensino: =AVERAGE(Registros!F:F)
Pesquisa: =AVERAGE(Registros!G:G)
Cultura: =AVERAGE(Registros!H:H)
Representação: =AVERAGE(Registros!I:I)
```

---

## 📈 Gráficos Sugeridos

### Gráfico 1 - Status dos Estudantes (Pizza):
- **Dados**: Contagem de FORMADO vs EM ANDAMENTO
- **Tipo**: Gráfico de pizza
- **Uso**: Visualizar progresso geral

### Gráfico 2 - Distribuição de Pontos (Coluna):
- **Dados**: Pontos por eixo (Ensino, Pesquisa, Cultura, Representação)
- **Tipo**: Gráfico de colunas
- **Uso**: Ver quais eixos são mais populares

### Gráfico 3 - Evolução no Tempo (Linha):
- **Dados**: Número de registros por data
- **Tipo**: Gráfico de linha
- **Uso**: Acompanhar crescimento

---

## 🔍 Exemplo de Busca

### Buscar estudante específico:
1. Use Ctrl+F (ou Cmd+F no Mac)
2. Digite nome ou matrícula
3. Navegue pelos resultados

### Filtrar por status:
1. Clique no ícone de filtro na coluna L
2. Selecione apenas "FORMADO" ou "EM ANDAMENTO"

### Filtrar por pontuação:
1. Clique no ícone de filtro na coluna E
2. Use "Filtrar por condição" → "Maior ou igual a" → 15

---

## 💾 Exportação

### Para Excel:
1. Menu: Arquivo → Fazer download → Microsoft Excel (.xlsx)

### Para PDF:
1. Menu: Arquivo → Fazer download → PDF

### Para CSV:
1. Menu: Arquivo → Fazer download → CSV

---

## 🎯 Exemplo Completo de Planilha

```
┌─────────────────────┬──────────────┬──────────────────┬───────────┬──────────────┬────────┬──────────┬─────────┬───────────────┬────────────────────────────────────────┬──────────────────────────┬──────────────┐
│ Data/Hora           │ Nome         │ Email            │ Matrícula │ Total Pontos │ Ensino │ Pesquisa │ Cultura │ Representação │ Atividades                             │ Arquivos                 │ Status       │
├─────────────────────┼──────────────┼──────────────────┼───────────┼──────────────┼────────┼──────────┼─────────┼───────────────┼────────────────────────────────────────┼──────────────────────────┼──────────────┤
│ 10/12/2024 14:30:25 │ João Silva   │ joao@email.com   │ 12345     │ 8            │ 5      │ 3        │ 0       │ 0             │ 1.1 - Monitoria (5 pts); 2.1 - IC (3)  │ comp1.pdf; comp2.pdf     │ EM ANDAMENTO │
│ 10/12/2024 15:45:10 │ Maria Santos │ maria@email.com  │ 67890     │ 16           │ 6      │ 5        │ 3       │ 2             │ 1.1 - Monitoria (6); 2.1 - IC (5); ... │ doc1.pdf; doc2.pdf; ...  │ FORMADO      │
│ 10/12/2024 16:20:00 │ Pedro Costa  │ pedro@email.com  │ 11111     │ 3            │ 0      │ 3        │ 0       │ 0             │ 2.2 - Artigo (3 pts)                   │ artigo.pdf               │ EM ANDAMENTO │
│ 11/12/2024 09:15:30 │ Ana Oliveira │ ana@email.com    │ 22222     │ 15           │ 7      │ 4        │ 2       │ 2             │ 1.2 - Estágio (7); 2.3 - Projeto (4)   │ est.pdf; proj.pdf; ...   │ FORMADO      │
└─────────────────────┴──────────────┴──────────────────┴───────────┴──────────────┴────────┴──────────┴─────────┴───────────────┴────────────────────────────────────────┴──────────────────────────┴──────────────┘
```

---

## ✅ Checklist de Configuração

Antes de começar a usar, certifique-se de:

- [ ] Planilha criada no Google Sheets
- [ ] Primeira linha com cabeçalhos preenchida
- [ ] Aba renomeada para "Registros"
- [ ] Planilha compartilhada como "Editor"
- [ ] ID da planilha copiado
- [ ] Configuração no `.env` completa
- [ ] Teste realizado com sucesso
- [ ] Dados aparecendo corretamente

---

**Sua planilha está pronta para receber dados automaticamente! 🎉**
