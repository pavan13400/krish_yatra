import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { Tractor, Leaf, Users, Shield } from "lucide-react";

const About = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="pt-24 pb-20">
        <section className="container mx-auto px-4 max-w-5xl space-y-16">
          <div className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-4">
              <Tractor className="w-4 h-4 text-primary" />
              <span className="text-sm font-medium text-primary">
                About KrishiYantra
              </span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
              Smart Farm Machinery for Every Indian Farmer
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              KrishiYantra helps farmers discover the right machinery for their
              land, crop and budget — powered by data, built with farmers in
              mind.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 mb-12">
            <div className="glass-card rounded-2xl p-6 md:p-8 shadow-elevated">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-primary" />
                Our Mission
              </h2>
              <p className="text-muted-foreground">
                We want to make modern farm machinery accessible to every
                farmer, from small holders to large farms. By combining local
                agronomy knowledge with AI, we suggest practical, affordable
                machinery options that actually work on the ground.
              </p>
            </div>

            <div className="glass-card rounded-2xl p-6 md:p-8 shadow-elevated">
              <h2 className="text-xl font-semibold mb-3 flex items-center gap-2">
                <Shield className="w-5 h-5 text-primary" />
                Why KrishiYantra?
              </h2>
              <ul className="space-y-2 text-muted-foreground text-sm">
                <li>• Recommendations based on crop, soil and farm size</li>
                <li>• Focus on realistic budgets and local conditions</li>
                <li>• Simple interface in place of complex catalogues</li>
                <li>• Built to save time, labour and costs</li>
              </ul>
            </div>
          </div>

          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">24x7</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Available for farmers
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">AI</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Powered recommendations
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 text-center">
              <p className="text-3xl font-bold text-primary mb-1">1</p>
              <p className="text-xs uppercase tracking-wide text-muted-foreground">
                Simple form to get started
              </p>
            </div>
          </div>

          <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-start gap-6">
            <div className="shrink-0">
              <Users className="w-10 h-10 text-primary" />
            </div>
            <div>
              <h2 className="text-xl font-semibold mb-2">Built for Bharat</h2>
              <p className="text-muted-foreground mb-3">
                KrishiYantra is designed keeping Indian farming realities in
                mind — monsoons, soil diversity, labour availability and local
                rental markets. The goal is not just technology, but technology
                that fits real fields.
              </p>
              <p className="text-sm text-muted-foreground">
                This About page is just a starting point. You can customise this
                content any way you like — add photos, partner logos, impact
                numbers or farmer stories to match your project vision.
              </p>
            </div>
          </div>

          {/* How KrishiYantra Works */}
          <div className="grid md:grid-cols-3 gap-6">
            <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-2">1. Share Your Farm Details</h3>
              <p className="text-sm text-muted-foreground flex-1">
                Farmers quickly enter state, crop, soil, farm size and budget. This
                creates a clear picture of local growing conditions and real-world
                constraints.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-2">2. AI Analyzes & Matches</h3>
              <p className="text-sm text-muted-foreground flex-1">
                Our recommendation engine compares your inputs with a curated
                machinery knowledge base to surface only those options that truly
                fit your needs.
              </p>
            </div>
            <div className="glass-card rounded-2xl p-6 h-full flex flex-col">
              <h3 className="text-lg font-semibold mb-2">3. Book & Plan Operations</h3>
              <p className="text-sm text-muted-foreground flex-1">
                Farmers can directly book slots, plan around weather windows and
                labour availability, and track upcoming work from a simple dashboard.
              </p>
            </div>
          </div>

          {/* Values / Promise */}
          <div className="glass-card rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-semibold mb-4">Our Promise to Farmers</h2>
            <div className="grid md:grid-cols-3 gap-6 text-sm text-muted-foreground">
              <div>
                <h3 className="font-semibold text-foreground mb-1">Clarity</h3>
                <p>
                  No confusing catalogues or hidden charges — just clear options with
                  transparent information so decisions are easy.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Trust</h3>
                <p>
                  We aim to collaborate with verified rental partners and
                  institutions so farmers know the machinery they book is reliable.
                </p>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-1">Impact</h3>
                <p>
                  Every recommendation is designed to save time, reduce manual
                  labour, and improve income over multiple seasons.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
};

export default About;

