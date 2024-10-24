document.addEventListener("DOMContentLoaded", function () {
    mostrarTarefas(); // Chama a função para exibir as tarefas assim que a página é carregada
    mostrarTarefasFinalizadas();
});

// Função para mostrar as tarefas na tabela de Tarefas
function mostrarTarefas() {
    fetch('/mostrar_tarefa') // Chama a rota que retorna as tarefas
        .then(response => response.json())
        .then(data => {
            const tabelaTarefas = document.getElementById('tabelaTarefas').getElementsByTagName('tbody')[0];
            tabelaTarefas.innerHTML = ''; // Limpa a tabela antes de adicionar novas linhas

            data.forEach(tarefa => {
                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${tarefa.id}</td>
                    <td class="fw-bold"><img src="${tarefa.avatar}" alt="Avatar" style="width: 35px; height: auto; "> ${tarefa.nome}</td>
                    <td>${tarefa.titulo} <button class="fa-solid fa-plus" onclick="abrirModalDetalhesTarefa(${tarefa.id})"></button></td> 
                    <td>
                    <span class="badge ${
                            tarefa.prioridade === 1 ? 'bg-danger' :
                            tarefa.prioridade === 2 ? 'bg-warning' :
                            tarefa.prioridade === 3 ? 'bg-success' : ''
                        }">
                            ${tarefa.prioridade === 1 ? 'Alta' :
                              tarefa.prioridade === 2 ? 'Média' :
                              tarefa.prioridade === 3 ? 'Baixa' : ''}
                        </span>
                    </td>
                    <td>${tarefa.data}</td>
                    <td class="align-middle">
                        <a href="#!" data-mdb-tooltip-init title="Done" onclick="concluirTarefa(${tarefa.id})">
                            <i class="fas fa-check fa-lg text-success me-3"></i>
                        </a>
                        <a href="#!" data-mdb-tooltip-init title="Remove" onclick="removerTarefa(${tarefa.id})">
                            <i class="fas fa-trash-alt fa-lg text-warning"></i>
                        </a>
                    </td>
                `;
                tabelaTarefas.appendChild(novaLinha); // Adiciona a nova linha à tabela
            });
        })
        .catch(error => console.error('Erro ao carregar as tarefas:', error));
}


// Função cadastrar tarefa
document.getElementById('cadastrarTarefa').addEventListener('submit', function(event) {
    event.preventDefault();  // Evita o comportamento padrão de envio do formulário

    const usuario = document.getElementById('nome').value;
    const titulo = document.getElementById('titulo').value;
    const descricao = quill.root.innerHTML;  // Pega o conteúdo HTML do editor Quill
    const prioridade = document.getElementById('prioridade').value;

    fetch(`/cadastrar_tarefa`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Define o formato da requisição como JSON
        },
        body: JSON.stringify({
            nome: usuario,
            titulo: titulo,
            tarefa: descricao,  // O conteúdo da descrição está sendo enviado corretamente
            prioridade: prioridade
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Tarefa criada com sucesso!');
            mostrarTarefas();  // Atualiza a lista de tarefas

            // Limpar os campos do formulário
            document.getElementById('cadastrarTarefa').reset();
            quill.root.innerHTML = '';  // Limpa o editor Quill

            // Navegar para a aba "Tarefas"
            const tabTarefas = new bootstrap.Tab(document.querySelector('#tarefas-tab'));
            tabTarefas.show();  // Mostra a aba de tarefas
        } else {
            console.error('Erro ao criar a tarefa:', data.message);
        }
    })
    .catch(error => console.error('Erro ao cadastrar a tarefa:', error));
});


/// Função para mostrar as tarefas finalizadas na tabela
function mostrarTarefasFinalizadas() {
    fetch('/mostrar_tarefa_finalizada') // Chama a rota que retorna as tarefas finalizadas
        .then(response => response.json())
        .then(data => {
            const tabelaTarefas = document.getElementById('tabelaTarefasFinalizadas').getElementsByTagName('tbody')[0];
            tabelaTarefas.innerHTML = ''; // Limpa a tabela antes de adicionar novas linhas

            data.forEach(tarefa => {
                const novaLinha = document.createElement('tr');
                novaLinha.innerHTML = `
                    <td>${tarefa.id}</td>
                    <td><img src="${tarefa.avatar}" alt="Avatar" style="width: 35px; height: auto;"> ${tarefa.nome}</td>
                    <td>${tarefa.titulo} <button class="fa-solid fa-plus" onclick="abrirModalDetalhesTarefa(${tarefa.id})"></button></td>
                    <td>
                    <span class="badge ${
                            tarefa.prioridade === 1 ? 'bg-danger' :
                            tarefa.prioridade === 2 ? 'bg-warning' :
                            tarefa.prioridade === 3 ? 'bg-success' : ''
                        }">
                            ${tarefa.prioridade === 1 ? 'Alta' :
                              tarefa.prioridade === 2 ? 'Média' :
                              tarefa.prioridade === 3 ? 'Baixa' : ''}
                        </span>
                    </td>
                    <td>${tarefa.finalizada}</td>
                    <td class="align-middle">
                        <a href="#!" data-mdb-tooltip-init title="Remove" onclick="removerTarefa(${tarefa.id})">
                            <i class="fas fa-trash-alt fa-lg text-warning"></i>
                        </a>
                    </td>
                `;
                tabelaTarefas.appendChild(novaLinha); // Adiciona a nova linha à tabela
            });
        })
        .catch(error => console.error('Erro ao carregar as tarefas finalizadas:', error));
}

//Função concluirTarefa
function concluirTarefa(id) {
    if (confirm('Tem certeza que deseja finalizar esta tarefa?')) {
        fetch(`/finalizar_tarefa/${id}`, {
            method: 'POST',
        })
        .then(response => response.json())
        .then(data => {
            if (data.status === 'success') {
                console.log('Tarefa finalizada com sucesso!');
                mostrarTarefasFinalizadas();
                mostrarTarefas();  // Atualiza a tabela de tarefas
            }
        })
        .catch(error => console.error('Erro ao finalizar a tarefa:', error));
    }
}

// Função para remover a tarefa
function removerTarefa(id) {
  
    const confirmacao = confirm("Tem certeza que deseja excluir esta tarefa?");  // Exibe uma mensagem de confirmação para o usuário
        
    if (confirmacao) {// Se o usuário clicar em "OK", a exclusão será processada
        fetch(`/remover_tarefa/${id}`, { method: 'DELETE' })
            .then(response => {
                if (response.ok) {
                    console.log(`Tarefa ${id} removida!`);
                    mostrarTarefas(); // Atualiza a tabela após remover a tarefa
                    mostrarTarefasFinalizadas();
                } else {
                    console.error('Erro ao remover a tarefa');
                }
            })
            .catch(error => console.error('Erro ao remover a tarefa:', error));
    } else {
        console.log("Exclusão cancelada pelo usuário.");
    }
}



// Função para abrir o modal e preencher os detalhes da tarefa
function abrirModalDetalhesTarefa(id) {
    // Fazer uma requisição para obter os detalhes da tarefa pelo ID
    fetch(`/mostrar_tarefa_detalhada/${id}`)
        .then(response => response.json())
        .then(tarefa => {
            // Preencher os campos do modal com os dados da tarefa
            document.getElementById('tituloTarefa').value = tarefa.titulo;
            document.querySelector('.ql-editor').innerHTML = tarefa.tarefa;
            document.getElementById('prioridadeTarefa').value = tarefa.prioridade;

            // Atribuir o ID da tarefa ao botão "Salvar alterações"
            document.getElementById('salvarAlteracoesTarefa').setAttribute('data-id', id);

            // Abrir o modal
            var modal = new bootstrap.Modal(document.getElementById('detalhesTarefaModal'));
            modal.show();
        })
        .catch(error => console.error('Erro ao carregar os detalhes da tarefa:', error));
}

// Função para salvar as alterações da tarefa
document.getElementById('salvarAlteracoesTarefa').addEventListener('click', function() {
    const id = this.getAttribute('data-id');  // Pega o ID da tarefa atribuído anteriormente
    const titulo = document.getElementById('tituloTarefa').value;
    const descricao = quill2.root.innerHTML;
    const prioridade = document.getElementById('prioridadeTarefa').value;

    fetch(`/salvar_alteracoes_tarefa/${id}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'  // Define o formato da requisição como JSON
        },
        body: JSON.stringify({
            titulo: titulo,
            descricao: descricao,
            prioridade: prioridade
        })
    })
    .then(response => response.json())
    .then(data => {
        if (data.status === 'success') {
            console.log('Tarefa alterada com sucesso!');
            mostrarTarefas();  // Atualiza a lista de tarefas
            var modal = bootstrap.Modal.getInstance(document.getElementById('detalhesTarefaModal'));
            modal.hide();  // Fecha o modal após o sucesso
        } else {
            console.error('Erro ao alterar a tarefa:', data.message);
        }
    })
    .catch(error => console.error('Erro ao salvar as alterações da tarefa:', error));
});


