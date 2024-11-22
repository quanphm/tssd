import { db } from "@/lib/db";
import { userTable } from "@/lib/db/schema";
import { newId } from "@/utils/id";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

const getUser = createServerFn({ method: "GET" }).handler(async () => {
	const users = await db.select().from(userTable);
	return users;
});

const addUser = createServerFn({ method: "POST" })
	.validator((data: string) => data)
	.handler(async ({ data }) => {
		await db.insert(userTable).values({
			id: newId("user"),
			username: data,
			email: `${data}@mail.com`,
		});
	});

export const Route = createFileRoute("/")({
	loader: async () => {
		const users = await getUser();
		return users;
	},
	component: Home,
});

function Home() {
	const router = useRouter();
	const users = Route.useLoaderData();

	return (
		<div>
			<button
				type="button"
				onClick={() => {
					addUser({ data: "Quan" }).then(() => {
						router.invalidate();
					});
				}}
			>
				Add user
			</button>
			{users.map((user) => {
				return <p key={user.id}>{user.username}</p>;
			})}
		</div>
	);
}
