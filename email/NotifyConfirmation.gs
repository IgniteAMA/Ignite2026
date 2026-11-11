/**
 * IGNITE 2027 "Notify Me" — branded confirmation email.
 *
 * Setup: open the Google Form → ⋮ → Script editor → paste this file →
 * Triggers (clock icon) → Add Trigger → onFormSubmit / From form / On form submit.
 * Edit REPLY_TO below. Questions must stay in the order: Name, Email, Company.
 */
const SITE = 'https://igniteama.org';
const REPLY_TO = 'REPLACE_WITH_TEAM_EMAIL@example.com';
const SUBJECT = "You're on the list for IGNITE 2027 🔥";

function onFormSubmit(e) {
  const answers = e.response.getItemResponses();
  const name = String(answers[0].getResponse() || '').trim();
  const email = String(answers[1].getResponse() || '').trim();
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) return;
  const first = name.split(/\s+/)[0] || 'there';

  // Embed the header so it shows without "load images"; fall back to the hosted URL.
  const headerUrl = SITE + '/assets/email/IGNITE_Email_Header.png';
  const inlineImages = {};
  let headerSrc = headerUrl;
  try {
    inlineImages.header = UrlFetchApp.fetch(headerUrl).getBlob().setName('IGNITE_Email_Header.png');
    headerSrc = 'cid:header';
  } catch (err) { /* keep hosted URL */ }

  const options = {
    to: email,
    subject: SUBJECT,
    htmlBody: buildHtml(first, headerSrc),
    body: buildText(first),
    name: 'IGNITE | AMA Cincinnati',
    replyTo: REPLY_TO
  };
  if (inlineImages.header) options.inlineImages = inlineImages;
  MailApp.sendEmail(options);
}

function buildText(first) {
  return 'Hi ' + first + ',\n\nYou\'re on the list! IGNITE 2026 was a blaze, and we\'ll email you the moment IGNITE 2027 dates, tickets, and speakers are announced.\n\n' +
    'Sponsor IGNITE 2027: ' + SITE + '/sponsors/\nNominate a speaker: ' + SITE + '/speakers/\n\n— The IGNITE team, AMA Cincinnati\n' + SITE;
}

function buildHtml(first, headerSrc) {
  const navy = '#0F1F35', orange = '#E8792C', cyan = '#4FC3E8';
  const font = "'Gotham Rounded','Avenir Next','Nunito','Helvetica Neue',Arial,sans-serif";
  const btn = (href, label, bg, fg) =>
    '<a href="' + href + '" style="display:inline-block;padding:14px 28px;border-radius:999px;background:' + bg + ';color:' + fg +
    ';font-family:' + font + ';font-size:14px;font-weight:800;text-decoration:none">' + label + '</a>';
  return '' +
  '<div style="margin:0;padding:0;background:#EEF1F5">' +
  '<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#EEF1F5"><tr><td align="center" style="padding:24px 12px">' +
  '<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="width:100%;max-width:600px;background:#FFFFFF;border-radius:20px;overflow:hidden">' +
    '<tr><td bgcolor="' + navy + '" style="background:' + navy + ';line-height:0"><img src="' + headerSrc + '" width="600" alt="IGNITE 2027 | AMA Cincinnati" style="display:block;width:100%;max-width:600px;height:auto;border:0"></td></tr>' +
    '<tr><td style="padding:40px 40px 8px;font-family:' + font + ';text-align:center">' +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.2em;text-transform:uppercase;color:' + orange + '">You\'re on the list</div>' +
      '<div style="margin-top:12px;font-size:34px;line-height:1.05;font-weight:700;color:' + navy + '">Hi ' + first + ', you\'re <span style="color:' + orange + '">in.</span></div>' +
      '<p style="margin:18px 0 0;font-size:16px;line-height:1.7;color:#4A5568">IGNITE 2026 was a blaze, and we\'re already fired up for what\'s next. You\'ll be among the first to know when <strong style="color:' + navy + '">IGNITE 2027</strong> dates, tickets, and speakers are announced.</p>' +
    '</td></tr>' +
    '<tr><td style="padding:24px 40px"><table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:' + navy + ';border-radius:16px"><tr><td style="padding:24px 28px;font-family:' + font + '">' +
      '<div style="font-size:11px;font-weight:800;letter-spacing:.18em;text-transform:uppercase;color:' + cyan + '">What to expect</div>' +
      '<p style="margin:10px 0 0;font-size:14.5px;line-height:1.7;color:#FFFFFF">An early heads-up on the date and venue, first access to tickets, and speaker announcements. Just the good stuff — no spam.</p>' +
    '</td></tr></table></td></tr>' +
    '<tr><td align="center" style="padding:4px 40px 12px;font-family:' + font + '">' +
      '<div style="font-size:14px;color:#4A5568;margin-bottom:16px">Want to be part of IGNITE 2027 sooner?</div>' +
      btn(SITE + '/sponsors/', 'Sponsor IGNITE 2027', orange, '#FFFFFF') + '&nbsp;&nbsp;' +
      btn(SITE + '/speakers/', 'Nominate a speaker', navy, '#FFFFFF') +
    '</td></tr>' +
    '<tr><td style="padding:32px 40px 36px;font-family:' + font + ';text-align:center;border-top:1px solid #E5E9F0;margin-top:24px">' +
      '<div style="font-size:12.5px;line-height:1.7;color:#8A94A6">You\'re receiving this because you asked to be notified about IGNITE 2027.<br>' +
      'IGNITE is presented by AMA Cincinnati · <a href="' + SITE + '" style="color:' + orange + ';text-decoration:none">igniteama.org</a><br>Reply to this email if you\'d like to be removed.</div>' +
    '</td></tr>' +
  '</table></td></tr></table></div>';
}
