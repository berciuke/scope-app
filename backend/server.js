const express = require('express');

const app = express();
const PORT = process.env.PORT || 3001;

app.get('/', (req, res) => {
  res.send('Hello World from Scope App Backend!');
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
}); 