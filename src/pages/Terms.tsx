
import Layout from '@/components/Layout';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Clock } from 'lucide-react';

const Terms = () => {
  const lastUpdated = "August 15, 2023";

  return (
    <Layout>
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold mb-4 text-gradient bg-gradient-to-r from-primary to-primary/70">
              Terms of Service
            </h1>
            <div className="flex items-center justify-center text-muted-foreground mt-4">
              <Clock className="h-4 w-4 mr-2" />
              <span>Last Updated: {lastUpdated}</span>
            </div>
          </div>

          <Card className="mb-8 hover:shadow-md transition-all duration-300">
            <CardContent className="p-8">
              <h2 className="text-2xl font-bold mb-4">1. Introduction</h2>
              <p className="text-muted-foreground mb-4">
                Welcome to SleekJobs. These Terms of Service ("Terms") govern your access to and use of the SleekJobs website, mobile applications, and services (collectively, the "Services"). By accessing or using our Services, you agree to be bound by these Terms. If you do not agree to these Terms, you may not access or use the Services.
              </p>
              <p className="text-muted-foreground mb-4">
                These Terms constitute a legally binding agreement between you and SleekJobs. Please read them carefully.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">2. Eligibility</h2>
              <p className="text-muted-foreground mb-4">
                To use the Services, you must be at least 18 years of age, or the age of legal majority in your jurisdiction, whichever is greater. By using the Services, you represent and warrant that you meet these eligibility requirements.
              </p>
              <p className="text-muted-foreground mb-4">
                If you are using the Services on behalf of an organization or entity, you represent and warrant that you have the authority to bind that organization or entity to these Terms and you agree to be bound by these Terms on behalf of that organization or entity.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">3. Account Registration</h2>
              <p className="text-muted-foreground mb-4">
                To access certain features of the Services, you may need to create an account. When you create an account, you must provide accurate and complete information. You are solely responsible for maintaining the confidentiality of your account credentials and for all activities that occur under your account.
              </p>
              <p className="text-muted-foreground mb-4">
                You agree to notify us immediately of any unauthorized use of your account or any other breach of security. We will not be liable for any loss or damage arising from your failure to protect your account credentials.
              </p>
              <p className="text-muted-foreground mb-4">
                We reserve the right to suspend or terminate your account at our discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users of the Services, us, or third parties, or for any other reason.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">4. Use of Services</h2>
              <p className="text-muted-foreground mb-4">
                Subject to these Terms, we grant you a limited, non-exclusive, non-transferable, and revocable license to access and use the Services for your personal or internal business purposes.
              </p>
              <p className="text-muted-foreground mb-4">
                You agree not to use the Services:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>In any way that violates any applicable federal, state, local, or international law or regulation</li>
                <li>To transmit, or procure the sending of, any advertising or promotional material, including any "junk mail," "chain letter," "spam," or any other similar solicitation</li>
                <li>To impersonate or attempt to impersonate SleekJobs, a SleekJobs employee, another user, or any other person or entity</li>
                <li>To engage in any other conduct that restricts or inhibits anyone's use or enjoyment of the Services, or which may harm SleekJobs or users of the Services or expose them to liability</li>
                <li>To use any robot, spider, or other automatic device, process, or means to access the Services for any purpose, including monitoring or copying any of the material on the Services</li>
                <li>To use any manual process to monitor or copy any of the material on the Services or for any other unauthorized purpose without our prior written consent</li>
                <li>To use any device, software, or routine that interferes with the proper working of the Services</li>
                <li>To introduce any viruses, Trojan horses, worms, logic bombs, or other material which is malicious or technologically harmful</li>
                <li>To attempt to gain unauthorized access to, interfere with, damage, or disrupt any parts of the Services, the server on which the Services are stored, or any server, computer, or database connected to the Services</li>
                <li>To attack the Services via a denial-of-service attack or a distributed denial-of-service attack</li>
                <li>To otherwise attempt to interfere with the proper working of the Services</li>
              </ul>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">5. User Content</h2>
              <p className="text-muted-foreground mb-4">
                The Services may allow you to upload, submit, store, send, or receive content, including but not limited to text, photos, resumes, and other materials (collectively, "User Content"). You retain ownership of any intellectual property rights that you hold in that User Content.
              </p>
              <p className="text-muted-foreground mb-4">
                By submitting User Content to the Services, you grant SleekJobs a worldwide, non-exclusive, royalty-free license (with the right to sublicense) to use, copy, reproduce, process, adapt, modify, publish, transmit, display, and distribute such User Content in any and all media or distribution methods now known or later developed, for the purpose of providing and improving the Services.
              </p>
              <p className="text-muted-foreground mb-4">
                You represent and warrant that:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>You own or control all rights in and to the User Content and have the right to grant the license granted above</li>
                <li>The User Content does not violate the privacy rights, publicity rights, copyrights, contract rights, or any other rights of any person or entity</li>
                <li>The User Content does not contain any material that is defamatory, obscene, indecent, abusive, offensive, harassing, violent, hateful, inflammatory, or otherwise objectionable</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                We reserve the right to remove any User Content that violates these Terms or that we determine in our sole discretion is otherwise objectionable.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">6. Intellectual Property</h2>
              <p className="text-muted-foreground mb-4">
                The Services and their entire contents, features, and functionality (including but not limited to all information, software, text, displays, images, video, and audio, and the design, selection, and arrangement thereof), are owned by SleekJobs, its licensors, or other providers of such material and are protected by United States and international copyright, trademark, patent, trade secret, and other intellectual property or proprietary rights laws.
              </p>
              <p className="text-muted-foreground mb-4">
                These Terms do not grant you any rights to use the SleekJobs name, logo, or other trademarks, service marks, and brand features.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">7. Subscription and Payments</h2>
              <p className="text-muted-foreground mb-4">
                Some features of the Services may be available only with a paid subscription. By subscribing to such features, you agree to pay the fees associated with the subscription plan you choose.
              </p>
              <p className="text-muted-foreground mb-4">
                All payments are non-refundable except as required by law or as explicitly stated in these Terms. You are responsible for any taxes that may apply to your subscription payments.
              </p>
              <p className="text-muted-foreground mb-4">
                Subscription plans may automatically renew unless you cancel your subscription before the renewal date. You can cancel your subscription at any time through your account settings or by contacting us.
              </p>
              <p className="text-muted-foreground mb-4">
                We reserve the right to change our subscription fees at any time. If we change the fees for your subscription, we will provide you with notice of the change and the opportunity to cancel your subscription before the change takes effect.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">8. Disclaimer of Warranties</h2>
              <p className="text-muted-foreground mb-4">
                THE SERVICES ARE PROVIDED "AS IS" AND "AS AVAILABLE," WITHOUT WARRANTY OF ANY KIND, EITHER EXPRESS OR IMPLIED. WITHOUT LIMITING THE FOREGOING, SLEEKJOBS EXPLICITLY DISCLAIMS ANY WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, QUIET ENJOYMENT, OR NON-INFRINGEMENT, AND ANY WARRANTIES ARISING OUT OF COURSE OF DEALING OR USAGE OF TRADE.
              </p>
              <p className="text-muted-foreground mb-4">
                SLEEKJOBS MAKES NO WARRANTY THAT THE SERVICES WILL MEET YOUR REQUIREMENTS OR BE AVAILABLE ON AN UNINTERRUPTED, SECURE, OR ERROR-FREE BASIS. SLEEKJOBS MAKES NO WARRANTY REGARDING THE QUALITY, ACCURACY, TIMELINESS, TRUTHFULNESS, COMPLETENESS, OR RELIABILITY OF ANY INFORMATION OR CONTENT ON THE SERVICES.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">9. Limitation of Liability</h2>
              <p className="text-muted-foreground mb-4">
                TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, SLEEKJOBS AND ITS AFFILIATES, OFFICERS, EMPLOYEES, AGENTS, PARTNERS, AND LICENSORS WILL NOT BE LIABLE FOR ANY INDIRECT, INCIDENTAL, SPECIAL, CONSEQUENTIAL, OR PUNITIVE DAMAGES, INCLUDING WITHOUT LIMITATION, LOSS OF PROFITS, DATA, USE, GOODWILL, OR OTHER INTANGIBLE LOSSES, RESULTING FROM:
              </p>
              <ul className="list-disc list-inside space-y-2 text-muted-foreground mb-6">
                <li>YOUR ACCESS TO OR USE OF OR INABILITY TO ACCESS OR USE THE SERVICES</li>
                <li>ANY CONDUCT OR CONTENT OF ANY THIRD PARTY ON THE SERVICES</li>
                <li>ANY CONTENT OBTAINED FROM THE SERVICES</li>
                <li>UNAUTHORIZED ACCESS, USE, OR ALTERATION OF YOUR TRANSMISSIONS OR CONTENT</li>
                <li>WHETHER BASED ON WARRANTY, CONTRACT, TORT (INCLUDING NEGLIGENCE), PRODUCT LIABILITY, OR ANY OTHER LEGAL THEORY, AND WHETHER OR NOT SLEEKJOBS HAS BEEN INFORMED OF THE POSSIBILITY OF SUCH DAMAGE</li>
              </ul>
              <p className="text-muted-foreground mb-4">
                THE FOREGOING LIMITATION OF LIABILITY SHALL APPLY TO THE FULLEST EXTENT PERMITTED BY LAW IN THE APPLICABLE JURISDICTION.
              </p>

              <Separator className="my-8" />

              <h2 className="text-2xl font-bold mb-4">10. Indemnification</h2>
              <p className="text-muted-foreground mb-6">
                You agree to defend, indemnify, and hold harmless SleekJobs and its affiliates, officers, directors, employees, and agents from and against any and all claims, damages, obligations, losses, liabilities, costs or debt, and expenses (including but not limited to attorney's fees) arising from: (i) your use of and access to the Services; (ii) your violation of any term of these Terms; (iii) your violation of any third-party right, including without limitation any copyright, property, or privacy right; or (iv) any claim that your User Content caused damage to a third party. This defense and indemnification obligation will survive these Terms and your use of the Services.
              </p>

              <h2 className="text-2xl font-bold mb-4">11. Changes to Terms</h2>
              <p className="text-muted-foreground mb-6">
                We may modify these Terms from time to time. If we make changes, we will provide you with notice of such changes, such as by sending an email, providing a notice through the Services, or updating the date at the top of these Terms. Unless we say otherwise in our notice, the amended Terms will be effective immediately, and your continued use of the Services after we provide such notice will confirm your acceptance of the changes. If you do not agree to the amended Terms, you must stop using the Services.
              </p>

              <h2 className="text-2xl font-bold mb-4">12. Governing Law and Jurisdiction</h2>
              <p className="text-muted-foreground mb-6">
                These Terms and your use of the Services shall be governed by and construed in accordance with the laws of the State of California, without giving effect to any choice or conflict of law provision or rule. Any legal suit, action, or proceeding arising out of, or related to, these Terms or the Services shall be instituted exclusively in the federal courts of the United States or the courts of the State of California, in each case located in the City and County of San Francisco. You waive any and all objections to the exercise of jurisdiction over you by such courts and to venue in such courts.
              </p>

              <h2 className="text-2xl font-bold mb-4">13. Miscellaneous</h2>
              <p className="text-muted-foreground mb-4">
                These Terms constitute the entire agreement between you and SleekJobs regarding your use of the Services and supersede all prior and contemporaneous written or oral agreements between you and SleekJobs.
              </p>
              <p className="text-muted-foreground mb-4">
                If any provision of these Terms is held to be invalid or unenforceable, such provision shall be struck and the remaining provisions shall be enforced.
              </p>
              <p className="text-muted-foreground mb-4">
                Our failure to enforce any right or provision of these Terms will not be considered a waiver of such right or provision.
              </p>
              <p className="text-muted-foreground mb-6">
                We may assign any or all of our rights and obligations to others at any time.
              </p>

              <h2 className="text-2xl font-bold mb-4">14. Contact Information</h2>
              <p className="text-muted-foreground mb-4">
                If you have any questions about these Terms, please contact us at:
              </p>
              <div className="p-4 bg-secondary/20 rounded-md mb-6">
                <p className="mb-1"><strong>Email:</strong> legal@sleekjobs.com</p>
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

export default Terms;
