import React from "react";
import { Footer } from "../../components/Footer";
import Navbar from "../../components/Navbar";

export const metadata = {
  title: "Notice of Appointments | Dual Key Victoria",
  description:
    "Notice of Appointments and Meetings for Charles Lloyd Property Australia.",
};

const NoticeOfAppointments = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-50 text-gray-800 font-sans pt-12 pb-12 flex flex-col">
        <div className="container mx-auto px-6 max-w-4xl flex-grow mb-12">
          <h1 className="text-4xl font-bold text-brand-blue mb-8 border-b-2 border-brand-gold pb-4">
            Notice of Appointments
          </h1>

          <div className="bg-white p-8 rounded-lg shadow-sm space-y-6">
            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                General Notice
              </h2>
              <p className="leading-relaxed text-gray-600">
                Notice of Appointments and Meetings with Charles Lloyd Property
                Australia and associated companies.
              </p>
              <p className="leading-relaxed text-gray-600 mt-4">
                Please be advised that all appointments and meetings with
                representatives of Charles Lloyd Property Australia Pty Ltd are
                by appointment only. We value your time and ensuring our team is
                available to provide you with the best possible service.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Scheduling
              </h2>
              <p className="leading-relaxed text-gray-600">
                To schedule an appointment, please contact our office during
                business hours. We will endeavor to accommodate your preferred
                time and date.
              </p>
            </section>

            <section>
              <h2 className="text-2xl font-semibold text-brand-blue mb-3">
                Cancellations
              </h2>
              <p className="leading-relaxed text-gray-600">
                If you need to cancel or reschedule your appointment, please
                provide us with at least 24 hours notice.
              </p>
            </section>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default NoticeOfAppointments;
