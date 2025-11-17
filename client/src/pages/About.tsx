import { trpc } from "@/lib/trpc";
import Navigation from "@/components/Navigation";
import { Loader2, Target, Eye, Users, Award } from "lucide-react";

export default function About() {
  // ✅ Fetch text content from database (editable via admin panel)
  const { data: pageContent, isLoading } = trpc.admin.getPageContent.useQuery(
    { pageKey: "about" },
    { 
      staleTime: 0,
      cacheTime: 0,
      refetchOnMount: true,
      refetchOnWindowFocus: true
    }
  );

  // ✅ HARDCODED IMAGES - Never change, no caching issues
  const missionImageUrl = "/uploads/Gemini_Generated_Image_g1ud5zg1ud5zg1ud-min.png";
  const visionImageUrl = "/uploads/Gemini_Generated_Image_bv1myvbv1myvbv1m.png";
  const founderImageUrl = "/uploads/poster.png";
  const companyImageUrl = "/uploads/Gemini_Generated_Image_1j1rdb1j1rdb1j1r.png";

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        <Loader2 className="w-8 h-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <Navigation />

      {/* === HERO SECTION === */}
      <section className="relative bg-gradient-to-r from-blue-600 to-indigo-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-6">
          <h1 className="text-5xl md:text-6xl font-bold mb-6">About InfinityX</h1>
          <p className="text-xl md:text-2xl text-blue-100 max-w-3xl">
            Empowering the next generation of tech leaders through innovative education and hands-on training
          </p>
        </div>
      </section>

      {/* === MISSION SECTION === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Target className="w-10 h-10 text-blue-600 mr-4" />
                <h2 className="text-4xl font-bold text-slate-900">Our Mission</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                {pageContent?.missionText || 
                  "At InfinityX, we're on a mission to democratize tech education and make cutting-edge skills accessible to everyone. We believe that with the right guidance and resources, anyone can become a tech professional and transform their career."}
              </p>
            </div>
            <div>
              <img
                src={missionImageUrl}
                alt="Our Mission"
                className="rounded-lg shadow-2xl w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === VISION SECTION === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="order-2 md:order-1">
              <img
                src={visionImageUrl}
                alt="Our Vision"
                className="rounded-lg shadow-2xl w-full"
                loading="lazy"
              />
            </div>
            <div className="order-1 md:order-2">
              <div className="flex items-center mb-6">
                <Eye className="w-10 h-10 text-blue-600 mr-4" />
                <h2 className="text-4xl font-bold text-slate-900">Our Vision</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed">
                {pageContent?.visionText || 
                  "We envision a world where quality tech education is accessible to all, bridging the gap between traditional learning and industry demands. Through innovative teaching methods and real-world projects, we're building the tech workforce of tomorrow."}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* === FOUNDER SECTION === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Meet Our Founder</h2>
            <p className="text-xl text-slate-600">
              Passionate about transforming lives through technology education
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
            <div className="flex justify-center">
              <img
                src={founderImageUrl}
                alt="Founder"
                className="rounded-lg shadow-2xl w-full max-w-md"
                loading="lazy"
              />
            </div>
            <div>
              <h3 className="text-3xl font-bold mb-4 text-slate-900">
                {pageContent?.founderName || "Ahmed Farahat"}
              </h3>
              <p className="text-lg text-slate-700 mb-6 leading-relaxed">
                {pageContent?.founderBio || 
                  "With over 15 years of experience in tech education and software development, our founder has trained thousands of students and helped them launch successful careers in technology."}
              </p>
              <div className="bg-blue-50 border-l-4 border-blue-600 p-6 rounded">
                <p className="text-slate-700 italic">
                  "{pageContent?.founderMessage || 
                    "Education is the most powerful tool we have to change the world. At InfinityX, we're committed to providing world-class tech education that transforms lives and creates opportunities."}"
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* === COMPANY SECTION === */}
      <section className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <div className="flex items-center mb-6">
                <Users className="w-10 h-10 text-blue-600 mr-4" />
                <h2 className="text-4xl font-bold text-slate-900">About Our Company</h2>
              </div>
              <p className="text-lg text-slate-700 leading-relaxed mb-6">
                {pageContent?.aboutCompany || 
                  "InfinityX EdTech is a leading technology education platform dedicated to bridging the gap between academic learning and industry requirements. We offer comprehensive programs in software development, cybersecurity, data science, and more."}
              </p>
              <div className="grid grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">500+</div>
                  <div className="text-slate-600">Students Trained</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">15+</div>
                  <div className="text-slate-600">Expert Instructors</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">95%</div>
                  <div className="text-slate-600">Job Placement</div>
                </div>
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
                  <div className="text-slate-600">Partner Companies</div>
                </div>
              </div>
            </div>
            <div>
              <img
                src={companyImageUrl}
                alt="Our Company"
                className="rounded-lg shadow-2xl w-full"
                loading="lazy"
              />
            </div>
          </div>
        </div>
      </section>

      {/* === VALUES SECTION === */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 text-slate-900">Our Core Values</h2>
            <p className="text-xl text-slate-600">
              The principles that guide everything we do
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-xl border border-blue-100">
              <Award className="w-12 h-12 text-blue-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Excellence</h3>
              <p className="text-slate-700">
                We strive for excellence in everything we do, from curriculum design to student support.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-xl border border-purple-100">
              <Users className="w-12 h-12 text-purple-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Community</h3>
              <p className="text-slate-700">
                We build a supportive community where students learn from each other and grow together.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-teal-50 p-8 rounded-xl border border-green-100">
              <Target className="w-12 h-12 text-green-600 mb-4" />
              <h3 className="text-2xl font-bold mb-3 text-slate-900">Impact</h3>
              <p className="text-slate-700">
                We measure our success by the positive impact we create in our students' lives and careers.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
