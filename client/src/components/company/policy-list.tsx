import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Eye, Download } from "lucide-react";

// Sample policy document data (in a real app, this would be fetched from an API)
const policies = [
  {
    id: 1,
    title: "Information Security Policy",
    updatedAt: "2 days ago",
  },
  {
    id: 2,
    title: "Acceptable Use Policy",
    updatedAt: "1 week ago",
  },
  {
    id: 3,
    title: "Incident Response Plan",
    updatedAt: "3 weeks ago",
  },
  {
    id: 4,
    title: "Business Continuity Plan",
    updatedAt: "1 month ago",
  },
  {
    id: 5,
    title: "Password Policy",
    updatedAt: "2 months ago",
  },
];

export default function PolicyList() {
  return (
    <Card className="backdrop-blur-sm bg-card/50 border-primary/10">
      <CardHeader>
        <CardTitle>Automated Policies</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {policies.map((policy) => (
            <div
              key={policy.id}
              className="flex justify-between items-center p-3 hover:bg-background/50 rounded-lg transition-colors"
            >
              <div className="flex items-center">
                <FileText className="w-6 h-6 text-primary mr-3" />
                <div>
                  <p className="text-sm font-medium">{policy.title}</p>
                  <p className="text-xs text-muted-foreground">Last updated: {policy.updatedAt}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-primary hover:bg-primary/10">
                  <Eye className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-emerald-400 hover:bg-emerald-400/10">
                  <Download className="w-5 h-5" />
                </Button>
              </div>
            </div>
          ))}
        </div>
        
        {policies.length === 0 && (
          <div className="text-center py-6">
            <p className="text-muted-foreground">No policies available</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
