"""Generates the PAT logo suite and stationery as outline-only SVGs (no fonts needed)."""
import json, os, sys
sys.path.insert(0, "brand/source")
from textpath import text_path

OUT = "brand"
FB = "node_modules/@fontsource/barlow/files/barlow-latin-{w}-normal.woff2"
FBC = "node_modules/@fontsource/barlow-condensed/files/barlow-condensed-latin-{w}-normal.woff2"
CAIRO = "node_modules/@fontsource-variable/cairo/files/cairo-arabic-wght-normal.woff2"

NAVY, BLUE, ORANGE, ORANGE_TXT, WHITE = "#102840", "#2A7CAC", "#E05826", "#B8441A", "#FFFFFF"
layers = json.load(open("brand/source/layers.json"))
bx, by, bw, bh = json.load(open("brand/source/bbox.json"))["bbox"]
ASPECT = bw / bh

def symbol(x, y, h, scheme="color", letters=True, stripes=True, piece=None):
    """Nested <svg> with the PAT symbol at (x, y), height h."""
    c = {"color": dict(navy=NAVY, blue=BLUE, orange=ORANGE, letters=NAVY),
         "reverse": dict(navy=WHITE, blue=BLUE, orange=ORANGE, letters=WHITE),
         "navy": dict(navy=NAVY, blue=NAVY, orange=NAVY, letters=NAVY),
         "white": dict(navy=WHITE, blue=WHITE, orange=WHITE, letters=WHITE)}[scheme]
    parts = []
    for name in (["orange", "blue", "navy"] if stripes else []) + (["letters"] if letters else []):
        for d, tx, ty in layers[name]:
            if piece and name != "letters":
                upper = (tx - bx) + (ty - by) < (bw + bh) * 0.5
                if (piece == "upper") != upper:
                    continue
            parts.append(f'<path fill="{c[name]}" transform="translate({tx:g},{ty:g})" d="{d}"/>')
    w = h * ASPECT
    return (f'<svg x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" viewBox="{bx} {by} {bw} {bh}">'
            + "".join(parts) + "</svg>"), w

def txt(s, font, size, x, y, fill, tracking=0.0, anchor="start", wght=None):
    d, w = text_path(font, s, size, x, y, tracking=tracking, anchor=anchor, wght=wght)
    return f'<path fill="{fill}" d="{d}"/>', w

def doc(inner, w, h, units="", bg=None, title="PAT"):
    rect = f'<rect width="{w}" height="{h}" fill="{bg}"/>' if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" width="{w}{units}" height="{h}{units}" '
            f'viewBox="0 0 {w} {h}"><title>{title}</title>{rect}{inner}</svg>')

def save(rel, s):
    p = os.path.join(OUT, rel); os.makedirs(os.path.dirname(p), exist_ok=True); open(p, "w").write(s)

# ---------- symbol ----------
for scheme in ("color", "reverse", "navy", "white"):
    s, w = symbol(0, 0, 1000, scheme)
    save(f"logo/pat-symbol-{scheme}.svg", doc(s, round(w), 1000, title="PAT symbol"))
device, dw = symbol(0, 0, 1000, "color", letters=False)
save("logo/pat-weave-device.svg", doc(device, round(dw), 1000, title="PAT weave brand device"))

# ---------- horizontal lockup (EN) ----------
def lockup_h(scheme):
    ink = NAVY if scheme in ("color", "navy") else WHITE
    acc = ORANGE if scheme in ("color", "reverse") else ink
    sym, sw = symbol(0, 0, 200, scheme)
    x = sw + 34
    a, w1 = txt("POWER AUTOMATION", FBC.format(w=700), 72, x, 86, ink, tracking=0.02)
    b, w2 = txt("TEAM", FBC.format(w=700), 72, x, 160, ink, tracking=0.02)
    c, w3 = txt("DCS & INSTRUMENTS SPECIALISTS", FBC.format(w=600), 26, x + 2, 196, acc, tracking=0.13)
    tw = max(w1, w3)
    rule = f'<rect x="{x + w2 + 18:.1f}" y="124" width="{tw - w2 - 18:.1f}" height="8" fill="{acc}"/>'
    W = x + tw + 6
    if scheme == "reverse":
        inner = f'<g transform="translate(40 40)">{sym + a + b + rule + c}</g>'
        return doc(inner, round(W + 80), 284, bg=NAVY, title="Power Automation Team")
    return doc(sym + a + b + rule + c, round(W), 204, title="Power Automation Team")
