import "server-only";

import mongoose from "mongoose";
import { serverEnv } from "@/lib/env";

type MongooseCache = {
  connection: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
};

const globalWithMongoose = globalThis as typeof globalThis & {
  __ssaromaMongoose?: MongooseCache;
};

const cache = globalWithMongoose.__ssaromaMongoose ?? {
  connection: null,
  promise: null,
};

globalWithMongoose.__ssaromaMongoose = cache;

export async function connectToDatabase() {
  if (cache.connection) return cache.connection;

  if (!cache.promise) {
    cache.promise = mongoose.connect(serverEnv.mongodbUri(), {
      bufferCommands: false,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 10_000,
    });
  }

  try {
    cache.connection = await cache.promise;
    return cache.connection;
  } catch (error) {
    cache.promise = null;
    throw error;
  }
}
