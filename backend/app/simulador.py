import random
import time
from .db import get_connection

def generar_dato_sintetico():
    """
    Genera un conjunto de valores simulados con menor varianza.
    """
    pm25_ugm3 = round(random.uniform(10, 50), 2)          # μg/m3
    ozono_ppb = round(random.uniform(20, 40), 2)          # ppb
    intensidad_uv = round(random.uniform(0.5, 1.5), 2)    # mW/cm2
    temperatura = round(random.uniform(20, 30), 2)        # °C
    humedad_relativa = round(random.uniform(40, 70), 2)   # %
    return (pm25_ugm3, ozono_ppb, intensidad_uv, temperatura, humedad_relativa)

def insertar_dato(conn, datos):
    """
    Inserta el registro generado en la tabla.
    """
    with conn.cursor() as cursor:
        cursor.execute("""
            INSERT INTO mediciones 
            (pm25_ugm3, ozono_ppb, intensidad_uv, temperatura, humedad_relativa)
            VALUES (%s, %s, %s, %s, %s)
        """, datos)
        conn.commit()

def run_simulador(intervalo_segundos=30):
    """
    Corre el bucle de simulación periódica
    """
    conn = get_connection()
    try:
        while True:
            datos = generar_dato_sintetico()
            insertar_dato(conn, datos)
            print(f"[OK] Insertado: {datos}")
            time.sleep(intervalo_segundos)
    except KeyboardInterrupt:
        print("Simulador detenido por el usuario.")
    finally:
        conn.close()

if __name__ == "__main__":
    run_simulador()
