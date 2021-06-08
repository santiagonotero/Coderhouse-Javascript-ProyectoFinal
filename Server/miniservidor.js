
import { createServer } from 'http';


const Tabla=[{

  "PesoMinimo": "0",
  "PesoMaximo": "1",
  "PrecioRegional": "505",
  "PrecioNacional": "700",
},
{

  "PesoMinimo": "2",
  "PesoMaximo": "5",
  "PrecioRegional": "610",
  "PrecioNacional": "865",
},
{

  "PesoMinimo": "6",
  "PesoMaximo": "10",
  "PrecioRegional": "770",
  "PrecioNacional": "1150",
},
{

  "PesoMinimo": "11",
  "PesoMaximo": "15",
  "PrecioRegional": "935",
  "PrecioNacional": "1420",
},
{

  "PesoMinimo": "16",
  "PesoMaximo": "20",
  "PrecioRegional": "1125",
  "PrecioNacional": "1660",
},
{

  "PesoMinimo": "21",
  "PesoMaximo": "25",
  "PrecioRegional": "1360",
  "PrecioNacional": "1990",
}
];

// Configurar una respuesta HTTP para todas las peticiones
function onRequest(request, response) {
  console.log("Peticion Recibida.");
  response.writeHead(200, {"Content-Type": "text/html"});
  response.write(JSON.stringify(Tabla));
  //response.write(`${Tabla}`);
  response.end();
}

const server = createServer(onRequest);

// Escuchar al puerto 3000
server.listen(3000);

// Poner un mensaje en la consola
console.log("Servidor funcionando en http://localhost:3000/");