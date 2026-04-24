# Todo Fast API

API robusta para gerenciamento de tarefas (To-Do List) construída com **FastAPI**, seguindo princípios de arquitetura limpa, com suporte a autenticação JWT, persistência de dados e separação de responsabilidades.

A aplicação é uma solução Full Stack completa que permite o gerenciamento de usuários e suas respectivas tarefas através de uma interface web moderna e responsiva. Inclui:

-   **Interface Web Moderna**: Design premium com tema escuro, animações suaves e totalmente responsiva.
-   **Gerenciamento de Usuários**: Sistema completo de cadastro e login integrado ao backend.
-   **Gestão de Tarefas (Real-time)**: CRUD completo com atualizações instantâneas na interface.
-   **Filtros Inteligentes**: Visualização rápida de tarefas "Todas", "Pendentes" ou "Concluídas".
-   **Segurança**: Autenticação via tokens JWT com armazenamento seguro no frontend.
-   **Validação**: Verificação de dados tanto no cliente (JS) quanto no servidor (Pydantic).
    

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

```
Todo_Fast/
│
├── app/                              # Backend (FastAPI)
│   ├── api/                          # Interface e Handlers
│   ├── core/                         # Configurações e Segurança
│   ├── models/                       # Banco de Dados (Beanie)
│   ├── schemas/                      # Validação (Pydantic)
│   ├── services/                     # Lógica de Negócio
│   └── app.py                        # Ponto de entrada
│
├── frontend/                         # Interface Web
│   ├── css/                          # Estilos
│   ├── js/                           # Lógica do Cliente
│   └── index.html                    # HTML Principal
│
└── requirements.txt                  # Dependências Python
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
    

## 5. Banco de Dados em Nuvem e Configuração (.env)

O projeto utiliza o **MongoDB Atlas** (banco de dados NoSQL em nuvem) junto com o **Beanie ODM** para persistência de dados.

Crie um arquivo `.env` na pasta `app/` seguindo o modelo abaixo e certifique-se de preencher a string de conexão com o seu cluster do MongoDB:

```env
JWT_SECRET_KEY=sua_chave_secreta_aqui
JWT_REFRESH_SECRET_KEY=sua_chave_de_refresh_aqui
MONGO_CONNECTION_STRING="mongodb+srv://<usuario>:<senha>@<cluster>.mongodb.net/TodoFast?retryWrites=true&w=majority"
ALGORITHM=HS256
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

### Backend (API)
Para iniciar o servidor de desenvolvimento:
```bash
# Dentro da pasta principal
cd app
uvicorn app:app --reload
```
Acesse a documentação: [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

### Frontend (Web)
Não é necessário instalar nada para o front. Basta servir o arquivo estático:
1.  Use a extensão **Live Server** no VS Code para abrir o arquivo `frontend/index.html`.
2.  Ou simplesmente abra o arquivo `index.html` em seu navegador.
3.  O frontend se conectará automaticamente à API rodando na porta 8000.

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


### Backend
-   **FastAPI**: Framework de alto desempenho.
-   **Beanie (ODM)**: Integração assíncrona com MongoDB.
-   **Pydantic V2**: Validação de dados ultrarrápida.
-   **PyJWT/Passlib**: Segurança e criptografia.

### Frontend
-   **Vanilla JS**: Lógica pura, sem frameworks pesados.
-   **CSS3 Moderno**: Grid, Flexbox e Variáveis para tema dinâmico.
-   **Fetch API**: Comunicação assíncrona com o backend.
-   **Google Fonts**: Tipografia premium (Inter/Outfit).
    

----------

**Desenvolvido como parte dos estudos de FastAPI e Clean Architecture.**