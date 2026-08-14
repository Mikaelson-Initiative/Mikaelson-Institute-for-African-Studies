import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { DraftNotice } from "@/components/draft-notice";
import { SectionLabel } from "@/components/section-label";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How the Mikaelson Institute for African Studies handles information about visitors, contributors, and correspondents.",
};

export default function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Privacy Policy"
        lede="How Mikaelson Institute for African Studies handles information about visitors, contributors, and correspondents."
      />

      <div className="mx-auto max-w-2xl space-y-10 px-4 py-16 sm:px-6">

        <Reveal>
          <DraftNotice>
            standard template drafted for the Institute&rsquo;s review, not
            legal advice, and not final until the Institute (or its counsel)
            confirms it. This policy should be reviewed by qualified legal
            counsel before final publication and adapted to reflect the
            Institute&rsquo;s actual legal structure, jurisdiction, website
            infrastructure, and data-processing practices. Last drafted August
            2026.
          </DraftNotice>
        </Reveal>

        <Reveal>
          <SectionLabel>About This Policy</SectionLabel>
          <p className="mt-3 text-ink-muted">
            This Privacy Policy describes how Mikaelson Institute for African
            Studies (&ldquo;the Institute&rdquo;, &ldquo;we&rdquo;,
            &ldquo;us&rdquo;) handles information collected through this website
            and through its submission, correspondence, and engagement processes.
            By using this website, you accept the practices described here.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Information We Collect</SectionLabel>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>
              <strong className="text-ink">Direct submissions and correspondence.</strong>{" "}
              When you submit a paper, contact the Institute, or engage with any
              of our programmes, we collect the information you provide directly:
              your name, email address, institutional affiliation (if any), and
              the content of your manuscript, message, or enquiry. We do not
              collect payment information.
            </p>
            <p>
              <strong className="text-ink">Website usage information.</strong>{" "}
              This website may collect standard technical information about
              visits, such as page views, browser type, and referring
              pages, through server logs or analytics tools, where such tools
              are in use. Where analytics are used, they are configured to
              minimize data collection consistent with their purpose.
            </p>
            <p>
              <strong className="text-ink">Cookies.</strong>{" "}
              This website may use cookies or similar technologies for
              operational purposes such as navigation and session management.
              Where cookies are used, they will be limited to those necessary
              for the site to function correctly. We do not use cookies for
              advertising or cross-site tracking.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>How We Use Information</SectionLabel>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>
              Submission data is used solely to operate the editorial review
              process: routing your paper to reviewers, tracking its status, and
              communicating updates to you. Contact and enquiry data is used only
              to respond to your message.
            </p>
            <p>
              We do not sell, rent, share, or use your personal information for
              advertising purposes.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>Academic Submissions</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Manuscripts submitted for review are handled under conditions of
            confidentiality appropriate to the review process. Your submission is
            shared with the reviewers and editors assigned to it, and with no one
            else, unless the paper is accepted and published, at which point the
            paper and your author attribution become part of the public record.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Public Information</SectionLabel>
          <p className="mt-3 text-ink-muted">
            If your paper is accepted for publication, the published work and
            your author details (name, institutional affiliation if provided)
            will become part of the Institute&rsquo;s publicly accessible
            archive. This information is intended to remain permanently available
            as part of the scholarly record.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Analytics and Third-Party Services</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Where the Institute uses third-party services (such as analytics
            providers, hosting services, or submission platforms), those
            providers may process certain technical data in connection with the
            operation of the website. The Institute will endeavour to use only
            services whose data practices are consistent with this policy.
            Specific third-party services in use will be listed here once the
            Institute&rsquo;s technical infrastructure is confirmed.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Data Security</SectionLabel>
          <p className="mt-3 text-ink-muted">
            The Institute takes reasonable technical and organisational measures
            to protect the information it holds against unauthorised access, loss,
            or disclosure. No method of transmission over the internet is
            completely secure, and we cannot guarantee absolute security.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Data Retention</SectionLabel>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>
              If your paper is accepted for publication, we retain the manuscript
              and your author information as part of the permanent published
              record.
            </p>
            <p>
              If your paper is declined or withdrawn, we retain the submission
              for a limited administrative period and then delete it from active
              systems.
            </p>
            <p>
              Contact and enquiry correspondence is retained for a reasonable
              administrative period and then deleted, unless there is a specific
              reason to retain it.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>Your Rights</SectionLabel>
          <p className="mt-3 text-ink-muted">
            You may request access to, correction of, or deletion of personal
            information the Institute holds about you. Requests relating to
            published scholarship will be considered in light of the
            Institute&rsquo;s obligations to maintain an accurate and permanent
            scholarly archive. To make a request, contact us at{" "}
            <a
              href="mailto:hello@mikaelsoninitiative.org"
              className="text-teal-deep underline"
            >
              hello@mikaelsoninitiative.org
            </a>
            .
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Children&rsquo;s Privacy</SectionLabel>
          <p className="mt-3 text-ink-muted">
            This website is not directed at children under the age of 16, and we
            do not knowingly collect personal information from anyone under 16.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Changes to This Policy</SectionLabel>
          <p className="mt-3 text-ink-muted">
            We may update this policy from time to time to reflect changes in the
            Institute&rsquo;s practices, legal requirements, or operational
            context. Where changes are material, we will note the revision date
            on this page. Continued use of the website following an update
            constitutes acceptance of the revised policy.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Contact</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Questions about this policy, or requests regarding your data, can be
            sent to{" "}
            <a
              href="mailto:hello@mikaelsoninitiative.org"
              className="text-teal-deep underline"
            >
              hello@mikaelsoninitiative.org
            </a>
            .
          </p>
        </Reveal>
      </div>
    </>
  );
}
