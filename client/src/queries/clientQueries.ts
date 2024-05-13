import { gql } from "@apollo/client";
import { BaseProject } from "./projectQueries";

export type BaseClient = {
  __typename: "Client";
  id: string;
  name: string;
  email: string;
  phone: string;
  projects: BaseProject[];
};

export type GetClients = {
  clients: BaseClient[];
};

export type SingleClient = {
  client: BaseClient;
};

const GET_CLIENTS = gql`
  query getClients {
    clients {
      id
      name
      email
      phone
      projects {
        __typename
        id
        name
        description
        status
      }
    }
  }
`;

const GET_CLIENT = gql`
  query getClient($id: ID!) {
    client(id: $id) {
      id
      name
      email
      phone
      projects {
        __typename
        id
        name
        description
        status
      }
    }
  }
`;

const ADD_CLIENT = gql`
  mutation addClient($name: String!, $email: String!, $phone: String!) {
    addClient(name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

const UPDATE_CLIENT = gql`
  mutation updateClient(
    $id: ID!
    $name: String!
    $email: String!
    $phone: String!
  ) {
    updateClient(id: $id, name: $name, email: $email, phone: $phone) {
      id
      name
      email
      phone
    }
  }
`;

const DELETE_CLIENT = gql`
  mutation deleteClient($id: ID!) {
    deleteClient(id: $id) {
      id
      name
      email
      phone
    }
  }
`;

export { ADD_CLIENT, DELETE_CLIENT, GET_CLIENT, GET_CLIENTS, UPDATE_CLIENT };
