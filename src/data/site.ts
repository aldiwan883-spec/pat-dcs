import { T } from "@/lib/i18n";

export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://patdcs.com").replace(/\/$/, "");

export const company = {
  legalName: "Power Automation Team Co.",
  shortName: "PAT",
  name: T("Power Automation Team", "باور أوتوميشن تيم"),
  founded: 1991,
  owner: T("Ahdy Abu-Malwa", "عهدي أبو ملوى"),
  email: "info@patdcs.com",
  salesEmail: "sales@patdcs.com",
  serviceEmail: "service@patdcs.com",
  phone: "+201099912020",
  phoneDisplay: "+20 109 991 2020",
  supportPhone: "+201223590402",
  supportPhoneDisplay: "+20 122 359 0402",
  /** Direct lines from the company contact list (PAT_WS13). */
  directLines: [
    { role: T("Managing Director", "المدير العام"), phone: "+201099912020", display: "+20 109 991 2020" },
    { role: T("Development Leader", "قائد التطوير"), phone: "+201099912384", display: "+20 109 991 2384" },
    { role: T("Engineering Manager", "مدير الهندسة"), phone: "+201099912381", display: "+20 109 991 2381" },
    { role: T("Administrator", "الإدارة"), phone: "+201099912028", display: "+20 109 991 2028" },
  ],
  address: T(
    "New Damietta, Second District, adjacent to 6 Al Bahr Street, Egypt",
    "دمياط الجديدة، الحي الثاني، بجوار شارع 6 البحر، مصر",
  ),
  addressParts: {
    locality: "New Damietta",
    country: "EG",
    street: "Second District, adjacent to 6 Al Bahr Street",
  },
  mapsUrl: "https://www.google.com/maps/search/?api=1&query=New+Damietta+Egypt",
} as const;

/** Companies our engineers have worked with (from the company profile). */
export const experienceCompanies = [
  "Emerson",
  "Techint",
  "Alstom",
  "GE",
  "Siemens",
  "Skoda",
  "CMI",
  "Iberdrola",
  "INITEC",
] as const;
