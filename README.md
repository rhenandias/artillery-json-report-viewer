# Artillery JSON Report Viewer

Visualizador de relatórios JSON gerados pelo Artillery para análise de testes de carga e performance.

## 🚀 Início Rápido

### 1. Instalar Dependências

```bash
# Instalar dependências da aplicação React
npm install

# Instalar dependências da Mock API
cd mock-api
npm install
cd ..

# Instalar Artillery globalmente
npm install -g artillery
```

### 2. Executar a Mock API

```bash
npm run api:start
```

A API estará disponível em `http://localhost:3001`

### 3. Executar Testes Artillery

Em outro terminal:

```bash
# Teste básico (60s, 5 req/s)
npm run test:basic

# Teste de carga (4min, 5-100 req/s)
npm run test:load

# Teste de estresse (2.5min, 10-200 req/s)
npm run test:stress

# Executar todos os testes
npm run test:all
```

### 4. Visualizar Relatórios

```bash
# Iniciar a aplicação React
npm run dev
```

Abra `http://localhost:5173` e faça upload dos arquivos JSON gerados em `/reports/`

## 📁 Estrutura do Projeto

```
artillery-json-report-viewer/
├── src/                      # Aplicação React
│   ├── components/          # Componentes da UI
│   ├── utils/               # Utilitários
│   └── types.ts             # Tipos TypeScript
│
├── mock-api/                # API Mock para testes
│   ├── server.js            # Servidor Express
│   ├── package.json         # Dependências da API
│   └── README.md            # Documentação da API
│
├── artillery-tests/         # Scripts de teste Artillery
│   ├── basic-test.yml       # Teste básico
│   ├── load-test.yml        # Teste de carga
│   ├── stress-test.yml      # Teste de estresse
│   ├── processor.js         # Funções auxiliares
│   └── README.md            # Documentação dos testes
│
├── reports/                 # Relatórios gerados (gitignored)
│   ├── basic-report.json
│   ├── load-report.json
│   └── stress-report.json
│
└── package.json             # Scripts principais
```

## 🎯 Scripts Disponíveis

### Aplicação React
```bash
npm run dev          # Inicia servidor de desenvolvimento
npm run build        # Build para produção
npm run preview      # Preview do build
npm run lint         # Executa linter
npm run format       # Formata código com Prettier
```

### Mock API
```bash
npm run api:install  # Instala dependências da API
npm run api:start    # Inicia a Mock API
npm run api:dev      # Inicia API em modo desenvolvimento
```

### Testes Artillery
```bash
npm run test:basic   # Teste básico (60s)
npm run test:load    # Teste de carga (4min)
npm run test:stress  # Teste de estresse (2.5min)
npm run test:all     # Executa todos os testes
```

### Workflow Completo
```bash
npm run workflow     # API + Teste básico + Visualizador
```

## 📊 Tipos de Teste

### 🟢 Teste Básico
- **Duração**: 60 segundos
- **Carga**: 5 requisições/segundo
- **Uso**: Validação rápida, desenvolvimento diário

### 🟡 Teste de Carga
- **Duração**: ~4 minutos
- **Carga**: 5 → 100 requisições/segundo
- **Fases**: Aquecimento, rampa, sustentação, pico, cooldown
- **Uso**: Simular carga realista, identificar gargalos

### 🔴 Teste de Estresse
- **Duração**: ~2.5 minutos
- **Carga**: 10 → 200 requisições/segundo
- **Uso**: Identificar limites, testar recuperação de falhas

## 🔧 Configuração

### Alterar Porta da Mock API

Edite `mock-api/server.js`:
```javascript
const PORT = 3001; // Sua porta
```

E atualize os arquivos em `artillery-tests/*.yml`:
```yaml
config:
  target: "http://localhost:3001"
```

### Personalizar Testes

Edite os arquivos `.yml` em `artillery-tests/`:

```yaml
config:
  phases:
    - duration: 60        # Duração em segundos
      arrivalRate: 10     # Requisições por segundo
      rampTo: 50          # Rampa até X req/s
```

## 📈 Métricas Capturadas

Os relatórios Artillery incluem:
- **Latência**: min, max, median, p50, p75, p90, p95, p99, p999
- **Taxa de requisições**: req/s ao longo do tempo
- **Taxa de erros**: erros HTTP, timeouts, falhas de conexão
- **Códigos HTTP**: distribuição de 2xx, 4xx, 5xx
- **Contadores customizados**: métricas específicas dos cenários

## 🎨 Recursos da Aplicação

- ✅ Upload de arquivos JSON do Artillery
- ✅ Visualização de métricas agregadas
- ✅ Gráficos interativos de latência
- ✅ Análise de performance ao longo do tempo
- ✅ Comparação de percentis
- ✅ Interface moderna e responsiva

## 🛠️ Tecnologias

### Frontend
- React 19
- TypeScript
- Vite
- TailwindCSS 4
- Chart.js
- Radix UI

### Mock API
- Node.js
- Express
- CORS

### Testes
- Artillery

## 📝 Workflow Recomendado

1. **Inicie a Mock API**
   ```bash
   npm run api:start
   ```

2. **Execute um teste Artillery**
   ```bash
   npm run test:basic
   ```

3. **Inicie a aplicação React**
   ```bash
   npm run dev
   ```

4. **Faça upload do relatório** gerado em `/reports/basic-report.json`

5. **Analise as métricas** na interface visual

## 🐛 Troubleshooting

### Erro: "ECONNREFUSED"
- A Mock API não está rodando
- Execute `npm run api:start`

### Erro: "artillery: command not found"
- Instale Artillery globalmente: `npm install -g artillery`

### Porta já em uso
- Altere a porta no `mock-api/server.js`
- Atualize os arquivos `.yml` do Artillery

### Relatórios não aparecem
- Verifique se os arquivos estão em `/reports/`
- Confirme que o teste Artillery foi concluído

## 📚 Documentação Adicional

- [Mock API](./mock-api/README.md) - Detalhes sobre os endpoints
- [Testes Artillery](./artillery-tests/README.md) - Guia completo dos testes
- [Artillery Docs](https://www.artillery.io/docs) - Documentação oficial

## 🤝 Contribuindo

Contribuições são bem-vindas! Sinta-se à vontade para:
- Adicionar novos endpoints na Mock API
- Criar novos cenários de teste
- Melhorar a visualização de dados
- Reportar bugs ou sugerir melhorias

## 📄 Licença

MIT

---

**Desenvolvido para facilitar a análise de testes de performance com Artillery** 🚀
