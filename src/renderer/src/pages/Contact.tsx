import React from 'react';

const ContactPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Contact Us</h1>
      <p className="text-gray-700 mb-6">
        We would love to hear from you! Whether you have questions, feedback, or concerns, feel free to get in touch with us through any of the following methods:
      </p>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Email</h2>
        <p className="text-gray-600 mt-2">
          You can reach us at: <a href="mailto:beehubdev@proton.me" className="text-blue-500">beehubdev@proton.me</a>
        </p>
      </div>

      <div className="text-center mt-10">
        <p className="text-gray-500 text-sm">
          We aim to respond to all inquiries within a week. Thank you for reaching out to us!
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
