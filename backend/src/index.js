const express = require('express');
const cors = require('cors');
const app = express();
const passport = require('passport');
const path = require('path');
const fs = require('fs');
const bodyParser = require('body-parser');
const helmet = require('helmet');
const db = require('./db/models');
const config = require('./config');
const swaggerUI = require('swagger-ui-express');
const swaggerJsDoc = require('swagger-jsdoc');

const authRoutes = require('./routes/auth');
const fileRoutes = require('./routes/file');

const usersRoutes = require('./routes/users');

const employeesRoutes = require('./routes/employees');

const inventoriesRoutes = require('./routes/inventories');

const machineryRoutes = require('./routes/machinery');

const quality_checksRoutes = require('./routes/quality_checks');

const raw_materialsRoutes = require('./routes/raw_materials');

const suppliersRoutes = require('./routes/suppliers');

const work_ordersRoutes = require('./routes/work_orders');

const rolesRoutes = require('./routes/roles');

const permissionsRoutes = require('./routes/permissions');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      version: '1.0.0',
      title: 'ERP for Manufacturing',
      description:
        'ERP for Manufacturing Online REST API for Testing and Prototyping application. You can perform all major operations with your entities - create, delete and etc.',
    },
    servers: [
      {
        url: config.swaggerUrl,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
      responses: {
        UnauthorizedError: {
          description: 'Access token is missing or invalid',
        },
      },
    },
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  apis: ['./src/routes/*.js'],
};

const specs = swaggerJsDoc(options);
app.use(
  '/api-docs',
  function (req, res, next) {
    swaggerUI.host = req.get('host');
    next();
  },
  swaggerUI.serve,
  swaggerUI.setup(specs),
);

app.use(cors({ origin: true }));
require('./auth/auth');

app.use(bodyParser.json());

app.use('/api/auth', authRoutes);
app.use('/api/file', fileRoutes);

app.use(
  '/api/users',
  passport.authenticate('jwt', { session: false }),
  usersRoutes,
);

app.use(
  '/api/employees',
  passport.authenticate('jwt', { session: false }),
  employeesRoutes,
);

app.use(
  '/api/inventories',
  passport.authenticate('jwt', { session: false }),
  inventoriesRoutes,
);

app.use(
  '/api/machinery',
  passport.authenticate('jwt', { session: false }),
  machineryRoutes,
);

app.use(
  '/api/quality_checks',
  passport.authenticate('jwt', { session: false }),
  quality_checksRoutes,
);

app.use(
  '/api/raw_materials',
  passport.authenticate('jwt', { session: false }),
  raw_materialsRoutes,
);

app.use(
  '/api/suppliers',
  passport.authenticate('jwt', { session: false }),
  suppliersRoutes,
);

app.use(
  '/api/work_orders',
  passport.authenticate('jwt', { session: false }),
  work_ordersRoutes,
);

app.use(
  '/api/roles',
  passport.authenticate('jwt', { session: false }),
  rolesRoutes,
);

app.use(
  '/api/permissions',
  passport.authenticate('jwt', { session: false }),
  permissionsRoutes,
);

const publicDir = path.join(__dirname, '../public');

if (fs.existsSync(publicDir)) {
  app.use('/', express.static(publicDir));

  app.get('*', function (request, response) {
    response.sendFile(path.resolve(publicDir, 'index.html'));
  });
}

const PORT = process.env.PORT || 8080;

db.sequelize.sync().then(function () {
  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
});

module.exports = app;
