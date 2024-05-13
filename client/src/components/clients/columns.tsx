"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  BaseClient,
  DELETE_CLIENT,
  GET_CLIENTS,
  GetClients,
} from "@/queries/clientQueries";
import { useMutation } from "@apollo/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "../ui/use-toast";
import ClientsForm from "./form";

export const columns: ColumnDef<BaseClient>[] = [
  {
    accessorKey: "id",
    header: "id",
    cell: ({ row }) => <div className="truncate">{row.original.id}</div>,
  },
  {
    accessorKey: "name",
    header: "Name",
    cell: ({ row }) => <div className="truncate">{row.original.name}</div>,
  },
  {
    accessorKey: "email",
    header: "Email",
    cell: ({ row }) => <div className="truncate">{row.original.email}</div>,
  },
  {
    accessorKey: "phone",
    header: "Phone",
    cell: ({ row }) => <div className="truncate">{row.original.phone}</div>,
  },
  {
    accessorKey: "projects",
    header: "Projects",
    cell: ({ row }) => (
      <div className="truncate">{row.original.projects?.length}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions client={row.original} />,
  },
];

export function Actions({ client }: { client: BaseClient }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [deleteClient] = useMutation(DELETE_CLIENT, {
    variables: { id: client.id },
    update(cache, { data: { deleteClient } }) {
      const clients =
        cache.readQuery<GetClients>({ query: GET_CLIENTS })?.clients ?? [];
      cache.writeQuery({
        query: GET_CLIENTS,
        data: {
          clients: clients.filter(
            (client: BaseClient) => client.id !== deleteClient.id
          ),
        },
      });
    },
    onCompleted: () => {
      setIsDeleteOpen(false);
      toast({
        title: "Client deleted successfully",
      });
    },
  });

  return (
    <div className="flex items-start justify-start gap-2">
      <Link to={`/clients/${client.id}`}>
        <Eye size={18} />
      </Link>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger>
          <Edit className="text-orange-500" size={18} />
        </DialogTrigger>
        <DialogContent>
          <ClientsForm setIsOpen={setIsEditOpen} initalValues={client} />
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger>
          <Trash2 className="text-red-500" size={18} />
        </DialogTrigger>
        <DialogContent>
          <div>
            <h1 className="text-xl font-semibold mb-2">
              Are you sure you want to delete this client
            </h1>
            <DialogDescription className="text-gray-500">
              You can't undo this action
            </DialogDescription>
          </div>
          <div className="flex gap-x-3">
            <Button
              onClick={() => setIsDeleteOpen(false)}
              className="w-full bg-gray-400 hover:bg-gray-500"
            >
              Cancel
            </Button>
            <Button
              className="w-full"
              variant="destructive"
              onClick={() => {
                deleteClient();
              }}
            >
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
