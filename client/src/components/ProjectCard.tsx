import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileTextIcon, 
  ImageIcon, 
  MoreVerticalIcon, 
  BookOpenIcon,
  ClockIcon,
  FileIcon
} from "lucide-react";
import { formatDistanceToNow } from "date-fns";

interface ProjectCardProps {
  project: {
    id: string;
    name: string;
    description: string;
    createdAt: Date;
    lastAccessed: Date;
    fileCount: number;
    imageCount: number;
    pdfCount: number;
    queryCount: number;
    aiModel?: string;
  };
  onOpen: (projectId: string) => void;
  onEdit: (projectId: string) => void;
}

export function ProjectCard({ project, onOpen, onEdit }: ProjectCardProps) {
  return (
    <Card className="group cursor-pointer transition-all duration-200 hover:shadow-lg hover:-translate-y-1 border-border/50">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10 text-primary">
              <BookOpenIcon className="h-5 w-5" />
            </div>
            <div>
              <CardTitle className="text-lg font-semibold group-hover:text-primary transition-colors">
                {project.name}
              </CardTitle>
              <CardDescription className="text-sm mt-1">
                {project.description}
              </CardDescription>
            </div>
          </div>
          
          <Button
            variant="ghost"
            size="icon"
            onClick={(e) => {
              e.stopPropagation();
              onEdit(project.id);
            }}
            className="opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <MoreVerticalIcon className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="space-y-4" onClick={() => onOpen(project.id)}>
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <FileIcon className="h-4 w-4" />
            <span>{project.fileCount} files</span>
          </div>
          <div className="flex items-center gap-1">
            <ImageIcon className="h-4 w-4" />
            <span>{project.imageCount}</span>
          </div>
          <div className="flex items-center gap-1">
            <FileTextIcon className="h-4 w-4" />
            <span>{project.pdfCount}</span>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {project.aiModel && (
              <Badge variant="secondary" className="text-xs">
                {project.aiModel}
              </Badge>
            )}
            <Badge variant="outline" className="text-xs">
              {project.queryCount} queries
            </Badge>
          </div>
          
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <ClockIcon className="h-3 w-3" />
            <span>{formatDistanceToNow(project.lastAccessed, { addSuffix: true })}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}