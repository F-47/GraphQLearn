import { useQuery } from "@apollo/client";
import { Loader2 } from "lucide-react";
import { DataTable } from "../ui/data-table";
import { columns } from "./columns";
import { GET_CLIENTS, GetClients } from "@/queries/clientQueries";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { Button } from "../ui/button";
import ClientsForm from "./form";
import { useState } from "react";

export default function Clients() {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, error, data } = useQuery<GetClients>(GET_CLIENTS);

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  if (error) return <p>Error :{error.message}</p>;

  return (
    <div>
      <div className="flex items-center justify-between mb-7">
        <h1 className="text-2xl font-bold">Clients</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Add Client</Button>
          </DialogTrigger>
          <DialogContent>
            <ClientsForm setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog>
      </div>
      {data && <DataTable data={data.clients} columns={columns} />}
    </div>
  );
}
