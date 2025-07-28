import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { DashboardHeader } from "@/components/DashboardHeader";
import { ProjectDashboard } from "@/components/ProjectDashboard";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpenIcon, 
  BrainIcon, 
  UploadIcon, 
  MessageSquareIcon,
  ArrowRightIcon,
  CheckIcon,
  StarIcon
} from "lucide-react";
import heroImage from "@/assets/hero-study.jpg";

const Index = () => {
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false);
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const handleGetStarted = () => {
    setShowDashboard(true);
  };

  const handleCreateProject = () => {
    setCreateModalOpen(true);
    setShowDashboard(true);
  };

  const handleProjectOpen = (projectId: string) => {
    navigate(`/project/${projectId}`);
  };

  const features = [
    {
      icon: BookOpenIcon,
      title: "Project-Based Organization",
      description: "Create dedicated study projects for each subject or topic"
    },
    {
      icon: UploadIcon,
      title: "Multi-Format Support",
      description: "Upload PDFs, images, and documents as study materials"
    },
    {
      icon: BrainIcon,
      title: "AI-Powered Analysis",
      description: "Get intelligent answers using your uploaded content as context"
    },
    {
      icon: MessageSquareIcon,
      title: "Smart Study Sessions",
      description: "Ask questions and receive educational explanations"
    }
  ];

  const benefits = [
    "Use your own API keys - complete control over costs",
    "Support for GPT-4, Claude, Gemini, and Grok",
    "Organized study collections for easy review",
    "Educational explanations tailored for learning"
  ];

  if (showDashboard) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
        <DashboardHeader onCreateProject={handleCreateProject} />
        <ProjectDashboard onProjectOpen={handleProjectOpen} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/30">
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-primary/5 via-transparent to-accent/5" />
        
        <div className="container mx-auto px-6 py-20 relative">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge variant="outline" className="w-fit gap-2">
                  <StarIcon className="h-3 w-3" />
                  AI-Powered Study Tool
                </Badge>
                
                <h1 className="text-5xl lg:text-6xl font-bold leading-tight">
                  <span className="bg-gradient-to-r from-primary via-primary-glow to-primary bg-clip-text text-transparent">
                    All Nighter
                  </span>
                  <br />
                  <span className="text-foreground">Study Smarter</span>
                </h1>
                
                <p className="text-xl text-muted-foreground leading-relaxed max-w-lg">
                  Transform your study materials into an AI-powered learning companion. 
                  Upload documents, ask questions, and get intelligent explanations tailored for your learning.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleGetStarted}
                  variant="study" 
                  size="lg"
                  className="gap-2 text-lg px-8 py-6"
                >
                  Get Started
                  <ArrowRightIcon className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="outline" 
                  size="lg"
                  className="gap-2 text-lg px-8 py-6"
                >
                  <BookOpenIcon className="h-5 w-5" />
                  Learn More
                </Button>
              </div>

              <div className="space-y-3">
                {benefits.map((benefit, index) => (
                  <div key={index} className="flex items-center gap-3">
                    <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center">
                      <CheckIcon className="h-3 w-3 text-primary" />
                    </div>
                    <span className="text-muted-foreground">{benefit}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <img 
                  src={heroImage} 
                  alt="Study setup with books, laptop, and warm lighting" 
                  className="w-full h-auto object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent" />
              </div>
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/10 rounded-full blur-xl animate-pulse" />
              <div className="absolute -bottom-6 -left-6 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse delay-1000" />
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-card/50">
        <div className="container mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold mb-4">
              Everything You Need to Study Effectively
            </h2>
            <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
              Powerful features designed to enhance your learning experience and help you master any subject
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card key={index} className="relative group hover:shadow-lg transition-all duration-300 border-border/50">
                  <CardContent className="p-6 text-center space-y-4">
                    <div className="w-16 h-16 mx-auto bg-primary/10 rounded-xl flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    
                    <h3 className="text-lg font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">
                      {feature.description}
                    </p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-primary/5 via-transparent to-accent/5">
        <div className="container mx-auto px-6 text-center">
          <div className="max-w-3xl mx-auto space-y-8">
            <h2 className="text-3xl lg:text-4xl font-bold">
              Ready to Transform Your Study Sessions?
            </h2>
            <p className="text-xl text-muted-foreground">
              Join students who are already using AI to learn more efficiently and effectively
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button 
                onClick={handleGetStarted}
                variant="study" 
                size="lg"
                className="gap-2 text-lg px-8 py-6"
              >
                Start Your First Project
                <ArrowRightIcon className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Index;