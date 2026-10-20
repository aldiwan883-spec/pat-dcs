"""Shape text with HarfBuzz and return SVG path data (outlines, no fonts needed)."""
import io
import uharfbuzz as hb
from fontTools.ttLib import TTFont
from fontTools.pens.svgPathPen import SVGPathPen
from fontTools.pens.transformPen import TransformPen
from fontTools.varLib import instancer

_cache = {}

def load(path, wght=None):
    key = (path, wght)
    if key in _cache:
        return _cache[key]
    f = TTFont(path)
    if wght is not None and "fvar" in f:
        f = instancer.instantiateVariableFont(f, {"wght": wght})
    buf = io.BytesIO(); f.flavor = None; f.save(buf)
    data = buf.getvalue()
    tt = TTFont(io.BytesIO(data))
    face = hb.Face(data); font = hb.Font(face)
    _cache[key] = (tt, font, tt["head"].unitsPerEm)
    return _cache[key]

def text_path(path, text, size, x=0.0, y=0.0, tracking=0.0, wght=None, anchor="start"):
    """Returns (d, width). y is the baseline. tracking in em."""
    tt, font, upem = load(path, wght)
    buf = hb.Buffer(); buf.add_str(text); buf.guess_segment_properties()
    hb.shape(font, buf, {"kern": True, "liga": True})
    s = size / upem
    order = tt.getGlyphOrder(); gs = tt.getGlyphSet()
    track = tracking * size
    n = len(buf.glyph_infos)
    width = sum(p.x_advance for p in buf.glyph_positions) * s + track * (n - 1)
    if anchor == "middle": x -= width / 2
    elif anchor == "end": x -= width
    pen = SVGPathPen(gs)
    cx = x
    for info, pos in zip(buf.glyph_infos, buf.glyph_positions):
        name = order[info.codepoint]
        t = TransformPen(pen, (s, 0, 0, -s, cx + pos.x_offset * s, y - pos.y_offset * s))
        gs[name].draw(t)
        cx += pos.x_advance * s + track
    return pen.getCommands(), width
