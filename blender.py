import bpy
import random

COLORS = [
    (0.933, 0.933, 0.933),
    (0.776, 0.894, 0.545),
    (0.482, 0.788, 0.435),
    (0.137, 0.604, 0.231),
    (0.098, 0.380, 0.153)
]


def delete_all():
    for ob in bpy.context.scene.objects:
        ob.select = True
    bpy.ops.object.delete()


def create_materials():
    # Create materials for day bars
    mats = []
    for idx, color in enumerate(COLORS):
        mat = bpy.data.materials.new(str(idx))
        mat.diffuse_color = color
        mats.append(mat)
    return mats


def create_model_base(mat):
    # Create base
    bpy.ops.mesh.primitive_cube_add(location=(0, 0, 0))
    bpy.context.object.scale = (52 / 7, 1, 0.5)
    bpy.ops.transform.translate(value=((-68/7)/4, 0, 0.5))
    base_obj = bpy.context.object
    base_obj.data.materials.append(mat)


def create_user_label(mat):
    # Create text label
    bpy.ops.object.text_add(location=(0, 0, 0))
    text_ob = bpy.context.object
    text_ob.data.body = 'bcongdon/2016'
    text_ob.data.align_x = 'LEFT'
    text_ob.data.materials.append(mat)
    bpy.ops.transform.rotate(value=1.5708, axis=(1, 0, 0))
    bpy.ops.transform.rotate(value=3.14159, axis=(0, 0, 1))
    bpy.context.object.data.extrude = 0.15
    bpy.ops.transform.translate(value=(4.75, 1.025, 0.25))
    bpy.ops.object.convert(target='MESH')


def create_day_bars(mats):
    # Create a bar for each day
    x = 5 - 1/7
    for week in range(52):
        y = 6/7
        for dow in range(7):
            z = random.random()
            bpy.ops.mesh.primitive_cube_add(location=(x, y, z + 1))
            bpy.context.object.scale = (1.0/7, 1.0/7, z)
            day_obj = bpy.context.object
            day_obj.data.materials.append(random.choice(mats))
            y -= 2.0/7
        x -= 2.0/7


def join_all_objects():
    # Join all objects into a mesh
    for ob in bpy.context.scene.objects:
        ob.select = True
    bpy.ops.object.join()


delete_all()
mats = create_materials()
create_model_base(mats[0])
create_user_label(mats[2])
create_day_bars(mats)
join_all_objects()
