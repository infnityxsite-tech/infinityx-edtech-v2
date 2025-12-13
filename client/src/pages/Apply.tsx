import { useState, useEffect } from "react";
import { useLocation, useRoute } from "wouter"; 
import { trpc } from "@/lib/trpc";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Loader2, CheckCircle2 } from "lucide-react";

// ✅ CLEAN IMPORTS: No ErrorBoundary here!

export default function Apply() {
  const [location, navigate] = useLocation();
  
  // 1. CATCH THE ID FROM URL PATH
  const [match, params] = useRoute("/apply/:id");
  const pathId = match ? params?.id : null;

  // 2. CATCH QUERY PARAMS
  const searchString = window.location.search; 
  const urlParams = new URLSearchParams(searchString);
  const queryId = urlParams.get("courseId");
  const courseName = urlParams.get("courseName");

  const finalCourseId = pathId || queryId || "";

  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    message: "",
  });

  const createApplication = trpc.admin.createApplication.useMutation({
    onSuccess: () => {
      toast.success("Your application has been submitted successfully!");
      setSubmitted(true);
      setFormData({ fullName: "", email: "", phone: "", message: "" });
    },
    onError: () => {
      toast.error("Something went wrong. Please try again later.");
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.fullName || !formData.email) {
      toast.error("Please fill in your name and email.");
      return;
    }

    if (!finalCourseId) {
        toast.error("Error: No course selected. Please go back and select a course.");
        return;
    }

    createApplication.mutate({
      ...formData,
      courseId: finalCourseId,
    });
  };

  if (submitted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 px-4">
        <Card className="max-w-md w-full text-center shadow-xl">
          <CardHeader>
            <CheckCircle2 className="w-12 h-12 text-green-600 mx-auto mb-3" />
            <CardTitle className="text-2xl text-slate-900">
              Application Submitted!
            </CardTitle>
            <CardDescription className="text-slate-600 mt-2">
              Thank you for applying. Our team will contact you soon.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button
              onClick={() => navigate("/programs")}
              className="w-full mt-4"
            >
              Back to Programs
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center px-4 py-20">
      <Card className="w-full max-w-lg shadow-lg border border-slate-200">
        <CardHeader>
          <CardTitle className="text-2xl text-slate-900 text-center">
            {courseName ? `Apply for ${decodeURIComponent(courseName)}` : "Student Application"}
          </CardTitle>
          <CardDescription className="text-center text-slate-600">
            Fill in your details below to secure your spot.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <input type="hidden" value={finalCourseId} />

            <div>
              <Label htmlFor="fullName">Full Name *</Label>
              <Input
                id="fullName"
                value={formData.fullName}
                onChange={(e) =>
                  setFormData({ ...formData, fullName: e.target.value })
                }
                placeholder="Your full name"
                required
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="you@example.com"
                required
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) =>
                  setFormData({ ...formData, phone: e.target.value })
                }
                placeholder="+20 10 xxxx xxxx"
              />
            </div>

            <div>
              <Label htmlFor="message">Statement of Purpose (Optional)</Label>
              <Textarea
                id="message"
                value={formData.message}
                onChange={(e) =>
                  setFormData({ ...formData, message: e.target.value })
                }
                placeholder="Why do you want to join this program?"
                rows={3}
              />
            </div>

            <Button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700"
              disabled={createApplication.isPending}
            >
              {createApplication.isPending ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting...
                </>
              ) : (
                "Submit Application"
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}