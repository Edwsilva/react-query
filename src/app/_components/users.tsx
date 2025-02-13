"use client";

import {useMutation, useQuery, useQueryClient} from "@tanstack/react-query";
import {User} from "../api/users/route";
import {faker} from "@faker-js/faker";

function fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}

function createUser(user: Omit<User, "id">) {
  return fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  }).then((res) => res.json());
}

export default function Users() {
  const queryClient = useQueryClient();
  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => fetcher("/api/users"),
  });
  const userMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser: User) => {
      queryClient.setQueryData(["users"], (users: User[]) => [
        ...users,
        newUser,
      ]);
      queryClient.invalidateQueries({queryKey: ["users"]});
    },
  });

  if (users.isPending) return <div>Pendente...</div>;

  if (users?.data?.error) return <div>Erro: {users.data.error}</div>;

  if (!users.data?.length) return <div>Sem usuários</div>;

  return (
    <div>
      <button
        onClick={() =>
          userMutation.mutate({
            fullName: faker.person.fullName(),
            email: faker.internet.email(),
          })
        }
      >
        {userMutation.isPending ? "Criando..." : "Novo Usuário"}
      </button>
      <hr className="my-3" />
      <ul>
        {users.data.map((user: User) => (
          <li key={user.id}>
            {user.fullName} / {user.email}
          </li>
        ))}
        {/* {isFetching && <li>Atualizando...</li>} */}
      </ul>
    </div>
  );
}
