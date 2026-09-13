# API Agendamento LeveSaúde

API REST para gerenciamento de agendas médicas e criação de agendamentos.

O projeto foi desenvolvido como teste técnico utilizando Node.js, TypeScript, Serverless Framework e AWS Lambda, com persistência em memória para simular o comportamento de um banco de dados.

## Tecnologias

- Node.js 20+
- TypeScript
- Serverless Framework
- AWS Lambda
- AWS API Gateway
- Serverless Offline
- Jest
- ESLint
- Prettier

## Arquitetura

O projeto utiliza separação de responsabilidades entre handlers, serviços e repositórios:

```text
API Gateway
    ↓
Lambda Handler
    ↓
Service / Use Case
    ↓
Repository Interface
    ↓
In-Memory Repository
```

Essa estrutura mantém os handlers responsáveis pela comunicação HTTP e concentra as regras de negócio nos services.

### Estrutura principal

```text
src/
├── handlers/
│   ├── getAgendas.ts
│   └── createAgendamento.ts
├── services/
│   ├── agendaService.ts
│   └── agendamentoService.ts
├── repositories/
│   ├── agendaRepository.ts
│   ├── inMemoryAgendaRepository.ts
│   ├── agendamentoRepository.ts
│   └── inMemoryAgendamentoRepository.ts
├── models/
│   ├── medico.ts
│   └── agendamento.ts
├── errors/
│   ├── appError.ts
│   ├── medicoNaoEncontradoError.ts
│   ├── horarioIndisponivelError.ts
│   ├── horarioOcupadoError.ts
│   └── validationError.ts
├── validators/
│   └── agendamentoValidator.ts
└── data/
    └── mockData.ts

tests/
├── handlers/
├── repositories/
├── services/
└── mockData.test.ts
```

## Instalação

Clone o repositório e entre na pasta do projeto:

```bash
git clone <URL_DO_REPOSITORIO>

cd api-agendamento-levesaude
```

Instale as dependências:

```bash
npm install
```

## Executando localmente

Para iniciar a API utilizando o Serverless Offline:

```bash
npm run dev
```

A API ficará disponível em:

```text
http://localhost:3000
```

O Serverless utiliza o stage `dev`. Portanto, os endpoints podem ser acessados através de:

```text
GET  http://localhost:3000/dev/agendas
POST http://localhost:3000/dev/agendamento
```

## Endpoints

### GET /agendas

Retorna os médicos e seus respectivos horários disponíveis.

#### Requisição

```bash
curl http://localhost:3000/dev/agendas
```

#### Resposta

```json
{
  "medicos": [
    {
      "id": 1,
      "nome": "Dr. João Silva",
      "especialidade": "Cardiologista",
      "horarios_disponiveis": [
        "2026-06-10 09:00",
        "2026-06-10 10:00",
        "2026-06-10 11:00"
      ]
    },
    {
      "id": 2,
      "nome": "Dra. Maria Souza",
      "especialidade": "Dermatologista",
      "horarios_disponiveis": ["2026-06-11 14:00", "2026-06-11 15:00"]
    }
  ]
}
```

### POST /agendamento

Cria um novo agendamento para um médico e horário disponível.

#### Requisição

O payload deve conter o objeto `agendamento`:

```bash
curl -X POST http://localhost:3000/dev/agendamento \
  -H "Content-Type: application/json" \
  -d '{
    "agendamento": {
      "medico_id": 1,
      "paciente": "Dérik Barcellos",
      "data_horario": "2026-06-10 09:00"
    }
  }'
```

#### Resposta de sucesso — 201

```json
{
  "mensagem": "Agendamento realizado com sucesso",
  "agendamento": {
    "id": "uuid-gerado",
    "medico": "Dr. João Silva",
    "paciente": "Dérik Barcellos",
    "data_horario": "2026-06-10 09:00"
  }
}
```

O campo `id` é gerado automaticamente utilizando UUID.

#### Horário ocupado — 409

Quando o mesmo médico já possui um agendamento para o horário solicitado:

