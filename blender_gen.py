import bpy


NORD_BLUE_BACKGROUND = (0.04, 0.05, 0.08, 1.0)


def clear_scene() -> None:
    """Remove every object and orphaned mesh block from the scene."""
    bpy.ops.object.select_all(action="SELECT")
    bpy.ops.object.delete(use_global=False)

    for block in list(bpy.data.meshes):
        if block.users == 0:
            bpy.data.meshes.remove(block)

    for block in list(bpy.data.cameras):
        if block.users == 0:
            bpy.data.cameras.remove(block)

    for block in list(bpy.data.lights):
        if block.users == 0:
            bpy.data.lights.remove(block)


def setup_world() -> None:
    """Set the world to a solid Dark Nord Blue background."""
    world = bpy.data.worlds.get("World")
    if world is None:
        world = bpy.data.worlds.new("World")
    bpy.context.scene.world = world
    world.use_nodes = True

    tree = world.node_tree
    output = tree.nodes.get("World Output")
    background = tree.nodes.get("Background")
    if output is None:
        output = tree.nodes.new("ShaderNodeOutputWorld")
    if background is None:
        background = tree.nodes.new("ShaderNodeBackground")
    tree.links.new(background.outputs[0], output.inputs["Surface"])

    background.inputs["Color"].default_value = NORD_BLUE_BACKGROUND
    background.inputs["Strength"].default_value = 1.0


def get_target() -> bpy.types.Object:
    """Return (creating if needed) the empty all look-constraints aim at."""
    target = bpy.data.objects.get("CameraTarget")
    if target is None:
        target = bpy.data.objects.new("CameraTarget", None)
        bpy.context.collection.objects.link(target)
    target.location = (0.0, 0.0, 0.0)
    return target


def setup_camera(target: bpy.types.Object) -> bpy.types.Object:
    """Cinematic 35mm perspective camera with shallow depth of field.

    The camera boomerangs along the Z-axis through the tunnel of glass
    (see ``setup_camera_animation``), always aimed at the origin.
    """
    cam_data = bpy.data.cameras.new("Camera")
    cam_data.type = "PERSP"
    cam_data.lens = 50.0
    cam_data.clip_start = 0.1
    cam_data.clip_end = 1000.0
    cam_data.dof.use_dof = True
    cam_data.dof.aperture_fstop = 0.12
    # Constant focus distance: at the extremes (Z=12 on GlassMan, Z=-6 on
    # GlassShard, Z=-24 on ProjectsCore) each hero sits exactly 12 units
    # from the lens.
    cam_data.dof.focus_distance = 12.0

    cam = bpy.data.objects.new("Camera", cam_data)
    bpy.context.collection.objects.link(cam)
    cam.location = (0.0, 0.0, 6.0)

    track = cam.constraints.new(type="TRACK_TO")
    track.target = target
    track.track_axis = "TRACK_NEGATIVE_Z"
    track.up_axis = "UP_Y"

    bpy.context.scene.camera = cam
    bpy.context.view_layer.objects.active = cam
    return cam


def setup_lights(cam: bpy.types.Object) -> None:
    """Massive area lights distributed down the Z-tunnel.

    A foreground key, a midground fill, and a deep backlight that fires
    straight back at the camera, shooting light *through* the Core and
    Shard so they glow like ice.
    """
    def make_area(name, loc, size, energy, color, look_at) -> None:
        light_data = bpy.data.lights.new(name, type="AREA")
        light_data.energy = energy
        light_data.size = size
        light_data.color = color

        light = bpy.data.objects.new(name, light_data)
        bpy.context.collection.objects.link(light)
        light.location = loc

        track = light.constraints.new(type="TRACK_TO")
        track.target = look_at
        track.track_axis = "TRACK_NEGATIVE_Z"
        track.up_axis = "UP_Y"

    make_area(
        "ForegroundKey",
        (5.0, 3.0, 2.0),
        5.0,
        800.0,
        (1.0, 1.0, 1.0),
        bpy.data.objects["GlassMan"],
    )
    make_area(
        "MidgroundFill",
        (-6.0, -2.0, -5.0),
        8.0,
        1200.0,
        (0.8, 0.9, 1.0),
        bpy.data.objects["GlassShard"],
    )
    make_area(
        "DeepBacklight",
        (0.0, 5.0, -20.0),
        10.0,
        2000.0,
        (0.6, 0.8, 1.0),
        cam,
    )


