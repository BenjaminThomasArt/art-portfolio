import { trpc } from "@/lib/trpc";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { useState } from "react";
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
    <div className="py-24">
      <div className="container">
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
          {artistInfo?.instagramHandle && (
            <div className="mt-12 pt-12 border-t border-border text-center">
              <p className="text-sm text-muted-foreground mb-2">You can also reach me on Instagram</p>
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
  );
}
