import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { ProjectCard } from "./ProjectCard";
import { CreateProjectModal } from "./CreateProjectModal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { 
  SearchIcon, 
  FilterIcon, 
  SortAscIcon,
  GraduationCapIcon,
  BrainIcon,
  BookOpenIcon,
  PlusIcon
} from "lucide-react";
import type { Project } from "@shared/schema";

interface ProjectDashboardProps {
  onProjectOpen: (projectId: string) => void;
}

export function ProjectDashboard({ onProjectOpen }: ProjectDashboardProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const { data: projectsData, isLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const projects = projectsData?.projects || [];
  const categories = Array.from(new Set(projects.map((p: Project) => p.category)));
  
  const filteredProjects = projects.filter((project: Project) => {
    const matchesSearch = project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (project.description && project.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesCategory = !selectedCategory || project.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-6 py-8">
        <div className="text-center space-y-4">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto"></div>
          <p className="text-muted-foreground">Loading projects...</p>
        </div>
      </div>
    );
  }

  const handleCreateProject = (projectData: {
    name: string;
    description: string;
    category: string;
  }) => {
    // This will be handled by the CreateProjectModal using API
    console.log("Creating project:", projectData);
  };

  const handleProjectEdit = (projectId: string) => {
    // TODO: Implement project editing
    console.log("Edit project:", projectId);
  };

  const getCategoryIcon = (category: string) => {
    if (category.toLowerCase().includes('biology') || category.toLowerCase().includes('science')) {
      return GraduationCapIcon;
    } else if (category.toLowerCase().includes('computer') || category.toLowerCase().includes('research')) {
      return BrainIcon;
    }
    return BookOpenIcon;
  };

  return (
    <div className="container mx-auto px-6 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-3xl font-bold text-foreground">Your Study Projects</h2>
          <p className="text-muted-foreground mt-1">
            Organize your learning materials and AI-powered study sessions
          </p>
        </div>
        
        <Button
          onClick={() => setCreateModalOpen(true)}
          variant="study"
          size="lg"
          className="gap-2"
        >
          <PlusIcon className="h-5 w-5" />
          Create Project
        </Button>
      </div>

      {/* Filters and Search */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="relative flex-1 max-w-md">
          <SearchIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" className="gap-2">
            <FilterIcon className="h-4 w-4" />
            Filter
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <SortAscIcon className="h-4 w-4" />
            Sort
          </Button>
        </div>
      </div>

      {/* Category Filter */}
      {categories.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <Badge
            variant={selectedCategory === "" ? "default" : "outline"}
            className="cursor-pointer"
            onClick={() => setSelectedCategory("")}
          >
            All Categories
          </Badge>
          {categories.map((category) => {
            const Icon = getCategoryIcon(category);
            return (
              <Badge
                key={category}
                variant={selectedCategory === category ? "default" : "outline"}
                className="cursor-pointer gap-1"
                onClick={() => setSelectedCategory(category === selectedCategory ? "" : category)}
              >
                <Icon className="h-3 w-3" />
                {category}
              </Badge>
            );
          })}
        </div>
      )}

      {/* Projects Grid */}
      {filteredProjects.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard
              key={project.id}
              project={project}
              onOpen={onProjectOpen}
              onEdit={handleProjectEdit}
            />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center mb-4">
            <BookOpenIcon className="h-12 w-12 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold mb-2">No Projects Found</h3>
          <p className="text-muted-foreground mb-4">
            {searchQuery ? "Try adjusting your search criteria" : "Get started by creating your first study project"}
          </p>
          <Button onClick={() => setCreateModalOpen(true)} variant="study">
            <PlusIcon className="h-4 w-4 mr-2" />
            Create Your First Project
          </Button>
        </div>
      )}

      <CreateProjectModal
        open={createModalOpen}
        onOpenChange={setCreateModalOpen}
        onCreateProject={handleCreateProject}
      />
    </div>
  );
}