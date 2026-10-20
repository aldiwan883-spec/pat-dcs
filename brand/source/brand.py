"""PAT identity generator.

Run from the repository root (after `npm install`, so the Fontsource fonts exist):

    python brand/source/brand.py          # needs fonttools, brotli, uharfbuzz
    node brand/source/export.mjs          # PNG + print PDF + preview sheets (needs playwright)

Every file is written with text converted to outlines, so nothing depends on installed fonts.
The logo paths come from layers.json (vectorised from pat-logo-source.png by trace.py/build_symbol.py).
"""
import json
import os
import sys

HERE = os.path.dirname(os.path.abspath(__file__))
sys.path.insert(0, HERE)
from textpath import text_path  # noqa: E402

ROOT = os.path.abspath(os.path.join(HERE, "..", ".."))
OUT = os.path.join(ROOT, "brand")
NM = os.path.join(ROOT, "node_modules")


def cond(w):
    return f"{NM}/@fontsource/barlow-condensed/files/barlow-condensed-latin-{w}-normal.woff2"


def sans(w):
    return f"{NM}/@fontsource/barlow/files/barlow-latin-{w}-normal.woff2"


CAIRO = f"{NM}/@fontsource-variable/cairo/files/cairo-arabic-wght-normal.woff2"

NAVY, BLUE, ORANGE, WHITE = "#102840", "#2A7CAC", "#E05826", "#FFFFFF"
ORANGE_TXT, ORANGE_ON_DARK = "#B8441A", "#F07A4A"
SAND, SLATE, LINE = "#F3F2EE", "#3B5368", "#D5DCE2"

COMPANY = "Power Automation Team Co."
NAME_AR = "باور أوتوميشن تيم"
TAGLINE = "DCS & INSTRUMENTS SPECIALISTS"
PHONE, EMAIL, WEB = "+20 109 991 2020", "info@patdcs.com", "patdcs.com"
ADDRESS = "New Damietta, Second District, adjacent to 6 Al Bahr Street, Egypt"

layers = json.load(open(os.path.join(HERE, "layers.json")))
bx, by, bw, bh = json.load(open(os.path.join(HERE, "bbox.json")))["bbox"]
ASPECT = bw / bh

SCHEMES = {
    "color": dict(navy=NAVY, blue=BLUE, orange=ORANGE, letters=NAVY),
    "reverse": dict(navy=WHITE, blue=BLUE, orange=ORANGE, letters=WHITE),
    "navy": dict(navy=NAVY, blue=NAVY, orange=NAVY, letters=NAVY),
    "white": dict(navy=WHITE, blue=WHITE, orange=WHITE, letters=WHITE),
}
# Stripe bundles of the symbol, measured on the artwork: centre, axis angle (deg), length (units).
PIECES = {
    "upper": dict(c=(1546.1, 963.7), ang=-42.4, length=1954.0),
    "lower": dict(c=(2620.4, 2011.3), ang=-43.8, length=1894.0),
}

DEFS = {}
MANIFEST = []


def _in_piece(tx, ty, piece):
    upper = (tx - bx) + (ty - by) < (bw + bh) * 0.5
    return piece is None or (piece == "upper") == upper


def _paths(scheme, letters=True, stripes=True, piece=None):
    c = SCHEMES[scheme]
    out = []
    names = (["orange", "blue", "navy"] if stripes else []) + (["letters"] if letters else [])
    for name in names:
        for d, tx, ty in layers[name]:
            if name != "letters" and not _in_piece(tx, ty, piece):
                continue
            out.append(f'<path fill="{c[name]}" transform="translate({tx:g},{ty:g})" d="{d}"/>')
    return "".join(out)


def symbol(x, y, h, scheme="color", letters=True, stripes=True):
    """The PAT symbol at (x, y) with height h. Returns (markup, width)."""
    key = f"pat-{scheme}{'-L' if letters else ''}{'-S' if stripes else ''}"
    if key not in DEFS:
        DEFS[key] = f'<symbol id="{key}" viewBox="{bx} {by} {bw} {bh}">{_paths(scheme, letters, stripes)}</symbol>'
    w = h * ASPECT
    return f'<use xlink:href="#{key}" x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}"/>', w


def weave(cx, cy, length, angle, piece="upper", scheme="color"):
    """One stripe bundle of the logo, centred at (cx, cy), its axis rotated to `angle`, `length` long."""
    key = f"weave-{piece}-{scheme}"
    if key not in DEFS:
        DEFS[key] = f'<g id="{key}">{_paths(scheme, letters=False, piece=piece)}</g>'
    p = PIECES[piece]
    s = length / p["length"]
    return (f'<use xlink:href="#{key}" transform="translate({cx:.3f} {cy:.3f}) rotate({angle - p["ang"]:.3f}) '
            f'scale({s:.6f}) translate({-p["c"][0]:.1f} {-p["c"][1]:.1f})"/>')


_CLIPS = [0]


def clip(x, y, w, h, inner):
    _CLIPS[0] += 1
    key = f"clip{_CLIPS[0]}"
    DEFS[key] = f'<clipPath id="{key}"><rect x="{x}" y="{y}" width="{w}" height="{h}"/></clipPath>'
    return f'<g clip-path="url(#{key})">{inner}</g>'


def txt(s, font, size, x, y, fill, tracking=0.0, anchor="start", wght=None, opacity=None):
    d, w = text_path(font, s, size, x, y, tracking=tracking, anchor=anchor, wght=wght)
    op = f' fill-opacity="{opacity}"' if opacity else ""
    return f'<path fill="{fill}"{op} d="{d}"/>', w


def width(s, font, size, tracking=0.0, wght=None):
    return text_path(font, s, size, tracking=tracking, wght=wght)[1]


