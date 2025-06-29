import psycopg2

# Configuración de la conexión a la base de datos PostgreSQL
DB_CONFIG = {
    'host': 'localhost',          # Dirección del servidor de la base de datos
    'port': 5432,                 # Puerto estándar de PostgreSQL
    'database': 'mediciones_ambientales',  # Nombre de la base de datos
    'user': 'postgres',           # Usuario de la base de datos
    'password': 'postgres'        # Contraseña del usuario
}

def crear_tabla_mediciones():
    """
    Función para crear la tabla de mediciones ambientales en la base de datos
    """
    try:
        # Establecer conexión con la base de datos usando los parámetros configurados
        conexion = psycopg2.connect(**DB_CONFIG)
        
        # Crear un cursor para ejecutar comandos SQL
        cursor = conexion.cursor()
        
        # Query SQL para crear la tabla de mediciones ambientales
        crear_tabla_sql = """
        CREATE TABLE IF NOT EXISTS mediciones (
            id SERIAL PRIMARY KEY,                    -- Identificador único autoincremental
            fecha_hora TIMESTAMP DEFAULT NOW(),       -- Fecha y hora de la medición (actual por defecto)
            pm25_ugm3 REAL,                           -- Concentración de PM 2.5 en μg/m3
            ozono_ppb REAL,                           -- Concentración de ozono en partes por billón
            intensidad_uv REAL,                       -- Intensidad UV en mW/cm2
            temperatura REAL,                         -- Temperatura en grados Celsius
            humedad_relativa REAL                     -- Humedad relativa en porcentaje
        );
        """
        
        # Ejecutar el comando SQL para crear la tabla
        cursor.execute(crear_tabla_sql)
        
        # Confirmar los cambios en la base de datos
        conexion.commit()
        
        print("[+] Tabla 'mediciones' creada exitosamente")
        
    except psycopg2.Error as error:
        # Capturar y mostrar errores específicos de PostgreSQL
        print(f"[!] Error al crear la tabla: {error}")
        
    except Exception as error:
        # Capturar cualquier otro tipo de error
        print(f"[!] Error inesperado: {error}")
        
    finally:
        # Cerrar el cursor y la conexión para liberar recursos
        if 'cursor' in locals():
            cursor.close()
        if 'conexion' in locals():
            conexion.close()
            print("[+] Conexión a la base de datos cerrada")

# Ejecutar la función si este script se ejecuta directamente
if __name__ == "__main__":
    crear_tabla_mediciones()