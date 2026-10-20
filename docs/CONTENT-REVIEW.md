# Content to confirm before launch

Sources: `PAT_WS9.doc` and `PAT_WS13.docx` (project reference list — identical 28 projects; WS13 adds
"Petrochemicals" to the intro and updated contact details), the Emerson plaque PDF, and the old site text.

## Facts

- **28 projects** are listed exactly as in the reference list. Corrections made silently: "IBDROLA" → Iberdrola,
  "Alsohm" → Alstom, "Balgem" → Belgian, "Re-Habitation"/"Re-Hungarian" → rehabilitation, "beck" → back.
  The old site also showed wrong country/year labels on some project cards (e.g. Saudi/Oman projects tagged "Egypt 2004") — not carried over.
- **Plant figures** on the project tiles are the sum of the capacities in the list (e.g. 2×300 → 600 MW).
  The literal text (e.g. `2×300 MW`) is shown on each project page. Confirm West Damietta (4×125 + 1×250 → 750) and Ataka (2×300 + 2×150 → 900).
- **Control system labels**: "Ovation" only where the list or the plaque says so; "Emerson DCS" where only "EMERSON" is given;
  Abqaiq = DeltaV; Kurimat III = Alstom; Suez Sokhna = Siemens S7. Confirm the Emerson-only ones.
- **CWP** (project 7) and **HCD** (project 25) are kept as abbreviations because the list does not expand them.
- **Abqaiq / Aramco, Marafiq, Savola, Skoda, CMI, INITEC, Iberdrola** are named as clients/partners (permission given).
- **Recognition plaque**: shown as "recognised by Emerson Process Management" for the owner, Ahdy Abu-Malwa — not as a partnership or certification.
  A trademark disclaimer is in the footer and on the credentials page.
- **Contact**: main `+20 109 991 2020` (24/7), support `+20 122 359 0402`, e-mails `info@ / sales@ / service@patdcs.com`.
  The direct lines (MD, development leader, engineering manager, administrator) from WS13 are published on the contact page —
  remove them from `src/data/site.ts` if personal numbers should not be public.
  `+966 55 417 7407` ("not active now") is intentionally omitted. Business hours: only "24/7 support" is shown (the old "08:00-08:30" was wrong).
- **Address**: "New Damietta, Second District, adjacent to 6 Al Bahr Street" (old site: truncated "Egyp").

## Translations (Arabic)

All Arabic copy and project descriptions were written for this site and should be read by a native speaker
who knows the trade, especially: plant names (عتاقة، الكريمات، الشعيبة، رابغ، بقيق…), "ترحيل/تحديث/ترقية نظام DCS",
and the vision / mission text.

## Assets

- Photos used: control room (team + operators), control desk, DCS cabinets, Ovation GT operator station, engineer at workstation —
  all from the old site. They are not tied to specific projects (the source does not say which plant).
- **Not used on purpose**: the architecture photo `Alien.jpeg` (watermarked © Tim Mulcahy), stock images (HART communicator,
  hands, aircraft diagram, Delta inverter), the Aramco certificate of appreciation (names another person),
  engineering drawings (client documents), and ID-badge photos.
- Logo: the approved new artwork, vectorised in `brand/` (SVG master files + PNG/PDF exports).
