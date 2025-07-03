"""
Ejemplo de uso de las clases de sensores
"""
import time
import sys
import os

# Agregar el directorio app al path para poder importar los módulos
sys.path.append(os.path.join(os.path.dirname(__file__), 'app'))

from app.sensores import EstacionMeteorologica, PMS5003, MQ131, DHT22, GUVAS12SD

def ejemplo_uso_individual():
    """
    Ejemplo de uso individual de cada sensor
    """
    print("=== EJEMPLO DE USO INDIVIDUAL DE SENSORES ===\n")
    
    # Crear instancias de cada sensor
    sensor_pm25 = PMS5003()
    sensor_ozono = MQ131()
    sensor_clima = DHT22()
    sensor_uv = GUVAS12SD()
    
    # Leer cada sensor individualmente
    print("1. Leyendo sensor PMS5003 (PM2.5):")
    lectura_pm25 = sensor_pm25.leer()
    print(f"   Resultado: {lectura_pm25}\n")
    
    print("2. Leyendo sensor MQ131 (Ozono):")
    lectura_ozono = sensor_ozono.leer()
    print(f"   Resultado: {lectura_ozono}\n")
    
    print("3. Leyendo sensor DHT22 (Temperatura y Humedad):")
    lectura_clima = sensor_clima.leer()
    print(f"   Resultado: {lectura_clima}\n")
    
    print("4. Leyendo sensor GUVAS12SD (Radiación UV):")
    lectura_uv = sensor_uv.leer()
    print(f"   Resultado: {lectura_uv}\n")
    
    # Mostrar estados de los sensores
    print("5. Estados de los sensores:")
    for sensor in [sensor_pm25, sensor_ozono, sensor_clima, sensor_uv]:
        estado = sensor.obtener_estado()
        print(f"   {estado['nombre']}: {estado['estado']}")

def ejemplo_uso_estacion():
    """
    Ejemplo de uso de la estación meteorológica completa
    """
    print("\n=== EJEMPLO DE USO DE ESTACIÓN METEOROLÓGICA ===\n")
    
    # Crear la estación meteorológica
    estacion = EstacionMeteorologica()
    
    # Leer todos los sensores
    print("1. Leyendo todos los sensores:")
    mediciones = estacion.leer_todos_sensores()
    for nombre, lectura in mediciones.items():
        print(f"   {nombre}: {lectura}")
    
    # Obtener medición completa para la base de datos
    print("\n2. Medición completa para BD:")
    medicion_completa = estacion.obtener_medicion_completa()
    print(f"   (PM2.5, O3, UV, Temp, Humedad): {medicion_completa}")
    
    # Guardar en base de datos
    print("\n3. Guardando en base de datos:")
    if estacion.guardar_mediciones():
        print("   ✓ Mediciones guardadas exitosamente")
    else:
        print("   ✗ Error al guardar mediciones")
    
    # Mostrar estado de la estación
    print("\n4. Estado de la estación:")
    estado = estacion.obtener_estado_estacion()
    print(f"   Estado general: {estado['estado']}")
    for nombre, info in estado['sensores'].items():
        print(f"   {nombre}: {info['estado']}")

def ejemplo_simulacion_continua():
    """
    Ejemplo de simulación continua
    """
    print("\n=== EJEMPLO DE SIMULACIÓN CONTINUA ===\n")
    
    estacion = EstacionMeteorologica()
    
    print("Iniciando simulación continua (5 lecturas, 2 segundos entre cada una):")
    for i in range(5):
        print(f"\n--- Lectura {i+1} ---")
        
        # Leer y mostrar mediciones
        mediciones = estacion.leer_todos_sensores()
        for nombre, lectura in mediciones.items():
            if 'error' not in lectura:
                if nombre == 'pm25':
                    print(f"   PM2.5: {lectura.get('pm25_ugm3', 'N/A')} μg/m³")
                elif nombre == 'ozono':
                    print(f"   Ozono: {lectura.get('ozono_ppb', 'N/A')} ppb")
                elif nombre == 'clima':
                    print(f"   Temperatura: {lectura.get('temperatura', 'N/A')}°C")
                    print(f"   Humedad: {lectura.get('humedad_relativa', 'N/A')}%")
                elif nombre == 'uv':
                    print(f"   UV: {lectura.get('intensidad_uv', 'N/A')} mW/cm²")
        
        # Guardar en BD
        if estacion.guardar_mediciones():
            print("   ✓ Guardado en BD")
        else:
            print("   ✗ Error al guardar")
        
        time.sleep(2)

if __name__ == "__main__":
    try:
        ejemplo_uso_individual()
        ejemplo_uso_estacion()
        ejemplo_simulacion_continua()
        
        print("\n=== FIN DE EJEMPLOS ===")
        print("Para usar en producción, asegúrate de:")
        print("1. Configurar la conexión a la base de datos")
        print("2. Implementar las conexiones físicas a los sensores")
        print("3. Manejar errores y excepciones apropiadamente")
        print("4. Configurar logging para monitoreo")
        
    except Exception as e:
        print(f"Error en los ejemplos: {e}") 