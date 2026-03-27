import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: {},
  handler: async (ctx) => {
    const columns = await ctx.db.query("columns").order("asc").collect();
    const tickets = await ctx.db.query("tickets").collect();
    return { columns, tickets };
  },
});

export const createColumn = mutation({
  args: { title: v.string() },
  handler: async (ctx, args) => {
    const columns = await ctx.db.query("columns").collect();
    const order = columns.length;
    const columnId = await ctx.db.insert("columns", {
      title: args.title,
      order,
    });
    return columnId;
  },
});

export const updateColumn = mutation({
  args: { id: v.id("columns"), title: v.string() },
  handler: async (ctx, args) => {
    await ctx.db.patch("columns", args.id, { title: args.title });
  },
});

export const deleteColumn = mutation({
  args: { id: v.id("columns") },
  handler: async (ctx, args) => {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_column", (q) => q.eq("columnId", args.id))
      .collect();
    for (const ticket of tickets) {
      await ctx.db.delete("tickets", ticket._id);
    }
    await ctx.db.delete("columns", args.id);
  },
});

export const createTicket = mutation({
  args: {
    columnId: v.id("columns"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    const tickets = await ctx.db
      .query("tickets")
      .withIndex("by_column", (q) => q.eq("columnId", args.columnId))
      .collect();
    const order = tickets.length;
    const ticketId = await ctx.db.insert("tickets", {
      columnId: args.columnId,
      title: args.title,
      description: args.description,
      order,
    });
    return ticketId;
  },
});

export const updateTicket = mutation({
  args: {
    id: v.id("tickets"),
    title: v.string(),
    description: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch("tickets", args.id, {
      title: args.title,
      description: args.description,
    });
  },
});

export const deleteTicket = mutation({
  args: { id: v.id("tickets") },
  handler: async (ctx, args) => {
    await ctx.db.delete("tickets", args.id);
  },
});

export const moveTicket = mutation({
  args: {
    ticketId: v.id("tickets"),
    targetColumnId: v.id("columns"),
    newOrder: v.number(),
  },
  handler: async (ctx, args) => {
    const ticket = await ctx.db.get("tickets", args.ticketId);
    if (!ticket) return;

    await ctx.db.patch("tickets", args.ticketId, {
      columnId: args.targetColumnId,
      order: args.newOrder,
    });
  },
});