def wrap(s, font, size, maxw, tracking=0.0):
    lines, cur = [], ""
    for word in s.split():
        t = f"{cur} {word}".strip()
        if width(t, font, size, tracking) <= maxw or not cur:
            cur = t
        else:
            lines.append(cur)
            cur = word
    return lines + [cur]


def rect(x, y, w, h, fill, rx=0, stroke=None, sw=0):
    st = f' stroke="{stroke}" stroke-width="{sw}"' if stroke else ""
    r = f' rx="{rx}"' if rx else ""
    return f'<rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" fill="{fill}"{r}{st}/>'


def doc(inner, w, h, units="", bg=None, title="PAT"):
    defs = "".join(DEFS.values())
    DEFS.clear()
    back = rect(0, 0, w, h, bg) if bg else ""
    return (f'<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" '
            f'width="{w}{units}" height="{h}{units}" viewBox="0 0 {w} {h}"><title>{title}</title>'
            f"<defs>{defs}</defs>{back}{inner}</svg>")


def save(rel, svg, png=None, pdf=None, group=None, label=None, dark=False):
    """Writes brand/<rel>; png = list of pixel widths; pdf = (w_mm, h_mm, name) for print."""
    path = os.path.join(OUT, rel)
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(svg)
    MANIFEST.append(dict(svg=rel, png=png or [], pdf=pdf, group=group, label=label or os.path.basename(rel), dark=dark))


# ------------------------------------------------------------------ lockups
def ink_of(scheme):
    return NAVY if scheme in ("color", "navy") else WHITE


def acc_of(scheme):
    return {"color": ORANGE, "reverse": ORANGE_ON_DARK}.get(scheme, ink_of(scheme))


def lockup_h(x, y, h, scheme="color", tagline=True):
    """Horizontal lockup; h is the symbol height. Returns (markup, width)."""
    k = h / 200
    ink, acc = ink_of(scheme), acc_of(scheme)
    sym_scheme = "reverse" if scheme == "reverse" else scheme
    sym, sw = symbol(x, y, h, sym_scheme)
    tx = x + sw + 34 * k
    a, w1 = txt("POWER AUTOMATION", cond(700), 72 * k, tx, y + 86 * k, ink, tracking=0.02)
    b, w2 = txt("TEAM", cond(700), 72 * k, tx, y + 160 * k, ink, tracking=0.02)
    parts = [sym, a, b]
    tw = w1
    if tagline:
        c, w3 = txt(TAGLINE, cond(600), 26 * k, tx + 2 * k, y + 196 * k, acc, tracking=0.13)
        parts.append(c)
        tw = max(w1, w3)
    parts.append(rect(tx + w2 + 18 * k, y + 124 * k, tw - w2 - 18 * k, 8 * k, acc))
    return "".join(parts), tx + tw - x


def lockup_v(cx, y, h, scheme="color", tagline=True):
    """Stacked lockup centred on cx; h is the symbol height. Returns (markup, total height)."""
    k = h / 340
    ink, acc = ink_of(scheme), acc_of(scheme)
    sym, sw = symbol(cx - h * ASPECT / 2, y, h, "reverse" if scheme == "reverse" else scheme)
    a, _ = txt("POWER AUTOMATION TEAM", cond(700), 62 * k, cx, y + 420 * k, ink, tracking=0.02, anchor="middle")
    parts = [sym, a]
    if tagline:
        c, _ = txt(TAGLINE, cond(600), 24 * k, cx, y + 458 * k, acc, tracking=0.16, anchor="middle")
        parts.append(c)
    return "".join(parts), 470 * k


def lockup_v_fit(total_width, scheme="color", tagline=True):
    """Stacked lockup scaled to a total width (the name line is the widest element)."""
    h = 340 * total_width / 640
    return lockup_v(total_width / 2, 0, h, scheme, tagline)


def fit_size(s, font, size, maxw, tracking=0.0):
    return min(size, size * maxw / width(s, font, size, tracking))


def lockup_ar(x, y, h, scheme="color"):
    """Arabic lockup (text left, symbol right); h is the symbol height."""
    k = h / 200
    ink = ink_of(scheme)
    a, wa = txt(NAME_AR, CAIRO, 80 * k, 0, 0, ink, wght=800)
    c, wc = txt("متخصصون في أنظمة التحكم الموزعة وأجهزة القياس", CAIRO, 30 * k, 0, 0, acc_of(scheme), wght=600)
    tw = max(wa, wc)
    a = f'<g transform="translate({x + tw - wa:.3f} {y + 104 * k:.3f})">{a}</g>'
    c = f'<g transform="translate({x + tw - wc:.3f} {y + 172 * k:.3f})">{c}</g>'
    sym, sw = symbol(x + tw + 34 * k, y, h, "reverse" if scheme == "reverse" else scheme)
    return a + c + sym, tw + 34 * k + sw


