import type { Metadata } from "next";
import { PageIntro } from "@/components/page/page-intro";
import { EnquiryForm } from "@/components/property/enquiry-form";
import { Reveal } from "@/components/ui/reveal";

export const metadata: Metadata = {
  title: "Contact",
  description: "Demo enquiry form for the fictional Azure Estates agency. No information is sent.",
};

export default function ContactPage() {
  return (
    <main id="main-content">
      <PageIntro eyebrow="Contact" title="Arrange a private conversation." intro="This is a working demonstration form: it validates and confirms on-screen, but nothing is transmitted or stored." />
      <div className="container-lux grid gap-16 pb-32 lg:grid-cols-[1fr_1.6fr]">
        <Reveal>
          <div className="space-y-10 border-t border-navy/15 pt-8">
            {[
              ["Office (fictional)", "12 Example Quay, Westmoorings, Trinidad"],
              ["Email (placeholder)", "hello@azure-estates.example"],
              ["Hours", "By appointment · Monday to Saturday"],
            ].map(([k, v]) => (
              <div key={k}>
                <p className="eyebrow text-champagne-deep">{k}</p>
                <p className="mt-2 font-serif text-2xl">{v}</p>
              </div>
            ))}
            <p className="text-sm leading-relaxed text-navy/60">
              Azure Estates is a portfolio demonstration. The address and email above are placeholders and do not belong to a real business.
            </p>
          </div>
        </Reveal>
        <Reveal delay={0.1}>
          <EnquiryForm />
        </Reveal>
      </div>
    </main>
  );
}
