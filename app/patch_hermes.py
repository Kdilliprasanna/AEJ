import zipfile
import os
import shutil

cache_dir = r"C:/Users/Prasanna/.gradle/caches/modules-2/files-2.1/com.facebook.hermes/hermes-android/250829098.0.14"

aar_path = None
for root, dirs, files in os.walk(cache_dir):
    for f in files:
        if f == "hermes-android-250829098.0.14-release.aar":
            aar_path = os.path.join(root, f).replace('\\', '/')
            break

if not aar_path:
    print("AAR not found in cache.")
    exit(0)

print("Patching AAR at:", aar_path)

# Step 1: Read classes.jar and remove AndroidUnicodeUtils.class
with zipfile.ZipFile(aar_path, 'r') as z_in:
    classes_jar_bytes = z_in.read('classes.jar')

tmp_in_jar = os.path.join(os.getcwd(), "_tmp_in.jar").replace('\\', '/')
tmp_out_jar = os.path.join(os.getcwd(), "_tmp_out.jar").replace('\\', '/')

with open(tmp_in_jar, "wb") as f:
    f.write(classes_jar_bytes)

with zipfile.ZipFile(tmp_in_jar, 'r') as zin, zipfile.ZipFile(tmp_out_jar, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        if item.filename != "com/facebook/hermes/unicode/AndroidUnicodeUtils.class":
            zout.writestr(item, zin.read(item.filename))
        else:
            print("Skipped duplicate class:", item.filename)

with open(tmp_out_jar, "rb") as f:
    new_classes_jar_bytes = f.read()

if os.path.exists(tmp_in_jar):
    os.remove(tmp_in_jar)
if os.path.exists(tmp_out_jar):
    os.remove(tmp_out_jar)

# Step 2: Rewrite AAR with updated classes.jar and libhermes.so aliases
tmp_aar_out = os.path.join(os.getcwd(), "_tmp_patched.aar").replace('\\', '/')
with zipfile.ZipFile(aar_path, 'r') as zin, zipfile.ZipFile(tmp_aar_out, 'w', zipfile.ZIP_DEFLATED) as zout:
    existing_entries = set(zin.namelist())
    written = set()

    for item in zin.infolist():
        if item.filename not in written:
            if item.filename == "classes.jar":
                zout.writestr("classes.jar", new_classes_jar_bytes)
            else:
                zout.writestr(item, zin.read(item.filename))
            written.add(item.filename)

            if item.filename.endswith("/libhermesvm.so"):
                alias_name = item.filename.replace("libhermesvm.so", "libhermes.so")
                if alias_name not in existing_entries and alias_name not in written:
                    zout.writestr(alias_name, zin.read(item.filename))
                    written.add(alias_name)
                    print(f"Created alias: {alias_name}")

shutil.move(tmp_aar_out, aar_path)
print("SUCCESSFULLY PATCHED AAR!")

transforms_dir = r"C:/Users/Prasanna/.gradle/caches/8.13/transforms"
if os.path.exists(transforms_dir):
    for td in os.listdir(transforms_dir):
        full = os.path.join(transforms_dir, td).replace('\\', '/')
        try:
            if os.path.isdir(full):
                for root, dirs, files in os.walk(full):
                    if any("hermes-android-250829098" in f for f in files):
                        shutil.rmtree(full, ignore_errors=True)
                        print("Cleared stale transform:", full)
                        break
        except Exception:
            pass

print("ALL DONE!")
