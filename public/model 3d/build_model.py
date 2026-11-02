"""
Génère dans Blender un buste 3D stylisé (style Pixar) inspiré de model.webp.

Utilisation (depuis ce dossier) :
  blender --background --python build_model.py -- [chemin_rendu.png]
Le fichier model.blend est enregistré à côté du script.
"""
import bpy, bmesh, math, sys, os
import numpy as np
from mathutils import Vector, Matrix
from mathutils.bvhtree import BVHTree

HERE = os.path.dirname(os.path.abspath(__file__))
argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
RENDER_PATH = argv[0] if argv else os.path.join(HERE, "rendu.png")

# ---------------------------------------------------------------- utilitaires
def clean_scene():
    bpy.ops.wm.read_factory_settings(use_empty=True)

def smoothstep(a, b, x):
    t = max(0.0, min(1.0, (x - a) / (b - a)))
    return t * t * (3 - 2 * t)

def lerp(a, b, t):
    return a + (b - a) * t

def interp(table, x):
    """Interpolation linéaire dans une table [(x, y), ...] triée."""
    if x <= table[0][0]:
        return table[0][1]
    for (x0, y0), (x1, y1) in zip(table, table[1:]):
        if x <= x1:
            return lerp(y0, y1, (x - x0) / (x1 - x0))
    return table[-1][1]

def mesh_obj(name, bm, mat=None, smooth=True):
    me = bpy.data.meshes.new(name)
    bm.to_mesh(me)
    if smooth:
        for p in me.polygons:
            p.use_smooth = True
    ob = bpy.data.objects.new(name, me)
    bpy.context.collection.objects.link(ob)
    if mat:
        ob.data.materials.append(mat)
    return ob

def front_y(bm, x, z):
    """Position Y de la surface avant du maillage au point (x, z)."""
    bm.verts.ensure_lookup_table()
    tree = BVHTree.FromBMesh(bm)
    hit = tree.ray_cast(Vector((x, -10, z)), Vector((0, 1, 0)))
    return hit[0].y if hit[0] else 0.0

def side_x(bm, y, z, sign):
    tree = BVHTree.FromBMesh(bm)
    hit = tree.ray_cast(Vector((10 * sign, y, z)), Vector((-sign, 0, 0)))
    return hit[0].x if hit[0] else 0.6 * sign

# ---------------------------------------------------------------- matériaux
def principled(name, color, rough=0.5, **kw):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    b = m.node_tree.nodes["Principled BSDF"]
    b.inputs["Base Color"].default_value = (*color, 1)
    b.inputs["Roughness"].default_value = rough
    for k, v in kw.items():
        b.inputs[k].default_value = v
    return m, b

