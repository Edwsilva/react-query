// Esse componente está utilizando o React Query para gerenciar dados assíncronos e fazer requisições API,
// além de realizar um mutate (alteração de dados) quando um novo usuário é criado.
// Aqui, o React Query está sendo usado para buscar a lista de usuários, e também para criar um novo usuário com a mutação.

// useQuery e useMutation são hooks do React Query:
// useQuery: Para realizar consultas de dados (como um GET para buscar dados).
// useMutation: Para realizar mutação de dados (como POST, PUT ou DELETE para modificar dados).
// useQueryClient: Um hook usado para acessar o client do React Query, o que permite manipular o cache e invalidar queries diretamente.
// User: Presumivelmente, é o tipo de dado retornado pelas APIs que você está consumindo (provavelmente um tipo TypeScript definido em algum lugar).
// faker: Utilizado para gerar dados falsos para o novo usuário, como nome e email, de maneira automatizada.
// SWR = State while revalidate
"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { User } from "../api/users/route";
// Cria dados faker para API
import { faker } from "@faker-js/faker";

function fetcher(url: string) {
  return fetch(url).then((res) => res.json());
}
// fetcher é uma função simples para buscar dados de uma API usando o fetch. Ela retorna os dados no formato JSON.
// Essa função é passada para o useQuery como a função de requisição (o que o useQuery vai chamar para buscar os dados).

function createUser(user: Omit<User, "id">) {
  return fetch("/api/users", {
    method: "POST",
    body: JSON.stringify(user),
  }).then((res) => res.json());
}
// O parâmetro user é do tipo Omit<User, "id">, o que significa que a função espera um objeto de usuário,
// mas sem o campo id (presumivelmente o id é gerado automaticamente pela API).

export default function Users() {
  const queryClient = useQueryClient();
  const users = useQuery({
    queryKey: ["users"],
    queryFn: () => fetcher("/api/users"),
  });
  // useQuery é usado para buscar os dados da API.
  // queryKey: ["users"]: O queryKey é usado para identificar essa consulta no cache do React Query.
  //           Nesse caso, estamos dizendo que a consulta se refere à lista de "usuários".
  // queryFn: () => fetcher("/api/users"): A função que o useQuery vai chamar para buscar os dados.
  //               Aqui, ele está utilizando a função fetcher para buscar a lista de usuários na rota /api/users.
  // O useQuery retorna um objeto com várias propriedades de estado (que indicam o status da consulta), como:
  //   isLoading, isFetching: Indicam se os dados estão sendo carregados.
  //   data: Contém os dados que foram retornados da consulta.
  //   error: Indica se ocorreu algum erro.
  // No código, você está usando essas propriedades para exibir diferentes estados de carregamento e erro.

  // useMutation para criar um novo usuário
  const userMutation = useMutation({
    mutationFn: createUser,
    onSuccess: (newUser: User) => {
      console.log("Novo usuário criado:", newUser);
      //users: User[] = [] para garantir que, se não houver cache ainda, ele não dê erro no spread
      queryClient.setQueryData(["users"], (users: User[] = []) => {
        console.log("Lista anterior:", users);
        return [...users, newUser];
      });
      // queryClient.setQueryData(["users"], ...) → vou atualizar o cache identificado pela query ["users"].
      // (users: User[] = []) => { ... } → recebo a lista atual de usuários, ou um array vazio se não existir nada no cache.
      // return [...users, newUser] → devolvo um novo array contendo os antigos + o novo usuário.

      queryClient.invalidateQueries({ queryKey: ["users"] });
      console.log("♻️ Queries de usuários invalidadas");
    },
    onError: (error: unknown) => {
      console.error("❌ Erro ao criar usuário:", error);
    },
  });
  // useMutation é usado para lidar com ações que alteram os dados, como uma requisição POST (para criar um usuário).
  // mutationFn: createUser: A função que será chamada quando a mutação for disparada, neste caso, a função createUser.
  // onSuccess: Essa é uma callback que é chamada quando a mutação é bem-sucedida.
  //            No caso, a mutação adiciona o novo usuário à lista de usuários em cache.

  //   queryClient.setQueryData: Após o sucesso da mutação, os dados de usuários são atualizados diretamente no cache do React Query (adicionando o novo usuário).

  //   queryClient.invalidateQueries: Invalidando a consulta ["users"] para forçar o React Query a buscar novamente os dados da API.
  //   Isso é útil para garantir que a lista de usuários seja revalida e reflita a nova alteração, especialmente se o cache estiver desatualizado.

  if (users.isPending) return <div>Pendente...</div>;

  if (users?.data?.error) return <div>Erro: {users.data.error}</div>;

  // if (!users.data?.length) return <div>Sem usuários</div>;

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
        {users.isFetching && <li>Atualizando...</li>}
      </ul>
    </div>
  );
}
