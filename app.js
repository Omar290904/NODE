const express = require('express');
const app = express();
const port = process.env.PORT || 8080;

app.get('/', (req, res) => {
  res.send('¡Hola, mundo desde Azure!');
});

app.listen(port, () => {
  console.log(`Servidor escuchando en puerto ${port}`);
});
