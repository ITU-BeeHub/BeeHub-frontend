import React from 'react';

const PrivacyPolicyPage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Privacy Policy</h1>

      <p className="text-gray-600 mb-4">
        At BeeHub, we take your privacy seriously. This Privacy Policy describes how we collect, use, and protect your personal information when you use our services.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Information We Collect</h2>
      <p className="text-gray-600 mb-4">
        We may collect the following types of information:
      </p>
      <ul className="list-disc ml-6 mb-4 text-gray-600">
        <li>Personal Information: such as name, email address, phone number, and other identifiable details.</li>
        <li>Usage Information: how you interact with our services, including IP addresses, browser types, and activity logs.</li>
        <li>Cookies: small text files that help enhance your user experience and collect usage data.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">How We Use Your Information</h2>
      <p className="text-gray-600 mb-4">
        Your information is used for the following purposes:
      </p>
      <ul className="list-disc ml-6 mb-4 text-gray-600">
        <li>To provide and improve our services.</li>
        <li>To communicate with you about updates, offers, and support.</li>
        <li>To comply with legal obligations and protect the rights of BeeHub and its users.</li>
      </ul>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">How We Share Your Information</h2>
      <p className="text-gray-600 mb-4">
        We do not sell, trade, or otherwise transfer your personal information to outside parties except when required by law or with your explicit consent.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Your Rights</h2>
      <p className="text-gray-600 mb-4">
        You have the right to access, correct, or delete your personal information. If you have any concerns or wish to exercise your rights, please contact us at <a href="mailto:privacy@beehub.com" className="text-blue-500">privacy@beehub.com</a>.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Changes to This Policy</h2>
      <p className="text-gray-600 mb-4">
        We may update this Privacy Policy from time to time. We will notify you of any changes by updating the "Last Updated" date at the top of this page.
      </p>

      <p className="text-gray-600 mt-6">
        If you have any questions about this Privacy Policy, please contact us at <a href="mailto:privacy@beehub.com" className="text-blue-500">privacy@beehub.com</a>.
      </p>
    </div>
  );
};

export default PrivacyPolicyPage;
