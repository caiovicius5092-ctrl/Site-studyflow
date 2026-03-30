import sqlite3

DB_PATH = "database/tarefas.db"

def obter_conexao():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    return conn

def criar_tabela():
    conn = obter_conexao()
    conn.execute("""
        CREATE TABLE IF NOT EXISTS tarefas (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            titulo TEXT NOT NULL,
            materia TEXT,
            prioridade TEXT,
            feita INTEGER DEFAULT 0
        )
    """)
    conn.commit()
    conn.close()