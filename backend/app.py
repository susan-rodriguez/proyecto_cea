import os
from flask import Flask, jsonify, request
from flask_cors import CORS
import psycopg2
from psycopg2.extras import RealDictCursor

app = Flask(__name__)
# ¡Esto permite que tu React hable con Flask sin bloqueos de CORS!
CORS(app)

# CONFIGURACIÓN DE NEON TECH
DATABASE_URL = "postgresql://neondb_owner:npg_alOqBous7dj3@ep-dawn-resonance-acdju3ya.sa-east-1.aws.neon.tech/neondb?sslmode=require"

def get_db_connection():
    return psycopg2.connect(DATABASE_URL)

# 1. RUTA PARA EL CONSEJO DEL DÍA (Tótem - GET para leer, POST para agregar)
@app.route('/api/consejo', methods=['GET', 'POST'])
def handle_consejo():
    if request.method == 'POST':
        try:
            data = request.json
            texto = data.get('texto')
            categoria = data.get('categoria', 'General')
            autor = data.get('autor', 'Equipo CEA')

            if not texto:
                return jsonify({"status": "error", "message": "Falta el campo 'texto'"}), 400

            conn = get_db_connection()
            cur = conn.cursor()
            # Guardamos el nuevo consejo directamente en Neon SQL
            cur.execute(
                "INSERT INTO consejos (texto, categoria, autor) VALUES (%s, %s, %s) RETURNING id;",
                (texto, categoria, autor)
            )
            nuevo_id = cur.fetchone()[0]
            conn.commit()
            cur.close()
            conn.close()

            return jsonify({"status": "success", "message": "Consejo guardado en Neon!", "id": nuevo_id}), 201
        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 500

    # Petición GET: Obtener un consejo al azar
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        cur.execute("SELECT id, texto, categoria, autor FROM consejos ORDER BY RANDOM() LIMIT 3;")
        row = cur.fetchone()
        cur.close()
        conn.close()
        
        if row:
            return jsonify({
                "id": f"consejo-{row['id']}",
                "texto": row["texto"],
                "categoria": row.get("categoria") or "Agua",
                "autor": row.get("autor") or "Equipo CEA"
            })
            
        return jsonify({
            "id": "consejo-fallback",
            "texto": "Cierra el grifo mientras te cepillas los dientes. Puedes ahorrar hasta 12 litros de agua por minuto.",
            "categoria": "Agua",
            "autor": "Equipo CEA"
        })
    except Exception as e:
        print(f"⚠️ Error de conexión con Neon: {e}")
        return jsonify({
            "id": "consejo-error",
            "texto": "Cierra el grifo mientras te cepillas los dientes. Puedes ahorrar hasta 12 litros de agua por minuto. (Modo de Respaldo)",
            "categoria": "Agua",
            "autor": "Equipo CEA"
        })

# 2. RUTA PARA LA TRIVIA (GET para cargar y POST para guardar/responder)
@app.route('/api/trivia', methods=['GET', 'POST'])
def handle_trivia():
    if request.method == 'POST':
        try:
            data = request.json
            
            # CASO A: Viene del panel de administración (Crear una pregunta nueva)
            if 'pregunta' in data:
                pregunta = data.get('pregunta')
                opcion_a = data.get('opcion_a')
                opcion_b = data.get('opcion_b')
                correcta = data.get('correcta') # 'A' o 'B'
                explicacion = data.get('explicacion', '')

                conn = get_db_connection()
                cur = conn.cursor()
                cur.execute(
                    "INSERT INTO preguntas (pregunta, opcion_a, opcion_b, respuesta_correcta, explicacion) VALUES (%s, %s, %s, %s, %s) RETURNING id;",
                    (pregunta, opcion_a, opcion_b, correcta, explicacion)
                )
                nuevo_id = cur.fetchone()[0]
                conn.commit()
                cur.close()
                conn.close()

                return jsonify({"status": "success", "message": "Pregunta guardada en Neon SQL!", "id": nuevo_id}), 201

            # CASO B: Viene del móvil (Responder una trivia)
            else:
                pregunta_id = data.get('preguntaId', 'desconocido')
                respuesta = data.get('respuesta', 'X')

                conn = get_db_connection()
                cur = conn.cursor()
                cur.execute(
                    "INSERT INTO respuestas_usuarios (pregunta_id, respuesta) VALUES (%s, %s);",
                    (str(pregunta_id), str(respuesta))
                )
                conn.commit()
                cur.close()
                conn.close()

                print(f"📡 Respuesta Móvil Registrada en la base de datos: {data}")
                return jsonify({"status": "success", "message": "Respuesta guardada de forma segura en Neon."}), 201

        except Exception as e:
            return jsonify({"status": "error", "message": str(e)}), 400

    # Petición GET: Cargar las preguntas de la base de datos de verdad
    try:
        conn = get_db_connection()
        cur = conn.cursor(cursor_factory=RealDictCursor)
        
        cur.execute("SELECT id, pregunta, opcion_a, opcion_b, respuesta_correcta, explicacion FROM preguntas ORDER BY id ASC;")
        rows = cur.fetchall()
        
        cur.close()
        conn.close()
        
        if rows:
            preguntas_mapeadas = []
            for item in rows:
                resp_raw = item.get("respuesta_correcta")
                correcta_limpia = str(resp_raw).strip().upper() if resp_raw else "A"

                preguntas_mapeadas.append({
                    "id": f"trivia-{item['id']}",
                    "pregunta": item["pregunta"],
                    "opcionA": item["opcion_a"],
                    "opcionB": item["opcion_b"],
                    "correcta": correcta_limpia, 
                    "explicacion": item.get("explicacion") or "¡Excelente contribución a la ecología!"
                })
            return jsonify(preguntas_mapeadas)
            
    except Exception as e:
        print(f"💥 ERROR REAL EN EL GET DE NEON: {e}")

    # Fallback local modificado con tu pregunta real por si se cae el internet
    return jsonify([
        {
            "id": "trivia-fallback-local",
            "pregunta": "¿Cuánto tarda en degradarse una bolsa de plástico?",
            "opcionA": "15 años",
            "opcionB": "500 años",
            "correcta": "B",
            "explicacion": "Las bolsas de plástico comunes tardan siglos en fragmentarse microplásticamente."
        }
    ])

# 3. NUEVO: RUTA PARA ELIMINAR UNA PREGUNTA EN NEON
@app.route('/api/trivia/<int:id>', methods=['DELETE'])
def delete_trivia(id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM preguntas WHERE id = %s;", (id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"status": "success", "message": f"Pregunta {id} eliminada."}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

# 4. NUEVO: RUTA PARA ELIMINAR UN CONSEJO EN NEON
@app.route('/api/consejo/<int:id>', methods=['DELETE'])
def delete_consejo(id):
    try:
        conn = get_db_connection()
        cur = conn.cursor()
        cur.execute("DELETE FROM consejos WHERE id = %s;", (id,))
        conn.commit()
        cur.close()
        conn.close()
        return jsonify({"status": "success", "message": f"Consejo {id} eliminado."}), 200
    except Exception as e:
        return jsonify({"status": "error", "message": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)