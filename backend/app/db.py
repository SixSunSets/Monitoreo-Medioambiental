"""
Maneja la conexión a la base de datos PostgreSQL 
'mediciones_ambientales'.
"""
import psycopg2

# Configuración de la conexión a la base de datos PostgreSQL
DB_CONFIG = {
    'host': 'localhost',          # Dirección del servidor de la base de datos
    'port': 5432,                 # Puerto estándar de PostgreSQL
    'database': 'mediciones_ambientales',  # Nombre de la base de datos
    'user': 'postgres',           # Usuario de la base de datos
    'password': 'postgres'        # Contraseña del usuario
}

def get_connection():
    """
    Devuelve la conexión a la db con las configuraciones especificadas
    en DB_CONFIG.
    
    Si ocurre un error, la excepción es relanzada para la función que 
    invocó get_connection().
    """
    try:
        return psycopg2.connect(**DB_CONFIG)
    except psycopg2.Error as e:
        print(f"Error al conectar a la base de datos: {e}")
        raise
