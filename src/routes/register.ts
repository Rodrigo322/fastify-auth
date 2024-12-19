import { FastifyInstance } from "fastify";
import z from "zod";

import { hashPassword } from "../utils/hash";
import { prisma } from "../lib/prisma";

export function Register(app: FastifyInstance) {
  const registerSchema = z.object({
    name: z.string(),
    email: z.string().email(),
    password: z.string().min(8, "Password must be at least 6 characters long"),
  });

  app.post("/register", async (req, res) => {
    const { name, email, password } = registerSchema.parse(req.body);

    const existingUser = await prisma.user.findUnique({ where: { email } });

    if (existingUser) {
      return res.status(400).send({ message: "User already exists" });
    }

    const hashedPassword = await hashPassword(password);

    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    return res.status(201).send(user);
  });
}
