import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Mail, Phone, MapPin } from "lucide-react";

const Contact = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 max-w-4xl space-y-10">
          <div className="text-center mb-10">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Mail className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                Contact Us
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-3">
              Have questions or feedback?
            </h1>
            <p className="text-lg text-muted-foreground">
              Reach out to us for any support, suggestions or collaboration
              around KrishiYantra.
            </p>
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8 space-y-6">
            <div className="flex items-start gap-3">
              <Mail className="w-5 h-5 text-primary mt-1" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Email
                </h2>
                <p className="text-sm text-muted-foreground">
                  boyapavankumar6@gmail.com
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="w-5 h-5 text-primary mt-1" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Phone / WhatsApp
                </h2>
                <p className="text-sm text-muted-foreground">
                  +91-7207391124
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <MapPin className="w-5 h-5 text-primary mt-1" />
              <div>
                <h2 className="text-sm font-semibold text-foreground">
                  Address
                </h2>
                <p className="text-sm text-muted-foreground">
                  GRIET institute / Chintal / Hyderabad , India
                </p>
              </div>
            </div>

            <p className="text-xs text-muted-foreground pt-2">
              These details help farmers, partners and institutes reach you for
              support or collaboration around KrishiYantra.
            </p>
          </div>

          {/* Simple Contact Form (frontend only) */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold text-foreground mb-4">
              Send us a message
            </h2>
            <p className="text-sm text-muted-foreground mb-6">
              This is a simple frontend form. You can later connect it to an
              email service or backend endpoint to store enquiries.
            </p>
            <form className="grid md:grid-cols-2 gap-4 md:gap-6">
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Your Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Enter your name"
                />
              </div>
              <div className="md:col-span-1">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Phone or Email
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="How can we reach you?"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-xs font-medium text-muted-foreground mb-1.5">
                  Message
                </label>
                <textarea
                  rows={4}
                  className="w-full px-3 py-2 rounded-lg border border-input bg-background text-sm resize-y focus:outline-none focus:ring-2 focus:ring-ring"
                  placeholder="Tell us briefly what you need help with..."
                />
              </div>
              <div className="md:col-span-2 flex justify-end">
                <button
                  type="button"
                  className="px-5 py-2.5 rounded-lg text-sm font-medium hero-gradient text-primary-foreground shadow-soft hover:shadow-elevated transition-shadow"
                >
                  Submit (demo)
                </button>
              </div>
            </form>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default Contact;

