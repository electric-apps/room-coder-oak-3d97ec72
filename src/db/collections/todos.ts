import { electricCollectionOptions } from "@tanstack/electric-db-collection";
import { createCollection } from "@tanstack/react-db";
import { type Todo, todoSelectSchema } from "../zod-schemas";

export const todosCollection = createCollection(
	electricCollectionOptions({
		id: "todos",
		schema: todoSelectSchema,
		getKey: (item) => item.id,
		shapeOptions: {
			url: "/api/todos",
			parser: {
				timestamptz: (value: string) => new Date(value),
			},
		},
		onInsert: async ({ transaction }) => {
			const todo = transaction.mutations[0].modified;
			const response = await fetch("/api/mutations/todos", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify(todo),
			});
			const data = await response.json();
			return { txid: data.txid };
		},
		onUpdate: async ({ transaction }) => {
			const { original, changes } = transaction.mutations[0];
			const response = await fetch("/api/mutations/todos", {
				method: "PUT",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id: original.id, ...changes }),
			});
			const data = await response.json();
			return { txid: data.txid };
		},
		onDelete: async ({ transaction }) => {
			const id = transaction.mutations[0].key;
			const response = await fetch("/api/mutations/todos", {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ id }),
			});
			const data = await response.json();
			return { txid: data.txid };
		},
	}),
);

export type { Todo };
