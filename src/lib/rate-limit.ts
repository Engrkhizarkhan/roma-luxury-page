import "server-only";

import { connectToDatabase } from "@/lib/db";
import { RateLimit } from "@/models/rate-limit";

export async function enforceRateLimit(
key: string,
limit: number,
windowSeconds: number,
) {
await connectToDatabase();

const now = new Date();
const expiresAt = new Date(now.getTime() + windowSeconds * 1000);

const activeWindow = { $gt: ["$expiresAt", now] };

const record = await RateLimit.findOneAndUpdate(
{ key: key.slice(0, 240) },
[
{
$set: {
count: {
$cond: [
activeWindow,
{ $add: [{ $ifNull: ["$count", 0] }, 1] },
1,
],
},
expiresAt: {
$cond: [activeWindow, "$expiresAt", expiresAt],
},
},
},
],
{
upsert: true,
returnDocument: "after",
updatePipeline: true,
},
);

if (record && record.count > limit) {
throw Object.assign(
new Error("Too many requests. Please try again later."),
{
statusCode: 429,
},
);
}
}
