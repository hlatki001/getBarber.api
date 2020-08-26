module.exports = {
  email: "luis.hlatki@hotmail.com", // email da conta do pagseguro
  token: "839E71DF1C594B2C8F1815BCBFA75AB0", // token pagseguro
  appId: "app0371928661", // ID da aplicação (pagamento recorrente)
  appKey: "E43667640A0A7A1BB4A44FAB16B5F6A3", // Key da aplicação (pagemento recorrente)
  env: "sandbox",
  log: __dirname + "src/shared/pagseguro",
  debug: false,
  notificationURL: "http://localhost:3333/authorization/notification",
  redirectURL: "http://localhost:3333/authorization/response"
};
