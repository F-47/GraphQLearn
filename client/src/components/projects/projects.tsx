import { GET_PROJECTS, GetProjects } from "@/queries/projectQueries";
import { useQuery } from "@apollo/client";
import { Loader2 } from "lucide-react";
import { useState } from "react";
import { Button } from "../ui/button";
import { DataTable } from "../ui/data-table";
import { Dialog, DialogContent, DialogTrigger } from "../ui/dialog";
import { columns } from "./columns";
import ProjectsForm from "./form";

export default function Projects() {
  const [isOpen, setIsOpen] = useState(false);
  const { loading, error, data } = useQuery<GetProjects>(GET_PROJECTS);

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
        <h1 className="text-2xl font-bold">Projects</h1>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button variant="secondary">Add Project</Button>
          </DialogTrigger>
          <DialogContent>
            <ProjectsForm setIsOpen={setIsOpen} />
          </DialogContent>
        </Dialog>
      </div>
      {data && <DataTable data={data.projects} columns={columns} />}
    </div>
  );
}
