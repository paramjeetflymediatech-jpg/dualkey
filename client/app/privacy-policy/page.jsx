import React from "react";
import { Footer } from "../../components/Footer";
import Navbar from "../../components/Navbar";
export const metadata = {
  title: "Privacy Policy | Dual Key Victoria",
  description: "Privacy Policy for Dual Key Victoria website.",
};

const PrivacyPolicy = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pt-24 pb-12 flex flex-col">
        <div className="container mx-auto px-6 max-w-4xl flex-grow mb-12">
          <h1 className="text-4xl font-bold text-brand-blue mb-8 border-b-2 border-brand-gold pb-4">
            Privacy Policy
          </h1>

          <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Introduction
              </h2>
              <p className="leading-relaxed text-gray-600 mb-4">
                Charles Lloyd Property Australia Pty Ltd and our subsidiaries
                (“Charles Lloyd”) are committed to protecting your privacy and
                we have adopted careful measures to protect the confidentiality
                of information provided to us.
              </p>
              <p className="leading-relaxed text-gray-600 mb-4">
                The introduction of the new privacy rules requires organisations
                to comply with the National Privacy Principles implemented in
                the Privacy Amendment (Private Sector) Act 2000. Charles Lloyd’s
                Privacy Policy explains how we collect, use and disclose
                personal information. References to “Charles Lloyd”, “Charles
                Lloyd Property Group”, “we”, “our”, “us” means Charles Lloyd
                Property Australia and our subsidiaries:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-4 mb-4">
                <li>
                  Charles Lloyd Property Australia Pty Ltd (ABN 79 143 917 739;
                  ACN 143 917 739)
                </li>
                <li>Aria First Homes Pty Ltd (ACN 153 948 924)</li>
              </ul>
              <p className="leading-relaxed text-gray-600">
                As at September 2017 our Policy is as follows, but may be
                amended from time to time as appropriate. We shall comply with
                all relevant legislation, which will override this Policy in the
                event of any inconsistency.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Collection
              </h2>
              <p className="leading-relaxed text-gray-600">
                Charles Lloyd will collect a range of personal information from
                time to time, such as your name, address, phone number and email
                address to undertake services to you and on your behalf. We will
                seek to ensure the collection of personal information will be
                fair, lawful and non-intrusive. You will always be told the
                purpose for the information collected, how you can get access to
                your personal information, and what happens if you do not give
                the information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Use and Disclosure
              </h2>
              <p className="leading-relaxed text-gray-600 mb-4">
                Charles Lloyd will use or disclose the information collected to
                provide services to you or on your behalf to a third party.
                Charles Lloyd may also use or disclose your personal information
                to provide promotional services to you from Charles Lloyd or a
                related organisation.
              </p>
              <p className="leading-relaxed text-gray-600">
                Charles Lloyd may also use or disclose your personal information
                to avoid, lessen or prevent an emergency or crime, and as
                required by Commonwealth and State laws.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Information Security
              </h2>
              <p className="leading-relaxed text-gray-600">
                Charles Lloyd will take reasonable steps to protect your
                personal information from misuse and loss from unauthorised
                access, modification or disclosure.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Data Quality, Access and Correction
              </h2>
              <p className="leading-relaxed text-gray-600 mb-4">
                Upon request, an individual’s information held by Charles Lloyd
                will be provided, except in the special circumstances referred
                to in the amended Privacy Act. These exceptions are where
                disclosure would have an unreasonable impact on the privacy of
                another individual or the information would reveal a
                commercially sensitive decision-making process, or we are
                prevented by law from making disclosure.
              </p>
              <p className="leading-relaxed text-gray-600">
                If the personal information of an individual held by us is not
                accurate, complete and up-to-date, we will take reasonable steps
                to correct it. We will provide reasons for any refusal to
                correct personal information, and if you ask us to associate
                your information with a statement claiming the information is
                not accurate, complete or up-to-date, we will take reasonable
                steps to do so.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Identifiers
              </h2>
              <p className="leading-relaxed text-gray-600">
                Charles Lloyd will not adopt as its own identifier of you, use
                or disclose an identifier of you, which has been assigned by a
                government agency, unless allowed by the National Privacy
                Principles, as set out in the amended Privacy Act. An identifier
                is a number assigned to an individual to uniquely identify the
                individual, but does not include an individual’s name or a
                company ABN.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Anonymity
              </h2>
              <p className="leading-relaxed text-gray-600">
                Charles Lloyd may provide services to you and therefore we may
                require the disclosure of your identity for security purposes.
                For this reason, it is unlikely we will be able to provide
                services to you without you identifying yourself.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Transborder Data Flows
              </h2>
              <p className="leading-relaxed text-gray-600">
                We will not transfer any of your personal information held by us
                to any individual, body or agency outside Australia.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Sensitive Information
              </h2>
              <p className="leading-relaxed text-gray-600">
                We will not collect sensitive information about you unless you
                have consented or it is required by law. Sensitive information
                is information such as, an individual’s racial or ethnic
                background, political opinions, membership of a political
                association, religious beliefs or affiliations, philosophical
                beliefs, membership of a professional trade association,
                membership of a trade union, sexual preferences or practices,
                criminal record or health information.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Subscribed Communications
              </h2>
              <p className="leading-relaxed text-gray-600">
                If you are subscribed to communications from Charles Lloyd and
                no longer wish to receive them, you may unsubscribe by sending
                an email to{" "}
                <a
                  href="mailto:info@charleslloyd.com.au"
                  className="text-brand-blue underline hover:text-brand-gold"
                >
                  info@charleslloyd.com.au
                </a>
                , and include the word “unsubscribe” in the subject line or use
                the contact form on the contact page of this website. This will
                unsubscribe you to all communications.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Security Policy
              </h2>
              <p className="leading-relaxed text-gray-600">
                If you have any questions regarding our Privacy Policy or any
                other matter, please contact us at{" "}
                <a
                  href="mailto:info@charleslloyd.com.au"
                  className="text-brand-blue underline hover:text-brand-gold"
                >
                  info@charleslloyd.com.au
                </a>
                .
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default PrivacyPolicy;
