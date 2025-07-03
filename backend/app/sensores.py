 """
Clases para manejar los sensores del sistema de monitoreo ambiental
"""
import random
import time
from abc import ABC, abstractmethod
from typing import Dict, Any, Tuple
from .db import get_connection


class Sensor(ABC):
    """
    Clase abstracta base para todos los sensores
    """
    
    def __init__(self, nombre: str, descripcion: str):
        self.nombre = nombre
        self.descripcion = descripcion
        self.ultima_lectura = None
        self.estado = "inactivo"
    
    @abstractmethod
    def leer(self) -> Dict[str, Any]:
        """
        Método abstracto que debe implementar cada sensor
        Retorna un diccionario con las mediciones
        """
        pass
    
    def simular_lectura(self) -> Dict[str, Any]:
        """
        Método base para simular lecturas (puede ser sobrescrito)
        """
        return {"error": "Método no implementado"}
    
    def obtener_estado(self) -> Dict[str, Any]:
        """
        Retorna el estado actual del sensor
        """
        return {
            "nombre": self.nombre,
            "descripcion": self.descripcion,
            "estado": self.estado,
            "ultima_lectura": self.ultima_lectura
        }


class PMS5003(Sensor):
    """
    Sensor de partículas PM2.5 (PMS5003)
    Mide la concentración de partículas en el aire
    """
    
    def __init__(self):
        super().__init__(
            nombre="PMS5003",
            descripcion="Sensor de partículas PM2.5"
        )
        self.unidad = "μg/m³"
        self.rango_min = 0
        self.rango_max = 1000
    
    def leer(self) -> Dict[str, Any]:
        """
        Lee la concentración de PM2.5
        En una implementación real, aquí se conectaría al sensor físico
        """
        try:
            # Simulación de lectura del sensor
            pm25 = round(random.uniform(10, 50), 2)
            
            self.ultima_lectura = {
                "pm25_ugm3": pm25,
                "timestamp": time.time(),
                "unidad": self.unidad
            }
            self.estado = "activo"
            
            return self.ultima_lectura
            
        except Exception as e:
            self.estado = "error"
            return {"error": f"Error al leer PM2.5: {str(e)}"}
    
    def simular_lectura(self) -> Dict[str, Any]:
        """
        Simula una lectura del sensor PMS5003
        """
        return self.leer()


class MQ131(Sensor):
    """
    Sensor de ozono (MQ131)
    Mide la concentración de ozono en el aire
    """
    
    def __init__(self):
        super().__init__(
            nombre="MQ131",
            descripcion="Sensor de ozono"
        )
        self.unidad = "ppb"
        self.rango_min = 0
        self.rango_max = 1000
    
    def leer(self) -> Dict[str, Any]:
        """
        Lee la concentración de ozono
        En una implementación real, aquí se conectaría al sensor físico
        """
        try:
            # Simulación de lectura del sensor
            ozono = round(random.uniform(20, 40), 2)
            
            self.ultima_lectura = {
                "ozono_ppb": ozono,
                "timestamp": time.time(),
                "unidad": self.unidad
            }
            self.estado = "activo"
            
            return self.ultima_lectura
            
        except Exception as e:
            self.estado = "error"
            return {"error": f"Error al leer ozono: {str(e)}"}
    
    def simular_lectura(self) -> Dict[str, Any]:
        """
        Simula una lectura del sensor MQ131
        """
        return self.leer()


class DHT22(Sensor):
    """
    Sensor de temperatura y humedad (DHT22)
    Mide temperatura y humedad relativa
    """
    
    def __init__(self):
        super().__init__(
            nombre="DHT22",
            descripcion="Sensor de temperatura y humedad"
        )
        self.temperatura_unidad = "°C"
        self.humedad_unidad = "%"
    
    def leer(self) -> Dict[str, Any]:
        """
        Lee temperatura y humedad relativa
        En una implementación real, aquí se conectaría al sensor físico
        """
        try:
            # Simulación de lecturas del sensor
            temperatura = round(random.uniform(20, 30), 2)
            humedad = round(random.uniform(40, 70), 2)
            
            self.ultima_lectura = {
                "temperatura": temperatura,
                "humedad_relativa": humedad,
                "timestamp": time.time(),
                "temperatura_unidad": self.temperatura_unidad,
                "humedad_unidad": self.humedad_unidad
            }
            self.estado = "activo"
            
            return self.ultima_lectura
            
        except Exception as e:
            self.estado = "error"
            return {"error": f"Error al leer DHT22: {str(e)}"}
    
    def simular_lectura(self) -> Dict[str, Any]:
        """
        Simula una lectura del sensor DHT22
        """
        return self.leer()


