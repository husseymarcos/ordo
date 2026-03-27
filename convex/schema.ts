import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  columns: defineTable({
    title: v.string(),
    order: v.number(),
  }).index("by_order", ["order"]),

  tickets: defineTable({
    columnId: v.id("columns"),
    title: v.string(),
    description: v.string(),
    order: v.number(),
  })
    .index("by_column", ["columnId"])
    .index("by_column_and_order", ["columnId", "order"]),
});
