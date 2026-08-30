import assert from "node:assert/strict";
import test from "node:test";
import { assertJsonRequest, assertSameOrigin } from "@/lib/http";
import { productSchema, settingsSchema } from "@/validators/admin";
import { checkoutSchema } from "@/validators/public";

const objectId = "507f1f77bcf86cd799439011";

test("checkout rejects duplicate products and excessive quantities", () => {
  const base = {
    customer: { name: "Test Customer", email: "", phone: "+92 300 1234567" },
    address: { street: "Test street 10", city: "Peshawar" },
  };
  assert.equal(
    checkoutSchema.safeParse({
      ...base,
      items: [
        { productId: objectId, quantity: 1 },
        { productId: objectId, quantity: 1 },
      ],
    }).success,
    false,
  );
  assert.equal(
    checkoutSchema.safeParse({ ...base, items: [{ productId: objectId, quantity: 10 }] }).success,
    false,
  );
});

test("published products require media", () => {
  const result = productSchema.safeParse({
    name: "Test Fragrance",
    slug: "test-fragrance",
    sku: "TEST-001",
    family: "Woody",
    gender: "unisex",
    collectionId: objectId,
    categoryId: objectId,
    concentration: "EDP",
    sizeMl: 50,
    price: 1000,
    stock: 5,
    featured: false,
    newArrival: false,
    published: true,
    rating: 0,
    reviewCount: 0,
    launchYear: 2026,
    mood: "A test mood",
    story: "A complete test product story.",
    notes: { top: ["Citrus"], heart: ["Rose"], base: ["Cedar"] },
    media: [],
  });
  assert.equal(result.success, false);
});

test("public settings reject executable URL schemes", () => {
  const partial = settingsSchema.pick({ instagramUrl: true, mapUrl: true });
  assert.equal(
    partial.safeParse({ instagramUrl: "javascript:alert(1)", mapUrl: "https://maps.google.com" })
      .success,
    false,
  );
  assert.equal(
    partial.safeParse({ instagramUrl: "https://instagram.com/ssaroma", mapUrl: "" }).success,
    true,
  );
});

test("homepage settings default section visibility and require images for image slots", () => {
  const home = settingsSchema.shape.home.parse({
    houseHeading: "House heading",
    houseBody: "House body",
    visitHeading: "Visit heading",
    visitBody: "Visit body",
    collectionHeading: "Collection heading",
    collectionBody: "Collection body",
    galleryQuote: "Gallery quote",
    galleryBody: "Gallery body",
    ctaHeading: "CTA heading",
    ctaBody: "CTA body",
  });
  assert.equal(home.showHouse, true);
  assert.equal(home.showGallery, true);

  const imageSlots = settingsSchema.pick({ visitImage: true });
  assert.equal(
    imageSlots.safeParse({
      visitImage: {
        id: "visit-image",
        type: "video",
        url: "https://res.cloudinary.com/demo/video.mp4",
        publicId: "ssaroma/demo/video",
        alt: "Wrong media type",
      },
    }).success,
    false,
  );
});

test("JSON and same-origin request guards reject malformed requests", () => {
  assert.throws(() =>
    assertJsonRequest(
      new Request("https://ssaroma.pk/api/orders", {
        method: "POST",
        headers: { "content-type": "text/plain" },
      }),
    ),
  );
  assert.throws(() =>
    assertSameOrigin(
      new Request("https://ssaroma.pk/api/orders", {
        method: "POST",
        headers: { origin: "https://attacker.example", host: "ssaroma.pk" },
      }),
    ),
  );
  assert.doesNotThrow(() =>
    assertSameOrigin(
      new Request("https://ssaroma.pk/api/orders", {
        method: "POST",
        headers: { origin: "https://ssaroma.pk", host: "ssaroma.pk" },
      }),
    ),
  );
});
