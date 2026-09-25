import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { userProvider as UserProvider } from "../context/user.jsx";
import { store } from "../redux/store.js";
import { Provider as ReduxProvider } from "react-redux";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

const queryClient = new QueryClient();

function Provider({ children }) {
  return (
    <QueryClientProvider client={queryClient}>
      <ReactQueryDevtools initialIsOpen={false} />
      <ReduxProvider store={store}>
        <UserProvider>{children}</UserProvider>
      </ReduxProvider>
    </QueryClientProvider>
  );
}

export default Provider;
