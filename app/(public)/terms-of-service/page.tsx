export async function generateMetadata({ params }: { params: { slug: string } }) {
	return {
		title: 'Terms of Service | Coaching Hours',
		description: 'Terms of Service for the Coaching Hours',
		openGraph: {
			title: 'Terms of Service | Coaching Hours',
			description: 'Terms of Service for the Coaching Hours',
		},
		twitter: {
			title: 'Terms of Service | Coaching Hours',
			description: 'Terms of Service for the Coaching Hours',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/terms-of-service`,
		},
	};
}

export default function Terms() {
	return (
		<section className="flex h-full flex-col gap-8 my-10 lg:my-20 container max-w-4xl">
			<h1 className="w-full text-start font-semibold text-xl md:text-2xl lg:text-3xl max-w-[22ch]">
				Terms of Service
			</h1>

			<div className="[&_ul]:list-disc [&_ol]:list-decimal [&_ol]:ml-4 [&_ul]:ml-4 [&_li]:ml-4 flex flex-col gap-6 [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h3]:text-xl [&_h3]:lg:text-2xl">
				<p>
					<strong>Effective Date:</strong> [Insert Date]
				</p>
				<p>
					Welcome to [Your Company Name]! These Terms of Service ({'"'}Terms{'"'}) govern
					your use of our software-as-a-service (SaaS) application ({'"'}Service{'"'})
					provided through the [Next.js] platform, including any related websites, mobile
					applications, or services operated by [Your Company Name] ({'"'}we{'"'}, {'"'}us
					{'"'}, {'"'}our{'"'}).
				</p>
				<p>
					By accessing or using our Service, you agree to these Terms. If you do not
					agree, please do not use the Service.
				</p>
				<h2>1. Use of the Service</h2>
				<h3>a. Eligibility</h3>
				<p>To use our Service, you must:</p>
				<ul>
					<li>
						Be at least 18 years old or have the permission of a parent or legal
						guardian.
					</li>
					<li>Not be barred from using the Service under any applicable laws.</li>
				</ul>
				<p>
					By using the Service, you represent and warrant that you meet these
					requirements.
				</p>
				<h3>b. Account Registration</h3>
				<p>
					To access certain features of the Service, you may need to create an account.
					When creating an account, you agree to:
				</p>
				<ul>
					<li>Provide accurate and up-to-date information.</li>
					<li>Keep your account credentials confidential.</li>
					<li>Be responsible for all activity that occurs under your account.</li>
				</ul>
				<p>
					If you believe your account has been compromised, contact us immediately at
					[Your Contact Information].
				</p>
				<h3>c. Prohibited Activities</h3>
				<p>
					You agree not to engage in any of the following activities while using the
					Service:
				</p>
				<ul>
					<li>Violating any applicable laws or regulations.</li>
					<li>Using the Service for any unlawful, harmful, or fraudulent purposes.</li>
					<li>Interfering with the operation or security of the Service.</li>
					<li>
						Accessing or attempting to access another user{"'"}s account without
						permission.
					</li>
					<li>Uploading or transmitting any viruses, malware, or harmful code.</li>
					<li>
						Reverse engineering, decompiling, or disassembling any part of the Service.
					</li>
					<li>
						Using automated tools or bots to access the Service in a manner that
						violates these Terms.
					</li>
				</ul>
				<p>
					We reserve the right to suspend or terminate accounts that engage in prohibited
					activities.
				</p>
				<h2>2. User Content</h2>
				<h3>a. Your Responsibilities</h3>
				<p>
					Our Service may allow you to submit, post, or share content, including but not
					limited to text, images, and other materials {'"'}User Content{'"'}. You are
					solely responsible for the content you submit, and you represent and warrant
					that:
				</p>
				<ul>
					<li>You have all necessary rights to submit the content.</li>
					<li>
						Your content does not infringe the rights of others or violate any laws.
					</li>
				</ul>
				<h3>b. License to Use Content</h3>
				<p>
					By submitting User Content to the Service, you grant us a worldwide,
					non-exclusive, royalty-free, transferable, and sublicensable license to use,
					modify, display, distribute, and create derivative works of your content in
					connection with operating and improving the Service.
				</p>
				<p>
					We do not claim ownership of your User Content, and you retain all ownership
					rights to the content you create.
				</p>
				<h3>c. Monitoring and Removal</h3>
				<p>
					We have the right, but not the obligation, to monitor, edit, or remove any User
					Content that violates these Terms or is otherwise objectionable. However, we are
					not responsible for any User Content or the actions of users on the Service.
				</p>
				<h2>3. Fees and Payments</h2>
				<h3>a. Subscription and Billing</h3>
				<p>
					Certain features of our Service may require payment, such as subscription fees.
					By subscribing to a paid service, you agree to:
				</p>
				<ul>
					<li>Pay all applicable fees and taxes.</li>
					<li>Provide valid payment information.</li>
					<li>
						Allow us to charge your payment method on a recurring basis (if applicable).
					</li>
				</ul>
				<h3>b. Cancellations and Refunds</h3>
				<p>
					You may cancel your subscription at any time through your account settings.
					Cancellations will take effect at the end of your current billing cycle, and you
					will not receive a refund for any unused portion of the service unless otherwise
					specified in our refund policy or required by law.
				</p>
				<p>
					We reserve the right to modify our subscription fees and will notify you in
					advance of any changes. Your continued use of the Service after the fee changes
					become effective constitutes your acceptance of the new fees.
				</p>
				<h2>4. Intellectual Property</h2>
				<h3>a. Ownership</h3>
				<p>
					All rights, title, and interest in and to the Service, including but not limited
					to all software, designs, logos, trademarks, and content (other than User
					Content) are owned by [Your Company Name] or its licensors. You are granted a
					limited, non-exclusive, non-transferable license to use the Service solely for
					its intended purpose.
				</p>
				<h3>b. Restrictions</h3>
				<p>
					You may not copy, modify, distribute, sell, lease, or create derivative works of
					any part of the Service, except as expressly permitted by these Terms or with
					our written consent.
				</p>
				<h2>5. Termination</h2>
				<p>
					We reserve the right to suspend or terminate your access to the Service at any
					time, with or without cause, including if you violate these Terms or engage in
					behavior that may harm the Service or its users.
				</p>
				<p>
					Upon termination, your rights to use the Service will immediately cease. Any
					provisions of these Terms that by their nature should survive termination (e.g.,
					intellectual property rights, indemnification, liability limitations) will
					continue to apply.
				</p>
				<h2>6. Disclaimers and Limitation of Liability</h2>
				<h3>a. Disclaimers</h3>
				<p>
					The Service is provided {'"'}as is{'"'} and {'"'}as available{'"'} without any
					warranties, express or implied, including but not limited to warranties of
					merchantability, fitness for a particular purpose, or non-infringement. We do
					not warrant that the Service will be error-free, secure, or available at all
					times.
				</p>
				<h3>b. Limitation of Liability</h3>
				<p>
					To the maximum extent permitted by law, [Your Company Name] shall not be liable
					for any indirect, incidental, consequential, or punitive damages arising out of
					your use or inability to use the Service, even if we have been advised of the
					possibility of such damages. In no event shall our total liability to you exceed
					the amount paid by you (if any) for the Service in the twelve months prior to
					the event giving rise to the claim.
				</p>
				<h2>7. Indemnification</h2>
				<p>
					You agree to indemnify and hold [Your Company Name] harmless from any claims,
					damages, liabilities, and expenses (including reasonable legal fees) arising out
					of or related to your use of the Service, your violation of these Terms, or your
					violation of any rights of a third party.
				</p>
				<h2>8. Changes to These Terms</h2>
				<p>
					We may update these Terms from time to time by posting the updated version on
					our website or within the Service. The {'"'}Effective Date{'"'} at the top of
					this page will indicate when the Terms were last revised. Your continued use of
					the Service after any changes to the Terms will constitute your acceptance of
					the updated terms.
				</p>
				<h2>9. Governing Law and Dispute Resolution</h2>
				<p>
					These Terms and any disputes related to the Service will be governed by and
					construed in accordance with the laws of [Your Country], without regard to its
					conflict of law principles. Any disputes arising from or relating to these Terms
					or the Service shall be resolved through binding arbitration in [Your Location],
					except where prohibited by law.
				</p>
				<h2>10. Miscellaneous</h2>
				<ul>
					<li>
						<strong>Entire Agreement:</strong> These Terms, along with our Privacy
						Policy, constitute the entire agreement between you and [Your Company Name]
						regarding the use of the Service.
					</li>
					<li>
						<strong>Severability:</strong> If any provision of these Terms is found to
						be invalid or unenforceable, the remaining provisions will remain in full
						force and effect.
					</li>
					<li>
						<strong>Waiver:</strong> Our failure to enforce any right or provision of
						these Terms will not be considered a waiver of those rights.
					</li>
					<li>
						<strong>Assignment:</strong> You may not assign or transfer your rights
						under these Terms without our prior written consent. We may assign or
						transfer our rights under these Terms at any time without notice.
					</li>
				</ul>
				<h2>11. Contact Us</h2>
				<p>
					If you have any questions or concerns about these Terms, please contact us at:
				</p>
				<p>
					[Your Company Name]
					<br />
					Email: [Your Email Address]
					<br />
					Address: [Your Company Address]
				</p>
			</div>
		</section>
	);
}
