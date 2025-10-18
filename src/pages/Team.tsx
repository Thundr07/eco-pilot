import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Github, Linkedin, Mail } from "lucide-react";

const Team = () => {
  const teamMembers = [
    {
      name: "Team Member 1",
      role: "AI/ML Engineer",
      initials: "TM",
      description: "Specializes in machine learning models and data analysis",
    },
    {
      name: "Team Member 2",
      role: "Full Stack Developer",
      initials: "TM",
      description: "Expert in React, TypeScript, and backend architecture",
    },
    {
      name: "Team Member 3",
      role: "UX/UI Designer",
      initials: "TM",
      description: "Creates intuitive and beautiful user experiences",
    },
    {
      name: "Team Member 4",
      role: "Data Scientist",
      initials: "TM",
      description: "Transforms complex data into actionable insights",
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-32 pb-20">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold mb-6 text-center">
            Meet Our Team
          </h1>
          <p className="text-xl text-muted-foreground text-center mb-12">
            Passionate innovators working together to create a sustainable future
          </p>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            {teamMembers.map((member, index) => (
              <Card key={index} className="hover:shadow-lg transition-all">
                <CardContent className="pt-6">
                  <div className="flex items-start gap-4">
                    <Avatar className="w-20 h-20">
                      <AvatarImage src="" />
                      <AvatarFallback className="bg-gradient-to-br from-primary to-secondary text-primary-foreground text-xl">
                        {member.initials}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold mb-1">{member.name}</h3>
                      <p className="text-sm text-primary mb-2">{member.role}</p>
                      <p className="text-sm text-muted-foreground mb-3">
                        {member.description}
                      </p>
                      <div className="flex gap-3">
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          <Github className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-secondary transition-colors">
                          <Linkedin className="w-5 h-5" />
                        </a>
                        <a href="#" className="text-muted-foreground hover:text-primary transition-colors">
                          <Mail className="w-5 h-5" />
                        </a>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card className="bg-muted/50">
            <CardContent className="pt-6 text-center">
              <h2 className="text-2xl font-bold mb-4">Our Mission</h2>
              <p className="text-muted-foreground max-w-2xl mx-auto">
                We believe that technology and sustainability go hand in hand. Our team is dedicated
                to building tools that empower individuals to make informed, eco-friendly decisions.
                Through innovation, collaboration, and a commitment to the planet, we're working to
                create a future where sustainable living is accessible to everyone.
              </p>
            </CardContent>
          </Card>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default Team;