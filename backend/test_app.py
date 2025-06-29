from app.models import obtener_mediciones

def test_obtener_mediciones():
    mediciones = obtener_mediciones()
    print(mediciones)

if __name__ == "__main__":
    test_obtener_mediciones()