def skin_material():
    m, b = principled("Peau", (0.15, 0.06, 0.03), rough=0.55)
    nt = m.node_tree
    b.inputs["Subsurface Weight"].default_value = 0.25
    b.inputs["Subsurface Radius"].default_value = (1.0, 0.35, 0.15)
    b.inputs["Subsurface Scale"].default_value = 0.08
    b.inputs["Specular IOR Level"].default_value = 0.35
    b.inputs["Coat Weight"].default_value = 0.0
    b.inputs["Coat Roughness"].default_value = 0.35
    # couleur issue des couleurs de sommets (barbe, lèvres...)
    attr = nt.nodes.new("ShaderNodeVertexColor")
    attr.layer_name = "Col"
    # petit grain de peau
    noise = nt.nodes.new("ShaderNodeTexNoise")
    noise.inputs["Scale"].default_value = 180
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.04
    nt.links.new(noise.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    nt.links.new(attr.outputs["Color"], b.inputs["Base Color"])
    return m

def hair_material():
    m, b = principled("Cheveux", (0.025, 0.016, 0.012), rough=0.85)
    nt = m.node_tree
    noise = nt.nodes.new("ShaderNodeTexVoronoi")
    noise.feature = "DISTANCE_TO_EDGE"
    noise.inputs["Scale"].default_value = 70
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 1.0
    bump.inputs["Distance"].default_value = 0.02
    nt.links.new(noise.outputs["Distance"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m

def eye_material():
    """Sclérotique / iris / pupille calculés selon l'angle autour de -Y local."""
    m, b = principled("Oeil", (0.8, 0.78, 0.75), rough=0.05)
    nt = m.node_tree
    tc = nt.nodes.new("ShaderNodeTexCoord")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nrm = nt.nodes.new("ShaderNodeVectorMath"); nrm.operation = "NORMALIZE"
    nt.links.new(tc.outputs["Object"], nrm.inputs[0])
    nt.links.new(nrm.outputs["Vector"], sep.inputs[0])
    # cos(angle) ~ -y (rayon 1)
    neg = nt.nodes.new("ShaderNodeMath"); neg.operation = "MULTIPLY"
    neg.inputs[1].default_value = -1
    nt.links.new(sep.outputs["Y"], neg.inputs[0])
    ramp = nt.nodes.new("ShaderNodeValToRGB")
    cr = ramp.color_ramp
    cr.interpolation = "LINEAR"
    cr.elements[1].position = 1.0
    cr.elements[1].color = (0.004, 0.003, 0.003, 1)                 # pupille
    cr.elements[0].position = 0.80
    cr.elements[0].color = (0.62, 0.57, 0.53, 1)                    # blanc de l'oeil
    e = cr.elements.new(0.815); e.color = (0.012, 0.006, 0.004, 1)  # limbe
    e = cr.elements.new(0.84); e.color = (0.09, 0.035, 0.012, 1)    # iris brun
    e = cr.elements.new(0.925); e.color = (0.30, 0.13, 0.045, 1)
    e = cr.elements.new(0.94); e.color = (0.004, 0.003, 0.003, 1)
    nt.links.new(neg.outputs[0], ramp.inputs["Fac"])
    nt.links.new(ramp.outputs["Color"], b.inputs["Base Color"])
    b.inputs["Roughness"].default_value = 0.35
    b.inputs["Coat Weight"].default_value = 0.6
    b.inputs["Coat Roughness"].default_value = 0.03
    return m

def sweater_material():
    m, b = principled("Tshirt", (0.70, 0.12, 0.15), rough=0.95)
    nt = m.node_tree
    b.inputs["Sheen Weight"].default_value = 0.25
    b.inputs["Sheen Tint"].default_value = (1, 0.75, 0.75, 1)
    # texture tricot
    wave = nt.nodes.new("ShaderNodeTexNoise")
    wave.inputs["Scale"].default_value = 120
    bump = nt.nodes.new("ShaderNodeBump")
    bump.inputs["Strength"].default_value = 0.15
    nt.links.new(wave.outputs["Fac"], bump.inputs["Height"])
    nt.links.new(bump.outputs["Normal"], b.inputs["Normal"])
    return m

def add_white_fade(m, bsdf, z0=-1.9, z1=-3.0):
    nt = m.node_tree
    out = nt.nodes["Material Output"]
    geo = nt.nodes.new("ShaderNodeNewGeometry")
    sep = nt.nodes.new("ShaderNodeSeparateXYZ")
    nt.links.new(geo.outputs["Position"], sep.inputs[0])
    mr = nt.nodes.new("ShaderNodeMapRange")
    mr.inputs["From Min"].default_value = z0
    mr.inputs["From Max"].default_value = z1
    nt.links.new(sep.outputs["Z"], mr.inputs["Value"])
    # accentue un peu le fondu sur les côtés
    absx = nt.nodes.new("ShaderNodeMath"); absx.operation = "ABSOLUTE"
    nt.links.new(sep.outputs["X"], absx.inputs[0])
    mrx = nt.nodes.new("ShaderNodeMapRange")
    mrx.inputs["From Min"].default_value = 1.6
    mrx.inputs["From Max"].default_value = 2.3
    nt.links.new(absx.outputs[0], mrx.inputs["Value"])
    mul = nt.nodes.new("ShaderNodeMath"); mul.operation = "MULTIPLY"
    nt.links.new(mrx.outputs[0], mul.inputs[0])
    mr2 = nt.nodes.new("ShaderNodeMapRange")
    mr2.inputs["From Min"].default_value = -1.0
    mr2.inputs["From Max"].default_value = -2.4
    nt.links.new(sep.outputs["Z"], mr2.inputs["Value"])
    nt.links.new(mr2.outputs[0], mul.inputs[1])
    mx = nt.nodes.new("ShaderNodeMath"); mx.operation = "MAXIMUM"
    nt.links.new(mr.outputs[0], mx.inputs[0])
    nt.links.new(mul.outputs[0], mx.inputs[1])
    em = nt.nodes.new("ShaderNodeEmission")
    em.inputs["Color"].default_value = (1, 1, 1, 1)
    mix = nt.nodes.new("ShaderNodeMixShader")
    nt.links.new(mx.outputs[0], mix.inputs["Fac"])
    nt.links.new(bsdf.outputs[0], mix.inputs[1])
    nt.links.new(em.outputs[0], mix.inputs[2])
    nt.links.new(mix.outputs[0], out.inputs["Surface"])

# ---------------------------------------------------------------- tête
HEAD_C = Vector((0, 0.0, 0.13))
HEAD_R = Vector((0.66, 0.80, 1.13))

def build_head_bm():
    bm = bmesh.new()
    bmesh.ops.create_icosphere(bm, subdivisions=7, radius=1.0)
    for v in bm.verts:
        u = v.co.copy()
        ry = HEAD_R.y * (0.92 if u.y < 0 else 1.12)   # visage plat, crâne profond
        rx = HEAD_R.x
        # mâchoire qui s'affine vers le menton
        if u.z < 0:
            rx *= 1 - 0.07 * smoothstep(0.0, 1.0, -u.z) - 0.20 * smoothstep(0.45, 1.0, -u.z)
            ry *= 1 - 0.10 * smoothstep(0.3, 1.0, -u.z)
            if u.y > 0:
                ry *= 1 - 0.25 * smoothstep(0.2, 0.9, -u.z)
        # sommet du crâne plus plat et plus large
        if u.z > 0.4:
            rx *= 1 + 0.10 * smoothstep(0.4, 0.95, u.z)
        z_scale = 1 - 0.06 * smoothstep(0.6, 1.0, u.z)
        v.co = Vector((u.x * rx, u.y * ry, u.z * HEAD_R.z * z_scale)) + HEAD_C
    bm.normal_update()
    return bm

P = None  # coordonnées des sommets de la tête (numpy) pendant la sculpture

def bump(bm, x, z, rx, rz, disp, ry=0.25):
    """Déplacement gaussien centré sur la surface avant en (x, z)."""
    near = (np.abs(P[:, 0] - x) < 0.03) & (np.abs(P[:, 2] - z) < 0.03) & (P[:, 1] < 0)
    if near.any():
        cy = P[near, 1].min()
    else:  # point hors du visage : sommet avant le plus proche
        d2 = (P[:, 0] - x) ** 2 + (P[:, 2] - z) ** 2 + 10 * (P[:, 1] > 0)
        cy = P[d2.argmin(), 1]
    d = P - np.array((x, cy, z))
    w = np.exp(-((d[:, 0] / rx) ** 2 + (d[:, 1] / ry) ** 2 + (d[:, 2] / rz) ** 2))
    w[P[:, 1] > cy + 0.3] = 0
    P[:] += w[:, None] * np.array(disp)

def sculpt_face(bm):
    global P
    bm.verts.ensure_lookup_table()
    P = np.array([v.co[:] for v in bm.verts])
    for s in (-1, 1):
        bump(bm, 0.32 * s, 0.43, 0.22, 0.08, (0, -0.05, 0))          # arcade
        bump(bm, 0.30 * s, 0.19, 0.17, 0.13, (0.0, 0.15, 0))          # orbites
        bump(bm, 0.45 * s, -0.02, 0.16, 0.15, (0.04 * s, -0.04, 0))   # pommettes
        bump(bm, 0.40 * s, -0.48, 0.15, 0.16, (-0.03 * s, 0.02, 0))   # joues creuses
        bump(bm, 0.60 * s, 0.45, 0.10, 0.15, (-0.02 * s, 0, 0))       # tempes
        bump(bm, 0.15 * s, -0.30, 0.075, 0.065, (0.045 * s, -0.075, 0))  # ailes du nez
        bump(bm, 0.19 * s, -0.33, 0.035, 0.05, (0, 0.03, 0))          # sillon narine
        bump(bm, 0.045 * s, -0.43, 0.025, 0.05, (0, -0.012, 0))       # colonnes du philtrum
        bump(bm, 0.27 * s, -0.57, 0.04, 0.04, (0, 0.03, 0))           # coins de la bouche
        bump(bm, 0.30 * s, 0.36, 0.16, 0.045, (0, -0.03, 0))          # paupière sup.
        bump(bm, 0.30 * s, 0.05, 0.13, 0.04, (0, -0.02, 0))           # paupière inf.
        bump(bm, 0.36 * s, -0.80, 0.18, 0.14, (0.03 * s, -0.02, 0))   # mâchoire
    bump(bm, 0, 0.38, 0.12, 0.10, (0, -0.03, 0))                      # glabelle
    bump(bm, 0, 0.02, 0.08, 0.28, (0, -0.10, 0))                      # arête du nez
    bump(bm, 0, -0.20, 0.12, 0.13, (0, -0.20, 0))                     # nez
    bump(bm, 0, -0.25, 0.10, 0.08, (0, -0.07, 0))                     # bout du nez
    bump(bm, 0, -0.34, 0.07, 0.03, (0, 0.03, 0))                      # columelle
    bump(bm, 0, -0.42, 0.14, 0.05, (0, 0.02, 0))                      # philtrum
    bump(bm, 0, -0.505, 0.22, 0.045, (0, -0.09, 0))                     # lèvre sup.
    bump(bm, 0, -0.562, 0.26, 0.012, (0, 0.035, 0))                     # commissure
    bump(bm, 0, -0.625, 0.19, 0.05, (0, -0.085, 0))                     # lèvre inf.
    bump(bm, 0, -0.74, 0.18, 0.04, (0, 0.025, 0))                     # sillon
    bump(bm, 0, -0.90, 0.20, 0.12, (0, -0.06, 0))                     # menton
    for v, co in zip(bm.verts, P):
        v.co = co
    bm.normal_update()

def paint_head(bm, me):
    """Couleurs de sommets : teint, barbe de quelques jours, lèvres."""
    skin = Vector((0.24, 0.095, 0.05))
    skin_light = Vector((0.30, 0.125, 0.068))
    beard = Vector((0.07, 0.032, 0.02))
    lips = Vector((0.13, 0.042, 0.035))
    col = me.color_attributes.new("Col", "FLOAT_COLOR", "POINT")
    for i, v in enumerate(me.vertices):
        x, y, z = v.co
        front = smoothstep(0.0, 0.35, -y)
        c = skin.copy()
        # front et pommettes un peu plus clairs
        c = c.lerp(skin_light, 0.6 * math.exp(-((x / 0.4) ** 2 + ((z - 0.55) / 0.25) ** 2)))
        # barbe : contour bouche + menton + ligne de mâchoire
        bx = abs(x)
        stub = 0.0
        stub = max(stub, math.exp(-((bx / 0.26) ** 2 + ((z + 0.45) / 0.04) ** 2)))  # moustache
        stub = max(stub, math.exp(-((bx / 0.16) ** 2 + ((z + 0.80) / 0.13) ** 2)))  # bouc
        jaw = smoothstep(-0.62, -0.85, z) * smoothstep(0.1, 0.35, bx)
        stub = max(stub, 0.7 * jaw)
        stub *= 0.55
        c = c.lerp(beard, stub)
        lip = math.exp(-((x / 0.25) ** 4 + ((z + 0.565) / 0.095) ** 4)) * front
        c = c.lerp(lips, lip)
        col.data[i].color = (*c, 1)

def build_hair(head_bm, mat):
    bm = head_bm.copy()
    def hairline(v):
        theta = math.atan2(abs(v.co.x), -v.co.y)  # 0 = devant, pi = derrière
        return interp([(0.0, 0.84), (0.6, 0.82), (0.95, 0.74), (1.2, 0.58),
                       (1.6, 0.46), (1.85, 0.05), (2.3, -0.26), (math.pi, -0.30)], theta)
    for v in bm.verts:
        m = smoothstep(-0.03, 0.03, v.co.z - hairline(v))
        t = smoothstep(0.4, 1.2, v.co.z)
        v.co += v.normal * (lerp(-0.04, 0.04 + 0.06 * t, m))
    ob = mesh_obj("Cheveux", bm, mat)
    return ob

def build_brows(head_bm, mat):
    for s in (-1, 1):
        cu = bpy.data.curves.new("Sourcil", "CURVE"); cu.dimensions = "3D"
        cu.bevel_depth = 0.034; cu.bevel_resolution = 4
        sp = cu.splines.new("POLY")
        n = 14
        sp.points.add(n - 1)
        for i, pt in enumerate(sp.points):
            t = i / (n - 1)                                  # 0 côté nez -> 1 tempe
            x = (0.10 + 0.36 * t) * s
            z = 0.425 + 0.05 * math.sin(math.pi * t * 0.75) - 0.04 * max(t - 0.75, 0) / 0.25
            y = front_y(head_bm, x, z) + 0.012
            pt.co = (x, y, z, 1)
            pt.radius = lerp(1.25, 0.45, t ** 1.3)
        ob = bpy.data.objects.new("Sourcil", cu); bpy.context.collection.objects.link(ob)
        ob.data.materials.append(mat)

# ---------------------------------------------------------------- corps
def build_torso(mat):
    rings = [  # (demi-largeur, z, profondeur)
        (0.66, -0.93, 0.50), (1.00, -1.10, 0.60), (1.38, -1.30, 0.70),
        (1.62, -1.52, 0.78), (1.66, -1.85, 0.82), (1.56, -2.25, 0.84),
        (1.46, -2.80, 0.84), (1.44, -3.80, 0.84)]
    seg = 96
    bm = bmesh.new()
    loops = []
    for ri, (w, z, d) in enumerate(rings):
        loop = []
        for i in range(seg):
            a = 2 * math.pi * i / seg
            ca, sa = math.cos(a), math.sin(a)
            e = 2.2 if ri > 0 else 2.0
            x = w * math.copysign(abs(ca) ** (2 / e), ca)
            y = d * math.copysign(abs(sa) ** (2 / e), sa) + 0.12
            # encolure ras-du-cou plus basse devant
            front = max(0.0, -sa) ** 2
            drop = (0.70 if ri == 0 else 0.42 if ri == 1 else 0.15 if ri == 2 else 0) * front
            loop.append(bm.verts.new((x, y, z - drop)))
        loops.append(loop)
    for a, b in zip(loops, loops[1:]):
        for i in range(seg):
            bm.faces.new((a[i], a[(i + 1) % seg], b[(i + 1) % seg], b[i]))
    bm.normal_update()
    bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
    ob = mesh_obj("Tshirt", bm, mat)
    sd = ob.modifiers.new("Lissage", "SUBSURF"); sd.levels = 2; sd.render_levels = 2
    # col côtelé : tube suivant l'encolure
    cu = bpy.data.curves.new("Col", "CURVE")
    cu.dimensions = "3D"
    cu.bevel_depth = 0.05
    cu.bevel_resolution = 6
    sp = cu.splines.new("POLY")
    pts = [v.co.copy() for v in loops[0]]
    sp.points.add(len(pts) - 1)
    for p, co in zip(sp.points, pts):
        p.co = (co.x * 1.04, (co.y - 0.12) * 1.04 + 0.12, co.z + 0.02, 1)
    sp.use_cyclic_u = True
    col = bpy.data.objects.new("Col", cu)
    bpy.context.collection.objects.link(col)
    col.data.materials.append(mat)
    build_sleeves(mat)
    return ob

def build_sleeves(mat):
    """Manches courtes évasées + bras qui en sortent."""
    for s in (-1, 1):
        top = Vector((1.42 * s, 0.12, -1.72))
        bot = Vector((2.02 * s, 0.12, -3.30))
        axis = bot - top
        q = axis.to_track_quat("Z", "Y")
        bm = bmesh.new()
        seg, rings, cap = 64, 10, 6
        loops = []
        for j in range(-cap, rings + 1):
            t = j / rings
            c = top.lerp(bot, t)
            if j < 0:   # calotte d'épaule
                k = j / cap
                r = 0.46 * math.sqrt(max(1 - k * k, 0.02))
                c = top + axis.normalized() * (0.40 * k)
            else:
                r = lerp(0.46, 0.52, t ** 0.7)
            loop = []
            for i in range(seg):
                a = 2 * math.pi * i / seg
                loop.append(bm.verts.new(c + q @ Vector((math.cos(a) * r, math.sin(a) * r * 0.95, 0))))
            loops.append(loop)
        for a, b in zip(loops, loops[1:]):
            for i in range(seg):
                bm.faces.new((a[i], a[(i + 1) % seg], b[(i + 1) % seg], b[i]))
                bmesh.ops.recalc_face_normals(bm, faces=bm.faces)
        ob = mesh_obj("Manche", bm, mat)
        sol = ob.modifiers.new("Epaisseur", "SOLIDIFY"); sol.thickness = 0.03
        sd = ob.modifiers.new("Lissage", "SUBSURF"); sd.levels = 2; sd.render_levels = 2
        # bras
        bpy.ops.mesh.primitive_cylinder_add(vertices=48, radius=0.36, depth=2.2,
                                            location=top.lerp(bot, 1.15))
        arm = bpy.context.active_object; arm.name = "Bras"
        arm.rotation_euler = q.to_euler()
        bpy.ops.object.shade_smooth()
        arm.data.materials.append(NECK_SKIN)

def build_neck(mat):
    bm = bmesh.new()
    bmesh.ops.create_cone(bm, cap_ends=False, segments=64, radius1=0.58, radius2=0.48, depth=2.1)
    for v in bm.verts:
        v.co.y *= 0.82
        v.co += Vector((0, 0.15, -1.05))
    return mesh_obj("Cou", bm, mat)

# ---------------------------------------------------------------- accessoires
def build_eyes(head_bm, mat):
    eyes = []
    r = 0.165
    for s in (-1, 1):
        x, z = 0.305 * s, 0.20
        y = front_y(head_bm, x, z) + r * 0.38
        bpy.ops.mesh.primitive_uv_sphere_add(segments=64, ring_count=32, radius=r, location=(x, y, z))
        ob = bpy.context.active_object
        ob.name = "Oeil_D" if s < 0 else "Oeil_G"
        bpy.ops.object.shade_smooth()
        ob.data.materials.append(mat)
        # regard légèrement convergent vers la caméra
        ob.rotation_euler = (math.radians(-2), 0, math.radians(5 * s))
        eyes.append(ob)
        build_lid(ob, r, LID_SKIN)
    return eyes

def build_lid(eye, r, mat):
    """Coque de paupière autour de l'oeil, ouverte en amande."""
    bm = bmesh.new()
    bmesh.ops.create_uvsphere(bm, u_segments=160, v_segments=80, radius=r * 1.05)
    def opening(d):
        if d.y > 0:
            return False
        az = math.atan2(d.x, -d.y)
        el = math.asin(max(-1, min(1, d.z)))
        k = max(0.0, 1 - (az / 1.05) ** 2)
        up = 0.40 * k ** 0.6 - 0.04 - 0.04 * az * (1 if eye.location.x > 0 else -1)
        low = -0.36 * k ** 0.8 + 0.02
        return low < el < up
    kill = [f for f in bm.faces if opening(f.calc_center_median().normalized())]
    bmesh.ops.delete(bm, geom=kill, context="FACES")
    ob = mesh_obj("Paupiere", bm, mat)
    ob.location = eye.location
    sol = ob.modifiers.new("Epaisseur", "SOLIDIFY"); sol.thickness = 0.012
    sd = ob.modifiers.new("Lissage", "SUBSURF"); sd.levels = 1; sd.render_levels = 2

def build_ears(head_bm, mat):
    for s in (-1, 1):
        x = side_x(head_bm, 0.05, 0.15, s)
        bm = bmesh.new()
        bmesh.ops.create_uvsphere(bm, u_segments=48, v_segments=24, radius=1)
        for v in bm.verts:
            v.co = Vector((v.co.x * 0.08, v.co.y * 0.17, v.co.z * 0.30))
            # creux du pavillon
            if v.co.x * s > 0:
                v.co.x -= 0.05 * s * math.exp(-((v.co.y / 0.09) ** 2 + (v.co.z / 0.17) ** 2))
        ob = mesh_obj("Oreille_D" if s < 0 else "Oreille_G", bm, mat)
        ob.location = (x + 0.02 * s, 0.08, 0.15)
        ob.rotation_euler = (math.radians(-8), 0, math.radians(28 * s))
        # écouteur
        bpy.ops.mesh.primitive_uv_sphere_add(segments=32, ring_count=16, radius=0.048,
                                             location=(x + 0.055 * s, -0.02, 0.05))
        bud = bpy.context.active_object
        bud.name = "Ecouteur"
        bud.scale = (0.8, 1.0, 1.0)
        bpy.ops.object.shade_smooth()
        bud.data.materials.append(BLACK_PLASTIC)

def build_glasses(head_bm, metal, glass):
    R, tube = 0.25, 0.012
    gy = min(front_y(head_bm, 0.30, 0.17), front_y(head_bm, -0.30, 0.17)) - 0.22
    centers = [(-0.37, 0.17), (0.38, 0.17)]
    parts = []
    for cx, cz in centers:
        bpy.ops.mesh.primitive_torus_add(major_radius=R, minor_radius=tube, major_segments=96,
                                         minor_segments=12, location=(cx, gy, cz),
                                         rotation=(math.radians(90), 0, 0))
        rim = bpy.context.active_object; rim.name = "Monture"; rim.scale.x = 1.08
        bpy.ops.object.shade_smooth(); rim.data.materials.append(metal)
        bpy.ops.mesh.primitive_cylinder_add(vertices=96, radius=R - 0.004, depth=0.008,
                                            location=(cx, gy, cz), rotation=(math.radians(90), 0, 0))
        lens = bpy.context.active_object; lens.name = "Verre"; lens.scale.x = 1.08
        lens.data.materials.append(glass)
        parts += [rim, lens]
    # pont
    cu = bpy.data.curves.new("Pont", "CURVE"); cu.dimensions = "3D"
    cu.bevel_depth = tube * 0.9; cu.bevel_resolution = 4
    sp = cu.splines.new("BEZIER"); sp.bezier_points.add(1)
    a, b = sp.bezier_points
    a.co = (centers[0][0] + R * 1.0, gy, 0.17 + 0.09); b.co = (centers[1][0] - R * 1.0, gy, 0.17 + 0.09)
    a.handle_right = (a.co.x + 0.05, gy - 0.02, 0.32); a.handle_left = a.co
    b.handle_left = (b.co.x - 0.05, gy - 0.02, 0.32); b.handle_right = b.co
    br = bpy.data.objects.new("Pont", cu); bpy.context.collection.objects.link(br)
    br.data.materials.append(metal)
    # branches vers les oreilles
    for (cx, cz), s in zip(centers, (-1, 1)):
        p0 = Vector((cx + R * 1.08 * s, gy, cz + 0.03))
        p1 = Vector((side_x(head_bm, 0.0, 0.26, s) + 0.025 * s, 0.25, 0.24))
        cu = bpy.data.curves.new("Branche", "CURVE"); cu.dimensions = "3D"
        cu.bevel_depth = tube * 0.8
        sp = cu.splines.new("BEZIER"); sp.bezier_points.add(1)
        a, b = sp.bezier_points
        a.co = p0; a.handle_left = p0; a.handle_right = p0 + Vector((0.06 * s, 0.1, 0))
        b.co = p1; b.handle_left = p1 + Vector((0.02 * s, -0.2, 0)); b.handle_right = p1
        t = bpy.data.objects.new("Branche", cu); bpy.context.collection.objects.link(t)
        t.data.materials.append(metal)
    return parts

# ---------------------------------------------------------------- scène
def setup_scene():
    sc = bpy.context.scene
    sc.render.engine = "BLENDER_EEVEE"
    try:
        sc.eevee.use_raytracing = True
        sc.eevee.taa_render_samples = 64
        sc.eevee.use_shadows = True
    except AttributeError:
        pass
    sc.render.resolution_x = 1024
    sc.render.resolution_y = 1024
    sc.render.resolution_percentage = 100
    sc.view_settings.view_transform = "Standard"
    sc.view_settings.look = "None"
    sc.view_settings.exposure = 0.0

    # monde : blanc vu par la caméra, éclairage d'ambiance neutre/doux
    w = bpy.data.worlds.new("Monde"); sc.world = w; w.use_nodes = True
    nt = w.node_tree
    bg = nt.nodes["Background"]
    bg.inputs["Color"].default_value = (0.35, 0.32, 0.38, 1); bg.inputs["Strength"].default_value = 0.35
    bpy.ops.mesh.primitive_plane_add(size=40, location=(0, 6, -1), rotation=(math.radians(90), 0, 0))
    wall = bpy.context.active_object; wall.name = "Fond_blanc"
    wm = bpy.data.materials.new("Fond"); wm.use_nodes = True
    wn = wm.node_tree.nodes; wn.remove(wn["Principled BSDF"])
    em = wn.new("ShaderNodeEmission"); em.inputs["Color"].default_value = (1, 1, 1, 1)
    lp = wn.new("ShaderNodeLightPath"); tr = wn.new("ShaderNodeBsdfTransparent")
    mx = wn.new("ShaderNodeMixShader")
    wm.node_tree.links.new(lp.outputs["Is Camera Ray"], mx.inputs["Fac"])
    wm.node_tree.links.new(tr.outputs[0], mx.inputs[1])
    wm.node_tree.links.new(em.outputs[0], mx.inputs[2])
    wm.node_tree.links.new(mx.outputs[0], wn["Material Output"].inputs["Surface"])
    wall.data.materials.append(wm)
    for attr in ("hide_probe_sphere", "hide_probe_volume", "hide_probe_plane"):
        if hasattr(wall, attr):
            setattr(wall, attr, True)
    wall.visible_shadow = False

    # caméra
    cam_d = bpy.data.cameras.new("Camera"); cam_d.type = "ORTHO"; cam_d.ortho_scale = 4.34
    cam = bpy.data.objects.new("Camera", cam_d); sc.collection.objects.link(cam)
    cam.location = (0.0, -12.0, -0.86)
    target = Vector((0.0, 0, -0.86))
    cam.rotation_euler = (target - cam.location).to_track_quat("-Z", "Y").to_euler()
    sc.camera = cam

    def area(name, loc, color, power, size, target=(0, 0, 0)):
        ld = bpy.data.lights.new(name, "AREA"); ld.energy = power; ld.color = color
        ld.size = size
        ob = bpy.data.objects.new(name, ld); sc.collection.objects.link(ob)
        ob.location = loc
        ob.rotation_euler = (Vector(target) - Vector(loc)).to_track_quat("-Z", "Y").to_euler()
        return ob

    area("Cle", (4.0, -7.0, 4.0), (1.0, 0.93, 0.86), 1500, 5)
    area("Remplissage", (-6.0, -6.0, 0.5), (0.70, 0.62, 1.0), 380, 6)
    area("Contre_gauche", (-5.0, 5.0, 2.0), (1.0, 0.70, 0.50), 900, 3)
    area("Contre_droit", (5.0, 5.0, 2.0), (1.0, 0.72, 0.72), 900, 3)
    area("Dessus", (0.0, 0.0, 7.0), (1.0, 0.95, 0.9), 500, 4)

# ---------------------------------------------------------------- main
clean_scene()
SKIN = skin_material()
NECK_SKIN, _b = principled("Peau_cou", (0.21, 0.082, 0.043), rough=0.45,
                           **{"Subsurface Weight": 0.2, "Subsurface Scale": 0.08})
LID_SKIN, _ = principled("Peau_paupiere", (0.19, 0.074, 0.04), rough=0.5)
BLACK_PLASTIC, _ = principled("Plastique_noir", (0.01, 0.01, 0.01), rough=0.25)
METAL, _ = principled("Metal", (0.75, 0.72, 0.70), rough=0.18, Metallic=1.0)
GLASS, gb = principled("Verre", (0.6, 0.55, 0.9), rough=0.02, Alpha=0.02)
gb.inputs["Specular IOR Level"].default_value = 0.3
if hasattr(GLASS, "surface_render_method"):
    GLASS.surface_render_method = "BLENDED"
SWEATER = sweater_material()

head_bm = build_head_bm()
sculpt_face(head_bm)
head = mesh_obj("Tete", head_bm, SKIN)
paint_head(head_bm, head.data)

HAIR = hair_material()
build_hair(head_bm, HAIR)
build_brows(head_bm, HAIR)
build_eyes(head_bm, eye_material())
build_ears(head_bm, NECK_SKIN)
build_glasses(head_bm, METAL, GLASS)
build_neck(NECK_SKIN)
build_torso(SWEATER)
setup_scene()

# référence : l'image originale en arrière-plan de la caméra (visible dans le viewport)
DL = os.path.join(os.path.expanduser("~"), "Downloads")
for fname, rot_z, y in (("0000.webp", 0, -4.0), ("0001.webp", 180, 4.0)):
    path = os.path.join(DL, fname)
    if not os.path.exists(path):
        continue
    ref = bpy.data.objects.new("Ref_" + ("face" if rot_z == 0 else "dos"), None)
    ref.empty_display_type = "IMAGE"
    ref.data = bpy.data.images.load(path)
    ref.empty_display_size = 4.34
    ref.location = (0, y, -0.86)
    ref.rotation_euler = (math.radians(90), 0, math.radians(rot_z))
    ref.empty_image_side = "FRONT"
    ref.show_empty_image_perspective = False
    ref.color[3] = 0.5
    ref.use_empty_image_alpha = True
    bpy.context.collection.objects.link(ref)

bpy.ops.wm.save_as_mainfile(filepath=os.path.join(HERE, "model.blend"))
bpy.context.scene.render.filepath = RENDER_PATH
bpy.ops.render.render(write_still=True)
print("RENDU OK ->", RENDER_PATH)
