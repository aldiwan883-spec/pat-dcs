"""Vectorise the chosen PAT logo: stripes as smooth splines, letters as crisp polygons."""
import re, numpy as np, vtracer
from PIL import Image, ImageFilter
from scipy import ndimage

def trace(mask, name, mode, **kw):
    Image.fromarray(np.where(mask, 0, 255).astype(np.uint8)).save(f"m-{name}.png")
    vtracer.convert_image_to_svg_py(f"m-{name}.png", f"t-{name}.svg", colormode="binary", mode=mode, **kw)
    svg = open(f"t-{name}.svg").read()
    out = []
    for d, tx, ty in re.findall(r'<path d="([^"]+)"[^>]*?transform="translate\(([-\d.]+),([-\d.]+)\)"', svg):
        out.append((d.strip(), float(tx), float(ty)))
    return out

masks = {n: np.array(Image.open(f"mask-{n}.png")) < 128 for n in ("navy", "blue", "orange")}
lab, n = ndimage.label(masks["navy"])
objs = ndimage.find_objects(lab)
sizes = ndimage.sum(masks["navy"], lab, range(1, n + 1))
letters = np.zeros_like(masks["navy"])
for i, (sl, sz) in enumerate(zip(objs, sizes), 1):
    h = sl[0].stop - sl[0].start; w = sl[1].stop - sl[1].start
    if sz / (h * w) > 0.3 and sz > 100000:
        letters |= lab == i
stripes_navy = masks["navy"] & ~letters

spline = dict(filter_speckle=40, corner_threshold=60, length_threshold=6.0, splice_threshold=45, path_precision=1)
poly = dict(filter_speckle=40, corner_threshold=60, length_threshold=8.0, splice_threshold=45, path_precision=1)
layers = {
    "orange": trace(masks["orange"], "orange", "spline", **spline),
    "blue": trace(masks["blue"], "blue", "spline", **spline),
    "navy": trace(stripes_navy, "navy-stripes", "spline", **spline),
    "letters": trace(letters, "letters", "polygon", **poly),
}
ys, xs = np.nonzero(masks["navy"] | masks["blue"] | masks["orange"])
x0, y0, x1, y1 = xs.min(), ys.min(), xs.max(), ys.max()
pad = 8
import json
json.dump({k: v for k, v in layers.items()}, open("layers.json", "w"))
json.dump({"bbox": [int(x0 - pad), int(y0 - pad), int(x1 - x0 + 2 * pad), int(y1 - y0 + 2 * pad)]}, open("bbox.json", "w"))
print({k: len(v) for k, v in layers.items()}, (x0, y0, x1, y1))
