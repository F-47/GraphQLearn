import { Button } from "@/components/ui/button";
import { GET_CLIENT, SingleClient } from "@/queries/clientQueries";
import { useQuery } from "@apollo/client";
import { Loader2, MoveLeft } from "lucide-react";
import { Link, useNavigate, useParams } from "react-router-dom";

function Client() {
  const { id } = useParams();
  const { loading, error, data } = useQuery<SingleClient>(GET_CLIENT, {
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
              {data.client.name}
            </h1>
            <p className="text-gray-500 text-base">{data.client.email}</p>
            <p className="text-gray-500 text-base">{data.client.phone}</p>
          </div>
          {data.client.projects && (
            <>
              <div>
                <div className="text-lg font-medium mb-5">Projects</div>
                <div className="border rounded-lg text-sm divide-y">
                  {data.client.projects.map((project) => {
                    return (
                      <div
                        key={project.id}
                        className="flex items-center justify-between gap-x-2 px-4 py-5"
                      >
                        <div>
                          <div>Name: {project.name}</div>
                          <div>Status: {project.status}</div>
                        </div>
                        <Link to={`/projects/${project.id}`}>
                          <Button variant="secondary" size={"sm"}>
                            View
                          </Button>
                        </Link>
                      </div>
                    );
                  })}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    );
}

export default Client;
