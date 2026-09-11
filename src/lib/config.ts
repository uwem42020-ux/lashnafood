// src/lib/config.ts

export const BUSINESS = {
  name: "Lashna Foods",
  whatsapp: "2348036772195",       // no +, no spaces
  whatsappDisplay: "+234 803 677 2195",
  phone: "+2348036772195",
  email: "orders@lashnafoods.com.ng",
  domain: "lashnafoods.com.ng",

  // Bank details — UPDATE THESE when client provides real account
  bank: {
    name: "GTBank",                 // placeholder — replace
    accountNumber: "0123456789",    // placeholder — replace
    accountName: "Lashna Foods Ltd",// placeholder — replace
  },

  // How long you typically confirm payments
  confirmationWindow: "30 minutes",
  deliveryNote: "Lagos: same day · Other states: 1–3 days",
};

export function whatsappLink(message: string) {
  return `https://wa.me/${BUSINESS.whatsapp}?text=${encodeURIComponent(message)}`;
}