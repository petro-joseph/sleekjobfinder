
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';

const Privacy = () => {
  const lastUpdated = "August 15, 2023";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-primary/70">
              Privacy Policy
            </h1>
            <div className="flex items-center justify-center text-muted-foreground mt-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>

          <Card className="mb-8 hover:shadow-md transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">Introduction</h2>
              <p className="text-muted-foreground mb-4">
                At SleekJobs ("we," "us," or "our"), we respect your privacy and are committed to protecting your personal data. This privacy policy explains how we collect, use, and share information about you when you use our website, mobile applications, and services (collectively, the "Services").
              </p>
              <p className="text-muted-foreground mb-4">
                Please read this privacy policy carefully to understand our practices regarding your personal data. By using our Services, you acknowledge that you have read and understood this privacy policy.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">Information We Collect</h2>
              <p className="text-muted-foreground mb-4">
                We collect several types of information from and about users of our Services, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>
                  <strong>Personal Information:</strong> Such as your name, email address, phone number, postal address, educational background, work experience, and other information you provide when creating an account or building your profile.
                </li>
                <li>
                  <strong>Resume Data:</strong> Information contained in resumes or CVs that you upload or create using our Services, including but not limited to your skills, work history, education, and other professional qualifications.
                </li>
                <li>
                  <strong>Job Application Data:</strong> Information related to jobs you apply for through our Services, including application status, communications with employers, and notes or feedback.
                </li>
                <li>
                  <strong>Usage Data:</strong> Information about how you use our Services, including your browsing actions, search queries, and other interaction data.
                </li>
                <li>
                  <strong>Device Information:</strong> Information about the devices you use to access our Services, including IP address, browser type, operating system, and device identifiers.
                </li>
                <li>
                  <strong>Location Data:</strong> Information about your approximate location as determined from your IP address or more precise location if you grant permission through your device settings.
                </li>
              </ul>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">How We Use Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We use the information we collect for various purposes, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>
                  <strong>Providing and Improving our Services:</strong> To operate, maintain, and enhance the functionality and user experience of our Services.
                </li>
                <li>
                  <strong>Job Matching:</strong> To match you with relevant job opportunities based on your profile, resume data, and preferences.
                </li>
                <li>
                  <strong>Communication:</strong> To communicate with you regarding your account, job applications, potential opportunities, and updates about our Services.
                </li>
                <li>
                  <strong>Personalization:</strong> To personalize your experience by showing you content and recommendations tailored to your interests and preferences.
                </li>
                <li>
                  <strong>Analytics:</strong> To analyze usage patterns, trends, and preferences to improve our Services and develop new features.
                </li>
                <li>
                  <strong>Security:</strong> To detect, prevent, and address technical issues, security breaches, and fraudulent or illegal activities.
                </li>
                <li>
                  <strong>Legal Compliance:</strong> To comply with applicable laws, regulations, legal processes, or governmental requests.
                </li>
              </ul>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">Sharing Your Information</h2>
              <p className="text-muted-foreground mb-4">
                We may share your information with the following parties:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>
                  <strong>Employers and Recruiters:</strong> When you apply for jobs through our Services, we share relevant information from your profile and resume with the employers or recruiters offering those positions.
                </li>
                <li>
                  <strong>Service Providers:</strong> We may share your information with third-party vendors, consultants, and other service providers who perform services on our behalf, such as hosting, data analysis, payment processing, and customer service.
                </li>
                <li>
                  <strong>Affiliates:</strong> We may share your information with our affiliates (companies under common control with us) for the purposes outlined in this Privacy Policy.
                </li>
                <li>
                  <strong>Business Transfers:</strong> If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information may be transferred as part of that transaction.
                </li>
                <li>
                  <strong>Legal Requirements:</strong> We may disclose your information if required to do so by law or in response to valid requests by public authorities.
                </li>
                <li>
                  <strong>Protection of Rights:</strong> We may disclose your information to protect the rights, property, or safety of SleekJobs, our users, or others.
                </li>
              </ul>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">Your Rights and Choices</h2>
              <p className="text-muted-foreground mb-4">
                Depending on your location, you may have certain rights regarding your personal data, including:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>
                  <strong>Access:</strong> You can request access to the personal data we hold about you.
                </li>
                <li>
                  <strong>Correction:</strong> You can request that we correct inaccurate or incomplete personal data.
                </li>
                <li>
                  <strong>Deletion:</strong> You can request that we delete your personal data in certain circumstances.
                </li>
                <li>
                  <strong>Restriction:</strong> You can request that we restrict the processing of your personal data in certain circumstances.
                </li>
                <li>
                  <strong>Data Portability:</strong> You can request a copy of your personal data in a structured, commonly used, and machine-readable format.
                </li>
                <li>
                  <strong>Objection:</strong> You can object to our processing of your personal data in certain circumstances.
                </li>
              </ul>
              <p className="text-muted-foreground mb-4">
                To exercise these rights, please contact us using the information provided in the "Contact Us" section below.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">Data Security</h2>
              <p className="text-muted-foreground mb-6">
                We implement appropriate technical and organizational measures to protect your personal data against unauthorized or unlawful processing, accidental loss, destruction, or damage. However, no method of transmission over the Internet or method of electronic storage is 100% secure, and we cannot guarantee absolute security.
              </p>

              <h2 className="text-2xl font-bold mb-4">International Data Transfers</h2>
              <p className="text-muted-foreground mb-6">
                Your personal data may be transferred to, and processed in, countries other than the country in which you reside. These countries may have data protection laws that are different from the laws of your country. We take appropriate safeguards to require that your personal data will remain protected in accordance with this Privacy Policy.
              </p>

              <h2 className="text-2xl font-bold mb-4">Data Retention</h2>
              <p className="text-muted-foreground mb-6">
                We retain your personal data for as long as necessary to fulfill the purposes for which we collected it, including for the purposes of satisfying any legal, accounting, or reporting requirements. To determine the appropriate retention period, we consider the amount, nature, and sensitivity of the personal data, the potential risk of harm from unauthorized use or disclosure, the purposes for which we process the data, and the applicable legal requirements.
              </p>

              <h2 className="text-2xl font-bold mb-4">Changes to This Privacy Policy</h2>
              <p className="text-muted-foreground mb-6">
                We may update this privacy policy from time to time to reflect changes in our practices or for other operational, legal, or regulatory reasons. We will notify you of any material changes by posting the new privacy policy on this page and updating the "Last Updated" date at the top of this page. We encourage you to review this privacy policy periodically for any changes.
              </p>

              <h2 className="text-2xl font-bold mb-4">Contact Us</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions, concerns, or requests regarding this privacy policy or our data practices, please contact us at:
              </p>
              <div className="p-4 bg-secondary/20 rounded-md mb-6">
                <p className="mb-1"><strong>Email:</strong> privacy@sleekjobs.com</p>
                <p className="mb-1"><strong>Address:</strong> 123 Innovation Way, San Francisco, CA 94103, USA</p>
                <p><strong>Phone:</strong> +1 (800) 123-4567</p>
              </div>
            </CardContent>
          </Card>

          <div className="text-center">
            <Button asChild>
              <a href="/contact">Contact Us With Questions</a>
            </Button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Privacy;
