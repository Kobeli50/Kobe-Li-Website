import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import React, { useRef } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_ayn6eya";
const TEMPLATE_ID = "template_n6xgvop"; // your actual template ID
const PUBLIC_KEY = "geOJSm8kjUeIzdEj8"; // your actual public key

const Contact = () => {
  const { toast } = useToast();
  const form = useRef<HTMLFormElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.current) return;

    emailjs.sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY).then(
      (result) => {
        // Success: show toast or alert
      },
      (error) => {
        // Error: show toast or alert
      }
    );
  };

  return (
    <section id="contact" className="py-20">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-4xl font-bold mb-12 text-center">Contact Me</h2>

          <Card className="border-border shadow-medium">
            <CardHeader>
              <CardTitle>Get In Touch</CardTitle>
            </CardHeader>
            <CardContent>
              <form ref={form} onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="user_name"
                      placeholder="Your name"
                      required
                      className="border-border focus:border-accent"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input
                      id="email"
                      name="user_email"
                      type="email"
                      placeholder="your@email.com"
                      required
                      className="border-border focus:border-accent"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="subject">Subject</Label>
                  <Input
                    id="subject"
                    name="subject"
                    placeholder="What's this about?"
                    className="border-border focus:border-accent"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="message">Message *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Your message..."
                    rows={6}
                    required
                    className="border-border focus:border-accent resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-hero hover:opacity-90 text-white py-3"
                >
                  Send Message
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
};

export default Contact;
