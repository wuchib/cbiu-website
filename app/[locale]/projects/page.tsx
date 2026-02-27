import { getPublicProjects } from "@/actions/projects"
import { ProjectList } from "@/components/projects/project-list"

export default async function ProjectsPage() {
  const { data: projects, hasMore } = await getPublicProjects(1, 12);

  return <ProjectList initialProjects={projects || []} initialHasMore={hasMore} />
}
