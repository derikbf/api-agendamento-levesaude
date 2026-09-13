# API Agendamento LeveSaúde

API REST para gerenciamento de agendas médicas e criação de agendamentos.

O projeto foi desenvolvido como teste técnico utilizando Node.js, TypeScript, Serverless Framework e AWS Lambda, com persistência em memória para simular o comportamento de um banco de dados.

## Tecnologias

* Node.js 20+
* TypeScript
* Serverless Framework
* AWS Lambda
* AWS API Gateway
* Serverless Offline
* Jest
* ESLint
* Prettier

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

Estrutura principal:

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

A API ficará disponível localmente através do endereço:

```text
http://localhost:3000
```

O Serverless utiliza o stage `dev`, portanto os endpoints podem ser acessados através de:

```text
GET  http://localhost:3000/dev/agendas
POST http://localhost:3000/dev/agendamento
```

## Endpoints

### GET /agendas

Retorna os médicos e seus horários disponíveis.

Exemplo:

```bash
curl http://localhost:3000/dev/agendas
```

Resposta:

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
      "horarios_disponiveis": [
        "2026-06-11 14:00",
        "2026-06-11 15:00"
      ]
    }
  ]
}
```

### POST /agendamento

Cria um novo agendamento.

Exemplo:

```bash
curl -X POST http://localhost:3000/dev/agendamento \
  -H "Content-Type: application/json" \
  -d '{
    "medico_id": 1,
    "paciente": "Dérik Barcellos",
    "data_horario": "2026-06-10 09:00"
  }'
```

Resposta de sucesso:

```json
{
  "id": "uuid-gerado",
  "medico_id": 1,
  "paciente": "Dérik Barcellos",
  "data_horario": "2026-06-10 09:00"
}
```

Status HTTP:

| Status | Descrição                                                    |
| ------ | ------------------------------------------------------------ |
| 201    | Agendamento criado                                           |
| 400    | Payload inválido, médico inexistente ou horário indisponível |
| 409    | Horário já ocupado                                           |
| 500    | Erro interno inesperado                                      |

## Validação

O endpoint `POST /agendamento` valida:

* `medico_id` deve ser um número inteiro;
* `paciente` é obrigatório;
* `data_horario` é obrigatório;
* o corpo da requisição deve ser um JSON válido;
* o médico deve existir;
* o horário deve estar disponível para o médico;
* o horário não pode estar previamente ocupado.

## Testes

Execute todos os testes com:

```bash
npm test
```

O projeto possui testes para:

* dados mockados;
* repositórios em memória;
* serviços;
* handlers;
* criação de agendamento;
* conflito de horários;
* validação de payload;
* médico inexistente;
* horário indisponível;
* JSON inválido.

## Build

Para compilar o projeto TypeScript:

```bash
npm run build
```

Os arquivos compilados são gerados na pasta `dist/`.

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

Este projeto utiliza armazenamento em memória conforme permitido pelo teste técnico.

Os agendamentos são armazenados em uma estrutura `InMemoryAgendamentoRepository`.

Isso significa que os dados não possuem persistência permanente e podem ser perdidos quando o processo ou a instância da aplicação for reiniciado.

Em uma aplicação real, o repository poderia ser substituído por uma implementação utilizando banco de dados sem alterar a regra de negócio dos serviços.

## Decisões de arquitetura

A aplicação utiliza interfaces para desacoplar os serviços das implementações concretas dos repositórios.

Por exemplo:

```text
AgendamentoService
       ↓
AgendamentoRepository
       ↓
InMemoryAgendamentoRepository
```

Isso permite substituir a implementação em memória por uma implementação real de banco de dados posteriormente.

Os handlers são responsáveis principalmente pela comunicação HTTP, enquanto as regras de negócio ficam nos services.

Os erros de negócio são representados por classes específicas, permitindo que o handler faça o tratamento adequado de cada situação.

## Scripts disponíveis

```bash
npm run dev       # inicia a API localmente
npm run build     # compila o TypeScript
npm test          # executa os testes
npm run lint      # executa o ESLint
npm run format    # formata os arquivos
```
