import Clients from "@/components/clients/clients";
import Projects from "@/components/projects/projects";

function Home() {
  return (
    <div className="space-y-10 pb-10">
      <Clients />
      <Projects />
    </div>
  );
}

export default Home;
