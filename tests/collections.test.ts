import { describe, it, expect } from "vitest"
import { todoSelectSchema, todoInsertSchema } from "@/db/zod-schemas"
import { generateValidRow } from "./helpers/schema-test-utils"
import { parseDates } from "@/db/utils"

describe("todos collection validation", () => {
	it("validates a todo after JSON round-trip", () => {
		const row = generateValidRow(todoSelectSchema)
		const roundTripped = parseDates(JSON.parse(JSON.stringify(row)))
		const result = todoSelectSchema.safeParse(roundTripped)
		expect(result.success).toBe(true)
	})

	it("insert schema validates a todo after JSON round-trip", () => {
		const row = generateValidRow(todoInsertSchema)
		const roundTripped = parseDates(JSON.parse(JSON.stringify(row)))
		const result = todoInsertSchema.safeParse(roundTripped)
		expect(result.success).toBe(true)
	})

	it("completed field is boolean", () => {
		const row = generateValidRow(todoSelectSchema)
		const result = todoSelectSchema.safeParse(row)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(typeof result.data.completed).toBe("boolean")
		}
	})

	it("insert schema rejects empty title", () => {
		const row = generateValidRow(todoInsertSchema)
		const result = todoInsertSchema.safeParse({ ...row, title: "" })
		expect(result.success).toBe(false)
	})

	it("dates are Date objects after parsing", () => {
		const row = generateValidRow(todoSelectSchema)
		const roundTripped = parseDates(JSON.parse(JSON.stringify(row)))
		const result = todoSelectSchema.safeParse(roundTripped)
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.created_at).toBeInstanceOf(Date)
			expect(result.data.updated_at).toBeInstanceOf(Date)
		}
	})
})
