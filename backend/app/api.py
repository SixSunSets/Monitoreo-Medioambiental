from flask import Flask, jsonify, request
from .models import obtener_mediciones

app = Flask(__name__)

@app.route('/mediciones', methods=['GET'])
def get_mediciones():
    """
    Endpoint para obtener todas las mediciones ambientales.
    
    Returns:
        JSON con la lista de mediciones o un mensaje de error.
    """
    try:
        mediciones = obtener_mediciones()
        return jsonify({
            'success': True,
            'data': mediciones,
            'message': 'Mediciones obtenidas exitosamente'
        }), 200
    except Exception as e:
        return jsonify({
            'success': False,
            'error': str(e),
            'message': 'Error al obtener las mediciones'
        }), 500

if __name__ == "__main__":
    app.run(debug=True, port=5000)