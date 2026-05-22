---
title: 'Shopify Expiring Offline Access Tokens: What Every Public App Developer Must Do Before 2027'
date: '2026-05-22'
description: 'Shopify is mandating expiring offline access tokens for all public apps by January 1, 2027. Here is what the change means, who is affected, and exactly how to migrate before authentication errors hit your merchants.'
---

# Shopify Expiring Offline Access Tokens: What Every Public App Developer Must Do Before 2027

If you maintain a public Shopify app, this one is time-sensitive. On May 20, 2026, Shopify announced that **all public apps must migrate to expiring offline access tokens by January 1, 2027** — or face authentication errors that break the experience for every merchant using your app.

Here is everything you need to know.

---

## What Changed and Why

Shopify has been tightening token security for a while. The April 1, 2026 change required all *newly created* public apps to use expiring offline tokens. The latest announcement extends that requirement to **every public app** — including those built before April 2026.

The motivation is straightforward. Non-expiring tokens are a permanent security liability. If one leaks — through a compromised server, a misconfigured log, or a third-party breach — it remains valid forever. An attacker with that token has indefinite access to a merchant's store data.

Expiring offline tokens close that window dramatically. They **auto-rotate every 60 minutes**, which means a leaked token is only useful for a narrow window of time. This aligns with modern OAuth 2.0 best practices and significantly limits the blast radius of any credential exposure.

---

## Who Is Affected

**Affected:**
- Public apps (App Store listed or unlisted) making Admin API requests using non-expiring offline access tokens
- Apps created before April 1, 2026 — these were previously exempt

**Not affected:**
- Custom apps (built for a single store)
- Apps created by merchants in the Dev Dashboard or Shopify Admin

If you are unsure whether your app uses non-expiring tokens, check your session storage. If your stored access tokens never change after the initial OAuth install, you are using non-expiring tokens and need to migrate.

---

## Key Dates

| Date | What Happens |
|------|-------------|
| April 1, 2026 | Expiring tokens enforced for all **newly created** public apps |
| January 1, 2027 | Expiring tokens enforced for **all** public apps |

After January 1, 2027, public apps still using non-expiring tokens will receive authentication errors on Admin API calls. Merchants will not be able to use your app until you fix it.

---

## How Expiring Tokens Work

With expiring offline tokens, your app receives a short-lived access token alongside a refresh token during the OAuth flow. When the access token expires (after 60 minutes), your app uses the refresh token to obtain a new one — without any merchant interaction.

The token exchange looks like this:

```
Initial OAuth install
        ↓
Receive: access_token (expires in 60 min) + associated_user_token
        ↓
Store both tokens securely
        ↓
On expiry → exchange for new access_token automatically
        ↓
Merchant never notices a thing
```

The key point: **merchants do not need to reinstall your app**. The migration happens entirely in your code.

---

## How to Migrate

Shopify has published a [migration guide](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens#migrating-from-non-expiring-to-expiring-tokens) with the step-by-step path. The high-level process:

### 1. Update Your Token Exchange Logic

When exchanging the OAuth code for a token, your app will now receive an expiring token. Store the new token format — you will need to persist the token alongside its expiry metadata.

### 2. Implement Token Refresh Handling

Before every Admin API call, check whether the current token is expired or close to expiry. If so, exchange it for a fresh one.

If you are using Shopify's official app templates or API libraries (`@shopify/shopify-app-remix`, `@shopify/shopify-app-express`), **refresh handling is already built in**. You mainly need to handle the initial token exchange and update how you store tokens in your database.

```typescript
// @shopify/shopify-app-remix handles this automatically
const { admin, session } = await authenticate.admin(request);

// The library checks token expiry and refreshes before making API calls
const response = await admin.graphql(`
  query {
    shop { name }
  }
`);
```

### 3. Update Your Session Storage

Your database schema likely stores a single `accessToken` string. With expiring tokens, you will need to store additional fields:

```typescript
// Example Prisma schema update
model Session {
  id          String   @id
  shop        String
  accessToken String
  // Add these fields:
  expiresAt   DateTime?
  scope       String?
}
```

### 4. Test Before Going Live

Use the Partner Dashboard to test your token refresh flow against a development store before rolling out to production. Confirm that:

- API calls work immediately after install
- API calls still work 60+ minutes after install (token has rotated)
- No errors surface to merchants during the refresh cycle

---

## If You Use Shopify's Official Libraries

The good news for most developers: if your app was scaffolded with the Shopify CLI and uses the official framework libraries, the heavy lifting is already done for you. The `authenticate.admin()` call manages token lifecycle transparently.

Your main tasks are:

1. Trigger the token exchange once (deploy a one-time migration)
2. Update your session storage schema to handle expiry data
3. Verify everything works end-to-end in a dev store

---

## Do Not Wait Until December

Migrations always surface unexpected edge cases — token storage incompatibilities, background jobs that hold onto old tokens, third-party integrations that cache credentials. Give yourself runway.

A reasonable timeline:

- **Now**: Audit your app, read the migration guide, scope the work
- **Q3 2026**: Build and test the migration in staging
- **Q4 2026**: Roll out to production, monitor for errors
- **January 1, 2027**: Deadline — all public apps must be compliant

---

## Resources

- [Shopify Changelog: Expiring offline access tokens required for all public apps](https://shopify.dev/changelog/expiring-offline-access-tokens-required-for-all-public-apps-as-of-january-1-2027)
- [Offline access tokens documentation](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens)
- [Migration guide: non-expiring to expiring tokens](https://shopify.dev/docs/apps/build/authentication-authorization/access-tokens/offline-access-tokens#migrating-from-non-expiring-to-expiring-tokens)
- [Shopify Dev Platform Community](https://community.shopify.dev/c/dev-platform/32)

---

## Conclusion

This is a security-positive change and the right call by Shopify. Non-expiring tokens are a known risk in any OAuth system, and moving the entire public app ecosystem to rotating credentials meaningfully raises the floor on merchant data protection.

The migration is not particularly complex — especially if you are already on Shopify's official tooling. But the deadline is real, and the consequence of missing it (broken apps, angry merchants) is not worth the risk.

Start the audit now, follow the migration guide, and ship before Q4 gets busy.