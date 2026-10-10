/**
 * Keyword-based auto-reply engine.
 *
 * Structured as an ordered array (not a plain object) so rule priority
 * is explicit and easy to reorder — e.g. if you later add a "refund order"
 * rule it's clear which one wins by being listed first.
 *
 * FUTURE-READY: this is the single seam where an AI chatbot would plug in.
 * Replace the body of getAutoReply() with a call to an LLM/AI service and
 * every controller that calls getAutoReply() keeps working unchanged.
 */

const RULES = [
  { keywords: ['order'],    reply: 'You can track your order from the My Orders page.' },
  { keywords: ['return'],   reply: 'Returns are accepted within 7 days of delivery.' },
  { keywords: ['refund'],   reply: 'Refunds are processed within 5-7 business days.' },
  { keywords: ['shipping', 'delivery'], reply: 'Orders are usually delivered within 3-7 business days.' },
  { keywords: ['contact'],  reply: 'Our support team will contact you shortly.' },
  { keywords: ['cancel'],   reply: 'You can cancel your order from the My Orders page before it ships.' },
  { keywords: ['payment', 'pay'], reply: 'We accept UPI, cards, net banking, and Cash on Delivery.' },
  { keywords: ['size', 'fit'], reply: 'Check our Size Guide on the product page for fitting details.' },
];

const DEFAULT_REPLY = 'Thank you for contacting Zuri Fashion. Our support team will respond soon.';

/**
 * getAutoReply(message) → string
 * Case-insensitive substring match against each rule's keywords.
 * First matching rule wins (array order = priority order).
 */
const getAutoReply = (message = '') => {
  const text = message.toLowerCase();

  for (const rule of RULES) {
    if (rule.keywords.some(kw => text.includes(kw))) {
      return rule.reply;
    }
  }
  return DEFAULT_REPLY;
};

module.exports = { getAutoReply, RULES, DEFAULT_REPLY };