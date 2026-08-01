
try {
    console.log("Loading auth.controller...");
    const authController = require("./src/controllers/auth.controller");
    console.log("authController loaded. keys:", Object.keys(authController));
    console.log("authController.login type:", typeof authController.login);

    console.log("Loading auth.routes...");
    require("./src/routes/auth.routes");
    console.log("auth.routes loaded OK");
} catch (e) {
    console.error("ERROR:", e.message);
    console.error(e.stack);
}
