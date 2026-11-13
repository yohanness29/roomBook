import { TypeBoxTypeProvider } from "@fastify/type-provider-typebox";
import { FastifyPluginAsync } from "fastify";
import Type from "typebox";
import argon2 from "argon2";
import { HttpError } from "../plugins/errors.ts";
const credentials = Type.Object({
  email: Type.String({ format: "email" }),
  pwd: Type.String({ minLength: 8 }),
});
export const AuthRoutes: FastifyPluginAsync = async (app) => {
  const typed = app.withTypeProvider<TypeBoxTypeProvider>();
  const { prisma } = app;
  typed.post(
    "/register",
    {
      schema: {
        tags: ["auth"],
        body: credentials,
      },
    },
    async (request, reply) => {
      const pwdHash = await argon2.hash(request.body.pwd);
      const user = await prisma.user.create({
        data: { email: request.body.email, pwdHash },
        select: { id: true, email: true, role: true },
      });
      return reply.code(201).send(user);
    },
  );
  typed.post("/login", { schema: { body: credentials } }, async (request) => {
    const user = await prisma.user.findUnique({
      where: { email: request.body.email },
    });
    const ok = user && (await argon2.verify(user?.pwdHash, request.body.pwd));
    if (!ok || !user) throw new HttpError(401, "Identifiants incorrectes");
    const token = app.jwt.sign({ sub: user.id.toString(), role: user.role });
    return { token };
  });
};
