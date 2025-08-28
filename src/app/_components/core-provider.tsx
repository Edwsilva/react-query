"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const queryClient = new QueryClient();

export default function CoreProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  );
}

// Esse componente é um exemplo de como usar o React Query para fornecer uma instância
// do QueryClient ao resto da aplicação, garantindo que você possa fazer chamadas de dados
// com gerenciamento automático de cache, atualizações em segundo plano, e muito mais

// Como utilizar:
// import { useQuery } from "@tanstack/react-query";

// const fetchData = async () => {
//   const response = await fetch("https://api.exemplo.com/dados");
//   return response.json();
// };

// const MeuComponente = () => {
//   const { data, error, isLoading } = useQuery(["dados"], fetchData);

//   if (isLoading) return <div>Carregando...</div>;
//   if (error instanceof Error) return <div>Erro: {error.message}</div>;

//   return <div>{JSON.stringify(data)}</div>;
// };
