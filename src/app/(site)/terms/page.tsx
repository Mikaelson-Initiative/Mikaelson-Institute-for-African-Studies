import type { Metadata } from "next";
import { PageHero } from "@/components/page-hero";
import { Reveal } from "@/components/motion/reveal";
import { DraftNotice } from "@/components/draft-notice";
import { SectionLabel } from "@/components/section-label";

export const metadata: Metadata = {
  title: "Terms of Submission",
  description:
    "Submission terms for the Mikaelson Institute for African Studies: covering originality, scope, scholarly standards, authorship, research ethics, copyright, and review.",
};

export default function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Legal"
        title="Terms of Submission"
        lede="The conditions under which the Mikaelson Institute for African Studies accepts and considers work submitted to its programmes and publications."
      />

      <div className="mx-auto max-w-2xl space-y-10 px-4 py-16 sm:px-6">

        <Reveal>
          <DraftNotice>
            standard template drafted for the Institute&rsquo;s review, not
            legal advice, and not final until the Institute (or its counsel)
            confirms it. Last drafted August 2026.
          </DraftNotice>
        </Reveal>

        <Reveal>
          <SectionLabel>Originality</SectionLabel>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>
              Submissions should be original work not previously published in
              substantially the same form. Authors should disclose, at the time
              of submission, any previous publication of related work or
              simultaneous consideration of the same manuscript elsewhere.
            </p>
            <p>
              Authors are responsible for securing any permissions required to
              reproduce third-party material, images, extended quotations, data,
              or other content, within their submission.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>Scope</SectionLabel>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>
              Submissions should meaningfully engage with African studies,
              particularly within the Institute&rsquo;s four research areas:
            </p>
            <ul className="ml-4 list-disc space-y-1 text-ink-muted">
              <li>History &amp; Decolonization</li>
              <li>Society &amp; Politics</li>
              <li>Arts &amp; Culture</li>
              <li>Religion &amp; Philosophy</li>
            </ul>
            <p>
              Interdisciplinary work is encouraged. The Institute welcomes
              submissions that cross established disciplinary boundaries where the
              argument and evidence support it.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>Scholarly Standards</SectionLabel>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>Submissions should demonstrate:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Clear research questions or arguments</li>
              <li>Appropriate engagement with relevant scholarship</li>
              <li>Sound methodology where applicable</li>
              <li>Accurate and consistently formatted citations</li>
              <li>Responsible use of evidence</li>
              <li>Original analysis or meaningful synthesis</li>
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>Authorship</SectionLabel>
          <p className="mt-3 text-ink-muted">
            By submitting a paper, you confirm that you are its author (or have
            the authority to submit on behalf of all listed co-authors) and that
            all listed authors have made a meaningful intellectual contribution to
            the work. Ghost authorship, listing individuals who did not
            meaningfully contribute, or excluding those who did, is not
            acceptable.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Research Ethics</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Authors are responsible for ensuring that their research was
            conducted with appropriate ethical approvals, permissions, informed
            consent, and safeguards where applicable, including research
            involving human participants, communities, sensitive materials, or
            personal data. The Institute may request documentation of ethical
            approvals in connection with a submission.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Academic Integrity</SectionLabel>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>The Institute does not accept:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>
                <strong className="text-ink">Plagiarism</strong>: presenting
                another person&rsquo;s work, words, or ideas as your own without
                appropriate attribution.
              </li>
              <li>
                <strong className="text-ink">Fabrication</strong>: inventing or
                misrepresenting research data, findings, sources, or evidence.
              </li>
              <li>
                <strong className="text-ink">Falsification</strong>: altering,
                omitting, or manipulating data, sources, or evidence in ways that
                distort the record.
              </li>
              <li>
                <strong className="text-ink">Deliberate misrepresentation</strong>: making
                claims about the origin, authorship, status, or nature
                of a submission that the submitting author knows to be false.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>Review</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Depending on the publication or programme, submissions may undergo
            editorial review, peer review, expert review, or another appropriate
            evaluation process. The specific review process applicable to a given
            call or submission category will be described in the relevant
            guidelines or call for papers.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Copyright</SectionLabel>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>
              Authors retain copyright in their work. By submitting, you grant
              the Institute a non-exclusive, worldwide licence to review, edit
              for publication, publish, and distribute your paper, in print and
              online, as part of the Institute&rsquo;s archive, if it is
              accepted. This licence does not prevent you from publishing the
              same work elsewhere subsequently, though we ask that any later
              publication credit its first appearance in the Institute&rsquo;s
              record.
            </p>
            <p>
              A separate agreement may govern specific publishing arrangements,
              and those terms will be communicated to authors on acceptance.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>Editorial Changes</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Accepted papers may be lightly copyedited for house style, clarity,
            and citation format. Substantive changes to your argument or findings
            will always be sent back to you for approval before publication.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Corrections and Withdrawal</SectionLabel>
          <div className="mt-3 space-y-3 text-ink-muted">
            <p>
              You may withdraw a submission at any point before it is formally
              accepted for publication.
            </p>
            <p>
              Once published, the Institute may correct, retract, or append a
              notice of concern to a paper if substantial concerns arise relating
              to accuracy, integrity, or misconduct. The Institute will contact
              the author before taking that step wherever possible. The scholarly
              record will be maintained in a transparent manner.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>Contact</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Questions about these terms can be sent to{" "}
            <a
              href="mailto:hello@mikaelsoninitiative.org"
              className="text-teal-deep underline"
            >
              hello@mikaelsoninitiative.org
            </a>
            .
          </p>
        </Reveal>

        {/* ── Terms of Use ───────────────────────────────────────────────── */}
        <Reveal>
          <div className="border-t border-ink/10 pt-10">
            <h2 className="font-display text-2xl font-semibold text-ink">
              Terms of Use
            </h2>
            <p className="mt-2 text-sm text-ink-muted">
              Governing use of this website and its content.
            </p>
          </div>
        </Reveal>

        <Reveal>
          <DraftNotice>
            standard template drafted for the Institute&rsquo;s review, not
            legal advice, and not final until the Institute (or its counsel)
            confirms it. This should be reviewed by qualified legal counsel
            before final publication.
          </DraftNotice>
        </Reveal>

        <Reveal>
          <SectionLabel>Website Use</SectionLabel>
          <p className="mt-3 text-ink-muted">
            This website is provided for informational, educational, and
            scholarly purposes. By accessing it, you agree to use it in good
            faith and in accordance with these terms. Automated scraping,
            harvesting of contact information, or use of this website for
            commercial purposes without the Institute&rsquo;s express consent is
            not permitted.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Intellectual Property</SectionLabel>
          <p className="mt-3 text-ink-muted">
            The Mikaelson Institute for African Studies name, marks, and original
            website content are the property of the Institute and may not be
            reproduced without permission. Authors of published scholarship retain
            their own copyright in accordance with the Terms of Submission above.
            Where material is reproduced with permission from third parties, that
            permission does not extend to further reproduction by visitors.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Published Scholarship</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Papers and other scholarly materials published in the Institute&rsquo;s
            archive are made available for academic reading, citation, and
            non-commercial educational use. Any reproduction, redistribution, or
            adaptation beyond fair use or equivalent exceptions under applicable
            copyright law requires the consent of the relevant copyright holder,
            which, for Institute-published work, is ordinarily the author.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Academic Use</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Citation of the Institute&rsquo;s published scholarship in academic
            work is permitted and encouraged, subject to standard scholarly
            citation practice: acknowledging the author, the Institute, and the
            date of publication. Quotation for the purposes of commentary,
            criticism, or review is likewise permitted within the usual academic
            conventions.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>External Links</SectionLabel>
          <p className="mt-3 text-ink-muted">
            This website may contain links to external sites. The Institute does
            not control the content of external websites and is not responsible
            for their accuracy, availability, or practices. Links are provided for
            convenience and do not constitute endorsement.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>User Submissions</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Materials submitted to the Institute through its submission and
            correspondence processes are governed by the Terms of Submission
            above and by any specific guidelines provided in connection with a
            particular call or programme.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Prohibited Use</SectionLabel>
          <div className="mt-3 space-y-2 text-ink-muted">
            <p>You may not use this website to:</p>
            <ul className="ml-4 list-disc space-y-1">
              <li>Violate any applicable law or regulation.</li>
              <li>
                Impersonate the Institute, its staff, or any other person or
                organization.
              </li>
              <li>
                Transmit material that is unlawful, defamatory, or otherwise
                harmful.
              </li>
              <li>
                Interfere with or disrupt the operation of the website or its
                infrastructure.
              </li>
              <li>
                Harvest personal information from this website by automated means.
              </li>
            </ul>
          </div>
        </Reveal>

        <Reveal>
          <SectionLabel>Accuracy</SectionLabel>
          <p className="mt-3 text-ink-muted">
            The Institute endeavours to ensure that information on this website is
            accurate and up to date. However, the Institute does not warrant the
            completeness or accuracy of any content and is not liable for
            reliance on information published here. Scholarly content published in
            the Institute&rsquo;s archive reflects the views of the authors
            concerned, not necessarily those of the Institute as an institution.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Changes</SectionLabel>
          <p className="mt-3 text-ink-muted">
            The Institute reserves the right to modify these terms at any time.
            Changes will be reflected on this page. Continued use of the website
            following an update constitutes acceptance of the revised terms.
          </p>
        </Reveal>

        <Reveal>
          <SectionLabel>Contact</SectionLabel>
          <p className="mt-3 text-ink-muted">
            Questions about these terms of use can be sent to{" "}
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
