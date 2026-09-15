# Domain Setup Guide for dressapp.in

## 🎯 Goal
Connect your MilesWeb domain `dressapp.in` to your Netlify site `dressapp-uniforms.netlify.app`

## ✅ Current Status
- ✅ Site deployed: https://dressapp-uniforms.netlify.app
- ✅ Environment variable updated: NEXT_PUBLIC_APP_URL = https://dressapp.in
- ⏳ DNS Configuration: Pending
- ⏳ Domain added to Netlify: Blocked (needs support)

---

## 📋 Step-by-Step Instructions

### Step 1: Configure DNS in MilesWeb

1. **Log into MilesWeb**: Go to your client area
2. **Select domain**: Click on `dressapp.in`
3. **Find DNS Management**: Look for one of these:
   - "DNS Management"
   - "Manage DNS Zone"
   - "DNS Records"
   - "Advanced DNS"
   
   **Note**: This is NOT "Register Private Nameservers"

4. **Add/Edit these DNS records**:

   **A Record (for dressapp.in):**
   ```
   Type: A
   Host/Name: @ (or blank, or "dressapp.in")
   Value: 75.2.60.5
   TTL: 3600
   ```

   **CNAME Record (for www.dressapp.in):**
   ```
   Type: CNAME
   Host/Name: www
   Value: dressapp-uniforms.netlify.app
   TTL: 3600
   ```

5. **Save** the changes

---

### Step 2: Contact Netlify Support

**Problem**: Netlify says "dressapp.in is already managed by another team"

**Solution**: Contact support to release the domain

1. Go to: https://app.netlify.com/support
2. Create a ticket with this message:

```
Subject: Domain dressapp.in showing as managed by another team

Hello,

I'm trying to add my domain dressapp.in to my Netlify project 
"dressapp-uniforms" but getting this error:

"dressapp.in or one of its subdomains is already managed by 
Netlify DNS on another team."

I own this domain through MilesWeb (expires 03-02-2027).
I do not have another Netlify team/account that owns this domain.

Can you please help release this domain so I can add it to my 
current project?

Project: dressapp-uniforms
Site URL: https://dressapp-uniforms.netlify.app
Team: projecti123's team
My email: projectors124@gmail.com

Thank you!
```

---

### Step 3: After Domain is Released

Once Netlify support releases the domain:

1. Go to: https://app.netlify.com/projects/dressapp-uniforms/settings/domain
2. Click **"Add a domain"**
3. Enter: `dressapp.in`
4. Click **"Add domain"**
5. Netlify should verify the DNS records you added in Step 1

---

### Step 4: Enable HTTPS

After DNS propagation (5-30 minutes, max 48 hours):

1. Netlify will automatically provision a free SSL certificate
2. Go to **Domain Management** → **HTTPS**
3. Enable **"Force HTTPS"** to redirect HTTP to HTTPS
4. Your site will be accessible at: https://dressapp.in

---

## 🔄 Redeploy After Domain Setup

After everything is configured, redeploy your site:

```bash
cd /Users/tanishakumari/dressapp-uniform/schoolkit
netlify deploy --prod
```

---

## 🆘 If You Can't Find DNS Management in MilesWeb

Contact MilesWeb support and ask them to add the records:

**Email**: support@milesweb.com
**Live Chat**: Look for chat icon in your MilesWeb dashboard

**Message to send**:
```
Subject: DNS Records Setup Request for dressapp.in

Hello MilesWeb Support,

I need help adding DNS records for my domain dressapp.in to point 
to my Netlify hosting.

Domain: dressapp.in
Registrant Email: dressappcare@gmail.com

Please add the following DNS records:

1. A Record:
   - Type: A
   - Host/Name: @ (root domain)
   - Points to: 75.2.60.5
   - TTL: 3600

2. CNAME Record:
   - Type: CNAME
   - Host/Name: www
   - Points to: dressapp-uniforms.netlify.app
   - TTL: 3600

Thank you!

Best regards,
Tanishq T
Phone: 8882872033
```

---

## 🧪 Test Your Domain

After DNS propagation, test your domain:

1. **Check DNS propagation**: https://dnschecker.org
   - Enter: `dressapp.in`
   - Check A record shows: `75.2.60.5`

2. **Visit your site**:
   - https://dressapp.in
   - https://www.dressapp.in

---

## 📞 Support Contacts

**Netlify Support**: https://app.netlify.com/support
**MilesWeb Support**: 
- Email: support@milesweb.com
- Phone: Check your MilesWeb dashboard
- Live Chat: Available in dashboard

---

## ⚠️ Important Notes

- DNS changes can take 5-30 minutes (max 48 hours) to propagate
- Don't include `https://` in CNAME values
- Your nameservers remain: sg.solidhosting.pro, us.solidhosting.pro, eu.solidhosting.pro, in.solidhosting.pro
- SSL certificate is FREE through Netlify (Let's Encrypt)
- You do NOT need MilesWeb hosting - only the domain registration

---

## 🎉 Final Result

Once complete, your architecture will be:

```
MilesWeb (Domain Registration)
        ↓
   DNS Records
        ↓
    Netlify (Hosting)
        ↓
  Your Website
```

Visitors see: **https://dressapp.in**
