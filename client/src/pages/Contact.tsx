import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState, useEffect } from "react";
import { Mail, MessageCircle } from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export default function Contact() {
  const submitInquiry = trpc.inquiries.submit.useMutation();
  const { data: artistInfo } = trpc.artist.getInfo.useQuery();

  const [formData, setFormData] = useState({
    type: "contact" as "contact" | "print" | "commission",
    name: "",
    email: "",
    phone: "",
    message: "",
  });

  // Pre-fill form with print order details from URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const printTitle = params.get('printTitle');
    const material = params.get('material');
    const size = params.get('size');

    if (printTitle && material && size) {
      // Format material name
      const materialNames: Record<string, string> = {
        'giclee': 'Giclée',
        'pvc': 'PVC board',
        'canvas': 'Canvas inkjet'
      };

      // Format size
      const sizeNames: Record<string, string> = {
        '80x60': '80 x 60 cm',
        '100x120': '100 x 120 cm',
        'custom': 'Custom size'
      };

      const message = `I would like to order a print of "${printTitle}"\n\nMaterial: ${materialNames[material] || material}\nSize: ${sizeNames[size] || size}\n\nPlease provide pricing and availability.`;

      setFormData(prev => ({
        ...prev,
        type: 'print',
        message: message
      }));
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      await submitInquiry.mutateAsync({
        type: formData.type,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        message: formData.message,
      });

      toast.success("Message sent successfully! We'll be in touch soon.");
      setFormData({
        type: "contact",
        name: "",
        email: "",
        phone: "",
        message: "",
      });
    } catch (error) {
      toast.error("Failed to send message. Please try again.");
    }
  };

  return (
    <div className="relative min-h-screen py-24">
      {/* Background Image */}
      <div 
        className="absolute inset-0 bg-cover opacity-35 contact-bg"
        style={{
          backgroundImage: 'url(https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/NQIUulwowISAxzFs.png)'
        }}
      />
      <div className="absolute inset-0 bg-background/70" />
      
      {/* Content */}
      <div className="container relative z-10">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4">Get in Touch</h1>
            <p className="text-lg text-muted-foreground">
              Have a question or interested in commissioning a piece? I'd love to hear from you.
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <Label htmlFor="type">Inquiry Type *</Label>
              <Select
                value={formData.type}
                onValueChange={(value: "contact" | "print" | "commission") =>
                  setFormData({ ...formData, type: value })
                }
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select inquiry type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="contact">General Inquiry</SelectItem>
                  <SelectItem value="print">Print Request</SelectItem>
                  <SelectItem value="commission">Commission Request</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                type="tel"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              />
            </div>

            <div>
              <Label htmlFor="message">Message *</Label>
              <Textarea
                id="message"
                required
                rows={6}
                placeholder="Tell me about your inquiry..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              />
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={submitInquiry.isPending}>
              {submitInquiry.isPending ? "Sending..." : "Send Message"}
            </Button>
          </form>

          {/* Contact Info */}
          <div className="mt-12 pt-12 border-t border-border">
            <p className="text-sm text-muted-foreground mb-6 text-center">Or reach out directly</p>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {/* WhatsApp */}
              <a
                href="https://wa.me/447597765530"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors group"
              >
                <MessageCircle className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="text-left">
                  <div className="text-sm font-medium">WhatsApp</div>
                  <div className="text-sm text-muted-foreground">+44 7597 765530</div>
                </div>
              </a>

              {/* Email */}
              <a
                href="mailto:benjaminthomas_art@mail.com"
                className="flex items-center gap-3 p-4 border border-border rounded-lg hover:bg-accent transition-colors group"
              >
                <Mail className="w-5 h-5 text-muted-foreground group-hover:text-foreground transition-colors" />
                <div className="text-left">
                  <div className="text-sm font-medium">Email</div>
                  <div className="text-sm text-muted-foreground">benjaminthomas_art@mail.com</div>
                </div>
              </a>
            </div>

            {artistInfo?.instagramHandle && (
              <div className="text-center">
                <p className="text-sm text-muted-foreground mb-2">Follow on Instagram</p>
                <a
                  href={artistInfo.instagramUrl || `https://instagram.com/${artistInfo.instagramHandle}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-foreground hover:text-muted-foreground transition-colors"
                >
                  @{artistInfo.instagramHandle}
                </a>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
