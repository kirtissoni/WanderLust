import React, { useState } from "react";

const Faq = () => {
  const [faq, setFaq] = useState([
    {
      question: "How do I create an account on Wanderlust?",
      answer:
        "Click on the <a href='#' class='text-[#FF385C] hover:underline'>Sign Up</a> button at the top right of the page, enter your details, and verify your email. Once done, you can log in and start exploring stays right away!",
      open: false,
    },
    {
      question: "How can I book a property?",
      answer:
        "Browse your desired destination, choose your travel dates, and click ‘Book Now’. You’ll receive an instant confirmation if the property supports instant booking. Otherwise, the host will confirm within 24 hours.",
      open: false,
    },
    {
      question: "Can I list my own property?",
      answer:
        "Absolutely! After logging in, click on <a href='#' class='text-[#FF385C] hover:underline'>Become a Host</a> in the menu. You can upload photos, set pricing, and manage availability directly from your dashboard.",
      open: false,
    },
    {
      question: "How do payments and refunds work?",
      answer:
        "Payments are processed securely through our platform using trusted gateways. Refunds depend on the host’s cancellation policy. You can review and request refunds from your <a href='#' class='text-[#FF385C] hover:underline'>Bookings</a> section.",
      open: false,
    },
    {
      question: "What if I face issues during my stay?",
      answer:
        "Our 24/7 support team is available to help. Go to the <a href='#' class='text-[#FF385C] hover:underline'>Help Center</a> and report any issue. We’ll assist with refunds, rebookings, or contacting your host.",
      open: false,
    },
    {
      question: "Is my data and payment information secure?",
      answer:
        "Yes! We use advanced encryption (SSL) and JWT authentication to protect user data. Payments are handled through secure and verified payment gateways.",
      open: false,
    },
  ]);

  const toggleFaq = (index) => {
    setFaq(
      faq.map((item, i) => ({
        ...item,
        open: i === index ? !item.open : false,
      }))
    );
  };

  return (
    <section className="py-16 bg-white sm:py-20 lg:py-28">
      <div className="px-6 mx-auto max-w-7xl sm:px-8">
        {/* Heading */}
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="text-4xl font-bold text-gray-900 sm:text-5xl">
            Frequently Asked Questions
          </h2>
          <p className="max-w-xl mx-auto mt-4 text-base text-gray-600">
            Everything you need to know about booking, hosting, and payments on
            Wanderlust.
          </p>
        </div>

        {/* FAQ Items */}
        <div className="max-w-3xl mx-auto mt-10 space-y-5 md:mt-16">
          {faq.map((item, index) => (
            <div
              key={index}
              className="transition-all duration-200 bg-white border border-gray-200 rounded-2xl shadow-sm hover:shadow-md"
            >
              <button
                type="button"
                className="flex items-center justify-between w-full px-6 py-5 text-left sm:p-7"
                onClick={() => toggleFaq(index)}
              >
                <span className="text-lg font-semibold text-gray-900">
                  {item.question}
                </span>
                <svg
                  className={`w-6 h-6 text-gray-500 transform transition-transform ${
                    item.open ? "rotate-180" : ""
                  }`}
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              <div
                className={`${
                  item.open ? "block" : "hidden"
                } px-6 pb-5 sm:px-7 sm:pb-7`}
              >
                <p
                  className="text-gray-600 leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: item.answer }}
                ></p>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="mt-12 text-center">
          <p className="text-gray-600">
            Didn’t find your answer?{" "}
            <a
              href="#"
              className="font-medium text-[#FF385C] hover:text-blue-700 hover:underline"
            >
              Contact our support team
            </a>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Faq;
