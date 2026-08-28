import express from 'express';

const app = express();

import login from './controllers/login';

app.use("/", login);

app.listen(8080, () => {
  console.log('Servidor iniciado na porta 8080: http://localhost:8080');
});