```json
{
  "erro": "Horário indisponível",
  "mensagem": "O horário solicitado não está mais disponível para este médico."
}
```

### Status HTTP

| Status | Descrição                                                    |
| -----: | ------------------------------------------------------------ |
|    201 | Agendamento criado com sucesso                               |
|    400 | Payload inválido, médico inexistente ou horário indisponível |
|    409 | Horário já ocupado para o médico informado                   |
|    500 | Erro interno inesperado                                      |

## Validação

O endpoint `POST /agendamento` valida:

- o corpo da requisição deve ser um JSON válido;
- o objeto `agendamento` é obrigatório;
- `medico_id` deve ser um número inteiro;
- `paciente` é obrigatório;
- `data_horario` é obrigatório;
- o médico deve existir;
- o horário deve estar disponível para o médico;
- o horário não pode estar previamente ocupado.

As validações são realizadas antes da execução das regras de criação do agendamento.

## Testes

Execute todos os testes com:

```bash
npm test
```

Para executar os testes de forma sequencial:

```bash
npm test -- --runInBand
```

O projeto possui testes para:

- dados mockados;
- repositórios em memória;
- services;
- handlers;
- criação de agendamento;
- conflito de horários;
- validação de payload;
- médico inexistente;
- horário indisponível;
- JSON inválido;
- diferentes médicos utilizando o mesmo horário.

## Build

Para compilar o projeto TypeScript:

```bash
npm run build
```

Os arquivos compilados são gerados na pasta `dist/`.

A pasta `dist/` é gerada automaticamente e não faz parte do código-fonte versionado.

## Lint

Para executar o ESLint:

```bash
npm run lint
```

## Formatação

Para verificar a formatação:

```bash
npx prettier --check .
```

Para formatar os arquivos:

```bash
npm run format
```

## Deploy na AWS

O projeto utiliza o Serverless Framework para realizar o deploy das funções Lambda e dos endpoints da API Gateway.

É necessário possuir uma conta AWS e configurar as credenciais localmente.

Para realizar o deploy:

```bash
npx serverless deploy
```

Após o deploy, o Serverless exibirá as URLs dos endpoints publicados.

## Persistência

Este projeto utiliza armazenamento em memória, conforme permitido pelo teste técnico.

Os agendamentos são armazenados na implementação `InMemoryAgendamentoRepository`.

Isso significa que os dados não possuem persistência permanente e podem ser perdidos quando o processo ou a instância da aplicação for reiniciado.

Em uma aplicação real, o repository poderia ser substituído por uma implementação utilizando banco de dados sem alterar as regras de negócio dos services.

## Decisões de arquitetura

A aplicação utiliza interfaces para desacoplar os services das implementações concretas dos repositórios.

Por exemplo:

```text
AgendamentoService
       ↓
AgendamentoRepository
       ↓
InMemoryAgendamentoRepository
```

O `AgendamentoService` depende da abstração `AgendamentoRepository`, e a implementação concreta é fornecida externamente. Isso facilita testes unitários e permite substituir a persistência em memória por uma implementação real futuramente.

Os handlers são responsáveis principalmente por:

- receber as requisições HTTP;
- interpretar o payload;
- realizar a validação de entrada;
- chamar os services;
- transformar resultados e erros em respostas HTTP.

As regras de negócio ficam nos services, evitando que os handlers concentrem responsabilidades que não pertencem à camada HTTP.

Os erros de negócio são representados por classes específicas, permitindo que diferentes situações sejam tratadas de forma tipada.

## Scripts disponíveis

```bash
npm run dev       # inicia a API localmente
npm run build     # compila o TypeScript
npm test          # executa os testes
npm run lint      # executa o ESLint
npm run format    # formata os arquivos
```

## Observações

Este projeto foi desenvolvido com foco em:

- TypeScript com tipagem explícita;
- separação de responsabilidades;
- princípios SOLID;
- inversão de dependências;
- handlers enxutos;
- regras de negócio isoladas em services;
- persistência desacoplada por interfaces;
- tratamento de erros de negócio tipados;
- testes automatizados;
- execução local utilizando Serverless Offline.
