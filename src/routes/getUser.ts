import { FastifyInstance } from "fastify";

export function getUsers(app: FastifyInstance) {
  app.addHook("onRequest", async (req, res) => {
    try {
      await req.jwtVerify();
    } catch (err) {
      return res.status(401).send({ message: "Unauthorized" });
    }
  });

  app.get("/profile", async (req) => {
    return req.user;
  });
}
