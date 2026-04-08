export interface SupportArticle {
  id: string;
  title: string;
  category: "Billing" | "Inventory" | "Account" | "Platform";
  excerpt: string;
  content: string;
  relatedIds?: string[];
}

export const SUPPORT_ARTICLES: SupportArticle[] = [
  {
    id: "create-invoice",
    title: "How to Issue a New Invoice",
    category: "Billing",
    excerpt: "A step-by-step guide to generating professional, GST-compliant invoices in under 60 seconds.",
    content: `
# Creating Your First Invoice

Generating a professional document is the core of the JEZZY platform. Follow these steps to ensure accuracy and compliance:

### 1. Initiate the Process
From any screen, you can click the **"New Invoice"** button in the top navigation or the **"Issue New Invoice"** button on the Invoices listing page.

### 2. Select Your Client
Use the Client search field to select an existing corporate entity. If the client is new, you must first register them in the **Clients** module.

### 3. Add Line Items
- Select products from your inventory catalog.
- Adjust quantities (**Qty**).
- Tax rates (GST) are automatically calculated based on your company settings and the product's HSN code.

### 4. Review and Finalize
Verify the **Subtotal**, **Tax Total**, and **Grand Total**. Once verified, click **"Finalize Invoice"**. 

> [!TIP]
> Use the **"Preview PDF"** feature to see exactly how the document will look before sending it to your client.
    `,
    relatedIds: ["tax-calculation", "status-indicators"]
  },
  {
    id: "status-indicators",
    title: "Understanding Invoice Statuses",
    category: "Platform",
    excerpt: "Learn what each status means and how they impact your financial reporting.",
    content: `
# Platform Status Guide

The JEZZY platform uses color-coded status indicators to help you track your receivables at a glance:

- **DRAFT**: The invoice is being prepared and has not been finalized. It does not yet impact your financial dashboard.
- **SENT**: The invoice has been issues and sent to the client. It is now part of your **Outstanding Receivables**.
- **PAID**: Payment has been confirmed in full.
- **PARTIAL**: A payment has been recorded, but a balance remains.
- **OVERDUE**: The due date has passed without full payment.

> [!IMPORTANT]
> The platform automatically transitions invoices to **OVERDUE** every midnight if they are still in 'SENT' or 'PARTIAL' state past their due date.
    `,
    relatedIds: ["create-invoice", "record-payment"]
  },
  {
    id: "security-best-practices",
    title: "Platform Security & Authentication",
    category: "Account",
    excerpt: "How we protect your business data and how you can ensure your account remains secure.",
    content: `
# Account Security

JEZZY utilizes enterprise-grade security protocols to protect your sensitive financial data.

### Secure Sessions
The platform uses **HttpOnly Secure Cookies** for all authentication. This means your login session is protected from most browser-level vulnerabilities.

### Access Control
- **ADMIN**: Full access to all modules, settings, and user management.
- **EDITOR**: Can create and manage billing/inventory but cannot modify system settings.
- **VIEWER**: Read-only access to reports and tracking.

### Best Practices
1. **Never share your password**.
2. **Log out** when using a shared terminal.
3. Ensure your **JWT_SECRET** is updated periodically in your server configuration.
    `
  }
];
