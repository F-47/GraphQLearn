"use client";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import {
  BaseProject,
  DELETE_PROJECT,
  GET_PROJECTS,
  GetProjects,
} from "@/queries/projectQueries";
import { useMutation } from "@apollo/client";
import { DialogDescription } from "@radix-ui/react-dialog";
import { ColumnDef } from "@tanstack/react-table";
import { Edit, Eye, Trash2 } from "lucide-react";
import { useState } from "react";
import { Link } from "react-router-dom";
import { toast } from "../ui/use-toast";
import ProjectsForm from "./form";

export const columns: ColumnDef<BaseProject>[] = [
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => <div className={"truncate"}>{row.original.status}</div>,
  },
  {
    accessorKey: "client.name",
    header: "Client Name",
    cell: ({ row }) => (
      <div className={"truncate capitalize"}>{row.original.client.name}</div>
    ),
  },
  {
    accessorKey: "actions",
    header: "Actions",
    cell: ({ row }) => <Actions project={row.original} />,
  },
];

export function Actions({ project }: { project: BaseProject }) {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);

  const [deleteProject] = useMutation(DELETE_PROJECT, {
    variables: { id: project.id },
    update(cache, { data: { deleteProject } }) {
      const projects =
        cache.readQuery<GetProjects>({ query: GET_PROJECTS })?.projects ?? [];
      cache.writeQuery({
        query: GET_PROJECTS,
        data: {
          projects: projects.filter(
            (project: BaseProject) => project.id !== deleteProject.id
          ),
        },
      });
    },
    onCompleted: () => {
      setIsDeleteOpen(false);
      toast({
        title: "Project deleted successfully",
      });
    },
  });

  return (
    <div className="flex items-start justify-start gap-2">
      <Link to={`/projects/${project.id}`}>
        <Eye size={18} />
      </Link>
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogTrigger>
          <Edit className="text-orange-500" size={18} />
        </DialogTrigger>
        <DialogContent>
          <ProjectsForm setIsOpen={setIsEditOpen} initalValues={project} />
        </DialogContent>
      </Dialog>
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogTrigger>
          <Trash2 className="text-red-500" size={18} />
        </DialogTrigger>
        <DialogContent>
          <div>
            <h1 className="text-xl font-semibold mb-2">
              Are you sure you want to delete this project
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
                deleteProject();
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
