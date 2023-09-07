**How to Start Project:**

1. Setup local variables based on `.env.example`

2. Run the following commands:

   ```bash
   docker build . -t nodecontacts
   ```
   ```bash
   docker run -d -p 3000:8080 nodecontacts
   ```
