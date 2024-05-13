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
import { useMutation } from "@apollo/client";
import {
  ADD_CLIENT,
  BaseClient,
  GET_CLIENTS,
  GetClients,
  UPDATE_CLIENT,
} from "@/queries/clientQueries";
import { toast } from "@/components/ui/use-toast";

const FormSchema = z.object({
  name: z.string().min(1, {
    message: "Name is required",
  }),
  email: z.string().email({
    message: "Invalid email",
  }),
  phone: z.string().min(11, {
    message: "Phone number is required",
  }),
});

type ClientsFormType = z.infer<typeof FormSchema>;

type Props = {
  initalValues?: BaseClient;
  setIsOpen: (value: boolean) => void;
};

function ClientsForm({ initalValues, setIsOpen }: Props) {
  const form = useForm<ClientsFormType>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      name: initalValues?.name ?? "",
      email: initalValues?.email ?? "",
      phone: initalValues?.phone ?? "",
    },
  });

  const [addClient] = useMutation(ADD_CLIENT, {
    variables: { ...form.getValues() },
    update(cache, { data: { addClient } }) {
      const clients =
        cache.readQuery<GetClients>({ query: GET_CLIENTS })?.clients ?? [];
      cache.writeQuery({
        query: GET_CLIENTS,
        data: { clients: [...clients, addClient] },
      });
    },
    onCompleted: () => {
      setIsOpen(false);
      toast({
        title: "Client created successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  const [updateClient] = useMutation(UPDATE_CLIENT, {
    variables: { ...form.getValues(), id: initalValues?.id },
    update(cache, { data: { updateClient } }) {
      const clients =
        cache.readQuery<GetClients>({ query: GET_CLIENTS })?.clients ?? [];
      cache.writeQuery({
        query: GET_CLIENTS,
        data: {
          clients: clients.map((client) =>
            client.id === updateClient.id ? updateClient : client
          ),
        },
      });
    },
    onCompleted: () => {
      setIsOpen(false);
      toast({
        title: "Client updated successfully",
      });
      form.reset();
    },
    onError: (error) => {
      toast({
        title: error.message,
        variant: "destructive",
      });
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => {
          initalValues ? updateClient() : addClient();
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
          name="email"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-base">Enter Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Email"
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
          name="phone"
          control={form.control}
          render={({ field }) => (
            <FormItem className="col-span-2">
              <FormLabel className="text-base">Enter Phone</FormLabel>
              <FormControl>
                <Input
                  type="text"
                  placeholder="Phone"
                  className="mt-3 w-full"
                  autoCapitalize="true"
                  {...field}
                />
              </FormControl>
              <FormMessage className="text-red-500" />
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

export default ClientsForm;
