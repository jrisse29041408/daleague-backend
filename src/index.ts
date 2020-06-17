import "reflect-metadata";
import { ApolloServer } from "apollo-server-express";
import * as express from "express";
import { buildSchema } from "type-graphql";
import { createConnection } from "typeorm";
import { RegisterResolver } from "./modules/user/Register";
import * as session from "express-session";
import * as connectRedis from "connect-redis";
import { redis } from "./redis";
import * as cors from "cors";
import { LoginResolver } from "./modules/user/Login";
import { MeResolver } from "./modules/user/Me";

const main = async () => {
  await createConnection();

  const schema = await buildSchema({
    resolvers: [RegisterResolver, LoginResolver, MeResolver],
    authChecker: ({ context: { req } }) => {
      return !!req.session.userId;
    }
  });

  const apolloServer = new ApolloServer({
    schema,
    context: ({ req }: any) => ({req})
  });

  const RedisStore = connectRedis(session);
  const sessionOption: session.SessionOptions = {
    store: new RedisStore({
      client: redis as any,
    }),
    name: "qid",
    secret: "dalfjdsfjoiqef23412ewdqd2342",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 1000 * 60 * 60 * 24 * 7 * 365, // 7 years
    },
  };

  const app = express();

  app.use(session(sessionOption));
  app.use(
    cors({
      credentials: true,
      origin: "https://localhost:3000"
    })
  );

  apolloServer.applyMiddleware({ app });

  app.listen(4000, () => {
    console.log("Server listening on http://localhost:4000/graphql");
  });
};

main();