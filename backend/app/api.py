from flask import Flask, jsonify, request
from .models import obtener_mediciones
from flask_cors import CORS

app = Flask(__name__)
CORS(app, origins=["http://localhost:5173"])

@app.route('/mediciones', methods=['GET'])
def get_mediciones():
    """
    Endpoint para obtener todas las mediciones ambientales.
    
    Returns:
        JSON con la lista de mediciones o un mensaje de error.
    """
    try:
        # Obtener las mediciones de la base de datos
        mediciones = obtener_mediciones()
        # Devolver las mediciones en formato JSON
        return jsonify({
            'success': True,
            'data': mediciones,
            'message': 'Mediciones obtenidas exitosamente'
        }), 200
    except Exception as e:
        # Devolver un mensaje de error en formato JSON
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al obtener las mediciones'
        }), 500

if __name__ == "__main__":
    # Ejecutar la aplicación Flask en modo debug y en el puerto 5000
    app.run(debug=True, port=5000)