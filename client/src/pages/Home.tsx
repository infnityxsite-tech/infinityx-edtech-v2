import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import {
  Loader2,
  Users,
  Brain,
  Shield,
  Laptop,
  Code,
  Rocket,
  ArrowRight,
  CheckCircle,
} from "lucide-react";

export default function Home() {
  // ✅ Fetch text content from database (editable via admin panel)
  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery(
    { pageKey: "home" },
    { 
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true
    }
  );

  // ✅ HARDCODED IMAGES - Never change, no caching issues
  const heroImageUrl = "/uploads/Gemini_Generated_Image_3p3go53p3go53p3g.png";
  const visionImageUrl = "/uploads/Gemini_Generated_Image_9qv2m9qv2m9qv2m9.png";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation />

      {/* === HERO SECTION === */}
      <section
        className="relative text-white py-32 md:py-40 bg-cover bg-center"
        style={{
          backgroundImage: `linear-gradient(rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6)), url(${heroImageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="relative z-10 max-w-7xl mx-auto px-6">
          <div className="max-w-3xl">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 leading-tight">
              {pageContent?.headline ||
                "Empowering the Next Generation of Tech Leaders"}
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-slate-200">
              {pageContent?.subHeadline ||
                "Master cutting-edge technologies through hands-on learning, expert mentorship, and real-world projects that prepare you for the future."}
            </p>
            <div className="flex flex-wrap gap-4">
              <Link href="/courses">
                <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-lg px-8">
                  Explore Courses <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
              <Link href="/contact">
                <Button
                  size="lg"
                  variant="outline"
                  className="bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20 text-lg px-8"
                >
                  Get Started
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === STATISTICS SECTION === */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="w-12 h-12 mx-auto mb-4" />
              <div className="text-5xl font-bold mb-2">
                {pageContent?.studentsTrained || 500}+
              </div>
              <div className="text-xl">Students Trained</div>
            </div>
            <div>
              <Brain className="w-12 h-12 mx-auto mb-4" />
              <div className="text-5xl font-bold mb-2">
                {pageContent?.expertInstructors || 15}+
              </div>
              <div className="text-xl">Expert Instructors</div>
            </div>
            <div>
              <Rocket className="w-12 h-12 mx-auto mb-4" />
              <div className="text-5xl font-bold mb-2">
                {pageContent?.jobPlacementRate || 95}%
              </div>
              <div className="text-xl">Job Placement Rate</div>
            </div>
          </div>
        </div>
      </section>

      {/* === VISION SECTION === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-4xl font-bold mb-6 text-slate-900">
                {pageContent?.visionText || "Our Vision for Tech Education"}
              </h2>
              <p className="text-lg text-slate-700 mb-6">
                We believe in transforming lives through technology education. Our mission is to make cutting-edge tech skills accessible to everyone, regardless of their background.
              </p>
              <div className="space-y-4">
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Industry-aligned curriculum designed by experts</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Hands-on projects with real-world applications</p>
                </div>
                <div className="flex items-start">
                  <CheckCircle className="w-6 h-6 text-blue-600 mr-3 mt-1 flex-shrink-0" />
                  <p className="text-slate-700">Personalized mentorship and career guidance</p>
                </div>
              </div>
            </div>
            <div className="relative">
              <img
                src={visionImageUrl}
                alt="Vision"
                className="rounded-lg shadow-2xl w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === PROGRAMS OVERVIEW === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">
              Our Programs
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              Choose from our comprehensive range of programs designed to take you from beginner to professional
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
              <Code className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Full-Stack Development</h3>
              <p className="text-slate-700 mb-4">
                Master both frontend and backend technologies to build complete web applications
              </p>
              <Link href="/courses">
                <Button variant="link" className="text-blue-600 p-0">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
              <Shield className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Cybersecurity</h3>
              <p className="text-slate-700 mb-4">
                Learn to protect systems and networks from digital threats and attacks
              </p>
              <Link href="/courses">
                <Button variant="link" className="text-purple-600 p-0">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl border border-green-100">
              <Laptop className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Data Science & AI</h3>
              <p className="text-slate-700 mb-4">
                Dive into machine learning, data analysis, and artificial intelligence
              </p>
              <Link href="/courses">
                <Button variant="link" className="text-green-600 p-0">
                  Learn More <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* === CTA SECTION === */}
      <section className="py-24 bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className="text-4xl font-bold mb-6">
            Ready to Start Your Tech Journey?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join thousands of students who have transformed their careers with InfinityX
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Link href="/courses">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 text-lg px-8">
                Browse Courses
              </Button>
            </Link>
            <Link href="/contact">
              <Button
                size="lg"
                variant="outline"
                className="border-white text-white hover:bg-white/10 text-lg px-8"
              >
                Contact Us
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
