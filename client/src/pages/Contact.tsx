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

    const artworkTitle = params.get('artworkTitle');
    const type = params.get('type');

    if (printTitle && material && size) {
      const materialNames: Record<string, string> = {
        'giclee': 'Giclée',
        'pvc': 'PVC board',
        'canvas': 'Canvas inkjet'
      };

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
    } else if (artworkTitle && type === 'original') {
      const message = `I am interested in the original artwork "${artworkTitle}".\n\nPlease let me know about availability and pricing.`;

      setFormData(prev => ({
        ...prev,
        type: 'contact',
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

      toast.success("Message sent successfully! I'll be in touch soon.");
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
    <div className="min-h-screen">
      {/* Two-column layout: photo left, form right */}
      <div className="flex flex-col lg:flex-row min-h-[calc(100vh-4rem)]">
        {/* Left: Artist photo */}
        <div className="relative lg:w-1/2 h-[40vh] lg:h-auto overflow-hidden">
          <img
            src="https://files.manuscdn.com/user_upload_by_module/session_file/310519663325255079/NQIUulwowISAxzFs.png"
            alt="Benjamin Thomas in the studio"
            className="absolute inset-0 w-full h-full object-cover object-[75%_center]"
          />
          {/* Subtle gradient overlay at bottom for mobile transition */}
          <div className="absolute inset-x-0 bottom-0 h-16 bg-gradient-to-t from-background to-transparent lg:hidden" />
        </div>

        {/* Right: Form */}
        <div className="lg:w-1/2 py-12 lg:py-24 px-6 lg:px-16 flex flex-col justify-center">
          <div className="max-w-lg mx-auto w-full">
            <div className="mb-10">
              <h1 className="text-4xl md:text-5xl font-serif tracking-tight mb-4 text-[#003153]">Get in Touch</h1>
              <p className="text-sm md:text-base text-muted-foreground">
                Have a question or interested in commissioning a piece? I'd love to hear from you.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <Label htmlFor="type">Enquiry Type *</Label>
                <Select
                  value={formData.type}
                  onValueChange={(value: "contact" | "print" | "commission") =>
                    setFormData({ ...formData, type: value })
                  }
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select enquiry type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="contact">General Enquiry</SelectItem>
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
                  rows={5}
                  placeholder="Tell me about your enquiry..."
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                />
              </div>

              <Button type="submit" size="lg" variant="outline" className="w-full" disabled={submitInquiry.isPending}>
                {submitInquiry.isPending ? "Sending..." : "Send Message"}
              </Button>
            </form>

            {/* Contact Info */}
            <div className="mt-10 pt-8 border-t border-border">
              <p className="text-xs text-muted-foreground mb-4 text-center">Or reach out directly</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
                {/* WhatsApp */}
                <a
                  href="https://wa.me/447597765530"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors group"
                >
                  <MessageCircle className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div className="text-left">
                    <div className="text-xs font-medium">WhatsApp</div>
                    <div className="text-xs text-muted-foreground">+44 7597 765530</div>
                  </div>
                </a>

                {/* Email */}
                <a
                  href="mailto:benjaminthomas_art@mail.com"
                  className="flex items-center gap-3 p-3 border border-border rounded-lg hover:bg-accent transition-colors group"
                >
                  <Mail className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
                  <div className="text-left">
                    <div className="text-xs font-medium">Email</div>
                    <div className="text-xs text-muted-foreground">benjaminthomas_art@mail.com</div>
                  </div>
                </a>
              </div>

              {artistInfo?.instagramHandle && (
                <div className="text-center">
                  <p className="text-xs text-muted-foreground mb-1">Follow on Instagram</p>
                  <a
                    href={artistInfo.instagramUrl || `https://instagram.com/${artistInfo.instagramHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-foreground hover:text-muted-foreground transition-colors"
                  >
                    @{artistInfo.instagramHandle}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
