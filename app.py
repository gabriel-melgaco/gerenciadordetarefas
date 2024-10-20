from flask import Flask, render_template, request, redirect, jsonify, flash
from peewee import *
from datetime import datetime


app = Flask(__name__)
db = SqliteDatabase('dados.db')
app.secret_key = 'sua_chave_secreta'

class Tarefas(Model):
    id = AutoField()
    nome = CharField()
    titulo = CharField()
    tarefa = CharField()
    prioridade = IntegerField()
    data = DateField()
    finalizada = DateField(null=True)
    avatar = CharField()

    class Meta:
        database = db  # Define o banco de dados para este modelo


db.connect()
db.create_tables([Tarefas])

@app.route("/")
def index():
    return render_template('index.html')


@app.route("/cadastrar_tarefa", methods=['POST'])
def cadastrar_tarefa():
    data = request.get_json()  # Obtém os dados enviados no formato JSON

    nome = data['nome']  # Corrige a sintaxe para acessar o dicionário
    titulo = data['titulo']
    tarefa = data['tarefa']
    prioridade = data['prioridade']
    data_criacao = datetime.now()  # 'data' já está sendo usada como variável, alterei para 'data_criacao'
    avatar = f'/static/img/{nome}.png'

    # Registrar no banco de dados
    Tarefas.create(nome=nome, titulo=titulo, tarefa=tarefa, prioridade=prioridade, data=data_criacao, avatar=avatar)

    return jsonify({"status": "success"})  # Responde com JSON


@app.route("/salvar_alteracoes_tarefa/<int:id>", methods=['POST'])
def salvar_alteracoes_tarefa(id):
    data = request.get_json()  # Recebe os dados enviados pelo frontend (JSON)

    # Busca a tarefa pelo ID
    tarefa = Tarefas.get_or_none(Tarefas.id == id)

    if tarefa:
        # Atualiza os campos da tarefa
        tarefa.titulo = data.get('titulo')
        tarefa.tarefa = data.get('descricao')  # O campo 'tarefa' representa a descrição
        tarefa.prioridade = data.get('prioridade')

        # Salva as alterações no banco de dados
        tarefa.save()

        # Retorna uma resposta de sucesso em formato JSON
        return jsonify({'status': 'success', 'message': 'Tarefa alterada com sucesso!'})
    else:
        # Se a tarefa não for encontrada, retorna um erro
        return jsonify({'status': 'error', 'message': 'Tarefa não encontrada!'}), 404



@app.route("/mostrar_tarefa")
def mostrar_tarefa():
    tarefas = Tarefas.select().where(Tarefas.finalizada.is_null()).order_by(Tarefas.data.desc())
    lista_tarefas = []

    for tarefa in tarefas:
        lista_tarefas.append({
            'id': tarefa.id,
            'nome': tarefa.nome,
            'titulo': tarefa.titulo,
            'tarefa': tarefa.tarefa,
            'prioridade': tarefa.prioridade,
            'data': tarefa.data.strftime('%d/%m/%Y'),
            'avatar': tarefa.avatar
        })

    return jsonify(lista_tarefas)

@app.route("/mostrar_tarefa_finalizada")
def mostrar_tarefa_finalizada():
    tarefas = Tarefas.select().order_by(Tarefas.data.desc())
    lista_tarefas =[]

    for tarefa in tarefas:
        if tarefa.finalizada:
            lista_tarefas.append({
                'id': tarefa.id,
                'nome': tarefa.nome,
                'titulo': tarefa.titulo,
                'tarefa': tarefa.tarefa,
                'prioridade': tarefa.prioridade,
                'finalizada': tarefa.finalizada.strftime('%d/%m/%Y'),
                'avatar': tarefa.avatar
            })
    return jsonify(lista_tarefas)


@app.route('/mostrar_tarefa_detalhada/<int:id>')
def detalhes_tarefa(id):
    try:
        tarefa = Tarefas.get_or_none(Tarefas.id == id)

        if tarefa:
            return jsonify({
                'titulo': tarefa.titulo,
                'tarefa': tarefa.tarefa,  # A descrição da tarefa
                'prioridade': tarefa.prioridade,
            }), 200
        else:
            return jsonify({'error': 'Tarefa não encontrada'}), 404
    except Exception as e:
        return jsonify({'error': str(e)}), 500


@app.route('/remover_tarefa/<int:id>', methods=['DELETE'])
def remover_tarefa(id):
    try:
        tarefa = Tarefas.get_or_none(Tarefas.id == id)

        if tarefa:
            tarefa.delete_instance()  # Excluir a tarefa
            return jsonify({'message': 'Tarefa removida com sucesso!'}), 200
        else:
            return jsonify({'error': 'Tarefa não encontrada!'}), 404

    except Exception as e:
        return jsonify({'error': str(e)}), 500



@app.route('/finalizar_tarefa/<int:id>', methods=['POST'])
def finalizar_tarefa(id):
    tarefa = Tarefas.get_or_none(Tarefas.id == id)
    tarefa.finalizada = datetime.now()
    tarefa.save()

    return jsonify({'status': 'success', 'message': 'Tarefa finalizada e movida para Tarefas Finalizadas'})

if __name__ == '__main__':
    app.run(debug=True)
