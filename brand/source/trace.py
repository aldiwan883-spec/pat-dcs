import re, sys, numpy as np, vtracer
from PIL import Image, ImageFilter
SRC = "pat-logo-source.png"
SCALE = 4
pal = {"navy": (16, 40, 64), "blue": (42, 124, 172), "orange": (224, 88, 38), "white": (248, 248, 248)}
im = Image.open(SRC).convert("RGB")
im = im.resize((im.width * SCALE, im.height * SCALE), Image.LANCZOS).filter(ImageFilter.GaussianBlur(1.2))
a = np.array(im).astype(float)
names = list(pal)
d = np.stack([((a - np.array(pal[n])) ** 2).sum(-1) for n in names], -1)
lab = d.argmin(-1)
paths = {}
for i, n in enumerate(names):
    if n == "white": continue
    m = (lab == i)
    img = Image.fromarray(np.where(m, 0, 255).astype(np.uint8)).filter(ImageFilter.MedianFilter(5))
    img.save(f"mask-{n}.png")
    vtracer.convert_image_to_svg_py(f"mask-{n}.png", f"trace-{n}.svg", colormode="binary",
        filter_speckle=40, corner_threshold=60, length_threshold=6.0, splice_threshold=45,
        path_precision=2, mode="spline")
    svg = open(f"trace-{n}.svg").read()
    paths[n] = re.findall(r'<path d="([^"]+)"[^>]*transform="translate\(([-\d.]+),([-\d.]+)\)"', svg) or \
               [(p, "0", "0") for p in re.findall(r'<path d="([^"]+)"', svg)]
    print(n, len(paths[n]), "paths")
W, H = im.size
fill = {"navy": "#102840", "blue": "#2A7CAC", "orange": "#E05826"}
body = ""
for n in ("orange", "blue", "navy"):
    for d_, tx, ty in paths[n]:
        body += f'<path fill="{fill[n]}" transform="translate({tx},{ty})" d="{d_}"/>'
open("traced-full.svg", "w").write(f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {W} {H}">{body}</svg>')
print(W, H)
