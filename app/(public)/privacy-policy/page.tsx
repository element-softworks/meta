export async function generateMetadata({ params }: { params: { slug: string } }) {
	return {
		title: 'Privacy Policy | Meta',
		description: 'Privacy Policy for the Meta',
		openGraph: {
			title: 'Privacy Policy | Meta',
			description: 'Privacy Policy for the Meta',
		},
		twitter: {
			title: 'Privacy Policy | Meta',
			description: 'Privacy Policy for the Meta',
		},
		alternates: {
			canonical: `${process.env.NEXT_PUBLIC_APP_URL}/privacy-policy`,
		},
	};
}

export default function Privacy() {
	return (
		<section className="flex h-full flex-col gap-8 my-10 lg:my-20 container max-w-4xl">
			<h1 className="w-full text-start font-semibold text-xl md:text-2xl lg:text-3xl max-w-[22ch]">
				Privacy Policy
			</h1>

			<div className="[&_ul]:list-disc [&_ol]:list-decimal [&_ol]:ml-4 [&_ul]:ml-4 [&_li]:ml-4 flex flex-col gap-6 [&_h2]:text-2xl [&_h2]:lg:text-3xl [&_h3]:text-xl [&_h3]:lg:text-2xl">
				<p>
					<strong>Effective Date:</strong> [Insert Date]
				</p>
				<p>
					This Privacy Policy explains how [Your Company Name] ({'"'}we{'"'}, {'"'}us{'"'}
					, or {'"'}our{'"'}) collects, uses, and shares information about you when you
					use our software-as-a-service (SaaS) application (the &ldquo;Service&rdquo;)
					built on the [Next.js] platform, including any related websites, mobile
					applications, or services.
				</p>
				<p>
					By using the Service, you agree to the collection and use of your personal
					information in accordance with this Privacy Policy. If you do not agree with the
					terms, please do not use the Service.
				</p>
				<h2>1. Information We Collect</h2>
				<h3>a. Information You Provide to Us</h3>
				<p>We may collect personal information that you voluntarily provide when you:</p>
				<ul>
					<li>Register for an account.</li>
					<li>Use our services or make a purchase.</li>
					<li>Contact us for support or inquiries.</li>
					<li>Participate in surveys, promotions, or other features of the Service.</li>
				</ul>
				<p>
					The types of personal information we may collect include, but are not limited
					to:
				</p>
				<ul>
					<li>Name</li>
					<li>Email address</li>
					<li>Billing and payment information</li>
					<li>Account information (e.g., username, password)</li>
					<li>Any other personal information you choose to provide</li>
				</ul>
				<h3>b. Information We Collect Automatically</h3>
				<p>
					When you use our Service, we may automatically collect certain information,
					including:
				</p>
				<ul>
					<li>
						<strong>Device Information:</strong> Details about the device you use to
						access the Service, such as IP address, browser type, and operating system.
					</li>
					<li>
						<strong>Usage Data:</strong> Information on how you interact with the
						Service, such as the pages you view, time spent on the Service, links
						clicked, and the date and time of your visits.
					</li>
					<li>
						<strong>Cookies and Tracking Technologies:</strong> We may use cookies, web
						beacons, and similar tracking technologies to collect information about your
						use of the Service and provide you with personalized content.
					</li>
				</ul>
				<h3>c. Third-Party Information</h3>
				<p>
					We may receive information about you from third parties, such as social media
					platforms, payment processors, or other services you connect to or interact with
					through the Service.
				</p>
				<h2>2. How We Use Your Information</h2>
				<p>We may use the personal information we collect for purposes such as:</p>
				<ul>
					<li>Providing and improving the Service.</li>
					<li>Personalizing your experience.</li>
					<li>
						Communicating with you, including sending service-related updates, marketing
						communications, and promotional offers.
					</li>
					<li>Processing payments and managing billing.</li>
					<li>Responding to your inquiries and providing customer support.</li>
					<li>Monitoring and analyzing usage and trends to enhance the Service.</li>
					<li>Preventing fraudulent or unauthorized activities.</li>
					<li>Complying with legal obligations.</li>
				</ul>
				<h2>3. How We Share Your Information</h2>
				<p>
					We do not sell or rent your personal information to third parties. However, we
					may share your information in the following ways:
				</p>
				<ul>
					<li>
						<strong>Service Providers:</strong> We may share your information with
						third-party vendors, consultants, or service providers who help us operate
						the Service (e.g., hosting, payment processing, analytics).
					</li>
					<li>
						<strong>Business Transfers:</strong> In the event of a merger, acquisition,
						or sale of assets, your information may be transferred as part of the
						transaction.
					</li>
					<li>
						<strong>Legal Obligations:</strong> We may disclose your information if
						required by law, such as in response to a subpoena, court order, or other
						governmental request.
					</li>
					<li>
						<strong>Protection of Rights:</strong> We may disclose your information to
						enforce our Terms of Service or to protect the rights, property, or safety
						of [Your Company Name], our users, or others.
					</li>
				</ul>
				<h2>4. Your Choices</h2>
				<h3>a. Account Information</h3>
				<p>
					You may update or delete your account information by logging into your account
					settings or contacting us directly. Please note that some information may be
					retained for legal or legitimate business purposes.
				</p>
				<h3>b. Marketing Communications</h3>
				<p>
					You can opt-out of receiving marketing communications from us by following the
					unsubscribe instructions in our emails or contacting us at [insert contact
					info]. Please note that even after opting out, you may still receive
					non-promotional communications, such as service-related notices.
				</p>
				<h3>c. Cookies</h3>
				<p>
					Most web browsers are set to accept cookies by default, but you can modify your
					browser settings to block or remove cookies. However, disabling cookies may
					affect your ability to use certain features of the Service.
				</p>
				<h2>5. Data Security</h2>
				<p>
					We implement reasonable security measures to protect your personal information
					from unauthorized access, disclosure, alteration, or destruction. However, no
					method of transmission over the Internet or electronic storage is completely
					secure, so we cannot guarantee the absolute security of your information.
				</p>
				<h2>6. International Data Transfers</h2>
				<p>
					If you are located outside of [Country], please note that we may transfer your
					information to servers and process it in countries other than your own. By using
					our Service, you consent to the transfer of your information to the U.S. or
					other countries, which may have different data protection laws than those in
					your country.
				</p>
				<h2>7. Children{"'"}s Privacy</h2>
				<p>
					Our Service is not intended for individuals under the age of 18. We do not
					knowingly collect or solicit personal information from minors. If we discover
					that we have collected personal information from a minor, we will take steps to
					delete such information as soon as possible.
				</p>
				<h2>8. Changes to This Privacy Policy</h2>
				<p>
					We may update this Privacy Policy from time to time in response to changing
					legal, technical, or business developments. When we update our Privacy Policy,
					we will post the updated version with a new {'"'}Effective Date{'"'} at the top
					of this policy. Your continued use of the Service after any changes to this
					policy will indicate your acceptance of the updated terms.
				</p>
				<h2>9. Contact Us</h2>
				<p>
					If you have any questions or concerns about this Privacy Policy or our data
					practices, please contact us at:
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
