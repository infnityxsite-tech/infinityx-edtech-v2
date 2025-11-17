import Navigation from "@/components/Navigation";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Mail,
  Phone,
  MessageCircle,
  MapPin,
  Send,
  Loader2,
} from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { trpc } from "@/lib/trpc";

export default function Contact() {
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  // ✅ TRPC mutation to save message to database
  const createMessage = trpc.admin.createMessage.useMutation({
    onSuccess: () => {
      toast.success("Your message has been sent successfully!");
      setForm({ name: "", email: "", message: "" });
      setLoading(false);
    },
    onError: () => {
      toast.error("Failed to send your message. Please try again.");
      setLoading(false);
    },
  });

  // ✅ Form submission handler
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.email || !form.message) {
      toast.error("Please fill all fields before sending your message.");
      return;
    }
    setLoading(true);
    createMessage.mutate({
      name: form.name,
      email: form.email,
      message: form.message,
      messageType: "contact",
    });
  };

  // ✅ These values will later come from your Admin “Site Settings”
  const siteInfo = {
    email: "infnityx.site@gmail.com",
    phone: "+201100135225",
    whatsapp: "https://wa.me/qr/DPIFTRQ4NI3VP1",
    location: "Cairo, Egypt",
  };

  return (
    <div className="min-h-screen bg-white text-slate-900">
      <Navigation />

      {/* HERO SECTION */}
      <section className="bg-gradient-to-r from-blue-700 to-indigo-700 text-white py-24 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <h1 className="text-5xl font-bold mb-4">Contact InfinityX</h1>
          <p className="text-blue-100 text-lg">
            Let’s connect — whether you’re a student, partner, or collaborator,
            we’re here to help.
          </p>
        </div>
      </section>

      {/* CONTACT DETAILS */}
      <section className="py-20 bg-slate-50">
        <div className="max-w-6xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <Card className="p-6 shadow hover:shadow-lg transition">
            <CardHeader>
              <Mail className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <CardTitle>Email Us</CardTitle>
              <CardDescription>We usually reply within 24 hours</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="link"
                className="text-blue-700 font-semibold"
                onClick={() =>
                  (window.location.href = `mailto:${siteInfo.email}`)
                }
              >
                {siteInfo.email}
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6 shadow hover:shadow-lg transition">
            <CardHeader>
              <MessageCircle className="w-10 h-10 text-green-600 mx-auto mb-3" />
              <CardTitle>Chat on WhatsApp</CardTitle>
              <CardDescription>Instant messaging available</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="link"
                className="text-green-700 font-semibold"
                onClick={() => window.open(siteInfo.whatsapp, "_blank")}
              >
                Chat Now
              </Button>
            </CardContent>
          </Card>

          <Card className="p-6 shadow hover:shadow-lg transition">
            <CardHeader>
              <Phone className="w-10 h-10 text-blue-600 mx-auto mb-3" />
              <CardTitle>Call Us</CardTitle>
              <CardDescription>
                Available Sunday–Thursday, 10 AM–6 PM
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                variant="link"
                className="text-blue-700 font-semibold"
                onClick={() => (window.location.href = `tel:${siteInfo.phone}`)}
              >
                {siteInfo.phone}
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* MESSAGE FORM */}
      <section className="py-20 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <Card className="shadow-md">
            <CardHeader>
              <CardTitle className="text-2xl text-slate-900 text-center">
                Send Us a Message
              </CardTitle>
              <CardDescription className="text-center">
                Fill in the form below and we’ll get back to you soon.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Input
                    placeholder="Your Name"
                    value={form.name}
                    onChange={(e) =>
                      setForm({ ...form, name: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Input
                    type="email"
                    placeholder="Your Email"
                    value={form.email}
                    onChange={(e) =>
                      setForm({ ...form, email: e.target.value })
                    }
                    required
                  />
                </div>
                <div>
                  <Textarea
                    placeholder="Your Message"
                    rows={5}
                    value={form.message}
                    onChange={(e) =>
                      setForm({ ...form, message: e.target.value })
                    }
                    required
                  />
                </div>
                <Button
                  type="submit"
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending...
                    </>
                  ) : (
                    <>
                      <Send className="w-4 h-4 mr-2" /> Send Message
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* MAP / LOCATION */}
      <section className="py-20 bg-slate-50 text-center">
        <div className="max-w-4xl mx-auto px-6">
          <MapPin className="w-10 h-10 mx-auto text-blue-600 mb-3" />
          <h3 className="text-xl font-semibold text-slate-900 mb-2">
            Our Location
          </h3>
          <p className="text-slate-600 mb-8">{siteInfo.location}</p>
          <iframe
            title="InfinityX Location"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d110571.52058563482!2d31.2057535!3d30.0444205!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x145840c9d7eeb3ff%3A0x853d6efb8b2a5471!2sCairo!5e0!3m2!1sen!2seg!4v1695051890169!5m2!1sen!2seg"
            width="100%"
            height="300"
            style={{ border: 0 }}
            allowFullScreen
            loading="lazy"
            className="rounded-lg shadow-md"
          ></iframe>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-900 text-white py-10">
        <div className="max-w-7xl mx-auto px-6 text-center space-y-2">
          <p className="text-lg font-semibold">InfinityX EdTech Platform</p>
          <p className="text-blue-200">
            infnityx.site@gmail.com • +20 109 036 4947
          </p>
          <p className="text-slate-400 text-sm">
            &copy; {new Date().getFullYear()} InfinityX. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