//Função para ordenar tabela
// Define a variável ordemAsc como true inicialmente (para ordenação crescente)
let ordemAsc = true;

// Função para ordenar a tabela
function ordenarTabela() {
    const tabela = document.getElementById('tabelaTarefas'); // captura a tabela
    const linhas = Array.from(tabela.rows).slice(1); // converte todas as linhas em um array e usa slice(1) para ignorar o cabeçalho
    const criterio = document.getElementById('ordenarPor').value;

    // Ordenar por data (você pode usar a lógica da função mostrarTarefas se necessário)
    if (criterio === 'data') {
        mostrarTarefas(); 
    } 
    // Ordenar por nome
    else if (criterio === 'nome') {
        const nome = {'ALEF': 1, 'GILSON': 2, 'MELGAÇO': 3};
        linhas.sort((a, b) => {
            const nomeA = nome[a.cells[1].innerText.trim().toUpperCase()] || 0;  // Remover espaços e converter para maiúsculas
            const nomeB = nome[b.cells[1].innerText.trim().toUpperCase()] || 0;  // Se não encontrar, define como 0
            console.log(nomeA, nomeB);  // Exibe os valores no console
            return ordemAsc ? nomeA - nomeB : nomeB - nomeA;
        });
    }
    // Ordenar por ID
    else if (criterio === 'id') {
        linhas.sort((a, b) => {
            const idA = parseInt(a.cells[0].innerText);
            const idB = parseInt(b.cells[0].innerText);
            console.log(idA)
            return ordemAsc ? idA - idB : idB - idA;
        });
    } 
    // Ordenar por prioridade
    else if (criterio === 'prioridade') {
        const prioridades = { 'Alta': 1, 'Média': 2, 'Baixa': 3 };
        linhas.sort((a, b) => {
            const prioridadeA = prioridades[a.cells[3].innerText];
            const prioridadeB = prioridades[b.cells[3].innerText];
            return ordemAsc ? prioridadeA - prioridadeB : prioridadeB - prioridadeA;
        });
    } 


    // Atualiza o corpo da tabela com as linhas ordenadas
    const corpoTabela = tabela.getElementsByTagName('tbody')[0];
    corpoTabela.innerHTML = '';  // Limpa o corpo da tabela
    linhas.forEach(linha => corpoTabela.appendChild(linha));  // Adiciona as linhas ordenadas
}

