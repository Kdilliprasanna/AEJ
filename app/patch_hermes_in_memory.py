import zipfile
import io
import os
import shutil

aar_path = r"C:\Users\Prasanna\.gradle\caches\modules-2\files-2.1\com.facebook.hermes\hermes-android\250829098.0.14\d86fa5d7fca49bddc3fe4343899ea72809d32593\hermes-android-250829098.0.14-release.aar"

print("Patching AAR in-memory at:", aar_path)

# 1. Read original AAR bytes
with open(aar_path, 'rb') as f:
    aar_bytes = f.read()

zin_aar = zipfile.ZipFile(io.BytesIO(aar_bytes), 'r')

# 2. Extract and patch classes.jar in memory
classes_jar_bytes = zin_aar.read('classes.jar')
zin_classes = zipfile.ZipFile(io.BytesIO(classes_jar_bytes), 'r')

out_classes_io = io.BytesIO()
with zipfile.ZipFile(out_classes_io, 'w', zipfile.ZIP_DEFLATED) as zout_classes:
    for item in zin_classes.infolist():
        if item.filename != "com/facebook/hermes/unicode/AndroidUnicodeUtils.class":
            zout_classes.writestr(item.filename, zin_classes.read(item.filename))
        else:
            print("Successfully excluded duplicate class:", item.filename)

new_classes_jar_bytes = out_classes_io.getvalue()

# 3. Patch AAR in memory: replace libhermesvm.so with libhermes.so
out_aar_io = io.BytesIO()
written = set()

with zipfile.ZipFile(out_aar_io, 'w', zipfile.ZIP_DEFLATED) as zout_aar:
    for item in zin_aar.infolist():
        if item.filename == "classes.jar":
            zout_aar.writestr("classes.jar", new_classes_jar_bytes)
            written.add("classes.jar")
        elif item.filename.endswith("/libhermesvm.so"):
            target_name = item.filename.replace("libhermesvm.so", "libhermes.so")
            if target_name not in written:
                zout_aar.writestr(target_name, zin_aar.read(item.filename))
                written.add(target_name)
                print(f"Renamed/Written {item.filename} -> {target_name}")
            if item.filename not in written:
                zout_aar.writestr(item.filename, zin_aar.read(item.filename))
                written.add(item.filename)
        else:
            if item.filename not in written:
                zout_aar.writestr(item.filename, zin_aar.read(item.filename))
                written.add(item.filename)

patched_aar_bytes = out_aar_io.getvalue()

# Write patched AAR bytes directly back to file
with open(aar_path, 'wb') as f:
    f.write(patched_aar_bytes)

print("SUCCESSFULLY WRITTEN PATCHED AAR TO DISK! Size:", len(patched_aar_bytes))

# 4. Clear stale transform caches
transforms_dir = r"C:\Users\Prasanna\.gradle\caches\8.13\transforms"
if os.path.exists(transforms_dir):
    for td in os.listdir(transforms_dir):
        full = os.path.join(transforms_dir, td)
        try:
            if os.path.isdir(full):
                for root, dirs, files in os.walk(full):
                    if any("hermes-android-250829098" in f for f in files):
                        shutil.rmtree(full, ignore_errors=True)
                        print("Cleared stale transform dir:", full)
                        break
        except Exception:
            pass

print("ALL DONE SUCCESSFULLY!")
