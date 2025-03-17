
import Layout from '@/components/Layout';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';

const Privacy = () => {
  const sections = [
    {
      title: "Introduction",
      content: `
        <p>This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our job search and career services. Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the site.</p>
        <p>We reserve the right to make changes to this Privacy Policy at any time and for any reason. We will alert you about any changes by updating the "Last updated" date of this Privacy Policy. You are encouraged to periodically review this Privacy Policy to stay informed of updates. You will be deemed to have been made aware of, will be subject to, and will be deemed to have accepted the changes in any revised Privacy Policy by your continued use of the Site after the date such revised Privacy Policy is posted.</p>
      `
    },
    {
      title: "Collection of Your Information",
      content: `
        <p>We may collect information about you in a variety of ways. The information we may collect on the Site includes:</p>
        <h3>Personal Data</h3>
        <p>Personally identifiable information, such as your name, email address, telephone number, and demographic information, such as your age, gender, hometown, and interests, that you voluntarily give to us when you register with the Site or when you choose to participate in various activities related to the Site, such as online chat and message boards. You are under no obligation to provide us with personal information of any kind, however your refusal to do so may prevent you from using certain features of the Site.</p>
        <h3>Derivative Data</h3>
        <p>Information our servers automatically collect when you access the Site, such as your IP address, your browser type, your operating system, your access times, and the pages you have viewed directly before and after accessing the Site.</p>
        <h3>Financial Data</h3>
        <p>Financial information, such as data related to your payment method (e.g. valid credit card number, card brand, expiration date) that we may collect when you purchase, order, return, exchange, or request information about our services from the Site. We store only very limited, if any, financial information that we collect. Otherwise, all financial information is stored by our payment processor and you are encouraged to review their privacy policy and contact them directly for responses to your questions.</p>
      `
    },
    {
      title: "Use of Your Information",
      content: `
        <p>Having accurate information about you permits us to provide you with a smooth, efficient, and customized experience. Specifically, we may use information collected about you via the Site to:</p>
        <ul>
          <li>Create and manage your account.</li>
          <li>Process your applications and match you with appropriate job opportunities.</li>
          <li>Email you regarding your account or job activity.</li>
          <li>Fulfill and manage job applications, payments, and other transactions related to the Site.</li>
          <li>Increase the efficiency and operation of the Site.</li>
          <li>Monitor and analyze usage and trends to improve your experience with the Site.</li>
          <li>Notify you of updates to the Site.</li>
          <li>Perform other business activities as needed.</li>
          <li>Resolve disputes and troubleshoot problems.</li>
          <li>Prevent fraudulent transactions, monitor against theft, and protect against criminal activity.</li>
        </ul>
      `
    },
    {
      title: "Disclosure of Your Information",
      content: `
        <p>We may share information we have collected about you in certain situations. Your information may be disclosed as follows:</p>
        <h3>By Law or to Protect Rights</h3>
        <p>If we believe the release of information about you is necessary to respond to legal process, to investigate or remedy potential violations of our policies, or to protect the rights, property, and safety of others, we may share your information as permitted or required by any applicable law, rule, or regulation. This includes exchanging information with other entities for fraud protection and credit risk reduction.</p>
        <h3>Third-Party Service Providers</h3>
        <p>We may share your information with third parties that perform services for us or on our behalf, including payment processing, data analysis, email delivery, hosting services, customer service, and marketing assistance.</p>
        <h3>Marketing Communications</h3>
        <p>With your consent, or with an opportunity for you to withdraw consent, we may share your information with third parties for marketing purposes, as permitted by law.</p>
      `
    },
    {
      title: "Security of Your Information",
      content: `
        <p>We use administrative, technical, and physical security measures to help protect your personal information. While we have taken reasonable steps to secure the personal information you provide to us, please be aware that despite our efforts, no security measures are perfect or impenetrable, and no method of data transmission can be guaranteed against any interception or other type of misuse. Any information disclosed online is vulnerable to interception and misuse by unauthorized parties. Therefore, we cannot guarantee complete security if you provide personal information.</p>
      `
    },
    {
      title: "Your Rights Regarding Your Information",
      content: `
        <h3>Account Information</h3>
        <p>You may at any time review or change the information in your account or terminate your account by:</p>
        <ul>
          <li>Logging into your account settings and updating your account</li>
          <li>Contacting us using the contact information provided</li>
        </ul>
        <p>Upon your request to terminate your account, we will deactivate or delete your account and information from our active databases. However, some information may be retained in our files to prevent fraud, troubleshoot problems, assist with any investigations, enforce our Terms of Use and/or comply with legal requirements.</p>
        <h3>Emails and Communications</h3>
        <p>If you no longer wish to receive correspondence, emails, or other communications from us, you may opt-out by:</p>
        <ul>
          <li>Noting your preferences at the time you register your account with the Site</li>
          <li>Logging into your account settings and updating your preferences</li>
          <li>Contacting us using the contact information provided</li>
        </ul>
        <p>If you no longer wish to receive correspondence, emails, or other communications from third parties, you are responsible for contacting the third party directly.</p>
      `
    },
    {
      title: "Contact Us",
      content: `
        <p>If you have questions or comments about this Privacy Policy, please contact us at:</p>
        <p>
          Company Name<br />
          123 Career Street<br />
          San Francisco, CA 94107<br />
          (123) 456-7890<br />
          privacy@company.com
        </p>
      `
    }
  ];

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4">Privacy Policy</h1>
            <p className="text-muted-foreground">Last updated: June 1, 2023</p>
          </div>

          <div className="bg-card rounded-xl p-8 shadow-sm border mb-8">
            <p className="mb-4">
              At our company, we respect your privacy and are committed to protecting it through our compliance with this policy.
              This policy describes the types of information we may collect from you or that you may provide when you visit our website
              and our practices for collecting, using, maintaining, protecting, and disclosing that information.
            </p>
          </div>

          <Accordion type="single" collapsible className="w-full mb-12">
            {sections.map((section, index) => (
              <AccordionItem key={index} value={`section-${index}`}>
                <AccordionTrigger className="text-xl font-semibold py-4">
                  {section.title}
                </AccordionTrigger>
                <AccordionContent className="prose prose-sm max-w-none dark:prose-invert">
                  <div dangerouslySetInnerHTML={{ __html: section.content }} />
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="bg-secondary/50 rounded-xl p-8 text-center">
            <h2 className="text-2xl font-bold mb-4">Questions About Our Privacy Policy?</h2>
            <p className="text-muted-foreground mb-6">
              If you have any questions or concerns regarding our privacy practices, please don't hesitate to contact us.
            </p>
            <a href="/contact" className="text-primary hover:underline font-medium">
              Contact Our Privacy Team
            </a>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
