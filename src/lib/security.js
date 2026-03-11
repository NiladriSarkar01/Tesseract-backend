/**
 * Brute Force Protection — Anonymous Public Routes
 * For: Tech Fest Registration App (Express.js)
 *
 * Routes protected:
 *   POST /register  → Rate limit + CAPTCHA
 *   POST /query     → Rate limit only
 *
 * Install dependencies:
 *   npm install express-rate-limit
 *
 * Setup Turnstile (free): https://dash.cloudflare.com → Turnstile
 *   - Get your site key (frontend) and secret key (backend)
 *   - Set env var: TURNSTILE_SECRET=your-secret-key  ← backend only, never in React
 */
import rateLimit from "express-rate-limit";
import { TURNSTILE_SECRET } from "../config/env.js";

// ─────────────────────────────────────────────
// 1. RATE LIMITERS
// ─────────────────────────────────────────────

/**
 * Global app-wide limiter
 * Max 500 requests per IP per 15 minutes — applies to every route.
 * Acts as a blanket shield against floods and scrapers.
 */
export const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error:
      "Too many requests from your IP. Please slow down and try again shortly.",
  },
});

/**
 * Registration route limiter
 * Max 5 submissions per IP per hour — tight, since one person
 * should only register once or twice at most.
 */
const registrationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour window
  max: 5, // max 5 submissions per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error:
      "Too many registration attempts from your IP. Please try again in an hour.",
  },
});

/**
 * Login route limiter
 * Max 5 attempts per IP per 15 minutes — strict, since
 * brute forcing credentials is the primary threat here.
 */
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 5, // max 5 attempts per IP
  standardHeaders: true,
  legacyHeaders: false,
  skipSuccessfulRequests: true, // only count failed attempts
  message: {
    success: false,
    error:
      "Too many login attempts from your IP. Please try again in 15 minutes.",
  },
});

/**
 * Query route limiter
 * Max 20 queries per IP per 15 minutes — generous enough for
 * real users checking their status, tight enough to block scrapers.
 */
const queryLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minute window
  max: 20, // max 20 queries per IP
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: "Too many requests. Please wait 15 minutes before trying again.",
  },
});

// ─────────────────────────────────────────────
// 2. CAPTCHA VERIFICATION (Cloudflare Turnstile — free, invisible)
// ──────────────────────────────
async function verifyCaptcha(token) {
  if (!token) {
    console.log("[Turnstile] No token received");
    return false;
  }
  try {
    const response = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ secret: TURNSTILE_SECRET, response: token }),
      },
    );
    const data = await response.json();
    console.log("[Turnstile] Response:", JSON.stringify(data)); // 👈 add this
    return data.success === true;
  } catch (err) {
    console.error("[Turnstile] Error:", err.message);
    return false;
  }
}

/**
 * Middleware: reject request if Turnstile token is missing or invalid.
 * Expects token in req.body["cf-turnstile-response"]
 */
async function captchaMiddleware(req, res, next) {
  const token = req.body?.["cf-turnstile-response"];
  const valid = await verifyCaptcha(token);
  if (!valid) {
    return res.status(400).json({
      success: false,
      error: "CAPTCHA verification failed. Please try again.",
    });
  }
  next();
}

// ─────────────────────────────────────────────
// 3. MIDDLEWARE CHAINS — attach to your routes
// ─────────────────────────────────────────────

/**
 * Use this on your POST /login route.
 * Applies: IP rate limiting only (no CAPTCHA)
 */
export const loginProtection = [loginLimiter];

/**
 * Use this on your POST /register route.
 * Applies: IP rate limiting → CAPTCHA check
 */
export const registrationProtection = [registrationLimiter, captchaMiddleware];

/**
 * Use this on your POST /query route.
 * Applies: IP rate limiting only (no CAPTCHA needed for reads)
 */
export const queryProtection = [queryLimiter];
