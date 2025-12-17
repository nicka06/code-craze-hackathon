Hello there, thank you for taking the time to look at the repository. To view the public URL, please go to https://code-craze-hackathon.vercel.app/
.

Looking at the structure, the project is hosted separately, with the frontend deployed on Vercel and the backend running on Google Cloud Run. We made this decision to keep deployments fast and scalable while also staying cost-efficient. In addition, we use a separate Supabase instance for the database (gotta do everything to save money!).

On the frontend, the app is built with React, focusing on a simple, responsive UI that makes submitting and viewing content intuitive. The frontend communicates with the backend through a clean API layer, keeping concerns clearly separated and making the system easier to iterate on.

The backend is responsible for handling requests, processing submissions, and interfacing with the database. By running it on Cloud Run, we’re able to scale automatically based on traffic while only paying for what we use.

Overall, the architecture is intentionally lightweight and modular: A fully managed container backend running on Google Cloud Run, and a managed database. This setup allows us to move quickly, keep costs low, and easily expand the platform as Open Source News grows.