for scheme in ("color", "reverse", "navy", "white"):
    save(f"logo/pat-lockup-horizontal-{scheme}.svg", lockup_h(scheme))

# ---------- stacked lockup (EN) ----------
def lockup_v(scheme):
    ink = NAVY if scheme in ("color", "navy") else WHITE
    acc = ORANGE if scheme in ("color", "reverse") else ink
    W = 640
    sym, sw = symbol(0, 0, 340, scheme)
    sym = sym.replace('x="0.000"', f'x="{(W - sw) / 2:.3f}"', 1)
    a, _ = txt("POWER AUTOMATION TEAM", FBC.format(w=700), 62, W / 2, 420, ink, tracking=0.02, anchor="middle")
    c, _ = txt("DCS & INSTRUMENTS SPECIALISTS", FBC.format(w=600), 24, W / 2, 458, acc, tracking=0.16, anchor="middle")
    bg = NAVY if scheme == "reverse" else None
    return doc(sym + a + c, W, 470, bg=bg, title="Power Automation Team")
for scheme in ("color", "reverse"):
    save(f"logo/pat-lockup-stacked-{scheme}.svg", lockup_v(scheme))

# ---------- Arabic lockup ----------
def lockup_ar(scheme):
    ink = NAVY if scheme == "color" else WHITE
    a, wa = txt("باور أوتوميشن تيم", CAIRO, 80, 0, 104, ink, wght=800)
    c, wc = txt("متخصصون في أنظمة التحكم الموزعة وأجهزة القياس", CAIRO, 30, 0, 172, ORANGE, wght=600)
    tw = max(wa, wc)
    a = f'<g transform="translate({tw - wa:.1f} 0)">{a}</g>'
    c = f'<g transform="translate({tw - wc:.1f} 0)">{c}</g>'
    sym, sw = symbol(tw + 34, 0, 200, scheme)
    if scheme == "reverse":
        return doc(f'<g transform="translate(40 40)">{a + c + sym}</g>', round(tw + 34 + sw + 80), 284, bg=NAVY, title="باور أوتوميشن تيم")
    return doc(a + c + sym, round(tw + 34 + sw), 204, title="باور أوتوميشن تيم")
for scheme in ("color", "reverse"):
    save(f"logo/pat-lockup-arabic-{scheme}.svg", lockup_ar(scheme))

# ---------- app icon ----------
s, w = symbol(0, 0, 860, "color")
save("logo/pat-app-icon.svg", doc(s.replace('x="0.000" y="0.000"', f'x="{(1024 - w) / 2:.1f}" y="82"', 1), 1024, 1024, bg=WHITE, title="PAT"))

