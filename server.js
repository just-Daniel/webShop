const express = require('express');
const config = require('config');
app = express();


require('./db/db');

require('./routes/auth/auth');
require('./routes/image');
require('./routes/category');
require('./routes/item');
require('./routes/itemImage');
require('./routes/shopingCartItem');

const PORT = config.get('port');

app.listen(PORT, () => console.log(
    `'Server started at http://localhost:${PORT}`));