def get_ice_glass() -> bpy.types.Material:
    """Return the single shared Icy Blue glass material (created once).

    Brighter than before, with a faint emission so refraction never
    falls to pure black and a slightly frosted 0.15 roughness.
    """
    mat = bpy.data.materials.get("IceGlass")
    if mat is not None:
        return mat
    mat = bpy.data.materials.new("IceGlass")
    mat.use_nodes = True
    bsdf = mat.node_tree.nodes.get("Principled BSDF")
    bsdf.inputs["Base Color"].default_value = (0.75, 0.85, 0.95, 1.0)
    bsdf.inputs["Transmission Weight"].default_value = 1.0
    bsdf.inputs["Roughness"].default_value = 0.05
    bsdf.inputs["IOR"].default_value = 1.45
    bsdf.inputs["Specular IOR Level"].default_value = 0.8
    bsdf.inputs["Emission Color"].default_value = (0.0, 0.0, 0.0, 1.0)
    bsdf.inputs["Emission Strength"].default_value = 0.0
    return mat


def generate_glass_man() -> None:
    """Build a Superhot-style triangulated low-poly glass mannequin.

    Sharp anatomical plates (head, neck/shoulders, V-tapered torso,
    pointing left arm, dynamic right arm and legs) are assembled from
    primitives, triangulated into sharp facets, and flat-shaded for the
    angular Superhot silhouette.
    """
    old = bpy.data.objects.get("GlassMan")
    if old is not None:
        bpy.data.objects.remove(old, do_unlink=True)

    old_mesh = bpy.data.meshes.get("GlassMan_Mesh")
    if old_mesh is not None and old_mesh.users == 0:
        bpy.data.meshes.remove(old_mesh)

    import bmesh
    from mathutils import Euler, Matrix, Vector

    bm = bmesh.new()

    def add_box(loc, size, rot=(0.0, 0.0, 0.0)) -> None:
        result = bmesh.ops.create_cube(bm, size=1.0)
        mat = Matrix.LocRotScale(Vector(loc), Euler(rot).to_matrix(), Vector(size))
        bmesh.ops.transform(bm, verts=result["verts"], matrix=mat)

    def add_icos(loc, size, rot=(0.0, 0.0, 0.0)) -> None:
        result = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0)
        mat = Matrix.LocRotScale(Vector(loc), Euler(rot).to_matrix(), Vector(size))
        bmesh.ops.transform(bm, verts=result["verts"], matrix=mat)

    add_icos((0.0, 2.74, 0.0), (0.32, 0.42, 0.32))

    add_box((0.0, 2.42, 0.0), (0.2, 0.24, 0.2), rot=(0.05, 0.0, 0.0))
    add_box((0.0, 2.14, 0.0), (0.96, 0.3, 0.34))
    add_box((-0.44, 2.04, 0.0), (0.36, 0.32, 0.34), rot=(0.0, 0.0, 0.6))
    add_box((0.44, 2.04, 0.0), (0.36, 0.32, 0.34), rot=(0.0, 0.0, -0.6))

    add_box((0.0, 1.92, 0.0), (0.68, 0.34, 0.32), rot=(0.1, 0.0, 0.0))
    add_box((0.0, 1.62, 0.0), (0.52, 0.3, 0.3), rot=(-0.08, 0.0, 0.0))
    add_box((0.0, 1.36, 0.0), (0.44, 0.28, 0.28), rot=(0.06, 0.0, 0.0))

    add_box((-0.2, 1.14, 0.0), (0.38, 0.3, 0.32), rot=(0.0, 0.0, 0.18))
    add_box((0.2, 1.14, 0.0), (0.38, 0.3, 0.32), rot=(0.0, 0.0, -0.18))

    add_box((-0.72, 2.14, 0.0), (0.5, 0.24, 0.24), rot=(0.0, 0.0, 0.04))
    add_box((-1.15, 2.12, 0.0), (0.44, 0.2, 0.2), rot=(0.0, 0.0, -0.03))
    add_box((-1.42, 2.12, 0.05), (0.22, 0.18, 0.16))
    add_box((-1.58, 2.12, 0.0), (0.18, 0.08, 0.08))

    add_box((0.62, 1.9, 0.0), (0.26, 0.5, 0.26), rot=(0.15, 0.0, -0.3))
    add_box((0.82, 1.4, -0.08), (0.22, 0.46, 0.22), rot=(0.25, 0.0, 0.15))
    add_box((0.92, 1.1, 0.0), (0.2, 0.26, 0.2), rot=(0.2, 0.0, 0.1))

    add_box((-0.18, 0.72, 0.0), (0.24, 0.46, 0.26), rot=(0.12, 0.0, 0.0))
    add_box((-0.16, 0.32, 0.05), (0.2, 0.42, 0.22), rot=(0.08, 0.0, 0.0))
    add_box((-0.18, 0.08, 0.0), (0.24, 0.18, 0.3))
    add_box((0.18, 0.74, 0.0), (0.24, 0.46, 0.26), rot=(-0.15, 0.0, 0.0))
    add_box((0.16, 0.34, -0.04), (0.2, 0.42, 0.22), rot=(-0.1, 0.0, 0.0))
    add_box((0.18, 0.08, 0.0), (0.24, 0.18, 0.3))

    bmesh.ops.transform(
        bm, verts=bm.verts, matrix=Euler((0.06, 0.04, -0.12)).to_matrix()
    )

    bmesh.ops.triangulate(bm, faces=list(bm.faces))

    min_c = Vector((float("inf"), float("inf"), float("inf")))
    max_c = Vector((-float("inf"), -float("inf"), -float("inf")))
    for v in bm.verts:
        for i in range(3):
            min_c[i] = min(min_c[i], v.co[i])
            max_c[i] = max(max_c[i], v.co[i])
    bmesh.ops.translate(bm, verts=bm.verts, vec=-(min_c + max_c) * 0.5)

    mesh = bpy.data.meshes.new("GlassMan_Mesh")
    bm.to_mesh(mesh)
    bm.free()

    for poly in mesh.polygons:
        poly.use_smooth = False
    mesh.update()

    mat = get_ice_glass()

    obj = bpy.data.objects.new("GlassMan", mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = (1.8, 0.0, 0.0)
    obj.scale = (1.2, 1.2, 1.2)

    remesh = obj.modifiers.new(name="Remesh", type="REMESH")
    remesh.mode = "VOXEL"
    remesh.voxel_size = 0.045

    decimate = obj.modifiers.new(name="Decimate", type="DECIMATE")
    decimate.ratio = 0.06
    decimate.use_collapse_triangulate = True

    edge_split = obj.modifiers.new(name="EdgeSplit", type="EDGE_SPLIT")
    edge_split.split_angle = 0.0

    obj.data.materials.append(mat)


def generate_glass_shard() -> None:
    """Build a sleek, floating refractive glass shard."""
    old = bpy.data.objects.get("GlassShard")
    if old is not None:
        bpy.data.objects.remove(old, do_unlink=True)

    old_mesh = bpy.data.meshes.get("GlassShard_Mesh")
    if old_mesh is not None and old_mesh.users == 0:
        bpy.data.meshes.remove(old_mesh)

    import bmesh
    from mathutils import Euler, Matrix, Vector

    bm = bmesh.new()
    result = bmesh.ops.create_icosphere(bm, subdivisions=1, radius=1.0)

    mat = Matrix.LocRotScale(
        Vector((0.0, 0.0, 0.0)),
        Euler((-1.25, 0.0, 0.55)).to_matrix(),
        Vector((0.4, 0.15, 1.8)),
    )
    bmesh.ops.transform(bm, verts=result["verts"], matrix=mat)

    mesh = bpy.data.meshes.new("GlassShard_Mesh")
    bm.to_mesh(mesh)
    bm.free()

    for poly in mesh.polygons:
        poly.use_smooth = False
    mesh.update()

    obj = bpy.data.objects.new("GlassShard", mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = (-3.2, 0.0, -12.0)
    obj.scale = (1.2, 1.2, 1.2)
    obj.data.materials.append(get_ice_glass())


def generate_projects_core() -> None:
    """Build a seamless 2x2 grid of glass slabs forming a UI card.

    Four slabs sized (4.8, 2.7, 0.1) are centered at +/-2.45, +/-1.4 so
    adjacent edges are separated by a tiny 0.1 gap.
    """
    old = bpy.data.objects.get("ProjectsCore")
    if old is not None:
        bpy.data.objects.remove(old, do_unlink=True)

    old_mesh = bpy.data.meshes.get("ProjectsCore_Mesh")
    if old_mesh is not None and old_mesh.users == 0:
        bpy.data.meshes.remove(old_mesh)

    import bmesh
    from mathutils import Euler, Matrix, Vector

    bm = bmesh.new()

    for dx, dy in ((-2.45, -1.4), (-2.45, 1.4), (2.45, -1.4), (2.45, 1.4)):
        result = bmesh.ops.create_cube(bm, size=1.0)
        mat = Matrix.LocRotScale(
            Vector((dx, dy, 0.0)), Euler((0.0, 0.0, 0.0)).to_matrix(), Vector((4.8, 2.7, 0.1))
        )
        bmesh.ops.transform(bm, verts=result["verts"], matrix=mat)

    bmesh.ops.transform(
        bm, verts=bm.verts, matrix=Euler((0.02, -0.01, 0.0)).to_matrix()
    )

    center = Vector((0.0, 0.0, 0.0))
    for v in bm.verts:
        center += v.co
    center /= len(bm.verts)
    bmesh.ops.translate(bm, verts=bm.verts, vec=-center)

    mesh = bpy.data.meshes.new("ProjectsCore_Mesh")
    bm.to_mesh(mesh)
    bm.free()

    for poly in mesh.polygons:
        poly.use_smooth = False
    mesh.update()

    obj = bpy.data.objects.new("ProjectsCore", mesh)
    bpy.context.collection.objects.link(obj)
    obj.location = (0.0, 0.0, -24.0)
    obj.scale = (1.0, 1.0, 1.0)
    obj.data.materials.append(get_ice_glass())


def setup_render() -> None:
    """Configure Cycles for fast, denoised 1080p animation renders."""
    sc = bpy.context.scene
    sc.render.engine = "CYCLES"
    sc.render.film_transparent = False
    sc.render.image_settings.color_mode = "RGB"
    sc.render.image_settings.file_format = "PNG"
    sc.render.resolution_x = 1920
    sc.render.resolution_y = 1080
    sc.render.filepath = "//desktop renders/"
    sc.render.use_persistent_data = True

    cycles = sc.cycles
    cycles.samples = 128
    cycles.use_denoising = True
    cycles.denoiser = "OPTIX"
    cycles.max_bounces = 8
    cycles.transparent_max_bounces = 8
    cycles.transmission_bounces = 8


def apply_ease_in_out(action) -> None:
    """Apply BEZIER + EASE_IN_OUT to every keyframe in a 5.2 action."""
    if action is None:
        return
    for layer in action.layers:
        for strip in layer.strips:
            for cb in strip.channelbags:
                for fc in cb.fcurves:
                    for kf in fc.keyframe_points:
                        kf.interpolation = "BEZIER"
                        kf.easing = "EASE_IN_OUT"


def setup_camera_animation(cam: bpy.types.Object) -> None:
    """Animate a smooth, one-way 240-frame forward dive through the tunnel.

    At 30 FPS the camera flows linearly from GlassMan (Z=12) past
    GlassShard (Z=0) to the ProjectsCore glass panes (Z=-12), with focus
    locked at a constant 12.0 so each hero is perfectly sharp as it
    passes. The reverse boomerang is handled in the frontend.
    """
    scene = bpy.context.scene
    scene.render.fps = 30
    scene.frame_start = 1
    scene.frame_end = 240

    # Frame 1:   camera Z=12, man at Z=0     (distance 12, in focus)
    # Frame 120: camera Z=0,  shard at Z=-12 (distance 12, in focus)
    # Frame 240: camera Z=-12, core at Z=-24 (distance 12, in focus)
    for frame, z in ((1, 12.0), (120, 0.0), (240, -12.0)):
        cam.location.z = z
        cam.keyframe_insert(data_path="location", frame=frame)

    apply_ease_in_out(cam.animation_data.action)


def setup_target_animation(target: bpy.types.Object) -> None:
    """Animate the look-at target so the camera never overtakes it.

    The target mirrors the camera's dive but sits on each hero's plane
    (Z = 0, -12, -24), keeping the camera aimed forward down the tunnel
    so it never passes the target and flips upside down.
    """
    for frame, z in ((1, 0.0), (120, -12.0), (240, -24.0)):
        target.location.z = z
        target.keyframe_insert(data_path="location", frame=frame)

    apply_ease_in_out(target.animation_data.action)


def main() -> None:
    clear_scene()
    target = get_target()
    setup_world()
    cam = setup_camera(target)
    generate_glass_man()
    generate_glass_shard()
    generate_projects_core()
    setup_lights(cam)
    setup_camera_animation(cam)
    setup_target_animation(target)
    setup_render()

    # Ensure all three assets are visible in the viewport and renderable.
    for name in ("GlassMan", "GlassShard", "ProjectsCore"):
        obj = bpy.data.objects.get(name)
        if obj is not None:
            obj.hide_viewport = False
            obj.hide_render = False


if __name__ == "__main__":
    main()