import numpy as _np
from PIL import Image as _Im
_m = _np.array(_Im.open(os.path.join(os.path.dirname(os.path.abspath(__file__)), "m-letters.png"))) < 128
_ys, _xs = _np.nonzero(_m)
lx0, ly0, lx1, ly1 = int(_xs.min()) - 20, int(_ys.min()) - 20, int(_xs.max()) + 20, int(_ys.max()) + 20
lp = "".join(f'<path fill="{NAVY}" transform="translate({tx:g},{ty:g})" d="{d}"/>' for d, tx, ty in layers["letters"])
side = max(lx1 - lx0, ly1 - ly0)
cx, cy = (lx0 + lx1) / 2, (ly0 + ly1) / 2
save("logo/pat-favicon.svg", f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{cx - side / 2:.0f} {cy - side / 2:.0f} {side} {side}" width="1024" height="1024"><title>PAT</title><rect x="{cx - side / 2:.0f}" y="{cy - side / 2:.0f}" width="{side}" height="{side}" fill="#FFFFFF"/>{lp}</svg>')

# ---------- business card (85 x 55 mm + 3 mm bleed) ----------
BLEED, CW, CH = 3, 85, 55
W, H = CW + 2 * BLEED, CH + 2 * BLEED

def card_front(name, title, lines):
    o = []
    dev, dw = symbol(0, 0, 74, "color", letters=False, piece="upper")
    o.append(f'<g opacity="1">{dev.replace("x=\"0.000\" y=\"0.000\"", f"x=\"{W - 30:.2f}\" y=\"{-8:.2f}\"", 1)}</g>')
    sym, sw = symbol(BLEED + 6, BLEED + 6, 11, "color")
    o.append(sym)
    t1, _ = txt("POWER AUTOMATION", FBC.format(w=700), 3.3, BLEED + 6 + sw + 2.6, BLEED + 10.6, NAVY, tracking=0.03)
    t2, _ = txt("TEAM", FBC.format(w=700), 3.3, BLEED + 6 + sw + 2.6, BLEED + 14.4, NAVY, tracking=0.03)
    o += [t1, t2]
    n, _ = txt(name.upper(), FBC.format(w=700), 6.2, BLEED + 6, BLEED + 30, NAVY, tracking=0.01)
    tt, _ = txt(title, FB.format(w=600), 2.7, BLEED + 6, BLEED + 34.6, ORANGE_TXT)
    o += [n, tt, f'<rect x="{BLEED + 6}" y="{BLEED + 36.6}" width="9" height="0.6" fill="{ORANGE}"/>']
    y = BLEED + 41.2
    for label, value in lines:
        l, _ = txt(label, FBC.format(w=700), 2.35, BLEED + 6, y, ORANGE_TXT, tracking=0.08)
        v, _ = txt(value, FB.format(w=500), 2.5, BLEED + 10.5, y, NAVY)
        o += [l, v]; y += 3.55
    return doc("".join(o), W, H, units="mm", bg=WHITE, title=f"{name} — business card front")

def card_back():
    o = []
    sym, sw = symbol(0, BLEED + 9.5, 22, "reverse")
    o.append(sym.replace('x="0.000"', f'x="{(W - sw) / 2:.3f}"', 1))
    a, _ = txt("POWER AUTOMATION TEAM", FBC.format(w=700), 4.1, W / 2, BLEED + 38.2, WHITE, tracking=0.04, anchor="middle")
    b, _ = txt("باور أوتوميشن تيم", CAIRO, 3.9, W / 2, BLEED + 43.6, WHITE, anchor="middle", wght=700)
    c, _ = txt("DCS & INSTRUMENTS SPECIALISTS · SINCE 1991", FBC.format(w=600), 2.2, W / 2, BLEED + 48.6, "#F07A4A", tracking=0.14, anchor="middle")
    return doc(o[0] + a + b + c, W, H, units="mm", bg=NAVY, title="business card back")

save("stationery/business-card-front-ahdy-abu-malwa.svg", card_front(
    "Ahdy Abu-Malwa", "Managing Director",
    [("T", "+20 109 991 2020"), ("E", "info@patdcs.com"), ("W", "patdcs.com"), ("A", "New Damietta, Egypt")]))
save("stationery/business-card-back.svg", card_back())
print("ok", round(ASPECT, 3))

def letterhead():
    o = []
    sym, sw = symbol(18, 14, 20, "color")
    o.append(sym)
    a, _ = txt("POWER AUTOMATION TEAM", FBC.format(w=700), 6, 18 + sw + 5, 24.2, NAVY, tracking=0.03)
    b, _ = txt("DCS & INSTRUMENTS SPECIALISTS · SINCE 1991", FBC.format(w=600), 2.9, 18 + sw + 5.2, 30.4, ORANGE_TXT, tracking=0.14)
    o += [a, b]
    y = 18.5
    for line in ("+20 109 991 2020", "info@patdcs.com", "patdcs.com"):
        t, _ = txt(line, FB.format(w=500), 3.0, 192, y, NAVY, anchor="end"); o.append(t); y += 4.6
    o.append(f'<rect x="18" y="40" width="174" height="0.5" fill="{ORANGE}"/>')
    dev, dw = symbol(0, 0, 110, "color", letters=False, piece="lower")
    o.append(dev.replace('x="0.000" y="0.000"', f'x="{210 - dw * 0.80:.2f}" y="{297 - 110 * 0.80:.2f}"', 1))
    f1, _ = txt("Power Automation Team Co. · New Damietta, Second District, adjacent to 6 Al Bahr Street, Egypt", FB.format(w=500), 2.6, 18, 284, NAVY)
    f2, _ = txt("باور أوتوميشن تيم", CAIRO, 3.0, 18, 289.6, NAVY, wght=700)
    o += [f1, f2.replace('<path', f'<g transform="translate(0 0)"><path', 1) + "</g>"]
    return doc("".join(o), 210, 297, units="mm", bg=WHITE, title="PAT letterhead")
save("stationery/letterhead-a4.svg", letterhead())
