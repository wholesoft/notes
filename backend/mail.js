import sgMail from "@sendgrid/mail"
import dotenv from "dotenv"
import nodemailer from "nodemailer"
import mysql from "mysql2"

dotenv.config()

const pool = mysql
  .createPool({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: process.env.MYSQL_DATABASE,
  })
  .promise()

/*
Using SendGrid for now.
Gmail and Bridged Protonmail are okay to use for dev purposes.

App sends emails on the following occasions: 
confirm an email adress after registration
confirm an email after email address change
password reset requests
*/

export async function sendGmail(mailTo, subject, textBody, htmlBody) {
  var transporter = nodemailer.createTransport({
    service: process.env.GMAIL_SERVICE,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_PASSWORD,
    },
  })

  var mailOptions = {
    from: process.env.EMAIL_FROM,
    to: mailTo,
    subject: subject,
    text: textBody,
    html: htmlBody,
  }

  console.log("Attempt to send email.")
  try {
    let mail_response = await transporter.sendMail(mailOptions)
    console.log(mail_response.messageId)
    if (mail_response.messageId != undefined) {
      console.log("Email sent: " + mail_response.response)
      success = true
      message = "Reset password email sent."
    } else {
      message = "Error.  Problem sending email."
    }
  } catch (error) {
    message = "Error.  Problem sending email."
  }
}

export async function sendProtonMail(mailTo, subject, textBody, htmlBody) {
  // requires protonmail bridge which is clunky and not well supported on linux servers
  let transporter = nodemailer.createTransport({
    host: process.env.PROTON_HOST,
    port: process.env.PROTON_PORT,
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.PROTON_USER,
      pass: process.env.PROTON_PASSWORD,
    },
    tls: {
      rejectUnauthorized: false,
    },
  })

  var mailOptions = {
    from: process.env.EMAIL_FROM,
    to: mailTo,
    subject: subject,
    text: textBody,
    html: htmlBody,
  }

  console.log("Attempt to send email.")
  try {
    let mail_response = await transporter.sendMail(mailOptions)
    console.log(mail_response.messageId)
    if (mail_response.messageId != undefined) {
      console.log("Email sent: " + mail_response.response)
      success = true
      message = "Reset password email sent."
    } else {
      message = "Error.  Problem sending email."
    }
  } catch (error) {
    message = "Error.  Problem sending email."
  }
}

// SENDGRID (100 email daily sends or $20/mo)
export default async function sendEmail(mailTo, subject, textBody, htmlBody) {
  // Returns { 'success': true/false , 'message': '' }
  let success = false
  let message = ""
  let mailFrom = process.env.EMAIL_FROM
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
  const msg = {
    to: mailTo, // Change to your recipient
    from: mailFrom,
    subject: subject,
    text: textBody,
    html: htmlBody,
  }
  console.log(`SEND EMAIL - ${subject} - ${mailTo}`)
  await sgMail
    .send(msg)
    .then(() => {
      console.log("Email sent")
      success = true
      message = "Email sent."
    })
    .catch((error) => {
      success = false
      message = "Error sending email."
      console.log(error)
    })
  logEmail(mailTo, mailFrom, subject, htmlBody, message, "sendgrid")
  return { success: success, message: message }
}

export async function logEmail(
  mail_to,
  mail_from,
  subject,
  body,
  notes,
  service
) {
  const result = await pool.query(
    `
         INSERT INTO EmailLog (mail_to, mail_from, subject, body, notes, service) 
         VALUES (?,?,?,?,?,?)
         `,
    [mail_to, mail_from, subject, body, notes, service]
  )
  return result
}

/*

+-----------------+--------------+------+-----+-------------------+-------------------+
| Field           | Type         | Null | Key | Default           | Extra             |
+-----------------+--------------+------+-----+-------------------+-------------------+
| id              | int          | NO   | PRI | NULL              | auto_increment    |
| ‘user_id’       | int          | YES  |     | NULL              |                   |
| ‘mail_to’       | varchar(255) | YES  |     | NULL              |                   |
| ‘mail_from’     | varchar(255) | YES  |     | NULL              |                   |
| ‘subject’       | varchar(255) | YES  |     | NULL              |                   |
| ‘body’          | text         | YES  |     | NULL              |                   |
| notes           | text         | YES  |     | NULL              |                   |
| ‘service’       | varchar(255) | YES  |     | NULL              |                   |
| created         | datetime     | YES  |     | CURRENT_TIMESTAMP | DEFAULT_GENERATED |
+-----------------+--------------+------+-----+-------------------+-------------------+

*/
