import random
import time
from .db import get_connection
from .sensores import EstacionMeteorologica

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
    Corre el bucle de simulación periódica usando la nueva estructura de clases
    """
    estacion = EstacionMeteorologica()
    print(f"[INFO] Estación meteorológica inicializada: {estacion.obtener_estado_estacion()}")
    
    try:
        while True:
            # Usar la nueva estructura de clases
            if estacion.guardar_mediciones():
                mediciones = estacion.obtener_medicion_completa()
                print(f"[OK] Mediciones guardadas: PM2.5={mediciones[0]}, O3={mediciones[1]}, UV={mediciones[2]}, T={mediciones[3]}°C, H={mediciones[4]}%")
            else:
                print("[ERROR] No se pudieron guardar las mediciones")
            
            time.sleep(intervalo_segundos)
    except KeyboardInterrupt:
        print("Simulador detenido por el usuario.")
    except Exception as e:
        print(f"Error en el simulador: {e}")

def run_simulador_legacy(intervalo_segundos=30):
    """
    Versión legacy del simulador (método anterior)
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
