import fastify from "fastify";
import fastifyJwt from "@fastify/jwt";

import { getUsers } from "./routes/getUser";
import { Register } from "./routes/register";
import { login } from "./routes/login";

const app = fastify();

app.register(Register);
app.register(login);
app.register(getUsers);

app.register(fastifyJwt, {
  secret: "your-secret-key",
});

app
  .listen({
    port: 3333,
  })
  .then(() => console.log("server is running on http://localhost:3333"));
