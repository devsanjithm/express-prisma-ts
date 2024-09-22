import swaggerAutogen from 'swagger-autogen';

const swaggerDef = {
  info: {
    title: `AlHayat API documentation`,
    version: '1.0.0',
    license: {
      name: 'MIT'
    }
  },
  host: 'localhost:5412', // by default: 'localhost:3000'
  basePath: '/v1', // by default: '/'
  schemes: ['http'],
  components: {
    securitySchemes: {
      bearerAuth: {
        type: 'http',
        scheme: 'bearer'
      }
    }
  },
  tags: [
    // by default: empty Array
    {
      name: 'users', // Tag name
      description: 'user api' // Tag description
    }
    // { ... }
  ]
};

const outputFile = './swagger_output.json';
const endpointsFiles = [
  '../routes/v1/user.route.ts'
  //   '../routes/v1/appoinment_request.route.ts',
  //   '../routes/v1/auth.route.ts',
  //   '../routes/v1/companyinfo.route.ts',
  //   '../routes/v1/confirmed_appt.route.ts',
  //   '../routes/v1/department.route.ts',
  //   '../routes/v1/dietpackage.route.ts',
  //   '../routes/v1/docslot.route.ts',
  //   '../routes/v1/doctor.route.ts',
  //   '../routes/v1/enquire.route.ts',
  //   '../routes/v1/memberfeeds.route.ts',
  //   '../routes/v1/otp.route.ts',
  //   '../routes/v1/point.route.ts',
  //   '../routes/v1/promt.route.ts',
  //   '../routes/v1/submember.route.ts'
];

swaggerAutogen()(outputFile, endpointsFiles, swaggerDef);
