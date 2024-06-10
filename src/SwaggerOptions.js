exports.options = {
  exposeRoute: true,
  routePrefix: "/admindocs",
  swagger: {
    info: {
      title: "BluAart - Admin API Documentation",
      description: "BluAart NFT admin api documentation",
      version: "1.0.0",
    },
    externalDocs: {
      url: "https://swagger.io",
      description: "Find more info here",
    },
    host: "bluaartadminapipostgresql.stsblockchain.xyz",
    basePath: "",
    schemes: ["https"],
    consumes: ["application/json", "multipart/form-data"],
    produces: ["application/json"],
    securityDefinitions: {
      Bearer: {
        type: "apiKey",
        name: "Authorization",
        in: "header",
        description:
          'Enter the token with the `Bearer: ` prefix, e.g. "Bearer abcde12345',
      },
    },
    security: [
      {
        Bearer: [],
      },
    ],
  },
};
