Create .env file in root directory of project

Misc envs
local setup: Set NEXT_PUBLIC_APP_URL to http://localhost:3000
Production setup: Set NEXT_PUBLIC_APP_URL to your base URL
add AUTH_TRUST_HOST as your root domain e.g https://saasphere.dev
add NEXTAUTH_URL as the same root domain

Database envs setup
NextJS SaaS Boilerplate uses postgres, so get any Postgres connection string from any provider and paste it into AUTH_DRIZZLE_URL= env.
https://neon.tech/ provides free databases up to a certain limit which are good for testing environments, however I suggest a more contained environment such as Railway for production as speed will be quicker. To setup a Neon database sign up to the platform fill in the setup form with the closest region to you (IMAGE 1). Copy your connection string and paste it into the AUTH_DRIZZLE_URL env place (IMAGE 2). Ensure you have "?sslmode=require" at the end of the connection string.

Run npx drizzle-kit generate inside console
Run npx drizzle-kit push to push the schemas to your database

Email sending setup
Signup at https://resend.com, then generate a secret token at https://resend.com/api-keys
This is used to send emails for password resets, email verification, etc
Ensure you have a verified domain in your Resend account for production deployments to allow sending emails to users, if this isnt done, only the accounts email will be able to send and recieve emails by using the send email onboarding@resend.dev. Follow the steps on resend to add this domain to your DNS records for production

Amazon Web Services setup
AWS handles files uploads across the app
Google AWS S3, create an account, create a new S3 bucket, In Object Ownership, select "ACLs enabled" and "Bucket owner prefered"
In Block Public Access settings for this bucket, uncheck "Block all public access" and check acknowledgement box, press create bucket. Click into your new bucket, go to the permissions tab, scroll down to bucket policy and select edit, then paste the following text inside then save changes
Replace the resource with your buckets code keeping the /_ at the end e.g arn:aws:s3:::nextjs-saas-boilerplate/_
{
"Version": "2012-10-17",
"Statement": [
{
"Sid": "PublicReadGetObject",
"Effect": "Allow",
"Principal": "*",
"Action": "s3:GetObject",
"Resource": "arn:aws:s3:::gearxplorer-prod/*"
}
]
}
Set AWS_REGION= AWS_BUCKET_NAME= envs to your new buckets region and bucket name to the name (can be found on s3 homepage table IMAGE 6) region as e.g us-east-2

.Click the top right dropdown and select security credentials, create a new access key
copy and paste the resulting keys as AWS_ACCESS_KEY_ID=, AWS_SECRET_ACCESS_KEY=

Authentication envs
First generate a Next Auth secret by running the command npc

Google setup - Google for "google api console" and click "Google Cloud console", find create a new project in the navbar dropdown, name the project whatever you desire, press create, select your newly created project, search for "APIs & Services" in the search bar, click "OAuth consent screen" on the sidebar, check external, press create, fill in name,
press save and continue, press save and continue, press save and continue, press "Credentials" on the left, press "Create Credentials", select OAuth client ID,
select web application, name it, add "Authorised JavaScript origins" which is the base URL of your app, add "Authorised redirect URIs" to the format shown in image (IMAGE 3 AND IMAGE 4): press create,
copy client id and secret on the right hand side of the page to the variables GOOGLE_CLIENT_ID=, GOOGLE_CLIENT_SECRET=-
ensure the providers you have provided keys for are enabled and that the UI is displaying then in social.tsx

Github login setup
Github - Go to Github, login, top right click profile, settings, developer settings, OAuth Apps, New OAuth App, fill in details, copy client id and secret
into .env as # GITHUB_CLIENT_ID=, GITHUB_CLIENT_SECRET=

ensure the providers you have provided keys for are enabled and that the UI is displaying then in social.tsx

STRIPE PAYMENTS SETUP
Go to stripe and create an account, setup your payment details. Copy secret key from the stripe dashboard homepage and pase into STRIPE_SECRET_KEY env. Then add NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY as the publishable key code. If localhost, press the developer toggle and copy the same test codes. You will be able to test payments using card details 424242424242 and then put any date in the future.

Search product catelogue in the search bar and create a new product and then save product. Add all the prices you need, if you want one time payments or subscriptions, make sure to select the correct boxes. Find and copy your priceIds into env file into the correct slots.
NEXT_PUBLIC_STRIPE_SUB_ONE=
NEXT_PUBLIC_STRIPE_SUB_TWO=
NEXT_PUBLIC_STRIPE_SUB_THREE=
NEXT_PUBLIC_STRIPE_ONE_TIME_ONE=
NEXT_PUBLIC_STRIPE_ONE_TIME_TWO=
If you need to add more payments, go to plans.ts file
If you want one time payments, paste them into the one time fields, if you want subscriptions, paste it into the subscription docs. If you want one time payments, follow the next steps to set the components to render one time rather than subscription models. Go to app/(public)/page.tsx and change the word subscription to one-time (SEE IMAGE 7). Go to app/(protected)/dashboard/teams/[team]/billing/page.tsx and change the wording subscription to one-time (IMAGE 8)

On stripe dashboard search for webhooks, create webhook. Add the following endpoint triggers
payment_intent.succeeded
customer.subscription.created
customer.subscription.updated
customer.subscription.deleted
invoice.payment_succeeded
invoice.payment_failed
checkout.session.completed

Press continue and then add your public path to the stripe api route, e.g for me
https://saasphere.dev/api/webhooks/stripe. Copy this secret into your deployed STRIPE_WEBHOOK_SECRET

To test stripe payments locally, you must download the stripe CLI
Install stripe with brew install stripe/stripe-cli/stripe and run stripe login, login then run stripe listen --forward-to http://localhost:3000/api/webhooks/stripe Copy the signing secret and paste it in the STRIPE_SIGNING_SECRET env.

FORMBOLD SETUP
Formbold will connect to the landing pages contact form to forward you emails. Go to https://formbold.com, create an account, create a form, go to the integration tab and paste the code into NEXT_PUBLIC_FORM_URL,

BLOG SETUP
Go to https://www.sanity.io/ create an account, create a new project from scratch, copy and paste project ID into NEXT_PUBLIC_SANITY_PROJECT_ID,go to the datasets tab and create a dataset, put this name into NEXT_PUBLIC_SANITY_DATASET, go to /studio on the boilerplate. follow the steps on the screen to verify CORS. You can now add posts through the CMS interface
