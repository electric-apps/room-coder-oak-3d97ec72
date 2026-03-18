import { createFileRoute } from "@tanstack/react-router";
import { eq } from "drizzle-orm";
import { db } from "@/db";
import { todos } from "@/db/schema";
import { todoInsertSchema } from "@/db/zod-schemas";
import { generateTxId, parseDates } from "@/db/utils";

export const Route = createFileRoute("/api/mutations/todos")({
	server: {
		handlers: {
			POST: async ({ request }) => {
				const raw = parseDates(await request.json());
				const body = todoInsertSchema.parse(raw);
				let txid!: number;
				const result = await db.transaction(async (tx) => {
					txid = await generateTxId(tx);
					const [todo] = await tx.insert(todos).values(body).returning();
					return todo;
				});
				return Response.json({ todo: result, txid });
			},
			PUT: async ({ request }) => {
				const raw = parseDates(await request.json());
				const partial = todoInsertSchema.partial().parse(raw);
				const { id, ...updates } = partial as {
					id: string;
					[key: string]: unknown;
				};
				let txid!: number;
				const result = await db.transaction(async (tx) => {
					txid = await generateTxId(tx);
					const [todo] = await tx
						.update(todos)
						.set({ ...updates, updated_at: new Date() })
						.where(eq(todos.id, id))
						.returning();
					return todo;
				});
				return Response.json({ todo: result, txid });
			},
			DELETE: async ({ request }) => {
				const { id } = (await request.json()) as { id: string };
				let txid!: number;
				await db.transaction(async (tx) => {
					txid = await generateTxId(tx);
					await tx.delete(todos).where(eq(todos.id, id));
				});
				return Response.json({ txid });
			},
		},
	},
});
