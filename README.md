Prerequisites
Install Dependencies:
npm install express stripe body-parser
npm install express stripe dotenv


Set Up Environment Variables:
npm install dotenv

create the necessary files:
New-Item -Path . -Name ".env" -ItemType "file"

Edit the .env File
Open the .env file and add your Stripe secret key:
# .env
STRIPE_SECRET_KEY=sk_test_4eC39HqLyjWDarjtT1zdp7dc

Initialize a Node.js project:
npm init -y
