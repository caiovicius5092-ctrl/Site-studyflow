from flask import Blueprint

tarefas_bp = Blueprint("tarefas", __name__)

@tarefas_bp.route("/conta")
def home():
    return "Sistema de conta funcionando 🚀"
