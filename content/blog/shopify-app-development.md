---
title: 'Shopify App Development: A Complete Guide from Idea to App Store'
date: '2025-05-13'
description: 'Everything I learned building and publishing Shopify apps — from choosing the right app type and setting up OAuth, to billing APIs, webhooks, and surviving the app review process.'
---

# Shopify App Development: A Complete Guide from Idea to App Store

The Shopify ecosystem is massive — over a million merchants, billions in GMV, and an App Store with thousands of apps. But building a Shopify app that merchants actually love? That takes more than just knowing React and Node.js.

In this post, I'll walk through everything I've learned building Shopify apps: architecture decisions, authentication flows, billing, and the gotchas that'll cost you days if you don't know about them upfront.

## Choosing Your App Type

Before writing a single line of code, you need to decide what kind of app you're building.

### Public vs. Custom Apps

**Public apps** are listed (or unlisted) on the Shopify App Store and can be installed by any merchant. They use OAuth for authentication and must comply with Shopify's Partner requirements.

**Custom apps** are built for a single specific store. They use Admin API access tokens directly and skip the OAuth dance entirely — great for bespoke merchant tooling or internal dashboards.

### Embedded vs. Standalone

**Embedded apps** live inside the Shopify Admin, rendered in an iframe using [Shopify App Bridge](https://shopify.dev/docs/apps/tools/app-bridge). This is the modern standard and what Shopify strongly recommends.

**Standalone apps** open in a separate tab or window. They're simpler to build but feel disconnected from the merchant's workflow.

My recommendation: **always go embedded**. It's more work upfront, but merchants expect it and Shopify's review process increasingly requires it.

---

## The Tech Stack

Here's what I reach for when starting a new Shopify app:

- **Framework**: [Remix](https://remix.run/) (Shopify's officially recommended framework via `@shopify/shopify-app-remix`)
- **UI**: [Polaris](https://polaris.shopify.com/) — Shopify's React component library. Use it. Don't fight it.
- **Database**: PostgreSQL with Prisma for session storage and app data
- **Hosting**: Fly.io or Railway for quick deploys, AWS for production scale

The Shopify CLI scaffolds all of this for you:

```bash
npm init @shopify/app@latest
```

This gives you a Remix app pre-wired with authentication, session storage, and a working embedded setup out of the box.

---

## Authentication: OAuth Done Right

Shopify uses OAuth 2.0 with a specific flow you need to understand cold.

### The OAuth Flow

```
Merchant clicks "Install" on App Store
        ↓
Shopify redirects to your /auth?shop=merchant.myshopify.com
        ↓
Your app redirects merchant to Shopify's OAuth screen
        ↓
Merchant approves scopes
        ↓
Shopify sends auth code to your /auth/callback
        ↓
Exchange code for permanent access token
        ↓
Store token, redirect into embedded app
```

### Session Tokens (App Bridge)

Once installed, subsequent requests from the embedded app use **session tokens** — short-lived JWTs signed by Shopify. Never trust these blindly:

```typescript
import { authenticate } from '~/shopify.server';

export async function loader({ request }: LoaderFunctionArgs) {
  // This handles token verification, refresh, and session lookup
  const { admin, session } = await authenticate.admin(request);

  const response = await admin.graphql(`
    query {
      shop {
        name
        email
      }
    }
  `);

  const { data } = await response.json();
  return json({ shop: data.shop });
}
```

The `authenticate.admin()` call from `@shopify/shopify-app-remix` handles all the token verification complexity — use it on every authenticated route.

---

## Working with the Shopify APIs

Shopify has multiple APIs and knowing when to use which one matters.

### Admin API (GraphQL)

The primary API for reading and writing store data. Always prefer GraphQL over REST — it's the direction Shopify is moving and you get precise data fetching.

```typescript
// Fetch recent orders
const response = await admin.graphql(`
  query GetOrders($first: Int!) {
    orders(first: $first, sortKey: CREATED_AT, reverse: true) {
      edges {
        node {
          id
          name
          totalPriceSet {
            shopMoney {
              amount
              currencyCode
            }
          }
          customer {
            displayName
            email
          }
        }
      }
    }
  }
`, { variables: { first: 10 } });
```

### Storefront API

For building customer-facing experiences — custom storefronts, headless commerce, product pickers in public contexts. Uses a separate Storefront API access token.

### Admin REST API

Still available, but Shopify is deprecating endpoints incrementally. Only reach for it when a GraphQL equivalent doesn't exist yet.

---

## Webhooks: Staying in Sync

Webhooks are how Shopify tells your app when something changes. For any serious app, you'll need them.

### Mandatory Webhooks

Shopify requires every public app to handle three webhooks for GDPR compliance:

- `customers/data_request` — merchant requests customer data export
- `customers/redact` — merchant requests customer data deletion  
- `shop/redact` — store owner requests their data deleted

These must be registered and return a 200 within 5 seconds or your app fails review.

```typescript
// app/routes/webhooks.tsx
export const action = async ({ request }: ActionFunctionArgs) => {
  const { topic, shop, session, payload } = await authenticate.webhook(request);

  switch (topic) {
    case 'CUSTOMERS_DATA_REQUEST':
      // Log and acknowledge — you likely don't store PII, but you must handle it
      break;
    case 'CUSTOMERS_REDACT':
      await deleteCustomerData(shop, payload.customer.id);
      break;
    case 'SHOP_REDACT':
      await deleteShopData(shop);
      break;
  }

  return new Response(null, { status: 200 });
};
```

### Business Webhooks

Beyond GDPR, subscribe to whatever keeps your app's data fresh:

```typescript
// shopify.server.ts
const shopify = shopifyApp({
  webhooks: {
    APP_UNINSTALLED: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
    },
    ORDERS_CREATE: {
      deliveryMethod: DeliveryMethod.Http,
      callbackUrl: '/webhooks',
    },
  },
  // ...
});
```

---

## Billing: Charging Merchants

This is where a lot of first-time Shopify developers trip up. Shopify has its own billing API and you **must** use it for paid apps on the App Store — you can't route payments around Shopify's system.

### Subscription Models

Shopify supports three billing types:

- **Recurring charges** — monthly/annual subscriptions
- **One-time charges** — for lifetime deals or one-off purchases  
- **Usage-based charges** — charge based on consumption (orders processed, API calls, etc.)

### Implementing a Subscription

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const { billing, session } = await authenticate.admin(request);

  // Check if merchant has an active subscription
  const { hasActivePayment, appSubscriptions } = await billing.check({
    plans: [MONTHLY_PLAN],
    isTest: process.env.NODE_ENV !== 'production',
  });

  if (!hasActivePayment) {
    // Redirect to billing approval
    await billing.request({
      plan: MONTHLY_PLAN,
      isTest: process.env.NODE_ENV !== 'production',
      returnUrl: `https://${session.shop}/admin/apps/${process.env.SHOPIFY_API_KEY}`,
    });
  }

  return json({ subscribed: true });
}

const MONTHLY_PLAN = 'Monthly Plan';

export const shopify = shopifyApp({
  billing: {
    [MONTHLY_PLAN]: {
      amount: 9.99,
      currencyCode: 'USD',
      interval: BillingInterval.Every30Days,
    },
  },
});
```

### Free Trials

Shopify billing supports trial periods natively. Merchants see the trial end date in their billing page:

```typescript
[MONTHLY_PLAN]: {
  amount: 9.99,
  currencyCode: 'USD',
  interval: BillingInterval.Every30Days,
  trialDays: 14,
}
```

---

## Performance Considerations

Embedded apps have unique performance constraints — your app loads inside an iframe after the Shopify Admin itself has loaded.

### Keep the Initial Load Fast

- Server-render data fetching in Remix loaders, not client-side `useEffect` calls
- Use Polaris skeleton components during loading states — merchants are used to them
- Lazy-load heavy features (charts, rich editors) that aren't in the critical path

### GraphQL Query Efficiency

Shopify's GraphQL API has cost limits. Every query has a "cost" and you get a bucket of 1000 points that refills at 50 points/second. Expensive queries on large stores will hit this.

```typescript
// Check remaining cost in the response
const response = await admin.graphql(`
  query {
    orders(first: 250) {
      edges { node { id } }
    }
  }
`);

const { extensions } = await response.json();
console.log(extensions.cost); 
// { requestedQueryCost: 251, actualQueryCost: 251, throttleStatus: { ... } }
```

Paginate aggressively and cache aggressively.

---

## Surviving the App Review

Shopify's app review is thorough. Here's what trips up most submissions:

1. **GDPR webhooks not responding correctly** — test these with the Partner Dashboard's webhook tester before submitting
2. **App Bridge not fully integrated** — all navigation must use App Bridge `redirect` calls, not `window.location`  
3. **Missing privacy policy / terms of service** — these are required and must be linked in your Partner Dashboard listing
4. **Slow performance** — Shopify audits load time; aim for under 3 seconds to interactive
5. **Broken on mobile Admin** — merchants use the Shopify app on phones; your embedded app needs to work at 390px wide

Build with a test store, run through the [App Store review requirements checklist](https://shopify.dev/docs/apps/launch/app-reviews/requirements), and submit only once you can tick every box.

---

## Conclusion

Building a successful Shopify app is genuinely rewarding — you're directly impacting merchants' businesses. But the ecosystem has real complexity: OAuth, session tokens, billing APIs, GDPR requirements, and a demanding review process.

The key is to lean into Shopify's opinionated tooling. Use the CLI scaffold, use Remix, use Polaris, use the billing API as designed. Fighting the conventions costs time you could spend building features merchants actually want.

The merchants who install your app are running real businesses. Build something that respects their time, handles their data carefully, and solves a genuine problem — and you'll do well.