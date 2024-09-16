import React from 'react';

const TermsOfServicePage: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-4xl font-bold text-gray-800 mb-4">Terms of Service</h1>

      <p className="text-gray-600 mb-4">
        Welcome to BeeHub. By using our services, you agree to the following terms and conditions. Please read them carefully.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Acceptance of Terms</h2>
      <p className="text-gray-600 mb-4">
        By accessing and using BeeHub, you accept and agree to be bound by these terms. If you do not agree with these terms, you must discontinue your use of the service.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">User Responsibilities</h2>
      <p className="text-gray-600 mb-4">
        You agree to use BeeHub only for lawful purposes and in a manner that does not infringe the rights of others. You are responsible for all activity that occurs under your account.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Account Security</h2>
      <p className="text-gray-600 mb-4">
        You are responsible for maintaining the confidentiality of your account information and password. BeeHub is not liable for any loss or damage resulting from unauthorized access to your account.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Disclaimer of Warranties</h2>
      <p className="text-gray-600 mb-4">
        BeeHub provides services on an "as is" and "as available" basis. We make no warranties, expressed or implied, regarding the functionality, accuracy, or reliability of the services.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Limitation of Liability</h2>
      <p className="text-gray-600 mb-4">
        BeeHub is not liable for any indirect, incidental, or consequential damages arising from the use of our services.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Termination of Service</h2>
      <p className="text-gray-600 mb-4">
        We reserve the right to suspend or terminate your access to BeeHub at any time, for any reason, without notice.
      </p>

      <h2 className="text-2xl font-semibold text-gray-800 mt-6">Changes to These Terms</h2>
      <p className="text-gray-600 mb-4">
        We may update these terms from time to time. Continued use of BeeHub after changes have been made constitutes acceptance of the new terms.
      </p>

      <p className="text-gray-600 mt-6">
        If you have any questions about these terms, please contact us at <a href="mailto:beehubdev@proton.me" className="text-blue-500">beehubdev@proton.me</a>.
      </p>
    </div>
  );
};

export default TermsOfServicePage;
