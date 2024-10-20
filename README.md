# Gerenciamento Jaguar

## Descrição

O **Gerenciamento Jaguar** é uma aplicação web desenvolvida com Flask para gerenciar tarefas de equipe. O sistema permite o cadastro de usuários, a atribuição de tarefas com diferentes níveis de prioridade, e o acompanhamento do status de cada tarefa (finalizada ou não). Além disso, possui integração com o Google Sheets e Quill Editor para a descrição de tarefas.

## Funcionalidades

- **Cadastro de Tarefas**: Adicione tarefas com prioridade (alta, média ou baixa), título e descrição utilizando um editor de texto Quill.
- **Visualização de Tarefas**: As tarefas são exibidas em uma tabela com opções de ordenação.
- **Edição de Tarefas**: Funcionalidade para editar os detalhes das tarefas através de um modal com o Quill Editor.
- **Uso de Modal e Quill Editor**: O sistema inclui um editor de texto rico para adicionar ou editar a descrição das tarefas.
  
## Tecnologias Utilizadas

- **Frontend**:
  - HTML, CSS, Bootstrap
  - JavaScript (Fetch API, Quill Editor)
  
- **Backend**:
  - Python (Flask)
  - Peewee ORM
  - SQLite (banco de dados local)

- **Ferramentas e Bibliotecas**:
  - Flask
  - Quill.js (editor de texto)
  - Google Sheets API (integração para salvar os dados das tarefas)
  
## Requisitos

- Python 3.x
- Flask
- Peewee
- SQLite
- Bootstrap (CSS e JavaScript)
- Quill.js

## Instalação

1. Clone este repositório:
   ```bash
   git clone https://github.com/seu-usuario/gerenciamento-jaguar.git
   ```
   
2. Navegue até o diretório do projeto:
   ```bash
   cd gerenciamento-jaguar
   ```

3. Crie um ambiente virtual e ative-o:
   ```bash
   python -m venv venv
   source venv/bin/activate  # no Windows: venv\Scripts\activate
   ```

4. Instale as dependências:
   ```bash
   pip install -r requirements.txt
   ```

5. Crie um arquivo `.env` e adicione as variáveis de ambiente:
   ```bash
   touch .env
   ```


6. Execute a aplicação:
   ```bash
   flask run
   ```

## Como Usar

1. Acesse o sistema pela URL `http://localhost:5000/`.
2. Cadastre uma nova tarefa na aba "Adicionar", preenchendo os campos de nome, título, prioridade e descrição com o editor de texto.
3. Visualize e gerencie as tarefas existentes na aba "Tarefas".
4. As tarefas finalizadas são movidas para a aba "Finalizadas".

## Contribuindo

Contribuições são bem-vindas! Para contribuir:

1. Faça um fork do repositório.
2. Crie uma nova branch: `git checkout -b feature-nova-funcionalidade`.
3. Faça as suas alterações e commit: `git commit -m 'Adiciona nova funcionalidade'`.
4. Envie para o GitHub: `git push origin feature-nova-funcionalidade`.
5. Abra um pull request.

## Licença

Este projeto está licenciado sob a Licença MIT.
