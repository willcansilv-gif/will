require('dotenv').config({ path: '.env' });
const { createServer } = require('./app');

const PORT = process.env.PORT || 4000;

const app = createServer();

app.listen(PORT, () => {
  // eslint-disable-next-line no-console
  console.log(`VITAHUB backend running on port ${PORT}`);
});
