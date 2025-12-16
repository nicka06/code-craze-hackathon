import { Resend } from 'resend';
import fs from 'fs/promises';
import path from 'path';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM_EMAIL = process.env.FROM_EMAIL || 'noreply@yourdomain.com';
const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'admin@yourdomain.com';

/**
 * Load HTML template from file and replace variables
 */
async function loadTemplate(templateName: string, variables: Record<string, string> = {}): Promise<string> {
  const templatePath = path.join(__dirname, '../templates/emails', `${templateName}.html`);
  let html = await fs.readFile(templatePath, 'utf-8');
  
  // Replace variables like {{variable_name}} with actual values
  Object.entries(variables).forEach(([key, value]) => {
    const regex = new RegExp(`{{${key}}}`, 'g');
    html = html.replace(regex, value);
  });
  
  return html;
}

/**
 * Generic send email function
 */
export async function sendEmail(
  to: string | string[],
  subject: string,
  html: string
): Promise<void> {
  try {
    await resend.emails.send({
      from: FROM_EMAIL,
      to: Array.isArray(to) ? to : [to],
      subject,
      html,
    });
    console.log(`✉️  Email sent to ${to}: ${subject}`);
  } catch (error) {
    console.error('Failed to send email:', error);
    throw error;
  }
}

/**
 * Send submission confirmation to user
 */
export async function sendSubmissionConfirmation(
  email: string,
  variables: {
    accountName: string;
    submissionId: string;
  }
): Promise<void> {
  const html = await loadTemplate('submission-confirmation', variables);
  await sendEmail(
    email,
    'Submission Received - Thank You!',
    html
  );
}

/**
 * Send admin notification for new submission
 */
export async function sendAdminNotification(
  adminEmails: string[],
  variables: {
    accountName: string;
    submissionId: string;
    caption: string;
    email: string;
    dashboardUrl: string;
  }
): Promise<void> {
  const html = await loadTemplate('admin-notification', variables);
  await sendEmail(
    adminEmails,
    `New Submission for ${variables.accountName}`,
    html
  );
}

/**
 * Send approval notification to user
 */
export async function sendApprovalNotification(
  email: string,
  variables: {
    accountName: string;
  }
): Promise<void> {
  const html = await loadTemplate('approval', variables);
  await sendEmail(
    email,
    'Your Submission Has Been Approved! 🎉',
    html
  );
}

/**
 * Send decline notification to user
 */
export async function sendDeclineNotification(
  email: string,
  variables: {
    accountName: string;
    declineReason: string;
  }
): Promise<void> {
  const html = await loadTemplate('decline', variables);
  await sendEmail(
    email,
    'Update on Your Submission',
    html
  );
}

/**
 * Send post success notification to user
 */
export async function sendPostSuccessNotification(
  email: string,
  variables: {
    accountName: string;
    instagramUrl?: string;
  }
): Promise<void> {
  const html = await loadTemplate('post-success', variables);
  await sendEmail(
    email,
    'Your Post is Live! 🚀',
    html
  );
}

/**
 * Send post failure notification to admins
 */
export async function sendPostFailureNotification(
  variables: {
    accountName: string;
    submissionId: string;
    errorMessage: string;
    dashboardUrl: string;
  }
): Promise<void> {
  const html = await loadTemplate('post-failure', variables);
  await sendEmail(
    ADMIN_EMAIL,
    `Failed to Post: ${variables.accountName}`,
    html
  );
}