import fetch from "node-fetch";
import excel from "exceljs";
import axios from "axios";

async function ejecucion() {
  async function leerArchivoDatos() {
    let arregloRequests = [];
    const workbook = new excel.Workbook();
    const archivoDatos = await workbook.xlsx.readFile("./Datos.xlsx");
    const hoja1 = workbook.getWorksheet(1);

    // Itera a través de las filas y columnas para leer los datos
    hoja1.eachRow((row, rowNumber) => {
      // Accede a las celdas de la fila
      let jsonFila = {
        title: "",
        body: "",
        userId: "",
        id: "",
      };

      jsonFila.title = row.getCell(1).value;
      jsonFila.body = row.getCell(2).value;
      jsonFila.userId = row.getCell(3).value;
      jsonFila.id = row.getCell(4).value;

      arregloRequests.push(jsonFila);
    });

    return arregloRequests;
  }

  const arregloRequests = await leerArchivoDatos();

  console.log(arregloRequests);

  const url = "https://jsonplaceholder.typicode.com/posts";

  // Función para realizar una solicitud POST y devolver una promesa junto con la solicitud original
  function postRequestWithOriginal(request) {
    return axios.post(url, request).then((response) => ({
      request,
      response,
    }));
  }

  // Usar Promise.all para realizar todas las solicitudes POST concurrentemente
  Promise.all(arregloRequests.map(postRequestWithOriginal))
    .then((results) => {
      results.forEach((result) => {
        const { request, response } = result;
        console.log(
          `Solicitud exitosa - ID del nuevo post: ${response.data.id}`
        );
        console.log(
          "Datos de la respuesta:",
          JSON.stringify(response.data, null, 2)
        );
        console.log("Datos de la solicitud original:", request);

        //Podría tomar los datos de la solicitud original y ponerlos en un excel y en la misma fila poner los datos de la respuesta.

      });
    })
    .catch((error) => {
      console.error("Error al realizar las solicitudes:", error.message);
    });
}

ejecucion();
