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
          You can reach us at: <a href="mailto:support@beehub.com" className="text-blue-500">support@beehub.com</a>
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Phone</h2>
        <p className="text-gray-600 mt-2">
          For urgent matters, give us a call: <a href="tel:+1234567890" className="text-blue-500">+1 (234) 567-890</a>
        </p>
      </div>

      <div className="mb-8">
        <h2 className="text-2xl font-semibold text-gray-800">Office Location</h2>
        <p className="text-gray-600 mt-2">
          Our office is located at: <br />
          BeeHub HQ, <br />
          1234 Tech Lane, <br />
          Silicon Valley, CA, USA
        </p>
      </div>

      <div className="text-center mt-10">
        <p className="text-gray-500 text-sm">
          We aim to respond to all inquiries within 2 business days. Thank you for reaching out to us!
        </p>
      </div>
    </div>
  );
};

export default ContactPage;
