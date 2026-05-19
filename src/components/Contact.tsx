import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import React, { useEffect, useRef, useState } from "react";
import emailjs from "@emailjs/browser";

const SERVICE_ID = "service_ayn6eya";
const TEMPLATE_ID = "template_kyawugh";
const PUBLIC_KEY = "geOJSm8kjUeIzdEj8";

const MIN_FILL_MS = 3000;
const COOLDOWN_MS = 60_000;
const DAILY_LIMIT = 5;
const RATE_KEY = "contact_rate_v1";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
const DISPOSABLE_DOMAINS = new Set([
  "mailinator.com",
  "tempmail.com",
  "temp-mail.org",
  "guerrillamail.com",
  "guerrillamail.net",
  "10minutemail.com",
  "yopmail.com",
  "trashmail.com",
  "throwawaymail.com",
  "fakeinbox.com",
  "getnada.com",
  "sharklasers.com",
  "dispostable.com",
  "maildrop.cc",
]);

type RateState = { last: number; dayStart: number; dayCount: number };

const readRate = (): RateState => {
  try {
    const raw = localStorage.getItem(RATE_KEY);
    if (!raw) return { last: 0, dayStart: 0, dayCount: 0 };
    return JSON.parse(raw) as RateState;
  } catch {
    return { last: 0, dayStart: 0, dayCount: 0 };
  }
};

const writeRate = (s: RateState) => {
  try {
    localStorage.setItem(RATE_KEY, JSON.stringify(s));
  } catch {
    /* ignore quota / private-mode */
  }
};

type RateCheck = { ok: boolean; reason: string };

const checkRateLimit = (): RateCheck => {
  const now = Date.now();
  const s = readRate();
  if (now - s.last < COOLDOWN_MS) {
    const wait = Math.ceil((COOLDOWN_MS - (now - s.last)) / 1000);
    return { ok: false, reason: `Please wait ${wait}s before sending another message.` };
  }
  const dayMs = 24 * 60 * 60 * 1000;
  const inSameDay = now - s.dayStart < dayMs;
  const dayCount = inSameDay ? s.dayCount : 0;
  if (dayCount >= DAILY_LIMIT) {
    return { ok: false, reason: "Daily message limit reached. Please try again tomorrow." };
  }
  return { ok: true, reason: "" };
};

const recordSend = () => {
  const now = Date.now();
  const s = readRate();
  const dayMs = 24 * 60 * 60 * 1000;
  const inSameDay = now - s.dayStart < dayMs;
  writeRate({
    last: now,
    dayStart: inSameDay ? s.dayStart : now,
    dayCount: (inSameDay ? s.dayCount : 0) + 1,
  });
};

const Contact = () => {
  const { toast } = useToast();
  const form = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const mountedAt = useRef<number>(0);

  useEffect(() => {
    mountedAt.current = Date.now();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!form.current) return;

    const fd = new FormData(form.current);
    const honeypot = String(fd.get("website") ?? "");
    const email = String(fd.get("user_email") ?? "").trim();
    const name = String(fd.get("user_name") ?? "").trim();
    const message = String(fd.get("message") ?? "").trim();

    // Honeypot: silently accept so bots don't learn they were caught.
    if (honeypot) {
      toast({
        title: "Message sent!",
        description: "Thank you for your message. I'll get back to you soon.",
      });
      form.current.reset();
      return;
    }

    if (Date.now() - mountedAt.current < MIN_FILL_MS) {
      toast({
        title: "Slow down a moment",
        description: "Please take a few seconds to fill out the form.",
        variant: "destructive",
      });
      return;
    }

    if (!EMAIL_RE.test(email)) {
      toast({
        title: "Invalid email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      });
      return;
    }

    const domain = email.split("@")[1]?.toLowerCase() ?? "";
    if (DISPOSABLE_DOMAINS.has(domain)) {
      toast({
        title: "Disposable email not allowed",
        description: "Please use a real email address so I can reply.",
        variant: "destructive",
      });
      return;
    }

    if (name.length < 2 || name.length > 100) {
      toast({
        title: "Invalid name",
        description: "Name must be between 2 and 100 characters.",
        variant: "destructive",
      });
      return;
    }

    if (message.length < 10 || message.length > 5000) {
      toast({
        title: "Invalid message",
        description: "Message must be between 10 and 5000 characters.",
        variant: "destructive",
      });
      return;
    }

    const rate = checkRateLimit();
    if (!rate.ok) {
      toast({
        title: "Too many messages",
        description: rate.reason,
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    emailjs
      .sendForm(SERVICE_ID, TEMPLATE_ID, form.current, PUBLIC_KEY)
      .then(
        () => {
          recordSend();
          toast({
            title: "Message sent!",
            description: "Thank you for your message. I'll get back to you soon.",
          });
          form.current?.reset();
          mountedAt.current = Date.now();
        },
        (error: unknown) => {
          const status =
            error && typeof error === "object" && "status" in error
              ? (error as { status: number }).status
              : "unknown";
          const text =
            error && typeof error === "object" && "text" in error
              ? (error as { text: string }).text
              : String(error);
          console.error("[EmailJS] send failed", { status, text, error });
          toast({
            title: "Failed to send message",
            description: `Error ${status}: ${text}. Please try again later.`,
            variant: "destructive",
          });
        }
      )
      .finally(() => setLoading(false));
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
              <form ref={form} onSubmit={handleSubmit} className="space-y-6" noValidate>
                <div
                  aria-hidden="true"
                  style={{
                    position: "absolute",
                    left: "-10000px",
                    top: "auto",
                    width: "1px",
                    height: "1px",
                    overflow: "hidden",
                  }}
                >
                  <label htmlFor="website">Website (leave empty)</label>
                  <input
                    type="text"
                    id="website"
                    name="website"
                    tabIndex={-1}
                    autoComplete="off"
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Name *</Label>
                    <Input
                      id="name"
                      name="user_name"
                      placeholder="Your name"
                      required
                      maxLength={100}
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
                      maxLength={254}
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
                    maxLength={200}
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
                    maxLength={5000}
                    className="border-border focus:border-accent resize-none"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-hero hover:opacity-90 text-white py-3"
                  disabled={loading}
                >
                  {loading ? "Sending..." : "Send Message"}
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
