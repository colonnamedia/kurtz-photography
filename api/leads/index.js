import { Resend } from 'resend'
import { getSql, readBody, send } from '../_db.js'
import { requireAuth } from '../_auth.js'

export default async function handler(req, res) {
  const sql = getSql()

  // ---- Public: submit an inquiry ----
  if (req.method === 'POST') {
    try {
      const { name, email, projectType = '', message } = readBody(req)
      if (!name || !email || !message) {
        return send(res, 400, { error: 'Name, email, and message are required.' })
      }

      const [lead] = await sql`
        INSERT INTO leads (name, email, project_type, message)
        VALUES (${name}, ${email}, ${projectType}, ${message})
        RETURNING id, created_at`

      // Email the site owner — non-fatal if email isn't configured yet.
      if (process.env.RESEND_API_KEY && process.env.OWNER_EMAIL && process.env.FROM_EMAIL) {
        try {
          const resend = new Resend(process.env.RESEND_API_KEY)
          await resend.emails.send({
            from: process.env.FROM_EMAIL,
            to: process.env.OWNER_EMAIL,
            replyTo: email,
            subject: `New inquiry — ${name}${projectType ? ` (${projectType})` : ''}`,
            html: `
              <div style="font-family:Inter,Arial,sans-serif;max-width:560px;margin:0 auto;color:#161310">
                <h2 style="font-family:Georgia,serif;color:#161310;margin:0 0 4px">New inquiry</h2>
                <p style="color:#8a8378;margin:0 0 20px;font-size:13px;letter-spacing:.04em;text-transform:uppercase">From your website</p>
                <table style="width:100%;border-collapse:collapse;font-size:15px">
                  <tr><td style="padding:8px 0;color:#8a8378;width:120px">Name</td><td style="padding:8px 0"><strong>${name}</strong></td></tr>
                  <tr><td style="padding:8px 0;color:#8a8378">Email</td><td style="padding:8px 0"><a href="mailto:${email}" style="color:#2b2a6b">${email}</a></td></tr>
                  <tr><td style="padding:8px 0;color:#8a8378">Project</td><td style="padding:8px 0">${projectType || '—'}</td></tr>
                </table>
                <div style="margin-top:16px;padding:18px;background:#faf7f2;border-left:3px solid #ff4d3d;border-radius:8px;white-space:pre-wrap">${message}</div>
              </div>`,
          })
        } catch (mailErr) {
          console.error('Resend error:', mailErr.message)
        }
      }

      return send(res, 201, { ok: true, id: lead.id })
    } catch (e) {
      return send(res, 500, { error: e.message })
    }
  }

  // ---- Admin: list inquiries ----
  if (req.method === 'GET') {
    try {
      requireAuth(req)
    } catch {
      return send(res, 401, { error: 'unauthorized' })
    }
    try {
      const leads = await sql`
        SELECT id, name, email, project_type, message, created_at
        FROM leads ORDER BY created_at DESC`
      return send(res, 200, { leads })
    } catch (e) {
      return send(res, 500, { error: e.message })
    }
  }

  return send(res, 405, { error: 'Method not allowed' })
}
