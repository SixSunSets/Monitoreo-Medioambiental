"""
Maneja las operaciones en la tabla
'mediciones'
"""
from .db import get_connection

def obtener_mediciones():
    """
    Obtiene todas las mediciones de la tabla 'mediciones'
    """
    # Obtener la conexión a la base de datos
    conn = get_connection()
    try:
        # Crear un cursor para ejecutar consultas
        with conn.cursor() as cursor:
            # Ejecutar la consulta para obtener todas las mediciones
            cursor.execute("SELECT * FROM mediciones")
            # Obtener los resultados de la consulta
            mediciones = cursor.fetchall()
            # Devolver los resultados
            return mediciones
    except psycopg2.Error as e:
        # Capturar y mostrar errores específicos de PostgreSQL
        print(f"Error al obtener las mediciones: {e}")
        raise
    finally:
        # Cerrar la conexión a la base de datos
        conn.close()

