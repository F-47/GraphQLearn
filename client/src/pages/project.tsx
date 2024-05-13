import { Button } from "@/components/ui/button";
import { GET_PROJECT, SingleProject } from "@/queries/projectQueries";
import { useQuery } from "@apollo/client";
import { Loader2, Mail, MoveLeft, Phone, User } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Project() {
  const { id } = useParams();
  const { loading, error, data } = useQuery<SingleProject>(GET_PROJECT, {
    variables: { id },
  });
  const navigate = useNavigate();

  if (loading)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="w-10 h-10 animate-spin" />
      </div>
    );
  if (error) return <div>Error: {error.message}</div>;
  if (data)
    return (
      <div>
        <Button
          variant="secondary"
          className="mb-5"
          size={"sm"}
          onClick={() => navigate(-1)}
        >
          <MoveLeft size={20} />
        </Button>
        <div className="border p-5 space-y-5 rounded-lg">
          <div>
            <h1 className="text-2xl font-bold capitalize">
              {data.project.name}
            </h1>
            <p className="text-gray-500 text-lg">{data.project.description}</p>
          </div>
          {data.project.client && (
            <>
              <div>
                <div className="text-lg font-medium">Project Status</div>
                <div>{data.project.status}</div>
              </div>
              <div>
                <div className="flex items-center justify-between mb-5">
                  <div className="text-lg font-medium">Client Information</div>
                  <Link to={`/clients/${data.project.client.id}`}>
                    <Button variant="secondary" size={"sm"}>
                      View
                    </Button>
                  </Link>
                </div>
                <div className="border rounded-lg text-sm">
                  <div className="flex items-center gap-x-2 px-4 py-5 border-b">
                    <User size={20} />
                    {data.project.client.name}
                  </div>
                  <div className="flex items-center gap-x-2 px-4 py-5 border-b">
                    <Mail size={18} />
                    {data.project.client.email}
                  </div>
                  <div className="flex items-center gap-x-2 px-4 py-5">
                    <Phone size={18} />
                    {data.project.client.phone}
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
}

export default Project;
