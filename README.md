# Frotalog - Sistema de Gestão de Frota

Sistema completo de gestão de frota com controle de ativos, manutenções, fornecedores e usuários.

## 🚀 Funcionalidades

### ✅ Implementadas
- **Gestão de Usuários**: CRUD completo com autenticação JWT
- **Gestão de Ativos**: Controle de veículos e equipamentos
- **Gestão de Categorias**: Organização de tipos de ativos
- **Gestão de Fornecedores**: Controle de prestadores de serviço
- **Gestão de Manutenções**: Agendamento e controle de manutenções
- **Documentos de Manutenção**: Upload e gestão de arquivos
- **Sistema de Relatórios**: Dashboards e relatórios de manutenção
- **Autenticação JWT**: Sistema seguro de login
- **Validação de CNPJ**: Algoritmo completo de validação
- **Logging Estruturado**: Logs detalhados para debugging

## 🛠️ Tecnologias

- **Backend**: Node.js + TypeScript
- **Framework**: Fastify
- **ORM**: Prisma
- **Database**: PostgreSQL
- **Autenticação**: JWT
- **Upload**: Multipart
- **Validação**: Zod
- **Testes**: Vitest
- **Linting**: ESLint

## 📋 Pré-requisitos

- Node.js 18+
- PostgreSQL 13+
- npm ou yarn

## 🚀 Instalação

1. Clone o repositório
```bash
git clone <repository-url>
cd frotalog
```

2. Instale as dependências
```bash
npm install
```

3. Configure as variáveis de ambiente
```bash
cp .env.example .env
```

Edite o arquivo `.env` com suas configurações:
```env
DATABASE_URL="postgresql://username:password@localhost:5432/frotalog"
NODE_ENV="dev"
PORT=3333
JWT_SECRET="your-super-secret-jwt-key-with-at-least-32-characters"
```

4. Execute as migrações do banco
```bash
npx prisma migrate dev
```

5. Inicie o servidor
```bash
npm run dev
```

## 📚 API Endpoints

### Autenticação
- `POST /auth/login` - Login de usuário
- `POST /auth/register` - Registro de usuário

### Usuários
- `POST /user` - Criar usuário
- `GET /user/search` - Listar usuários
- `GET /user/search/:id` - Buscar usuário por ID
- `GET /user/search/email` - Buscar usuário por email
- `GET /user/search/name` - Buscar usuário por nome
- `GET /user/search/role` - Buscar usuário por role
- `PATCH /user/:id` - Atualizar usuário
- `PATCH /user/:id/status` - Ativar/desativar usuário

### Ativos
- `POST /asset` - Criar ativo
- `GET /asset/search` - Listar ativos
- `GET /asset/search/:id` - Buscar ativo por ID
- `GET /asset/search/brand` - Buscar ativo por marca
- `GET /asset/search/model` - Buscar ativo por modelo
- `GET /asset/search/plate/:plate` - Buscar ativo por placa
- `GET /asset/search/serialNumber/:serialNumber` - Buscar ativo por número de série
- `PATCH /asset/:id` - Atualizar ativo

### Categorias de Ativos
- `POST /asset-category` - Criar categoria
- `GET /asset-category/search` - Listar categorias
- `GET /asset-category/search/:id` - Buscar categoria por ID
- `GET /asset-category/search/name` - Buscar categoria por nome
- `PATCH /asset-category/:id` - Atualizar categoria

### Fornecedores
- `POST /supplier` - Criar fornecedor
- `GET /supplier/search` - Listar fornecedores
- `GET /supplier/search/:id` - Buscar fornecedor por ID
- `GET /supplier/search/company` - Buscar fornecedor por nome da empresa
- `PATCH /supplier/:id` - Atualizar fornecedor

### Manutenções
- `POST /maintenance` - Criar manutenção
- `GET /maintenance/search` - Listar manutenções
- `GET /maintenance/search/:id` - Buscar manutenção por ID
- `PATCH /maintenance/:id/status` - Atualizar status da manutenção

### Documentos de Manutenção
- `POST /maintenance/:maintenanceId/document` - Upload de documento
- `GET /maintenance-document/search` - Listar documentos
- `GET /maintenance-document/search/:id` - Buscar documento por ID
- `GET /maintenance/:maintenanceId/documents` - Listar documentos de uma manutenção
- `GET /maintenance-document/:id/download` - Download de documento
- `DELETE /maintenance-document/:id` - Deletar documento

### Relatórios
- `GET /reports/maintenance` - Relatório de manutenções (requer autenticação)

## 🧪 Testes

Execute os testes:
```bash
npm test
```

Execute testes com cobertura:
```bash
npm run test:coverage
```

Execute testes em modo watch:
```bash
npm run test:watch
```

## 📊 Estrutura do Projeto

```
src/
├── http/
│   ├── controllers/     # Controllers HTTP
│   └── middleware/      # Middlewares
├── repositories/
│   ├── interfaces/      # Interfaces dos repositórios
│   ├── prisma/         # Implementações Prisma
│   └── in-memory/      # Implementações para testes
├── services/
│   ├── auth/           # Serviços de autenticação
│   ├── reports/        # Serviços de relatórios
│   ├── errors/         # Classes de erro customizadas
│   ├── factories/      # Factories para injeção de dependência
│   └── tests/          # Testes unitários
├── utils/              # Utilitários
└── lib/                # Configurações (Prisma, Logger)
```

## 🔐 Autenticação

O sistema usa JWT para autenticação. Para acessar rotas protegidas, inclua o header:

```
Authorization: Bearer <token>
```

## 📁 Upload de Arquivos

O sistema suporta upload de arquivos para documentos de manutenção:

- **Tipos permitidos**: PDF, imagens (JPEG, PNG, GIF), documentos (DOC, DOCX, XLS, XLSX)
- **Tamanho máximo**: 10MB
- **Localização**: `uploads/maintenance-documents/`

## 🎯 Próximas Funcionalidades

- [ ] Sistema de notificações
- [ ] Dashboard em tempo real
- [ ] Exportação de relatórios (PDF, Excel)
- [ ] API de integração com sistemas externos
- [ ] Métricas de performance

## 📝 Licença

ISC License

## 👥 Contribuição

1. Fork o projeto
2. Crie uma branch para sua feature (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request