# ------------------------------------------------------------------ logo suite
def build_logos():
    for scheme in ("color", "reverse", "navy", "white"):
        s, w = symbol(0, 0, 1000, scheme)
        save(f"logo/pat-symbol-{scheme}.svg", doc(s, round(w), 1000, title="PAT symbol"),
             png=[256, 1024], group="Logo", label=f"Symbol — {scheme}", dark=scheme in ("reverse", "white"))
    for scheme in ("color", "reverse", "navy", "white"):
        inner, w = lockup_h(0, 0, 200, scheme)
        if scheme == "reverse":
            svg = doc(f'<g transform="translate(40 40)">{inner}</g>', round(w + 80), 284, bg=NAVY, title="Power Automation Team")
        else:
            svg = doc(inner, round(w + 4), 204, title="Power Automation Team")
        save(f"logo/pat-lockup-horizontal-{scheme}.svg", svg, png=[600, 2000], group="Logo", label=f"Horizontal — {scheme}",
             dark=scheme == "white")
    for scheme in ("color", "reverse", "navy", "white"):
        inner, h = lockup_v(320, 0, 340, scheme)
        bg = NAVY if scheme == "reverse" else None
        save(f"logo/pat-lockup-stacked-{scheme}.svg", doc(inner, 640, round(h + 2), bg=bg, title="Power Automation Team"),
             png=[1200], group="Logo", label=f"Stacked — {scheme}", dark=scheme == "white")
    for scheme in ("color", "reverse"):
        inner, w = lockup_ar(0, 0, 200, scheme)
        if scheme == "reverse":
            svg = doc(f'<g transform="translate(40 40)">{inner}</g>', round(w + 80), 284, bg=NAVY, title=NAME_AR)
        else:
            svg = doc(inner, round(w + 2), 204, title=NAME_AR)
        save(f"logo/pat-lockup-arabic-{scheme}.svg", svg, png=[2000], group="Logo", label=f"Arabic — {scheme}")
    # Garment / dark-surface artwork: reverse colours on a transparent background.
    inner, w = lockup_h(0, 0, 200, "reverse")
    save("logo/pat-lockup-horizontal-reverse-transparent.svg", doc(inner, round(w + 4), 204, title="Power Automation Team"),
         png=[2000], group="Logo", label="Horizontal — reverse, transparent", dark=True)
    inner, h = lockup_v(320, 0, 340, "reverse")
    save("logo/pat-lockup-stacked-reverse-transparent.svg", doc(inner, 640, round(h + 2), title="Power Automation Team"),
         png=[1200], group="Logo", label="Stacked — reverse, transparent", dark=True)
    # Favicon: the letters only, filling a square.
    letters = "".join(f'<path fill="{NAVY}" transform="translate({tx:g},{ty:g})" d="{d}"/>' for d, tx, ty in layers["letters"])
    lx0, ly0, lx1, ly1 = json.load(open(os.path.join(HERE, "letters-bbox.json")))
    side = max(lx1 - lx0, ly1 - ly0) + 40
    cx, cy = (lx0 + lx1) / 2, (ly0 + ly1) / 2
    save("logo/pat-favicon.svg",
         f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="{cx - side / 2:.0f} {cy - side / 2:.0f} {side} {side}" '
         f'width="1024" height="1024"><title>PAT</title><rect x="{cx - side / 2:.0f}" y="{cy - side / 2:.0f}" '
         f'width="{side}" height="{side}" fill="#FFFFFF"/>{letters}</svg>',
         png=[180, 512], group="Logo", label="Favicon (letters only)")
    s, w = symbol((1024 - 860 * ASPECT) / 2, 82, 860)
    save("logo/pat-app-icon.svg", doc(s, 1024, 1024, bg=WHITE, title="PAT"), png=[400, 1024], group="Logo", label="App / profile icon")
    save("logo/pat-weave-device.svg", doc(weave(600, 380, 1150, -42.4, "upper"), 1200, 760, title="PAT weave device"),
         png=[1600], group="Logo", label="Weave device")
    save("logo/pat-weave-device-reverse.svg", doc(weave(600, 380, 1150, -42.4, "upper", "reverse"), 1200, 760, title="PAT weave device"),
         png=[1600], group="Logo", label="Weave device — on navy", dark=True)


# ------------------------------------------------------------------ stationery
CARD_W, CARD_H, CB = 85, 55, 3


def contact_lines(x, y, step, label_size, value_size, value_color, label_color, rows):
    out = []
    for label, value in rows:
        out.append(txt(label, cond(700), label_size, x, y, label_color, tracking=0.08)[0])
        out.append(txt(value, sans(500), value_size, x + label_size * 1.9, y, value_color)[0])
        y += step
    return "".join(out)


def card_front(name, title, rows):
    W, H, B = CARD_W + 2 * CB, CARD_H + 2 * CB, CB
    o = [weave(B + 72, B + 27, 84, -57, "upper", "color")]
    sym, sw = symbol(B + 6, B + 5.5, 11, "color")
    o.append(sym)
    wx = B + 6 + sw + 2.6
    o.append(txt("POWER AUTOMATION", cond(700), 3.3, wx, B + 10.1, NAVY, tracking=0.03)[0])
    o.append(txt("TEAM", cond(700), 3.3, wx, B + 13.9, NAVY, tracking=0.03)[0])
    o.append(txt(name.upper(), cond(700), 6.2, B + 6, B + 29.5, NAVY, tracking=0.01)[0])
    o.append(txt(title, sans(600), 2.7, B + 6, B + 34.1, ORANGE_TXT)[0])
    o.append(rect(B + 6, B + 36.1, 9, 0.6, ORANGE))
    o.append(contact_lines(B + 6, B + 40.6, 3.45, 2.35, 2.5, NAVY, ORANGE_TXT, rows))
    return doc("".join(o), W, H, units="mm", bg=WHITE, title=f"{name} — business card front")


def card_back():
    W, H, B = CARD_W + 2 * CB, CARD_H + 2 * CB, CB
    sym, sw = symbol((W - 22 * ASPECT) / 2, B + 9.5, 22, "reverse")
    a = txt("POWER AUTOMATION TEAM", cond(700), 4.1, W / 2, B + 38.2, WHITE, tracking=0.04, anchor="middle")[0]
    b = txt(NAME_AR, CAIRO, 3.9, W / 2, B + 43.6, WHITE, anchor="middle", wght=700)[0]
    c = txt(f"{TAGLINE} · SINCE 1991", cond(600), 2.2, W / 2, B + 48.6, ORANGE_ON_DARK, tracking=0.14, anchor="middle")[0]
    return doc(sym + a + b + c, W, H, units="mm", bg=NAVY, title="business card back")


PEOPLE = [
    dict(slug="ahdy-abu-malwa", name="Ahdy Abu-Malwa", title="Managing Director",
         rows=[("T", PHONE), ("E", EMAIL), ("W", WEB), ("A", "New Damietta, Egypt")]),
]


