const express = require('express');
const axios = require('axios');
const app = express();
const port = process.env.PORT || 8080;

// Tu API Key de OpenWeatherMap
const apiKey = 'cbcb359ff3661fe590c599dcde236275'; // Reemplaza con tu API Key

// Servir archivos estáticos (CSS, imágenes)
app.use(express.static('public'));

// Middleware para poder leer datos de un formulario
app.use(express.urlencoded({ extended: true }));

// Ruta principal (Formulario de entrada de ciudad)
app.get('/', (req, res) => {
  res.send(`
    <html>
      <head>
        <title>Clima</title>
        <link rel="stylesheet" type="text/css" href="styles.css">
      </head>
      <body>
        <div class="container">
          <h1>Consulta el clima de tu ciudad</h1>
          <form method="GET" action="/clima">
            <label for="ciudad">Ingresa la ciudad:</label>
            <input type="text" id="ciudad" name="ciudad" placeholder="Ejemplo: Buenos Aires" required>
            <button type="submit">Consultar</button>
          </form>
        </div>
      </body>
    </html>
  `);
});

// Ruta para obtener información del clima
app.get('/clima', async (req, res) => {
  const ciudad = req.query.ciudad || 'Buenos Aires'; // Ciudad por defecto
  try {
    const respuesta = await axios.get(`https://api.openweathermap.org/data/2.5/weather?q=${ciudad}&appid=${apiKey}&units=metric&lang=es`);
    
    // Si la ciudad es válida, esto debería funcionar
    const clima = respuesta.data;
    console.log(clima); // Esto imprimirá la respuesta completa en la terminal para que puedas verificar que la API devuelve la información correcta.
    
    res.send(`
      <html>
        <head>
          <title>Clima en ${ciudad}</title>
          <link rel="stylesheet" type="text/css" href="styles.css">
        </head>
        <body>
          <div class="container">
            <h1>Clima en ${ciudad}</h1>
            <div class="clima-info">
              <h2>${clima.weather[0].description}</h2>
              <img src="http://openweathermap.org/img/wn/${clima.weather[0].icon}.png" alt="Icono del clima">
              <p><strong>Temperatura:</strong> ${clima.main.temp}°C</p>
              <p><strong>Humedad:</strong> ${clima.main.humidity}%</p>
              <p><strong>Viento:</strong> ${clima.wind.speed} m/s</p>
              <br><br>
              <a href="/">Volver al formulario</a>
            </div>
          </div>
        </body>
      </html>
    `);
  } catch (error) {
    console.error(error.response ? error.response.data : error.message); // Mostrar detalles del error en la terminal
    res.send(`
      <html>
        <body>
          <h1>No se pudo obtener el clima para ${ciudad}. Error: ${error.message}</h1>
          <a href="/">Volver al formulario</a>
        </body>
      </html>
    `);
  }
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
