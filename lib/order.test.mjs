// npm test (Node 22.18+ laadt order.ts direct)
import assert from "node:assert/strict";
import test from "node:test";
import { buildOrder } from "./order.ts";

const ok = (lines, country) => {
  const o = buildOrder(lines, country);
  assert.ok(!("error" in o), JSON.stringify(o));
  return o;
};

test("NL altijd gratis, cadeau per thobe, cadeaudoos telt mee", () => {
  const o = ok([{ slug: "white-desert", size: "M", fit: "slim", giftBox: true, qty: 2 }], "NL");
  assert.equal(o.subtotal, 2 * (4499 + 500));
  assert.equal(o.shipping, 0);
  assert.deepEqual(o.lines.filter((l) => l.cents === 0).map((l) => [l.slug, l.qty]), [["musk", 2], ["siwak", 2]]);
});

test("EU onder de drempel betaalt, vanaf de drempel gratis; VK altijd", () => {
  assert.equal(ok([{ slug: "musk", qty: 1 }], "BE").shipping, 499);
  assert.equal(ok([{ slug: "white-desert", size: "S", fit: "broad", qty: 2 }], "DE").shipping, 0);
  assert.equal(ok([{ slug: "white-desert", size: "S", fit: "broad", qty: 2 }], "GB").shipping, 899);
  assert.equal(ok([{ slug: "musk", qty: 1 }], "NL").lines.length, 1);
});

test("weigert wat de browser verzint", () => {
  for (const [lines, country] of [
    [[{ slug: "caramel-sands", size: "M", fit: "slim", qty: 1 }], "NL"], // uitverkocht
    [[{ slug: "white-desert", size: "XXL", fit: "slim", qty: 1 }], "NL"],
    [[{ slug: "white-desert", size: "M", fit: "slim", qty: 0 }], "NL"],
    [[{ slug: "white-desert", size: "M", fit: "slim", qty: 1.5 }], "NL"],
    [[{ slug: "nope", qty: 1 }], "NL"],
    [[], "NL"],
    ["x", "NL"],
    [[{ slug: "musk", qty: 1 }], "US"],
  ]) assert.ok("error" in buildOrder(lines, country), JSON.stringify(lines));
});