def build_stationery():
    W, H = CARD_W + 2 * CB, CARD_H + 2 * CB
    save("stationery/business-card-back.svg", card_back(), png=[1200], group="Stationery", label="Business card — back")
    for p in PEOPLE:
        rel = f"stationery/business-card-front-{p['slug']}.svg"
        save(rel, card_front(p["name"], p["title"], p["rows"]), png=[1200], group="Stationery", label=f"Business card — {p['name']}",
             pdf=dict(w=W, h=H, name=f"print/business-card-{p['slug']}-91x61mm-bleed.pdf",
                      pages=[rel, "stationery/business-card-back.svg"]))

    # A4 letterhead
    o = []
    lk, lw = lockup_h(18, 13, 21, "color")
    o.append(lk)
    y = 18.5
    for line in (PHONE, EMAIL, WEB):
        o.append(txt(line, sans(500), 3.0, 192, y, NAVY, anchor="end")[0])
        y += 4.6
    o.append(rect(18, 40, 174, 0.5, ORANGE))
    o.append(weave(201, 274, 96, -57, "upper", "color"))
    o.append(txt(f"{COMPANY} · {ADDRESS}", sans(500), 2.5, 18, 284, NAVY)[0])
    o.append(txt(NAME_AR, CAIRO, 3.0, 18, 289.6, NAVY, wght=700)[0])
    save("stationery/letterhead-a4.svg", doc("".join(o), 210, 297, units="mm", bg=WHITE, title="PAT letterhead"),
         png=[1240], group="Stationery", label="Letterhead A4",
         pdf=dict(w=210, h=297, name="print/letterhead-a4.pdf", pages=["stationery/letterhead-a4.svg"]))

    # DL envelope 220 x 110 (+3 bleed)
    B, W, H = 3, 226, 116
    o = [weave(B + 204, B + 10, 78, -57, "upper", "color")]
    lk, lw = lockup_h(B + 14, B + 11, 16, "color")
    o.append(lk)
    y = B + 92
    for line in (COMPANY, ADDRESS, f"{PHONE} · {EMAIL} · {WEB}"):
        o.append(txt(line, sans(500), 2.6, B + 14, y, SLATE)[0])
        y += 4
    save("stationery/envelope-dl.svg", doc("".join(o), W, H, units="mm", bg=WHITE, title="PAT DL envelope"),
         png=[1400], group="Stationery", label="Envelope DL",
         pdf=dict(w=W, h=H, name="print/envelope-dl-226x116mm-bleed.pdf", pages=["stationery/envelope-dl.svg"]))

    # A4 presentation folder, outer spread: back cover (left) + front cover (right), 220 x 310 each (+3 bleed)
    B, PW, PH = 3, 220, 310
    W, H = 2 * PW + 2 * B, PH + 2 * B
    fx = B + PW
    o = [clip(fx, 0, PW + B, H, weave(fx + 178, B + 236, 300, -57, "upper", "reverse"))]
    lk, _ = lockup_h(fx + 22, B + 26, 26, "reverse")
    o.append(lk)
    o.append(txt("COMMISSIONING", cond(800), 21, fx + 22, B + 96, WHITE)[0])
    o.append(txt("CONTROL SYSTEMS", cond(800), 21, fx + 22, B + 117, WHITE)[0])
    o.append(txt("SINCE 1991", cond(800), 21, fx + 22, B + 138, ORANGE_ON_DARK)[0])
    sym, sw = symbol(B + 22, B + 236, 20, "reverse")
    o.append(sym)
    y = B + 270
    for line in (COMPANY, ADDRESS, f"{PHONE} · {EMAIL}", WEB):
        o.append(txt(line, sans(500), 3.0, B + 22, y, WHITE)[0])
        y += 5
    save("stationery/folder-a4-outer.svg", doc("".join(o), W, H, units="mm", bg=NAVY, title="PAT folder outer"),
         png=[1800], group="Stationery", label="A4 folder — outside (back + front)",
         pdf=dict(w=W, h=H, name="print/folder-a4-outer-446x316mm-bleed.pdf", pages=["stationery/folder-a4-outer.svg"]))
    o = [clip(0, 0, B + PW, H, weave(B + 40, B + 30, 150, -57, "lower", "color"))]
    lk, _ = lockup_h(fx + 22, B + 20, 15, "color")
    o.append(lk)
    save("stationery/folder-a4-inner.svg", doc("".join(o), W, H, units="mm", bg=WHITE, title="PAT folder inner"),
         png=[1800], group="Stationery", label="A4 folder — inside",
         pdf=dict(w=W, h=H, name="print/folder-a4-inner-446x316mm-bleed.pdf", pages=["stationery/folder-a4-inner.svg"]))


# ------------------------------------------------------------------ ID badge + lanyard
def build_badge():
    B, W, H = 2, 58, 90
    o = [weave(B + 46, B + 5, 40, -57, "upper", "color")]
    sym, sw = symbol(B + 5, B + 5, 12, "color")
    o.append(sym)
    o.append(rect(B + 14.5, B + 21, 25, 31, SAND, rx=1.2, stroke=LINE, sw=0.3))
    o.append(txt("PHOTO", cond(600), 2.6, B + 27, B + 37.5, SLATE, tracking=0.2, anchor="middle")[0])
    o.append(txt("NAME SURNAME", cond(700), 4.6, B + 27, B + 59.5, NAVY, anchor="middle", tracking=0.02)[0])
    o.append(txt("Commissioning Engineer", sans(600), 2.6, B + 27, B + 64.2, ORANGE_TXT, anchor="middle")[0])
    o.append(txt("ID 0000", sans(500), 2.3, B + 27, B + 68.6, SLATE, anchor="middle")[0])
    o.append(rect(0, B + 74, W, H - B - 74, NAVY))
    o.append(txt("POWER AUTOMATION TEAM", cond(700), 3.4, W / 2, B + 79.6, WHITE, tracking=0.05, anchor="middle")[0])
    o.append(txt(WEB, cond(600), 2.4, W / 2, B + 83.4, ORANGE_ON_DARK, tracking=0.14, anchor="middle")[0])
    save("badge/id-badge-front.svg", doc("".join(o), W, H, units="mm", bg=WHITE, title="PAT ID badge front"),
         png=[700], group="ID badge", label="ID badge — front (CR80)",
         pdf=dict(w=W, h=H, name="print/id-badge-cr80-58x90mm-bleed.pdf", pages=["badge/id-badge-front.svg", "badge/id-badge-back.svg"]))
    o = []
    sym, sw = symbol((W - 22 * ASPECT) / 2, B + 12, 22, "reverse")
    o.append(sym)
    y = B + 50
    for line, size, col in (("If found, please return to", 2.3, ORANGE_ON_DARK), (COMPANY, 2.5, WHITE),
                            ("New Damietta, Egypt", 2.3, WHITE), (PHONE, 2.3, WHITE)):
        o.append(txt(line, sans(500), size, W / 2, y, col, anchor="middle")[0])
        y += 4
    o.append(txt(WEB, cond(700), 3.2, W / 2, B + 79, WHITE, tracking=0.1, anchor="middle")[0])
    save("badge/id-badge-back.svg", doc("".join(o), W, H, units="mm", bg=NAVY, title="PAT ID badge back"),
         png=[700], group="ID badge", label="ID badge — back")
    # Lanyard 900 x 20 mm, repeating unit
    o, x = [], 10
    while x < 880:
        sym, sw = symbol(x, 3, 14, "reverse")
        o.append(sym)
        t, tw = txt("POWER AUTOMATION TEAM", cond(700), 7, x + sw + 4, 12.6, WHITE, tracking=0.06)
        o.append(t)
        x += sw + 4 + tw + 26
    save("badge/lanyard-900x20mm.svg", doc("".join(o), 900, 20, units="mm", bg=NAVY, title="PAT lanyard"),
         png=[2400], group="ID badge", label="Lanyard 900 × 20 mm")


# ------------------------------------------------------------------ PPE, vehicle, signage
def build_field():
    # Hard-hat decal 58 x 56 mm (cut to the rounded rectangle)
    s, sw = symbol((58 - 48 * ASPECT) / 2, 4, 48, "color")
    save("ppe/hardhat-decal-58x56mm.svg", doc(rect(0, 0, 58, 56, WHITE, rx=6) + s, 58, 56, units="mm", title="Hard-hat decal"),
         png=[600], group="PPE", label="Hard-hat decal 58 × 56 mm")
    lk, lw = lockup_h(5, 5, 20, "color")
    save("ppe/hardhat-side-sticker-110x30mm.svg", doc(rect(0, 0, lw + 10, 30, WHITE, rx=4) + lk, round(lw + 10, 1), 30, units="mm",
         title="Hard-hat side sticker"), png=[1000], group="PPE", label="Hard-hat side sticker")
    lk, lw = lockup_h(0, 0, 30, "color", tagline=False)
    save("ppe/coverall-chest-light-90mm.svg", doc(lk, round(lw, 1), 30, units="mm", title="Coverall chest — light fabric"),
         png=[1000], group="PPE", label="Coverall chest — light fabric")
    lk, lw = lockup_h(0, 0, 30, "reverse", tagline=False)
    save("ppe/coverall-chest-navy-90mm.svg", doc(lk, round(lw, 1), 30, units="mm", title="Coverall chest — navy fabric"),
         png=[1000], group="PPE", label="Coverall chest — navy fabric", dark=True)
    lk, lh = lockup_v_fit(260, "reverse")
    save("ppe/coverall-back-navy-260mm.svg", doc(lk, 260, round(lh + 2), units="mm", title="Coverall back — navy fabric"),
         png=[1400], group="PPE", label="Coverall back — navy fabric", dark=True)
    lk, lh = lockup_v_fit(250, "navy")
    save("ppe/vest-back-navy-print-250mm.svg", doc(lk, 250, round(lh + 2), units="mm", title="Hi-vis vest back"),
         png=[1400], group="PPE", label="Hi-vis vest back (one colour)")

    # Vehicle
    lk, lw = lockup_h(0, 0, 200, "color")
    k = 600 / lw
    door = f'<g transform="scale({k:.5f})">{lk}</g>' + txt(f"{PHONE}  ·  {WEB}", cond(600), 34, 300, 270, NAVY,
                                                           tracking=0.06, anchor="middle")[0]
    save("vehicle/door-decal-600mm.svg", doc(door, 600, 290, units="mm", title="Vehicle door decal"),
         png=[1600], group="Vehicle", label="Door decal 600 mm")
    save("vehicle/rear-quarter-1200x900mm.svg",
         doc(clip(0, 0, 1200, 900, weave(780, 430, 1250, -57, "upper", "color")), 1200, 900, units="mm", title="Vehicle rear quarter graphic"),
         png=[1600], group="Vehicle", label="Rear-quarter graphic 1200 × 900 mm")
    line = f"POWER AUTOMATION TEAM   ·   {WEB}   ·   {PHONE}"
    size = fit_size(line, cond(700), 52, 1140, tracking=0.04)
    t = txt(line, cond(700), size, 600, 50 + size * 0.35, NAVY, tracking=0.04, anchor="middle")[0]
    save("vehicle/tailgate-1200x100mm.svg", doc(t, 1200, 100, units="mm", title="Tailgate strip"),
         png=[1600], group="Vehicle", label="Tailgate strip 1200 × 100 mm")

    # Signage
    lk, lw = lockup_h(0, 0, 200, "color")
    k = 2000 / lw
    save("signage/reception-lockup-2000mm.svg", doc(f'<g transform="scale({k:.5f})">{lk}</g>', 2000, round(204 * k), units="mm",
         title="Reception wall sign"), png=[2000], group="Signage", label="Reception wall sign — 2000 mm")
    W, H = 300, 200
    o = [rect(0, 0, W, H, WHITE), clip(0, 0, W, H, weave(272, 22, 150, -57, "upper", "color"))]
    lk, lw = lockup_h(22, 26, 38, "color")
    o.append(lk)
    y = 128
    for line, font, size, col in ((COMPANY, cond(700), 11, NAVY), ("New Damietta, Second District,", sans(500), 8, SLATE),
                                  ("adjacent to 6 Al Bahr Street, Egypt", sans(500), 8, SLATE), (f"{PHONE}  ·  {WEB}", sans(600), 8, ORANGE_TXT)):
        o.append(txt(line, font, size, 22, y, col)[0])
        y += 13 if font == cond(700) else 11
    o.append(rect(0, H - 6, W, 6, NAVY))
    save("signage/entrance-plate-300x200mm.svg", doc("".join(o), W, H, units="mm", title="Entrance plate"),
         png=[1500], group="Signage", label="Entrance plate 300 × 200 mm",
         pdf=dict(w=W, h=H, name="print/entrance-plate-300x200mm.pdf", pages=["signage/entrance-plate-300x200mm.svg"]))


# ------------------------------------------------------------------ roll-up banner
SERVICES = ["DCS Engineering & Commissioning", "PLC Programming & Integration", "Commissioning & Start-up",
            "I&C and Electrical Commissioning", "Training & Development", "Technical Staffing & Manpower",
            "Troubleshooting & Emergency Support"]


def build_rollup():
    B, W, H = 3, 856, 2006
    o = [clip(0, 0, W, H, weave(B + 700, B + 1500, 900, -57, "upper", "color"))]
    lk, lw = lockup_h(B + 70, B + 80, 118, "color")
    o.append(lk)
    y = B + 380
    for line, col in (("COMMISSIONING", NAVY), ("CONTROL SYSTEMS", NAVY), ("SINCE 1991", ORANGE_TXT)):
        o.append(txt(line, cond(800), 112, B + 70, y, col)[0])
        y += 116
    sub = wrap("DCS site services, loop checks, commissioning, start-up and operator training for power plants.", sans(500), 30, 640)
    y = B + 680
    for line in sub:
        o.append(txt(line, sans(500), 30, B + 70, y, SLATE)[0])
        y += 42
    y = B + 860
    stats = (("1991", "ESTABLISHED"), ("28", "REFERENCE PROJECTS"), ("3", "COUNTRIES"))
    x = B + 70
    for value, label in stats:
        o.append(txt(value, cond(800), 96, x, y, NAVY)[0])
        o.append(txt(label, cond(600), 22, x + 2, y + 36, ORANGE_TXT, tracking=0.12)[0])
        x += 240
    y = B + 1010
    for s in SERVICES:
        o.append(rect(B + 70, y - 19, 14, 14, ORANGE))
        o.append(txt(s, cond(600), 36, B + 100, y, NAVY)[0])
        y += 56
    o.append(rect(0, B + 1830, W, H - B - 1830, NAVY))
    o.append(txt(WEB, cond(800), 64, B + 70, B + 1912, WHITE, tracking=0.03)[0])
    o.append(txt(f"{PHONE}   ·   {EMAIL}", sans(500), 28, B + 70, B + 1960, WHITE)[0])
    sym, sw = symbol(W - B - 70 - 120 * ASPECT, B + 1858, 120, "reverse")
    o.append(sym)
    save("rollup/rollup-850x2000mm.svg", doc("".join(o), W, H, units="mm", bg=WHITE, title="PAT roll-up banner"),
         png=[900], group="Roll-up", label="Roll-up 850 × 2000 mm",
         pdf=dict(w=W, h=H, name="print/rollup-850x2000mm-bleed.pdf", pages=["rollup/rollup-850x2000mm.svg"]))


# ------------------------------------------------------------------ social + presentation + covers
def build_social():
    # LinkedIn personal profile background 1584 x 396
    o = [weave(1440, 205, 820, -57, "upper", "reverse")]
    o.append(txt("DCS COMMISSIONING & SITE SERVICES", cond(800), 54, 380, 190, WHITE, tracking=0.01)[0])
    o.append(txt("EGYPT · SAUDI ARABIA · OMAN · SINCE 1991", cond(600), 26, 382, 234, ORANGE_ON_DARK, tracking=0.12)[0])
    save("social/linkedin-cover-1584x396.svg", doc(clip(0, 0, 1584, 396, "".join(o)), 1584, 396, bg=NAVY, title="LinkedIn cover"),
         png=[1584], group="Social", label="LinkedIn profile cover 1584 × 396")
    # LinkedIn company page cover 1128 x 191
    o = [weave(980, 95, 520, -57, "upper", "reverse")]
    o.append(txt("DCS COMMISSIONING & SITE SERVICES", cond(800), 34, 250, 92, WHITE)[0])
    o.append(txt("EGYPT · SAUDI ARABIA · OMAN · SINCE 1991", cond(600), 17, 251, 120, ORANGE_ON_DARK, tracking=0.12)[0])
    save("social/linkedin-company-cover-1128x191.svg", doc(clip(0, 0, 1128, 191, "".join(o)), 1128, 191, bg=NAVY,
         title="LinkedIn company cover"), png=[1128], group="Social", label="LinkedIn company cover 1128 × 191")

    S = 1080
    # Post: project highlight
    o = [clip(0, 0, S, S, weave(930, 120, 620, -57, "upper", "reverse"))]
    o.append(txt("PROJECT REFERENCE", cond(600), 32, 90, 330, ORANGE_ON_DARK, tracking=0.16)[0])
    o.append(txt("2,000", cond(800), 260, 82, 560, WHITE)[0])
    o.append(txt("MW", cond(700), 80, 92 + width("2,000", cond(800), 260) + 6, 560, ORANGE_ON_DARK)[0])
    o.append(txt("SUR IPP-CCPP · OMAN · 2014", cond(700), 54, 90, 660, WHITE, tracking=0.02)[0])
    y = 730
    for line in wrap("New Ovation DCS — Automatic Plant Start check and modification, systems commissioning and start-up.",
                     sans(500), 34, 860):
        o.append(txt(line, sans(500), 34, 90, y, WHITE, opacity=0.85)[0])
        y += 48
    lk, _ = lockup_h(90, 930, 70, "reverse", tagline=False)
    o.append(lk)
    o.append(txt(WEB, cond(600), 30, 990, 985, WHITE, tracking=0.1, anchor="end")[0])
    save("social/post-project-1080.svg", doc("".join(o), S, S, bg=NAVY, title="Post — project"),
         png=[1080], group="Social", label="Post template — project")
    # Post: what we do
    o = [clip(0, 0, S, S, weave(930, 930, 640, -57, "upper", "color"))]
    y = 300
    for word in ("LOOP CHECKS", "START-UP", "PUNCH LISTS"):
        t, w = txt(word, cond(800), 128, 90, y, NAVY)
        o.append(t)
        o.append(txt(".", cond(800), 128, 90 + w + 4, y, ORANGE)[0])
        y += 132
    y = 640
    for line in wrap("The commissioning team EPC contractors and system vendors call — since 1991.", sans(500), 38, 640):
        o.append(txt(line, sans(500), 38, 90, y, SLATE)[0])
        y += 52
    lk, _ = lockup_h(90, 920, 76, "color", tagline=False)
    o.append(lk)
    save("social/post-services-1080.svg", doc("".join(o), S, S, bg=WHITE, title="Post — services"),
         png=[1080], group="Social", label="Post template — services")
    # Post: since 1991
    o = [clip(0, 0, S, S, weave(950, 140, 560, -57, "upper", "color"))]
    o.append(txt("SINCE", cond(700), 80, 90, 400, ORANGE_TXT, tracking=0.08)[0])
    o.append(txt("1991", cond(800), 330, 80, 690, NAVY)[0])
    y = 780
    for line in wrap("28 reference projects across Egypt, Saudi Arabia and Oman.", sans(500), 40, 760):
        o.append(txt(line, sans(500), 40, 90, y, SLATE)[0])
        y += 54
    lk, _ = lockup_h(90, 930, 70, "color", tagline=False)
    o.append(lk)
    save("social/post-since-1991-1080.svg", doc("".join(o), S, S, bg=SAND, title="Post — since 1991"),
         png=[1080], group="Social", label="Post template — since 1991")


def build_presentation():
    W, H = 1920, 1080
    o = [clip(0, 0, W, H, weave(1790, 560, 1180, -57, "upper", "color"))]
    lk, _ = lockup_h(110, 90, 96, "color")
    o.append(lk)
    o.append(txt("POWER AUTOMATION TEAM", cond(800), 116, 110, 600, NAVY)[0])
    o.append(txt("Commissioning control systems since 1991", sans(500), 46, 114, 680, ORANGE_TXT)[0])
    o.append(rect(114, 720, 120, 8, ORANGE))
    o.append(txt(f"{WEB}  ·  Egypt · Saudi Arabia · Oman", sans(500), 30, 114, 990, SLATE)[0])
    save("presentation/title-slide-1920x1080.svg", doc("".join(o), W, H, bg=WHITE, title="Title slide"),
         png=[1920], group="Presentation", label="Title slide")
    o = [clip(0, 0, W, H, weave(1640, 520, 1250, -57, "upper", "reverse"))]
    o.append(txt("THANK YOU", cond(800), 190, 110, 500, WHITE)[0])
    y = 620
    for line in (PHONE, EMAIL, WEB):
        o.append(txt(line, sans(500), 44, 114, y, WHITE)[0])
        y += 62
    lk, _ = lockup_h(110, 880, 110, "reverse")
    o.append(lk)
    save("presentation/closing-slide-1920x1080.svg", doc("".join(o), W, H, bg=NAVY, title="Closing slide"),
         png=[1920], group="Presentation", label="Closing slide")
    # Company profile cover, A4 (+3 bleed)
    B, W, H = 3, 216, 303
    o = [clip(0, 0, W, H, weave(B + 172, B + 238, 230, -57, "upper", "reverse"))]
    lk, _ = lockup_h(B + 20, B + 22, 24, "reverse")
    o.append(lk)
    o.append(txt("COMPANY", cond(800), 30, B + 20, B + 120, WHITE)[0])
    o.append(txt("PROFILE", cond(800), 30, B + 20, B + 150, WHITE)[0])
    o.append(rect(B + 20, B + 160, 24, 1.6, ORANGE))
    o.append(txt("DCS & Instruments Specialists — since 1991", sans(500), 6, B + 20, B + 172, ORANGE_ON_DARK)[0])
    o.append(txt(WEB, cond(700), 6, B + 20, B + 282, WHITE, tracking=0.08)[0])
    save("presentation/profile-cover-a4.svg", doc("".join(o), W, H, units="mm", bg=NAVY, title="Company profile cover"),
         png=[1240], group="Presentation", label="Company profile cover A4",
         pdf=dict(w=W, h=H, name="print/profile-cover-a4-216x303mm-bleed.pdf", pages=["presentation/profile-cover-a4.svg"]))


