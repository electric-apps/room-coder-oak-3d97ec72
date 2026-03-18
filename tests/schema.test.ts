import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { generateValidRow, generateRowWithout } from "./helpers/schema-test-utils"

describe("todos schema", () => {
	it("validates a valid todo row", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("rejects a row missing title", () => {
		const row = generateRowWithout(todoSelectSchema, "title")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("rejects a row missing id", () => {
		const row = generateRowWithout(todoSelectSchema, "id")
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("validates insert schema with required fields", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("insert schema accepts a full row", () => {
		const row = {
			id: crypto.randomUUID(),
			title: "Test todo",
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		}
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(true)
	})

	it("insert schema rejects empty title", () => {
		const row = {
			id: crypto.randomUUID(),
			title: "",
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		}
		const result = todoInsertSchema.safeParse(row)
		expect(result.success).toBe(false)
	})

	it("completed defaults to false", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse({ ...row, completed: false })
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.completed).toBe(false)
		}
	})

	it("parses ISO date strings for created_at", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse({
			...row,
			created_at: new Date().toISOString(),
			updated_at: new Date().toISOString(),
		})
		expect(result.success).toBe(true)
	})
})
