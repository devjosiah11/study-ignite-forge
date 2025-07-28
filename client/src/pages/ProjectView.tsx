import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  ArrowLeftIcon, 
  UploadIcon, 
  MessageSquareIcon, 
  FileTextIcon, 
  ImageIcon,
  BookmarkIcon 
} from "lucide-react";

const ProjectView = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();

  // Mock project data - in real app this would come from state/API
  const project = {
    id: projectId,
    name: "Biology 101",
    description: "Study materials for introductory biology course",
    category: "Science",
    fileCount: 12,
    imageCount: 8,
    pdfCount: 4,
    queryCount: 23,
    lastAccessed: "2 hours ago",
    aiModel: "GPT-4"
  };

  const handleBackToDashboard = () => {
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Header */}
      <header className="border-b border-border/40 bg-card/50 backdrop-blur-sm sticky top-0 z-10">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={handleBackToDashboard}
                className="gap-2"
              >
                <ArrowLeftIcon className="h-4 w-4" />
                Back to Dashboard
              </Button>
              <div className="h-6 w-px bg-border" />
              <div>
                <h1 className="text-2xl font-bold">{project.name}</h1>
                <p className="text-muted-foreground">{project.description}</p>
              </div>
            </div>
            <Badge variant="outline">{project.category}</Badge>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-6 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upload Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <UploadIcon className="h-5 w-5" />
                  Upload Study Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
                  <div className="space-y-4">
                    <div className="w-16 h-16 mx-auto bg-muted rounded-lg flex items-center justify-center">
                      <UploadIcon className="h-8 w-8 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="text-lg font-medium">Drag and drop files here</p>
                      <p className="text-muted-foreground">or click to browse</p>
                    </div>
                    <Button variant="outline">Browse Files</Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Query Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <MessageSquareIcon className="h-5 w-5" />
                  Ask Questions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask a question about your study materials..."
                      className="flex-1 px-4 py-3 border border-border rounded-lg bg-background"
                    />
                    <Button>Ask</Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Using {project.aiModel} • {project.queryCount} queries asked
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Project Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Project Statistics</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <FileTextIcon className="h-4 w-4 text-muted-foreground" />
                    <span>PDF Files</span>
                  </div>
                  <Badge variant="secondary">{project.pdfCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <ImageIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Images</span>
                  </div>
                  <Badge variant="secondary">{project.imageCount}</Badge>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MessageSquareIcon className="h-4 w-4 text-muted-foreground" />
                    <span>Queries</span>
                  </div>
                  <Badge variant="secondary">{project.queryCount}</Badge>
                </div>
              </CardContent>
            </Card>

            {/* Study Collections */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookmarkIcon className="h-5 w-5" />
                  Study Collections
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground text-sm">
                  Save important queries and responses here for easy review.
                </p>
                <Button variant="outline" className="w-full mt-4">
                  View Collections
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectView;