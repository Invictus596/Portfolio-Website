import os

import bpy

ASSET_NAMES = ("GlassMan", "GlassShard", "ProjectsCore")
OUT_REL = os.path.join("public", "models", "portfolio_scene.glb")


def ensure_scene() -> None:
    """Regenerate the scene from blender_gen.py if any asset is missing."""
    missing = [n for n in ASSET_NAMES if bpy.data.objects.get(n) is None]
    if not missing:
        return
    here = os.path.dirname(os.path.abspath(__file__))
    gen_path = os.path.join(here, "blender_gen.py")
    with open(gen_path) as fh:
        exec(compile(fh.read(), gen_path, "exec"), {})
    still_missing = [n for n in ASSET_NAMES if bpy.data.objects.get(n) is None]
    if still_missing:
        raise SystemExit(f"missing assets after regenerate: {still_missing}")


def main() -> None:
    ensure_scene()

    bpy.ops.object.select_all(action="DESELECT")
    active = None
    for name in ASSET_NAMES:
        obj = bpy.data.objects[name]
        obj.select_set(True)
        active = obj
    bpy.context.view_layer.objects.active = active

    here = os.path.dirname(os.path.abspath(__file__))
    out_dir = os.path.join(here, "public", "models")
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, "portfolio_scene.glb")

    bpy.ops.export_scene.gltf(
        filepath=out_path,
        export_format="GLB",
        use_selection=True,
        export_apply=True,
        export_materials="EXPORT",
        export_animations=False,
    )
    print(f"EXPORTED: {out_path} ({os.path.getsize(out_path)} bytes)")


if __name__ == "__main__":
    main()