class GUVAS12SD(Sensor):
    """
    Sensor de radiación UV (GUVAS12SD)
    Mide la intensidad de radiación ultravioleta
    """
    
    def __init__(self):
        super().__init__(
            nombre="GUVAS12SD",
            descripcion="Sensor de radiación UV"
        )
        self.unidad = "mW/cm²"
        self.rango_min = 0
        self.rango_max = 10
    
    def leer(self) -> Dict[str, Any]:
        """
        Lee la intensidad de radiación UV
        En una implementación real, aquí se conectaría al sensor físico
        """
        try:
            # Simulación de lectura del sensor
            intensidad_uv = round(random.uniform(0.5, 1.5), 2)
            
            self.ultima_lectura = {
                "intensidad_uv": intensidad_uv,
                "timestamp": time.time(),
                "unidad": self.unidad
            }
            self.estado = "activo"
            
            return self.ultima_lectura
            
        except Exception as e:
            self.estado = "error"
            return {"error": f"Error al leer UV: {str(e)}"}
    
    def simular_lectura(self) -> Dict[str, Any]:
        """
        Simula una lectura del sensor GUVAS12SD
        """
        return self.leer()


class EstacionMeteorologica:
    """
    Clase principal que coordina todos los sensores
    """
    
    def __init__(self):
        self.sensores = {
            "pm25": PMS5003(),
            "ozono": MQ131(),
            "clima": DHT22(),
            "uv": GUVAS12SD()
        }
        self.estado = "inicializado"
    
    def leer_todos_sensores(self) -> Dict[str, Any]:
        """
        Lee todos los sensores y retorna un diccionario con todas las mediciones
        """
        mediciones = {}
        
        for nombre, sensor in self.sensores.items():
            try:
                lectura = sensor.leer()
                mediciones[nombre] = lectura
            except Exception as e:
                mediciones[nombre] = {"error": f"Error en sensor {nombre}: {str(e)}"}
        
        return mediciones
    
    def obtener_medicion_completa(self) -> Tuple[float, float, float, float, float]:
        """
        Retorna una tupla con todas las mediciones en el orden de la base de datos:
        (pm25_ugm3, ozono_ppb, intensidad_uv, temperatura, humedad_relativa)
        """
        lecturas = self.leer_todos_sensores()
        
        pm25 = lecturas.get("pm25", {}).get("pm25_ugm3", 0)
        ozono = lecturas.get("ozono", {}).get("ozono_ppb", 0)
        uv = lecturas.get("uv", {}).get("intensidad_uv", 0)
        temp = lecturas.get("clima", {}).get("temperatura", 0)
        humedad = lecturas.get("clima", {}).get("humedad_relativa", 0)
        
        return (pm25, ozono, uv, temp, humedad)
    
    def guardar_mediciones(self) -> bool:
        """
        Guarda las mediciones en la base de datos
        """
        try:
            conn = get_connection()
            mediciones = self.obtener_medicion_completa()
            
            with conn.cursor() as cursor:
                cursor.execute("""
                    INSERT INTO mediciones 
                    (pm25_ugm3, ozono_ppb, intensidad_uv, temperatura, humedad_relativa)
                    VALUES (%s, %s, %s, %s, %s)
                """, mediciones)
                conn.commit()
            
            conn.close()
            return True
            
        except Exception as e:
            print(f"Error al guardar mediciones: {e}")
            return False
    
    def obtener_estado_estacion(self) -> Dict[str, Any]:
        """
        Retorna el estado de toda la estación meteorológica
        """
        return {
            "estado": self.estado,
            "sensores": {nombre: sensor.obtener_estado() 
                        for nombre, sensor in self.sensores.items()}
        }