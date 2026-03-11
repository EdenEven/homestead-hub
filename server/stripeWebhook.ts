import express from "express";
import Stripe from "stripe";
import { updateUserStripe, updateUserStripeByCustomerId } from "./db";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY || "", {
  apiVersion: "2026-02-25.clover",
});

export const stripeWebhookRouter = express.Router();

// MUST use raw body for Stripe signature verification
stripeWebhookRouter.post(
  "/api/stripe/webhook",
  express.raw({ type: "application/json" }),
  async (req, res) => {
    const sig = req.headers["stripe-signature"] as string;
    const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET || "";

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(req.body, sig, webhookSecret);
    } catch (err: any) {
      console.error("[Stripe Webhook] Signature verification failed:", err.message);
      return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    // Handle test events
    if (event.id.startsWith("evt_test_")) {
      console.log("[Webhook] Test event detected, returning verification response");
      return res.json({ verified: true });
    }

    console.log(`[Stripe Webhook] Event: ${event.type} | ID: ${event.id}`);

    try {
      switch (event.type) {
        case "checkout.session.completed": {
          const session = event.data.object as Stripe.Checkout.Session;
          const userId = parseInt(session.metadata?.user_id || "0");
          const customerId = session.customer as string;
          const subscriptionId = session.subscription as string;

          if (userId) {
            await updateUserStripe(userId, {
              stripeCustomerId: customerId,
              stripeSubscriptionId: subscriptionId,
              subscriptionStatus: "active",
            });
            console.log(`[Stripe] User ${userId} subscribed — customer: ${customerId}`);
          }
          break;
        }

        case "customer.subscription.updated": {
          const sub = event.data.object as Stripe.Subscription;
          const customerId = sub.customer as string;
          const status = sub.status as "active" | "canceled" | "past_due" | "trialing";
          await updateUserStripeByCustomerId(customerId, {
            stripeSubscriptionId: sub.id,
            subscriptionStatus: status,
          });
          break;
        }

        case "customer.subscription.deleted": {
          const sub = event.data.object as Stripe.Subscription;
          const customerId = sub.customer as string;
          await updateUserStripeByCustomerId(customerId, {
            subscriptionStatus: "canceled",
          });
          break;
        }

        case "invoice.payment_failed": {
          const invoice = event.data.object as Stripe.Invoice;
          const customerId = invoice.customer as string;
          await updateUserStripeByCustomerId(customerId, {
            subscriptionStatus: "past_due",
          });
          break;
        }

        default:
          console.log(`[Stripe Webhook] Unhandled event type: ${event.type}`);
      }
    } catch (err) {
      console.error("[Stripe Webhook] Error processing event:", err);
      return res.status(500).json({ error: "Webhook processing failed" });
    }

    res.json({ received: true });
  }
);
