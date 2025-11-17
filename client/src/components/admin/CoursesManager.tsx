import { useState } from "react";
import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Loader2, Plus, Edit2, Trash2 } from "lucide-react";

export default function CoursesManager() {
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    imageUrl: "",
    duration: "",
    level: "",
    instructor: "",
    priceEgp: 0,
    priceUsd: 0,
    courseLink: "",
  });

  const utils = trpc.useUtils();
  const { data: courses = [], isLoading } = trpc.admin.getCourses.useQuery();

  const createMutation = trpc.admin.createCourse.useMutation({
    onSuccess: () => {
      toast.success("✅ Course created successfully!");
      setOpen(false);
      resetForm();
      utils.admin.getCourses.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to create course"),
  });

  const updateMutation = trpc.admin.updateCourse.useMutation({
    onSuccess: () => {
      toast.success("✅ Course updated successfully!");
      setOpen(false);
      resetForm();
      utils.admin.getCourses.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to update course"),
  });

  const deleteMutation = trpc.admin.deleteCourse.useMutation({
    onSuccess: () => {
      toast.success("🗑️ Course deleted successfully!");
      utils.admin.getCourses.invalidate();
    },
    onError: (error) => toast.error(error.message || "Failed to delete course"),
  });

  const resetForm = () => {
    setFormData({
      title: "",
      description: "",
      imageUrl: "",
      duration: "",
      level: "",
      instructor: "",
      priceEgp: 0,
      priceUsd: 0,
      courseLink: "",
    });
    setEditingId(null);
  };

  const handleSubmit = () => {
    if (!formData.title.trim()) {
      toast.error("Please enter a course title");
      return;
    }

    const payload = {
      ...formData,
      priceEgp: Number(formData.priceEgp) || 0,
      priceUsd: Number(formData.priceUsd) || 0,
    };

    if (editingId) {
      updateMutation.mutate({ id: editingId, ...payload });
    } else {
      createMutation.mutate(payload);
    }
  };

  const handleEdit = (course: any) => {
    setFormData({
      title: course.title || "",
      description: course.description || "",
      imageUrl: course.imageUrl || "",
      duration: course.duration || "",
      level: course.level || "",
      instructor: course.instructor || "",
      priceEgp: course.priceEgp ?? 0,
      priceUsd: course.priceUsd ?? 0,
      courseLink: course.courseLink || "",
    });
    setEditingId(course.id);
    setOpen(true);
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Courses Manager</CardTitle>
          <CardDescription>Manage all courses offered on your platform</CardDescription>
        </div>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button onClick={() => resetForm()} className="flex items-center gap-2">
              <Plus className="w-4 h-4" />
              Add Course
            </Button>
          </DialogTrigger>

          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>{editingId ? "Edit Course" : "Create New Course"}</DialogTitle>
            </DialogHeader>

            <div className="space-y-4">
              {/* Title */}
              <div className="space-y-2">
                <Label htmlFor="title">Course Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g., Advanced React Development"
                />
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder="Course description"
                  rows={6}
                />
              </div>

              {/* Duration & Level */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="duration">Duration</Label>
                  <Input
                    id="duration"
                    value={formData.duration}
                    onChange={(e) => setFormData({ ...formData, duration: e.target.value })}
                    placeholder="e.g., 8 weeks"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="level">Level</Label>
                  <Input
                    id="level"
                    value={formData.level}
                    onChange={(e) => setFormData({ ...formData, level: e.target.value })}
                    placeholder="e.g., Intermediate"
                  />
                </div>
              </div>

              {/* Instructor */}
              <div className="space-y-2">
                <Label htmlFor="instructor">Instructor</Label>
                <Input
                  id="instructor"
                  value={formData.instructor}
                  onChange={(e) => setFormData({ ...formData, instructor: e.target.value })}
                  placeholder="Instructor name"
                />
              </div>

              {/* Prices */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="priceEgp">Price (EGP)</Label>
                  <Input
                    id="priceEgp"
                    type="number"
                    value={formData.priceEgp}
                    onChange={(e) =>
                      setFormData({ ...formData, priceEgp: Number(e.target.value) || 0 })
                    }
                    placeholder="e.g., 1500"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="priceUsd">Price (USD)</Label>
                  <Input
                    id="priceUsd"
                    type="number"
                    value={formData.priceUsd}
                    onChange={(e) =>
                      setFormData({ ...formData, priceUsd: Number(e.target.value) || 0 })
                    }
                    placeholder="e.g., 50"
                  />
                </div>
              </div>

              {/* Image URL */}
              <div className="space-y-2">
                <Label htmlFor="imageUrl">Image URL</Label>
                <Input
                  id="imageUrl"
                  value={formData.imageUrl}
                  onChange={(e) => setFormData({ ...formData, imageUrl: e.target.value })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>

              {/* Course Link (Know More) */}
              <div className="space-y-2">
                <Label htmlFor="courseLink">Course Link (Know More)</Label>
                <Input
                  id="courseLink"
                  value={formData.courseLink}
                  onChange={(e) => setFormData({ ...formData, courseLink: e.target.value })}
                  placeholder="https://shorturl.at/pvLp3"
                />
                <p className="text-xs text-slate-500">External link for "Know More" button</p>
              </div>

              <Button
                onClick={handleSubmit}
                disabled={createMutation.isPending || updateMutation.isPending}
                className="w-full"
              >
                {createMutation.isPending || updateMutation.isPending ? (
                  <>
                    <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                    Saving...
                  </>
                ) : editingId ? (
                  "Update Course"
                ) : (
                  "Create Course"
                )}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </CardHeader>

      <CardContent>
        {isLoading ? (
          <div className="flex justify-center py-8">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
        ) : courses.length === 0 ? (
          <div className="text-center py-8 text-slate-500">
            <p>No courses yet. Click “Add Course” to create one.</p>
          </div>
        ) : (
          <div className="space-y-3">
            {courses.map((course: any) => (
              <div
                key={course.id}
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition"
              >
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900">{course.title}</h3>
                  <p className="text-sm text-slate-600">
                    {course.level} • {course.duration}
                  </p>
                  <p className="text-sm text-blue-700 mt-1">
                    🇪🇬 {course.priceEgp?.toLocaleString()} EGP • 💵 ${course.priceUsd?.toLocaleString()}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => handleEdit(course)}>
                    <Edit2 className="w-4 h-4" />
                  </Button>
                  <Button
                    variant="destructive"
                    size="sm"
                    onClick={() => deleteMutation.mutate({ id: course.id })}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
