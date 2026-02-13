import { Tractor, Phone, Mail, MapPin } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-foreground text-background py-12">
      <div className="container mx-auto px-4">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 rounded-xl hero-gradient flex items-center justify-center">
                <Tractor className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <span className="text-lg font-bold leading-tight">KrishiYantra</span>
                {/* <p className="text-xs opacity-70">कृषि यंत्र</p> */}
              </div>
            </div>
            <p className="text-sm opacity-70">
              Empowering Indian farmers with smart machinery solutions.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#home" className="hover:opacity-100 transition-opacity">Home</a></li>
              <li><a href="#find" className="hover:opacity-100 transition-opacity">Find Machinery</a></li>
              <li><a href="#book" className="hover:opacity-100 transition-opacity">Book a Slot</a></li>
              <li><a href="#about" className="hover:opacity-100 transition-opacity">About Us</a></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold mb-4">Support</h4>
            <ul className="space-y-2 text-sm opacity-70">
              <li><a href="#" className="hover:opacity-100 transition-opacity">Help Center</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">FAQs</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Terms of Service</a></li>
              <li><a href="#" className="hover:opacity-100 transition-opacity">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-semibold mb-4">Contact Us</h4>
            <ul className="space-y-3 text-sm opacity-70">
              <li className="flex items-center gap-2">
                <Phone className="w-4 h-4" />
                <span>720-739-1124</span>
              </li>
              <li className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>support@boyapavankumar6@gmail.com</span>
              </li>
              <li className="flex items-start gap-2">
                <MapPin className="w-4 h-4 mt-0.5" />
                <span>Hyderbad, India</span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 border-t border-background/20 text-center text-sm opacity-70">
          <p>© 2026 KrishiYantra. All rights reserved. Made with Love for Indian Farmers</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
