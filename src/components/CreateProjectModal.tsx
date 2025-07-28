import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpenIcon, BrainIcon, GraduationCapIcon } from "lucide-react";

interface CreateProjectModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onCreateProject: (project: {
    name: string;
    description: string;
    category: string;
    aiModel: string;
  }) => void;
}

const projectTemplates = [
  {
    id: "academic",
    name: "Academic Course",
    description: "Perfect for university courses, textbooks, and academic research",
    icon: GraduationCapIcon,
    category: "Education",
    placeholder: {
      name: "Biology 101",
      description: "Introduction to Biology course materials and study notes"
    }
  },
  {
    id: "research",
    name: "Research Project",
    description: "Organize research papers, articles, and documentation",
    icon: BrainIcon,
    category: "Research",
    placeholder: {
      name: "Machine Learning Research",
      description: "Collection of ML papers and implementation notes"
    }
  },
  {
    id: "general",
    name: "General Study",
    description: "General purpose study collection for any topic",
    icon: BookOpenIcon,
    category: "General",
    placeholder: {
      name: "Personal Learning",
      description: "General study materials and notes"
    }
  }
];

const aiModels = [
  { id: "gpt-4", name: "GPT-4", provider: "OpenAI", description: "Most capable for complex reasoning" },
  { id: "claude-3", name: "Claude 3", provider: "Anthropic", description: "Excellent for analysis and writing" },
  { id: "gemini-pro", name: "Gemini Pro", provider: "Google", description: "Great for multimodal tasks" },
  { id: "grok", name: "Grok", provider: "xAI", description: "Real-time web search capabilities" },
];

export function CreateProjectModal({ open, onOpenChange, onCreateProject }: CreateProjectModalProps) {
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    aiModel: ""
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = projectTemplates.find(t => t.id === templateId);
    if (template) {
      setFormData({
        name: template.placeholder.name,
        description: template.placeholder.description,
        category: template.category,
        aiModel: formData.aiModel
      });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.name && formData.description && formData.aiModel) {
      onCreateProject(formData);
      setFormData({ name: "", description: "", category: "", aiModel: "" });
      setSelectedTemplate("");
      onOpenChange(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl">Create New Study Project</DialogTitle>
          <DialogDescription>
            Choose a template and configure your AI-powered study project
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-3">
            <Label className="text-sm font-medium">Choose a Template</Label>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {projectTemplates.map((template) => {
                const Icon = template.icon;
                return (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all duration-200 ${
                      selectedTemplate === template.id
                        ? "ring-2 ring-primary bg-primary/5"
                        : "hover:shadow-md hover:bg-accent/50"
                    }`}
                    onClick={() => handleTemplateSelect(template.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-center gap-2">
                        <Icon className="h-5 w-5 text-primary" />
                        <CardTitle className="text-sm">{template.name}</CardTitle>
                      </div>
                    </CardHeader>
                    <CardContent className="pt-0">
                      <CardDescription className="text-xs">
                        {template.description}
                      </CardDescription>
                      <Badge variant="outline" className="mt-2 text-xs">
                        {template.category}
                      </Badge>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Project Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Project Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Enter project name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Input
                id="category"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                placeholder="e.g., Biology, Computer Science"
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              placeholder="Describe what you'll be studying in this project"
              className="resize-none"
              rows={3}
              required
            />
          </div>

          {/* AI Model Selection */}
          <div className="space-y-3">
            <Label>Preferred AI Model</Label>
            <Select value={formData.aiModel} onValueChange={(value) => setFormData({ ...formData, aiModel: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select an AI model" />
              </SelectTrigger>
              <SelectContent>
                {aiModels.map((model) => (
                  <SelectItem key={model.id} value={model.id}>
                    <div className="flex items-center justify-between w-full">
                      <div>
                        <div className="font-medium">{model.name}</div>
                        <div className="text-xs text-muted-foreground">{model.description}</div>
                      </div>
                      <Badge variant="outline" className="ml-2 text-xs">
                        {model.provider}
                      </Badge>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button type="submit" variant="study">
              Create Project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}