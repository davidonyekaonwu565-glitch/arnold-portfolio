/**
 * =========================================================================
 * ARNOLD — FREELANCE WEB DESIGNER PORTFOLIO CONFIGURATION
 * =========================================================================
 */

const PORTFOLIO_CONFIG = {
  // Brand & Identity
  brandName: "Arnold",
  brandTitle: "Freelance Web Designer",
  statusText: "Available for new projects",
  brandInitials: "AR",

  // Contact Details
  whatsappNumber: "2348162483154",
  whatsappDisplay: "+234 816 248 3154",
  phoneNumber: "+2348162483154",
  phoneDisplay: "0816 248 3154",
  emailAddress: "davidonyekaonwu565@gmail.com",

  // Pre-filled WhatsApp message template
  defaultWhatsAppMessage: "Hello Arnold, I saw your web design portfolio and would like to discuss building a website for my business.",

  // Project Categories for Interactive Filter
  categories: [
    { id: "all", label: "All Projects" },
    { id: "food", label: "Food & Hospitality" },
    { id: "beauty", label: "Beauty & Salon" },
    { id: "trade", label: "Trade & Construction" }
  ],

  // 5 Verified Live Portfolio Projects with Updated GitHub Pages URLs
  projects: {
    creamtown: {
      name: "Creamtown",
      categoryKey: "food",
      categoryLabel: "Ice Cream Business",
      url: "https://davidonyekaonwu565-glitch.github.io/creamtown/",
      buttonText: "View Website →",
      description: "A modern business website designed to showcase products, provide important business information and make it easy for customers to connect with the business.",
      features: [
        "Product/menu showcase",
        "Custom ordering",
        "WhatsApp ordering",
        "Location",
        "Opening hours",
        "Reviews",
        "Social media links"
      ]
    },
    jmax: {
      name: "JMAX Beauty Salon",
      categoryKey: "beauty",
      categoryLabel: "Hair Salon & Luxury Beauty",
      url: "https://davidonyekaonwu565-glitch.github.io/jmax/",
      buttonText: "View Website →",
      description: "A 24/7 luxury hair salon and beauty studio website built for a premier Ikeja salon, featuring 24-hour booking, service specialties, and instant WhatsApp consultation.",
      features: [
        "24/7 Appointment booking system",
        "Frontal installation & wig customization showcase",
        "Live Lagos time & studio open status indicator",
        "Direct WhatsApp inquiry (0808 507 7963)",
        "Interactive service & price menu",
        "Verified customer reviews (4.8 ★)"
      ]
    },
    cityCreamery: {
      name: "City Creamery",
      categoryKey: "food",
      categoryLabel: "Ice Cream Business",
      url: "https://davidonyekaonwu565-glitch.github.io/citycreamery/",
      buttonText: "View Website →",
      description: "A custom website created for an ice cream business, focused on presenting the brand, products and important customer information.",
      features: [
        "Brand and product showcase",
        "Digital flavour & dessert catalogue",
        "Location and operating hours",
        "Mobile-friendly interface"
      ]
    },
    makeMeBeauty: {
      name: "Make Me Beauty Place",
      categoryKey: "beauty",
      categoryLabel: "Luxury Hair Salon & Beauty Lounge",
      url: "https://davidonyekaonwu565-glitch.github.io/make-me-beauty/",
      buttonText: "View Website →",
      description: "An upscale multi-floor hair salon and beauty store website designed for a prominent Surulere salon, featuring dual currency pricing, treatment lookbooks, and VIP booking.",
      features: [
        "Interactive VIP appointment booking",
        "Dual currency switcher (₦ NGN / $ USD)",
        "Instagram lookbook & hairstyle showcase",
        "Live Surulere studio status",
        "Direct WhatsApp booking (0707 109 5500)",
        "Multi-floor experience breakdown"
      ]
    },
    dtRoofing: {
      name: "David Tulloch Roofing",
      categoryKey: "trade",
      categoryLabel: "Roofing & Construction",
      url: "https://davidonyekaonwu565-glitch.github.io/dt-roofing/",
      buttonText: "View Website →",
      description: "A high-performance roofing contractor website designed to present residential and commercial services, emergency storm response, project transformations, and online cost estimations.",
      features: [
        "Interactive roof cost calculator",
        "Before & after transformation showcase",
        "CertainTeed roofing systems & ice removal",
        "24/7 Emergency call & dispatch integration",
        "Free estimate request form",
        "Verified local reviews & track record"
      ]
    }
  }
};

if (typeof window !== 'undefined') {
  window.PORTFOLIO_CONFIG = PORTFOLIO_CONFIG;
}
