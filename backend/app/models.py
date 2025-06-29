"""
Maneja las operaciones en la tabla
'mediciones'
"""
from .db import get_connection

def obtener_mediciones():
    """
    Obtiene todas las mediciones de la tabla 'mediciones'
    """
    conn = get_connection()
    try:
        with conn.cursor() as cursor:
            cursor.execute("SELECT * FROM mediciones")
            mediciones = cursor.fetchall()
            return mediciones
    except psycopg2.Error as e:
        print(f"Error al obtener las mediciones: {e}")
        raise
    finally:
        conn.close()

