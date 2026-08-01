# Test Cases for AI-Powered Drug Inventory System

Here is a structured test case table covering the core functionalities of your project. This table is formatted to be easily copied into a PowerPoint presentation (you can copy the table and paste it directly, or recreate it using these columns).

| Test Case ID | Component / Module | Test Scenario | Steps / Actions | Expected Result | Status / Remarks |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **TC_01** | User Authentication | Login with valid credentials | 1. Enter email and password<br>2. Click Login | Generates JWT token, logs user in, and redirects to respective role dashboard (e.g. Admin, Manufacturer). | Pass |
| **TC_02** | Role-Based Access | Unauthorized Route Access | 1. Login as Manufacturer.<br>2. Attempt to access Warehouse specific routes. | API returns `403 Forbidden` error. UI redirects to error or hides unauthorized buttons. | Pass |
| **TC_03** | Inventory Management | Add New Drug Batch | 1. Navigate to Add Batch.<br>2. Enter drug details, quantity, MFG/EXP dates.<br>3. Submit. | Batch is created in MongoDB with a unique pseudo/QR batch ID. Status displays as Active. | Pass |
| **TC_04** | AI Service | Demand Forecast Accuracy | 1. Trigger AI Predict endpoint with existing product ID (e.g., `VITC004`). | AI Model successfully analyzes `inventory_data.csv` using Prophet and returns a quantitative forecast metric. | Pass |
| **TC_05** | AI Service | Expiry Risk Identification | 1. Set a drug's expiry logic to `< 30 days`.<br>2. Run Forecast. | AI evaluates expiry risk as `HIGH` and flags the batch as mathematically vulnerable. | Pass |
| **TC_06** | Real-Time Pipeline | Automatic Background Scanning | 1. Leave the Node server running.<br>2. Wait for the 1-minute `cron` job. | Pipeline scans all items, pushes data to AI, and identifies items needing a reorder. | Pass |
| **TC_07** | Alert System | Generate Expiry / Restock Alerts | 1. Pipeline detects stock below safe threshold.<br>2. Evaluates AI recommendation. | System automatically creates a `REORDER` or `EXPIRING` Alert record in the DB with medium/critical severity. | Pass |
| **TC_08** | Real-Time UI (Sockets) | UI Notification Delivery | 1. Alert is generated in the backend.<br>2. Check frontend dashboard. | Frontend instantly receives `alert_new` via WebSockets and displays it without a page refresh. | Pass |
| **TC_09** | UI Charts & Visualization | Fetching Dashboard Charts | 1. Load Manufacturer Dashboard.<br>2. Check Forecast & Actuals chart. | Chart.js seamlessly loads AI forecast curves alongside actual production line datasets. | Pass |

### Tips for your PPT:
* **Slide 1:** Focus on **TC_01 - TC_03** as "Basic Application Flow Tests".
* **Slide 2:** Focus on **TC_04 - TC_05** as "AI Model Mathematical Validations".
* **Slide 3:** Focus on **TC_06 - TC_08** as "Real-Time Pipeline & Autonomous Operations".
