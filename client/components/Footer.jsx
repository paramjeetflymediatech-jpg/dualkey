"use client";

import Link from "next/link";
import React from "react";
import {
  contactDetails,
  copyrightContent,
  footerLinks,
  legalLinks,
  socialLinks,
} from "./constantData";

const SocialIcon = ({ name }) => {
  switch (name) {
    case "Facebook":
      return (
        <svg
          fill="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"></path>
        </svg>
      );
    case "Twitter":
      return (
        <svg
          fill="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path d="M23 3a10.9 10.9 0 01-3.14 1.53 4.48 4.48 0 00-7.86 3v1A10.66 10.66 0 013 4s-4 9 5 13a11.64 11.64 0 01-7 2c9 5 20 0 20-11.5a4.5 4.5 0 00-.08-.83A7.72 7.72 0 0023 3z"></path>
        </svg>
      );
    case "Instagram":
      return (
        <svg
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="2"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <rect width="20" height="20" x="2" y="2" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1112.63 8 4 4 0 0116 11.37zm1.5-4.87h.01"></path>
        </svg>
      );
    case "Linkedin":
      return (
        <svg
          fill="currentColor"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path
            stroke="none"
            d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-2-2 2 2 0 00-2 2v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"
          ></path>
          <circle cx="4" cy="4" r="2" stroke="none"></circle>
        </svg>
      );
    case "Youtube":
      return (
        <svg
          fill="currentColor"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="0"
          className="w-5 h-5"
          viewBox="0 0 24 24"
        >
          <path
            stroke="none"
            d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"
          ></path>
        </svg>
      );
    default:
      return null;
  }
};

export const Footer = () => {
  return (
    <footer className="">
      <div className="container px-5 py-24 mx-auto flex md:items-start lg:items-start md:flex-row md:flex-nowrap flex-wrap flex-col">
        {/* Brand Column */}
        <div className="w-64 flex-shrink-0 md:mx-0 mx-auto text-center md:text-left">
          <Link
            href="/"
            className="flex title-font font-medium items-center md:justify-start justify-center text-white"
          >
            <img src="/logo.png" alt="Dual Key Victoria" className="h-20" />
          </Link>
          <p className="mt-4 text-sm text-gray-800 leading-relaxed">
            Victoria's premier dual key property specialists. Maximizing your
            investment potential through innovative design and smart
            construction.
          </p>
          <p className="mt-4 text-sm font-semibold text-brand-gold">
            Invest Smarter.
          </p>
        </div>

        {/* Links Container */}
        <div className="flex-grow flex flex-wrap md:pl-20 -mb-10 md:mt-0 mt-10 md:text-left text-center">
          {/* Quick Links */}
          <div className="lg:w-1/3 md:w-1/2 w-full px-4 mb-10">
            <h2 className="title-font font-semibold text-brand-gold tracking-widest text-sm mb-3 uppercase">
              Quick Links
            </h2>
            <nav className="list-none space-y-2">
              {footerLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    className="text-gray-800 hover:text-white transition-colors duration-300 ease-in-out"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </nav>
          </div>

          {/* Legal Links */}
          <div className="lg:w-1/3 md:w-1/2 w-full px-4 mb-10">
            <h2 className="title-font font-semibold text-brand-gold tracking-widest text-sm mb-3 uppercase">
              Legal
            </h2>
            <nav className="list-none space-y-2">
              {legalLinks.map((link) => (
                <li key={link.id}>
                  <Link
                    href={link.url}
                    className="text-gray-800 hover:text-white transition-colors duration-300 ease-in-out"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </nav>
          </div>

          {/* Contact / Socials */}
          <div className="lg:w-1/3 md:w-1/2 w-full px-4 mb-10">
            <h2 className="title-font font-semibold text-brand-gold tracking-widest text-sm mb-3 uppercase">
              Connect With Us
            </h2>

            {/* Address & Contact Info */}
            <div className="mb-6 text-sm text-gray-800">
              <p className="mb-2 text-white font-medium">
                {contactDetails.heading}
              </p>
              <p className="mb-4">{contactDetails.address}</p>
              <div className="space-y-1">
                {contactDetails.phone.map((item, index) => (
                  <p
                    key={index}
                    className="flex flex-col md:flex-row md:items-center justify-center md:justify-start gap-1"
                  >
                    <span className="text-gray-500 w-28 text-right md:text-left">
                      {item.label}:
                    </span>
                    <a
                      href={`tel:${item.number.replace(/\s/g, "")}`}
                      className="hover:text-white transition-colors font-medium text-brand-gold"
                    >
                      {item.number}
                    </a>
                  </p>
                ))}
              </div>
            </div>

            <div className="flex justify-center md:justify-start mb-4 space-x-3">
              {socialLinks.map((link) => (
                <a
                  key={link.id}
                  href={link.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-800 hover:text-brand-gold transition-colors duration-300"
                >
                  <span className="sr-only">{link.name}</span>
                  <div className="p-2   rounded-full hover:bg-gray-700 transition-colors">
                    <SocialIcon name={link.name} />
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Bar */}
      <div className="bg-gray-950 border-t border-gray-800">
        <div className="container mx-auto py-6 px-5 flex flex-col items-center">
          <p className="text-gray-300 text-xs text-center leading-relaxed max-w-4xl mx-auto">
            {copyrightContent.text}
          </p>
        </div>
      </div>
    </footer>
  );
};
