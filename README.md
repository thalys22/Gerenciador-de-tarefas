# Todo Fast API

API robusta para gerenciamento de tarefas (To-Do List) construída com **FastAPI**, seguindo princípios de arquitetura limpa, com suporte a autenticação JWT, persistência de dados e separação de responsabilidades.

## 1. Visão Geral

A aplicação permite o gerenciamento completo de usuários e suas respectivas tarefas. Inclui:

-   **Gerenciamento de Usuários**: Cadastro e autenticação.
    
-   **Gestão de Tarefas**: CRUD completo de tarefas vinculadas ao usuário.
    
-   **Segurança**: Autenticação via tokens JWT (JSON Web Tokens).
    
-   **Arquitetura Modular**: Divisão clara entre lógica de negócio (services), modelos de dados (models) e interface (api).
    
-   **Validação**: Uso intensivo de Pydantic para garantia de integridade dos dados.
    

**Versão**: 1.0.0

## 2. Arquitetura (Camadas)

O projeto adota uma estrutura organizada para facilitar a manutenção e escalabilidade:

-   **Core**: Configurações centrais da aplicação e segurança (JWT, hashing de senhas).
    
-   **Models**: Definição das entidades de banco de dados (User e Task).
    
-   **Schemas**: DTOs (Data Transfer Objects) para validação de entrada e saída de dados via Pydantic.
    
-   **Services**: Camada de lógica de negócio, onde reside a inteligência da aplicação.
    
-   **API (Handlers)**: Controladores que recebem as requisições HTTP e orquestram a resposta.
    
-   **Dependencies**: Injeção de dependências, como a recuperação do usuário atual a partir do token.
    

## 3. Estrutura do Repositório

Plaintext

```
FastApi/Todo_Fast/
│
├── app/
│   ├── api/                          # Camada de Interface (Handlers)
│   │   ├── api_v1/
│   │   │   ├── handlers/             # Implementação dos endpoints (task, user)
│   │   │   └── router.py             # Agregador de rotas da V1
│   │   ├── auth/                     # Endpoints de autenticação (JWT)
│   │   └── depedencies/              # Injeção de dependência (Auth deps)
│   │
│   ├── core/                         # Configurações e Segurança
│   │   ├── config.py                 # Variáveis de ambiente e settings
│   │   └── security.py               # Lógica de JWT e Criptografia
│   │
│   ├── models/                       # Entidades (Banco de Dados)
│   │   ├── user_model.py
│   │   └── task_model.py
│   │
│   ├── schemas/                      # Esquemas de Validação (Pydantic)
│   │   ├── user_schema.py
│   │   ├── task_schema.py
│   │   └── auth_schema.py
│   │
│   ├── services/                     # Camada de Lógica de Negócio
│   │   ├── user_service.py
│   │   └── task_service.py
│   │
│   ├── app.py                        # Ponto de entrada da aplicação
│   └── .env                          # Variáveis sensíveis
└── Code/                             # Scripts de exemplo e aprendizado

```

## 4. Instalação

**Pré-requisitos**: Python 3.13+

1.  Clone o repositório.
    
2.  Crie um ambiente virtual:
    
    Bash
    
    ```
    python -m venv venv
    source venv/bin/activate  # Linux/Mac
    # ou
    venv\Scripts\activate     # Windows
    
    ```
    
3.  Instale as dependências (ajuste conforme seu gerenciador, ex: pip):
    
    Bash
    
    ```
    pip install fastapi uvicorn pydantic python-jose[cryptography] passlib[bcrypt] python-dotenv
    
    ```
    

## 5. Configuração (.env)

Crie um arquivo `.env` na pasta `app/` seguindo o modelo:

Snippet de código

```
JWT_SECRET_KEY=sua_chave_secreta_aqui
JWT_REFRESH_SECRET_KEY=sua_chave_de_refresh_aqui
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30

```

## 6. Execução Local

Para iniciar o servidor de desenvolvimento:

Bash

```
python app/app.py

```

Acesse a documentação interativa em: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

## 7. Endpoints Principais

| **Método** | **Endpoint**             | **Descrição**                                 |
| ---------- | ------------------------ | --------------------------------------------- |
| POST       | `/api/v1/user/create`    | Registra um novo usuário                      |
| POST       | `/api/v1/auth/login`     | Autentica usuário e retorna Token JWT         |
| GET        | `/api/v1/task/`          | Lista todas as tarefas do usuário autenticado |
| POST       | `/api/v1/task/create`    | Cria uma nova tarefa                          |
| GET        | `/api/v1/task/{task_id}` | Obtém detalhes de uma tarefa específica       |
| PUT        | `/api/v1/task/{task_id}` | Atualiza uma tarefa existente                 |
| DELETE     | `/api/v1/task/{task_id}` | Remove uma tarefa                             |
|            |                          |                                               |


## 8. Tecnologias Utilizadas

-   **FastAPI**: Framework web moderno e de alto desempenho.
    
-   **Pydantic**: Validação de dados e gestão de configurações.
    
-   **Passlib (Bcrypt)**: Hash de senhas para segurança.
    
-   **PyJWT**: Geração e validação de tokens JWT.
    
-   **Python Dotenv**: Gestão de variáveis de ambiente.
    

----------

**Desenvolvido como parte dos estudos de FastAPI e Clean Architecture.**