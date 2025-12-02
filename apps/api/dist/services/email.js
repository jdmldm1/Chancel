import { Resend } from 'resend';
const resend = new Resend(process.env.RESEND_API_KEY);
export class EmailService {
    defaultFrom = process.env.EMAIL_FROM || 'Chancel <noreply@chancel.app>';
    async sendEmail(options) {
        // Skip sending in development if no API key
        if (!process.env.RESEND_API_KEY) {
            console.log('📧 Email would be sent (no API key):', {
                to: options.to,
                subject: options.subject,
            });
            return true;
        }
        try {
            const result = await resend.emails.send({
                from: options.from || this.defaultFrom,
                to: Array.isArray(options.to) ? options.to : [options.to],
                subject: options.subject,
                html: options.html,
            });
            console.log('✅ Email sent:', result);
            return true;
        }
        catch (error) {
            console.error('❌ Email send failed:', error);
            return false;
        }
    }
    // Session invitation email
    async sendSessionInvitation(params) {
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #667eea; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>📖 You're Invited to a Bible Study!</h1>
            </div>
            <div class="content">
              <p>Hi ${params.userName},</p>
              <p><strong>${params.invitedBy}</strong> has invited you to join a Bible study session:</p>

              <h2 style="color: #667eea;">${params.sessionTitle}</h2>
              <p><strong>📅 When:</strong> ${new Date(params.sessionDate).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: 'numeric',
            minute: '2-digit'
        })}</p>

              <a href="${params.sessionUrl}" class="button">View Session Details</a>

              <p>We're looking forward to studying God's Word together!</p>

              <p>Blessings,<br>The Chancel Team</p>
            </div>
            <div class="footer">
              <p>You received this email because you were invited to a Bible study session on Chancel.</p>
            </div>
          </div>
        </body>
      </html>
    `;
        return this.sendEmail({
            to: params.to,
            subject: `You're invited: ${params.sessionTitle}`,
            html,
        });
    }
    // Comment reply notification
    async sendCommentReply(params) {
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .comment { background: white; border-left: 4px solid #3b82f6; padding: 15px; margin: 20px 0; border-radius: 4px; }
            .button { display: inline-block; background: #3b82f6; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>💬 New Reply to Your Comment</h1>
            </div>
            <div class="content">
              <p>Hi ${params.userName},</p>
              <p><strong>${params.commentAuthor}</strong> replied to your comment in <strong>${params.sessionTitle}</strong>:</p>

              <div class="comment">
                <p><em>"${params.commentContent}"</em></p>
              </div>

              <a href="${params.sessionUrl}" class="button">View Discussion</a>

              <p>Join the conversation!</p>
            </div>
            <div class="footer">
              <p>You received this email because someone replied to your comment on Chancel.</p>
              <p><a href="#">Unsubscribe from comment notifications</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
        return this.sendEmail({
            to: params.to,
            subject: `New reply in ${params.sessionTitle}`,
            html,
        });
    }
    // Prayer request update
    async sendPrayerUpdate(params) {
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #ef4444 0%, #dc2626 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .prayer { background: white; border-left: 4px solid #ef4444; padding: 15px; margin: 20px 0; border-radius: 4px; font-style: italic; }
            .button { display: inline-block; background: #ef4444; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🙏 Prayer Request Update</h1>
            </div>
            <div class="content">
              <p>Hi ${params.userName},</p>
              ${params.updateType === 'new'
            ? '<p>A new prayer request has been shared:</p>'
            : `<p><strong>${params.reactorName}</strong> is praying for your request:</p>`}

              <div class="prayer">
                <p>"${params.prayerRequestContent}"</p>
              </div>

              <a href="${process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'}/prayer-requests" class="button">View Prayer Requests</a>

              <p>Let us continue to lift each other up in prayer!</p>
            </div>
            <div class="footer">
              <p>You received this email because of prayer request activity on Chancel.</p>
              <p><a href="#">Unsubscribe from prayer notifications</a></p>
            </div>
          </div>
        </body>
      </html>
    `;
        return this.sendEmail({
            to: params.to,
            subject: params.updateType === 'new' ? 'New Prayer Request' : 'Someone is praying for you',
            html,
        });
    }
    // Group invitation
    async sendGroupInvitation(params) {
        const html = `
      <!DOCTYPE html>
      <html>
        <head>
          <style>
            body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
            .container { max-width: 600px; margin: 0 auto; padding: 20px; }
            .header { background: linear-gradient(135deg, #10b981 0%, #059669 100%); color: white; padding: 30px; text-align: center; border-radius: 8px 8px 0 0; }
            .content { background: #f9fafb; padding: 30px; border-radius: 0 0 8px 8px; }
            .button { display: inline-block; background: #10b981; color: white; padding: 12px 30px; text-decoration: none; border-radius: 6px; margin: 20px 0; }
            .footer { text-align: center; margin-top: 30px; color: #666; font-size: 12px; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>👥 You've Been Added to a Group!</h1>
            </div>
            <div class="content">
              <p>Hi ${params.userName},</p>
              <p><strong>${params.invitedBy}</strong> has added you to the group:</p>

              <h2 style="color: #10b981;">${params.groupName}</h2>

              <a href="${params.groupUrl}" class="button">View Group</a>

              <p>Connect with your group members and grow together in faith!</p>
            </div>
            <div class="footer">
              <p>You received this email because you were added to a group on Chancel.</p>
            </div>
          </div>
        </body>
      </html>
    `;
        return this.sendEmail({
            to: params.to,
            subject: `Added to group: ${params.groupName}`,
            html,
        });
    }
}
export const emailService = new EmailService();
//# sourceMappingURL=email.js.map