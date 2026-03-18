import {
	Box,
	Button,
	Checkbox,
	Container,
	Flex,
	Heading,
	IconButton,
	Text,
	TextField,
} from "@radix-ui/themes";
import { useLiveQuery } from "@tanstack/react-db";
import { createFileRoute } from "@tanstack/react-router";
import { Trash2 } from "lucide-react";
import { useState } from "react";
import { todosCollection } from "@/db/collections/todos";

export const Route = createFileRoute("/")({
	ssr: false,
	loader: async () => {
		await todosCollection.preload();
		return null;
	},
	component: TodoPage,
});

function TodoPage() {
	const { data: todos } = useLiveQuery((q) =>
		q.from({ todo: todosCollection }).orderBy((f) => f.todo.created_at, "desc"),
	);

	const [inputValue, setInputValue] = useState("");

	const handleAdd = async () => {
		const title = inputValue.trim();
		if (!title) return;
		setInputValue("");
		await todosCollection.insert({
			id: crypto.randomUUID(),
			title,
			completed: false,
			created_at: new Date(),
			updated_at: new Date(),
		});
	};

	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === "Enter") handleAdd();
	};

	const handleToggle = async (id: string, completed: boolean) => {
		await todosCollection.update(id, (draft) => {
			draft.completed = !completed;
		});
	};

	const handleDelete = async (id: string) => {
		await todosCollection.delete(id);
	};

	const remaining = todos?.filter((t) => !t.completed).length ?? 0;

	return (
		<Container size="2" py="8">
			<Flex direction="column" gap="6">
				<Flex direction="column" gap="1">
					<Heading size="8">Todo</Heading>
					<Text color="gray" size="2">
						{remaining} task{remaining !== 1 ? "s" : ""} remaining
					</Text>
				</Flex>

				<Flex gap="2">
					<Box flexGrow="1">
						<TextField.Root
							placeholder="Add a new todo..."
							value={inputValue}
							onChange={(e) => setInputValue(e.target.value)}
							onKeyDown={handleKeyDown}
							size="3"
						/>
					</Box>
					<Button onClick={handleAdd} size="3" disabled={!inputValue.trim()}>
						Add
					</Button>
				</Flex>

				<Flex direction="column" gap="2">
					{todos?.length === 0 && (
						<Flex
							align="center"
							justify="center"
							py="8"
							style={{
								border: "1px dashed var(--gray-6)",
								borderRadius: "var(--radius-3)",
							}}
						>
							<Text color="gray" size="3">
								No todos yet. Add one above!
							</Text>
						</Flex>
					)}

					{todos?.map((todo) => (
						<Flex
							key={todo.id}
							align="center"
							gap="3"
							px="4"
							py="3"
							style={{
								background: "var(--color-panel)",
								borderRadius: "var(--radius-3)",
								border: "1px solid var(--gray-4)",
							}}
						>
							<Checkbox
								size="2"
								checked={todo.completed}
								onCheckedChange={() => handleToggle(todo.id, todo.completed)}
							/>
							<Text
								size="3"
								style={{
									flexGrow: 1,
									textDecoration: todo.completed ? "line-through" : "none",
									color: todo.completed ? "var(--gray-9)" : undefined,
								}}
							>
								{todo.title}
							</Text>
							<IconButton
								variant="ghost"
								color="red"
								size="1"
								onClick={() => handleDelete(todo.id)}
							>
								<Trash2 size={14} />
							</IconButton>
						</Flex>
					))}
				</Flex>

				{todos && todos.length > 0 && todos.some((t) => t.completed) && (
					<Flex justify="end">
						<Button
							variant="soft"
							color="gray"
							size="2"
							onClick={() =>
								Promise.all(
									todos
										.filter((t) => t.completed)
										.map((t) => todosCollection.delete(t.id)),
								)
							}
						>
							Clear completed
						</Button>
					</Flex>
				)}
			</Flex>
		</Container>
	);
}
