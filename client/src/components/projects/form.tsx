"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Textarea } from "../ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { useMutation, useQuery } from "@apollo/client";
import {
  ADD_PROJECT,
  BaseProject,
  GET_PROJECTS,
  GetProjects,
  UPDATE_PROJECT,
} from "@/queries/projectQueries";
import { toast } from "../ui/use-toast";
import { BaseClient, GET_CLIENTS } from "@/queries/clientQueries";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  description: z.string().nonempty({
    message: "Description is required",
  }),
  status: z.enum(["new", "progress", "completed"]),
  clientId: z.string().nonempty({
    message: "Client is required",
  }),
});

type ProjectsFormType = z.infer<typeof FormSchema>;

interface Props {
  initalValues?: BaseProject;
  setIsOpen: (isOpen: boolean) => void;
}

function ProjectsForm({ initalValues, setIsOpen }: Props) {
  const form = useForm<ProjectsFormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initalValues?.name || "",
      description: initalValues?.description || "",
      status:
        initalValues?.status === "New"
          ? "new"
          : initalValues?.status === "In Progress"
          ? "progress"
          : initalValues?.status === "Completed"
          ? "completed"
          : "new",
      clientId: initalValues?.client.id || "",
    },
  });

  const [addProject] = useMutation(ADD_PROJECT, {
    variables: { ...form.getValues() },
    update(cache, { data: { addProject } }) {
      const projects =
        cache.readQuery<GetProjects>({
          query: GET_PROJECTS,
        })?.projects ?? [];
      cache.writeQuery({
        query: GET_PROJECTS,
        data: { projects: [...projects, addProject] },
      });
    },
    onCompleted: () => {
      setIsOpen(false);
      toast({
        title: "Project created successfully",
      });
    },
  });

  const [updateProject] = useMutation(UPDATE_PROJECT, {
    variables: { ...form.getValues(), id: initalValues?.id },
    update(cache, { data: { updateProject } }) {
      const projects =
        cache.readQuery<GetProjects>({
          query: GET_PROJECTS,
        })?.projects ?? [];
      cache.writeQuery({
        query: GET_PROJECTS,
        data: {
          projects: projects.map((project: BaseProject) => {
            if (project.id === updateProject.id) {
              return updateProject;
            }
            return project;
          }),
        },
      });
    },
    onCompleted: () => {
      setIsOpen(false);
      toast({
        title: "Project updated successfully",
      });
    },
  });

  const { loading, error, data } = useQuery(GET_CLIENTS);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :{error.message}</p>;
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          return initalValues ? updateProject() : addProject();
        })}
        className="text-base font-medium space-y-5"
      >
        <FormField
          name="name"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-base">Enter Name</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Name"
                  className="mt-3 w-full"
                  autoCapitalize="true"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          name="description"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-base">Enter Description</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Description"
                  className="mt-3 w-full resize-none h-32"
                  autoCapitalize="true"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="status"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Choose Status</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a status" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {[
                    { name: "New", value: "new" },
                    { name: "In Progress", value: "progress" },
                    { name: "Completed", value: "completed" },
                  ].map((status) => {
                    return (
                      <SelectItem key={status.value} value={status.value}>
                        {status.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="clientId"
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel>Choose Client</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a Client" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {data.clients.map((client: BaseClient) => {
                    return (
                      <SelectItem key={client.id} value={client.id}>
                        {client.name}
                      </SelectItem>
                    );
                  })}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="flex items-end justify-end">
          <Button
            type="submit"
            disabled={!form.formState.isValid}
            className="text-white"
          >
            {initalValues ? "Update" : "Create"}
          </Button>
        </div>
      </form>
    </Form>
  );
}

export default ProjectsForm;
