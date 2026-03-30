from flask import Flask, render_template
from routes.tarefas import tarefas_bp
from database.db import criar_tabela

app = Flask(__name__)

# cria a tabela ao iniciar
criar_tabela()

app.register_blueprint(tarefas_bp)

@app.route("/")
def index():
    return render_template("index.html")

if __name__ == "__main__":
    app.run(debug=True)()