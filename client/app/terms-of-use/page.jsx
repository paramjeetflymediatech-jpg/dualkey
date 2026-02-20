import React from "react";
import { Footer } from "../../components/Footer";
import Navbar from "../../components/Navbar";

export const metadata = {
  title: "Terms of Use | Dual Key Victoria",
  description: "Terms of Use for Dual Key Victoria website.",
};

const TermsOfUse = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pt-24 pb-12 flex flex-col">
        <div className="container mx-auto px-6 max-w-4xl flex-grow mb-12">
          <h1 className="text-4xl font-bold text-brand-blue mb-8 border-b-2 border-brand-gold pb-4">
            Terms of Use
          </h1>

          <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
            <section>
              <p className="leading-relaxed text-gray-600 mb-4">
                You have accessed a website owned by Charles Lloyd Property
                Australia Pty Ltd. It is operated by Charles Lloyd Property
                Australia Pty Ltd and our subsidiaries (“Charles Lloyd”).
              </p>
              <p className="leading-relaxed text-gray-600 mb-4">
                Your use of this website and all the information, graphics,
                materials and other content contained on this website are
                governed by the Terms of Use set out below and by accessing this
                website you agree to be bound by these Terms of Use. If you do
                not agree to these Terms of Use, do not access this website.
              </p>
              <p className="leading-relaxed text-gray-600 mb-4">
                We reserve the right to update and amend this website (including
                all information, graphics and materials) at any time without
                notice.
              </p>
              <p className="leading-relaxed text-gray-600 mb-4">
                You agree that where Charles Lloyd is required, by law or
                otherwise, to provide you with a document, you consent to the
                provision of that document electronically through the links on
                this website.
              </p>
              <p className="leading-relaxed text-gray-600 mb-4">
                All references to dollars are to Australian dollars.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-blue mb-3">
                Entities providing advice
              </h2>
              <p className="leading-relaxed text-gray-600 mb-4">
                To the extent that general advice is provided on this website,
                it is provided by one or more of the following entities based on
                the circumstances and context in which the advice is given:
              </p>
              <ul className="list-disc list-inside text-gray-600 ml-4 mb-4 space-y-1">
                <li>
                  Charles Lloyd Property Australia Pty Ltd (ACN 143 917 739)
                </li>
                <li>Studio Homes Victoria Pty Ltd (ACN 137 335 221)</li>
                <li>Champions Estate Pty Ltd (ACN 615 379 532)</li>
                <li>Grande Vue Pty Ltd (ACN 618 868 223)</li>
                <li>Sovereign Rose Estate Pty Ltd (ACN 622 555 248)</li>
                <li>
                  Springlands Narre Warren Estate Pty Ltd (ACN 625 608 326)
                </li>
                <li>Red Plains Road Pty Ltd (ACN 622 952 185)</li>
                <li>Section Road Greenvale Pty Ltd (ACN 632 311 329)</li>
                <li>Stadio Pty Ltd (ACN 631 940 522)</li>
                <li>Aria First Homes Pty Ltd (ACN 153 948 924)</li>
              </ul>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-blue mb-3">
                Disclaimer
              </h2>
              <p className="leading-relaxed text-gray-600 mb-4">
                This website contains general information about Charles Lloyd’s
                products and services. This information does not constitute an
                offer or inducement to enter into a legally binding contract and
                is not part of the terms and conditions for any of the products
                and services named on this website. The information contained in
                this website is designed to be used as a guide only and all case
                studies are provided for illustrative purposes only. Charles
                Lloyd does not make any representation or provide any warranty
                as to the accuracy, adequacy or completeness of the information.
                Charles Lloyd recommends that you seek independent advice in
                relation to the information contained on this website.
              </p>
            </section>

            <section>
              <h2 className="text-xl font-semibold text-brand-blue mb-3">
                Indemnity
              </h2>
              <p className="leading-relaxed text-gray-600">
                You agree to indemnify Charles Lloyd and keep it indemnified
                against all actions, claims, costs, demands, damages or
                liability arising in any manner from a breach by you of these
                Terms of Use.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default TermsOfUse;
