import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";
import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Header from "./components/header.tsx";
import Home from "./pages/home.tsx";
import NotFound from "./pages/notfound.tsx";
import Project from "./pages/project.tsx";
import "./index.css";
import { Toaster } from "./components/ui/toaster.tsx";
import Client from "./pages/client.tsx";

const cache = new InMemoryCache({
  typePolicies: {
    Query: {
      fields: {
        clients: {
          merge(existing, incoming) {
            return incoming;
          },
        },
        projects: {
          merge(existing, incoming) {
            return incoming;
          },
        },
      },
    },
  },
});

const client = new ApolloClient({
  uri: "http://localhost:5000/graphql",
  cache,
});

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/clients",
    children: [
      {
        path: "/clients/:id",
        element: <Client />,
      },
    ],
  },
  {
    path: "/projects",
    children: [
      {
        path: "/projects/:id",
        element: <Project />,
      },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Header />
      <div className="container">
        <RouterProvider router={router} />
      </div>
      <Toaster />
    </ApolloProvider>
  </React.StrictMode>
);
