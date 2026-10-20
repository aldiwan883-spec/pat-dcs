# AI image prompts: website and marketing

Gemini (or any image model) prompts for the photos the website still needs.
These images sit **next to** PAT's real site photos and never replace them.

- **Real photos:** used for projects, the gallery and credentials.
- **AI images:** used only for heroes, service cards and sector or country banners.

## How to use

1. **Attach the logo.** In every chat, attach two files:
   - `brand/png/ppe/hardhat-side-sticker-110x30mm-1000.png`
   - `brand/png/logo/pat-symbol-color-1024.png`

   Then paste the **style block** followed by one prompt.
2. **Generate and pick.** Make 3–4 variations and keep the best one. Reject any image where:
   - the logo is redrawn, distorted or misspelled;
   - there are extra letters on equipment;
   - hands or PPE look wrong.
3. **Save.** Save the chosen image as `images/ai/<file name>` at the size given. Upload the folder to the repo.
   Claude then crops, compresses and places it.

## Style block (paste before every prompt)

> Photorealistic documentary photograph, shot on a full-frame camera with a 35 mm lens, natural light, shallow depth of field,
> realistic textures, no illustration or 3D-render look.
> Colour grade: deep navy blue (#102840) and steel blue (#2A7CAC) dominate; small, deliberate accents of PAT orange (#E05826) —
> safety vests, cable tags, indicator lights. Calm, precise, professional mood.
> People: Egyptian and Gulf Arab engineers and technicians, correct PPE (white hard hat, safety glasses, gloves where needed,
> navy fire-retardant coverall), focused on the work, not posing or looking at the camera.
> Branding: use ONLY the attached PAT logo, exactly as provided (do not redraw or retype it), small — on the side of hard hats and
> on the coverall chest. No other company logos, brand names or readable text anywhere in the image. No watermarks.

## Prompts

| # | File · size | Where on the site | Prompt |
|---|---|---|---|
| 1 | `home-hero.jpg` · 2400×1350 (16:9) | Home page hero | A commissioning engineer at a DCS operator console in a combined-cycle power plant control room at dusk, several large process-graphic screens glowing blue, through the window the plant's heat-recovery boilers and stacks lit against a navy sky. Engineer seen from three-quarter behind, white PAT hard hat on the desk beside him. Leave calm, dark negative space on the left third for a headline. |
| 2 | `home-loop-check.jpg` · 1600×1200 (4:3) | Home, "How we work" strip | Two technicians performing an IO loop check at an open marshalling cabinet: one holds a HART communicator and reads a laptop, the other points at a terminal block with orange cable tags. Neat wiring, ferrules, labels without readable text. |
| 3 | `service-dcs.jpg` · 1600×1200 | Services: DCS Engineering & Commissioning | Engineer configuring a distributed control system in an engineering room: open system cabinets with redundant controller modules and blinking status LEDs, a laptop with a logic diagram (unreadable), cable trays overhead. |
| 4 | `service-plc.jpg` · 1600×1200 | Services: PLC Programming & Integration | Close-up of hands connecting a laptop to a PLC rack inside an industrial control panel, I/O modules with small orange status lights, tidy grey wiring ducts. |
| 5 | `service-commissioning.jpg` · 1600×1200 | Services: Commissioning & Start-up | Night start-up at a gas-turbine power plant: three engineers on a steel walkway with radios and tablets, steam venting softly from a stack, sodium and blue lights, sense of a milestone moment. |
| 6 | `service-ic.jpg` · 1600×1200 | Services: I&C and Electrical Commissioning | Technician calibrating a pressure transmitter on a steel pipe rack with a handheld calibrator; in the background, an electrical substation room with switchgear panels. |
| 7 | `service-training.jpg` · 1600×1200 | Services: Training & Development | A training room with an operator simulator: six plant operators at workstations showing process graphics, an instructor in a navy PAT polo shirt explaining at a large screen. |
| 8 | `service-staffing.jpg` · 1600×1200 | Services: Technical Staffing & Manpower | A team of eight engineers and technicians in navy PAT coveralls, white PAT hard hats and orange vests, walking together toward a power plant at sunrise, seen from behind and slightly to the side. |
| 9 | `service-support.jpg` · 1600×1200 | Services: Troubleshooting & Emergency Support | Late-night troubleshooting: an engineer with a headlamp inspecting an open control cabinet, laptop connected, a colleague on the phone in the background; tense but controlled atmosphere. |
| 10 | `site-egypt-delta.jpg` · 2400×1000 (12:5) | Egypt banner / projects page | A combined-cycle power plant in the Nile Delta at early morning, green farmland, palm trees and an irrigation canal in the foreground, light haze, two stacks and air-cooled condenser. Wide landscape. |
| 11 | `site-redsea-coast.jpg` · 2400×1000 | Saudi Arabia banner | A large steam power and desalination plant on the Red Sea coast of Saudi Arabia, turquoise water, sandy shore, tall stacks and boiler houses, clear midday sky. Wide landscape. |
| 12 | `site-desert-gt.jpg` · 2400×1000 | Gas-turbine sector | A row of simple-cycle gas-turbine units in open Saudi desert, heat shimmer, dunes and a high-voltage switchyard, late-afternoon golden light. |
| 13 | `site-oman-coast.jpg` · 2400×1000 | Oman banner | A combined-cycle power plant on the coast of Oman with rugged brown mountains behind and the Gulf of Oman in front, soft evening light. |
| 14 | `sector-oil-gas.jpg` · 1600×1200 | Oil & gas sector | A gas-oil separation plant in the eastern Saudi desert: pipe racks, separator vessels, a distant flare, a technician in a vest walking along the rack. |
| 15 | `sector-solar.jpg` · 1600×1200 | Solar (ISCC) sector | Parabolic-trough solar collectors in long rows beside a combined-cycle power block in the Egyptian desert, mirrors reflecting a blue sky. |
| 16 | `sector-water.jpg` · 1600×1200 | Water & utilities sector | Interior of a desalination plant: rows of reverse-osmosis pressure vessels and blue pumps, a technician checking a local instrument panel. |
| 17 | `sector-marine.jpg` · 1600×1200 | Industrial & marine sector | Engine control room of an oil tanker: main switchboard, generator synchronising panel and an engineer reading meters. Analog meters without readable brand names. |
| 18 | `about-team.jpg` · 1600×1200 | About us | PAT engineers reviewing large P&ID drawings on a table in a site office container; hard hats and a radio on the table, plant visible through the window. |
| 19 | `contact-vehicle.jpg` · 2400×1000 | Contact / careers banner | A white double-cabin pickup with the PAT logo on the door, parked at a power plant gate at sunrise, two engineers unloading a tool case and a laptop bag. |

## Rules

- **Labels:** do not caption an AI image with a real plant name, and do not present it as a specific project.
  On the website, AI images get neutral alt text, for example "Commissioning engineer in a control room".
- **Other companies' logos:** never put the logo of Emerson, Siemens, GE or any other company on generated equipment.
- **Real photos:** keep the real site photos for:
  - project pages;
  - the gallery;
  - credentials;
  - social media posts about a specific job.