# ------------------------------------------------------------------ merchandise
def build_merch():
    B, W, H = 2, 204, 89  # mug wrap 200 x 85 mm (+2 bleed)
    o = [clip(0, 0, W, H, weave(B + 176, B + 40, 120, -57, "upper", "color"))]
    lk, _ = lockup_h(B + 14, B + 30, 24, "color")
    o.append(lk)
    save("merch/mug-wrap-200x85mm.svg", doc("".join(o), W, H, units="mm", bg=WHITE, title="Mug wrap"),
         png=[1400], group="Merchandise", label="Mug wrap 200 × 85 mm")
    B, W, H = 3, 154, 216  # A5 notebook cover (+3 bleed)
    o = [clip(0, 0, W, H, weave(B + 110, B + 168, 150, -57, "upper", "reverse"))]
    sym, sw = symbol((W - 44 * ASPECT) / 2, B + 30, 44, "reverse")
    o.append(sym)
    o.append(txt("POWER AUTOMATION TEAM", cond(700), 7, W / 2, B + 88, WHITE, tracking=0.04, anchor="middle")[0])
    save("merch/notebook-a5-cover.svg", doc("".join(o), W, H, units="mm", bg=NAVY, title="Notebook cover"),
         png=[900], group="Merchandise", label="Notebook A5 cover")
    lk, lh = lockup_v_fit(250, "navy")
    save("merch/tote-print-250mm.svg", doc(lk, 250, round(lh + 2), units="mm", title="Tote bag print"),
         png=[1200], group="Merchandise", label="Tote bag print (one colour)")
    # Sticker sheet A5 with cut lines
    W, H = 148, 210
    o = [rect(8, 8, 64, 62, WHITE, rx=6, stroke=LINE, sw=0.3), symbol(13, 12, 54, "color")[0]]
    lk, lw = lockup_h(0, 0, 22, "color")
    o += [rect(8, 80, lw + 10, 32, WHITE, rx=5, stroke=LINE, sw=0.3), f'<g transform="translate(13 85)">{lk}</g>']
    o.append(rect(8, 122, 132, 30, NAVY, rx=5))
    o.append(symbol(14, 126, 22, "reverse")[0])
    o.append(txt("COMMISSIONED BY PAT", cond(800), 9.5, 14 + 22 * ASPECT + 5, 140, WHITE, tracking=0.04)[0])
    o.append(rect(8, 160, 42, 42, NAVY, rx=21))
    o.append(symbol(29 - 26 * ASPECT / 2, 168, 26, "reverse")[0])
    o.append(rect(58, 160, 42, 42, WHITE, rx=21, stroke=LINE, sw=0.3))
    o.append(symbol(79 - 26 * ASPECT / 2, 168, 26, "color")[0])
    save("merch/sticker-sheet-a5.svg", doc("".join(o), W, H, units="mm", bg=SAND, title="Sticker sheet"),
         png=[900], group="Merchandise", label="Sticker sheet A5 (grey lines = cut)",
         pdf=dict(w=W, h=H, name="print/sticker-sheet-a5.pdf", pages=["merch/sticker-sheet-a5.svg"]))


# ------------------------------------------------------------------ brand board
def build_board():
    W, H = 1920, 1080
    o = []
    o.append(txt("PAT — BRAND IDENTITY", cond(800), 56, 80, 110, NAVY, tracking=0.02)[0])
    o.append(txt(f"{COMPANY}  ·  {TAGLINE}  ·  SINCE 1991", cond(600), 22, 82, 146, ORANGE_TXT, tracking=0.12)[0])
    o.append(rect(80, 180, 800, 820, SAND))
    o.append(symbol(480 - 600 * ASPECT / 2, 290, 600, "color")[0])
    o.append(rect(940, 180, 440, 300, NAVY))
    o.append(symbol(1160 - 220 * ASPECT / 2, 220, 220, "reverse")[0])
    o.append(rect(1400, 180, 440, 300, WHITE, stroke=LINE, sw=2))
    lk, lw = lockup_h(0, 0, 76, "color")
    o.append(f'<g transform="translate({1620 - lw / 2:.1f} 292)">{lk}</g>')
    sw_ = [(NAVY, "NAVY", "#102840"), (ORANGE, "ORANGE", "#E05826"), (BLUE, "STEEL BLUE", "#2A7CAC"),
           (ORANGE_TXT, "ORANGE TEXT", "#B8441A"), (SAND, "SAND", "#F3F2EE"), (SLATE, "SLATE", "#3B5368")]
    x = 940
    for col, name, hx in sw_:
        o.append(rect(x, 520, 135, 110, col, stroke=LINE if col == SAND else None, sw=2))
        o.append(txt(name, cond(700), 20, x, 662, NAVY, tracking=0.06)[0])
        o.append(txt(hx, sans(500), 18, x, 688, SLATE)[0])
        x += 150
    o.append(txt("COMMISSIONING SINCE 1991", cond(800), 54, 940, 786, NAVY)[0])
    o.append(txt("Barlow Condensed — headings", sans(500), 22, 942, 818, SLATE)[0])
    o.append(txt(NAME_AR, CAIRO, 34, 1840, 782, NAVY, anchor="end", wght=800)[0])
    o.append(txt("Cairo — Arabic", sans(500), 22, 1840, 818, SLATE, anchor="end")[0])
    o.append(txt("Barlow — body text for documents, web and forms.", sans(500), 28, 940, 870, NAVY)[0])
    o.append(clip(940, 915, 900, 85, rect(940, 915, 900, 85, NAVY) + weave(1660, 957, 300, -57, "upper", "reverse")))
    o.append(txt("GRAPHIC DEVICE — THE WEAVE", cond(700), 24, 966, 966, WHITE, tracking=0.08)[0])
    save("board/brand-board-1920x1080.svg", doc("".join(o), W, H, bg=WHITE, title="PAT brand board"),
         png=[1920], group="Brand board", label="Brand board",
         pdf=dict(w=508, h=285.75, name="print/brand-board.pdf", pages=["board/brand-board-1920x1080.svg"]))


if __name__ == "__main__":
    build_logos()
    build_stationery()
    build_badge()
    build_field()
    build_rollup()
    build_social()
    build_presentation()
    build_merch()
    build_board()
    with open(os.path.join(HERE, "manifest.json"), "w") as f:
        json.dump(MANIFEST, f, indent=1)
    print(f"{len(MANIFEST)} files")
