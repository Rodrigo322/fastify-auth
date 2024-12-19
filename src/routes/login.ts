import fastify, { FastifyInstance } from "fastify";
import z from "zod";
import { prisma } from "../lib/prisma";
import { verifyPassword } from "../utils/hash";

export function login(app: FastifyInstance) {
  const loginSchema = z.object({ email: z.string().email(), password: z.string() });

  app.post("/login", async (req, res) => {
    const { email, password } = loginSchema.parse(req.body);

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      return res.status(401).send({ message: "User not found" });
    }

    const isPasswordValid = await verifyPassword(password, user.password);

    if (!isPasswordValid) {
      return res.status(401).send({ message: "Invalid password" });
    }

    const token = app.jwt.sign({ id: user.id, email: user.email });

    return res.status(200).send({ token });
  });
}
