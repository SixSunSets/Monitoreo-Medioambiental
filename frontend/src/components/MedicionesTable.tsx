import { useEffect, useState } from "react";
import axios from "axios";

export default function MedicionesTable() {
  const [mediciones, setMediciones] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:5000/mediciones")
      .then(response => {
        if (response.data.success) {
          setMediciones(response.data.data);
        }
      })
      .catch(error => console.error("Error al obtener mediciones:", error));
  }, []);

  return (
    <div>
      <h2>Mediciones Ambientales</h2>
      <table border={1}>
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>PM2.5</th>
            <th>Ozono</th>
            <th>UV</th>
            <th>Temperatura</th>
            <th>Humedad</th>
          </tr>
        </thead>
        <tbody>
          {mediciones.map((m) => (
            <tr key={m[0]}>
              <td>{m[0]}</td>
              <td>{m[1]}</td>
              <td>{m[2]}</td>
              <td>{m[3]}</td>
              <td>{m[4]}</td>
              <td>{m[5]}</td>
              <td>{m[6]}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
