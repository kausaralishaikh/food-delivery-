import { Mail, Phone } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-primary/5 border-t">
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-xl font-bold mb-4">About Us</h3>
            <p className="text-muted-foreground">
              Crawingo is your premier destination for authentic Indian cuisine. 
              We partner with the finest restaurants to bring you a diverse selection 
              of dishes from across India, delivered right to your doorstep.
            </p>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Contact Us</h3>
            <div className="space-y-2">
              <a 
                href="mailto:shaikhkausarali771@gmail.com" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Mail className="h-4 w-4" />
                shaikhkausarali771@gmail.com
              </a>
              <a 
                href="tel:+917021951058" 
                className="flex items-center gap-2 text-muted-foreground hover:text-primary"
              >
                <Phone className="h-4 w-4" />
                +91 7021951058
              </a>
            </div>
          </div>
          <div>
            <h3 className="text-xl font-bold mb-4">Working Hours</h3>
            <p className="text-muted-foreground">
              Monday - Sunday: 10:00 AM - 11:00 PM
            </p>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-muted-foreground">
          <p>&copy; {new Date().getFullYear()} Crawingo. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
}
