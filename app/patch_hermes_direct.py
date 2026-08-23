import zipfile
import os
import shutil

aar_path = r"C:\Users\Prasanna\.gradle\caches\modules-2\files-2.1\com.facebook.hermes\hermes-android\250829098.0.14\d86fa5d7fca49bddc3fe4343899ea72809d32593\hermes-android-250829098.0.14-release.aar"

print("Patching target AAR directly at:", aar_path)

# 1. Extract classes.jar and remove AndroidUnicodeUtils.class
with zipfile.ZipFile(aar_path, 'r') as z_in:
    classes_jar_bytes = z_in.read('classes.jar')
    all_aar_entries = z_in.namelist()

tmp_in_jar = os.path.join(os.getcwd(), "_tmp_in_classes.jar")
tmp_out_jar = os.path.join(os.getcwd(), "_tmp_out_classes.jar")

with open(tmp_in_jar, "wb") as f:
    f.write(classes_jar_bytes)

with zipfile.ZipFile(tmp_in_jar, 'r') as zin, zipfile.ZipFile(tmp_out_jar, 'w', zipfile.ZIP_DEFLATED) as zout:
    for item in zin.infolist():
        if item.filename != "com/facebook/hermes/unicode/AndroidUnicodeUtils.class":
            zout.writestr(item, zin.read(item.filename))
        else:
            print("Successfully skipped duplicate class:", item.filename)

with open(tmp_out_jar, "rb") as f:
    new_classes_jar_bytes = f.read()

if os.path.exists(tmp_in_jar):
    os.remove(tmp_in_jar)
if os.path.exists(tmp_out_jar):
    os.remove(tmp_out_jar)

# 2. Rewrite AAR with updated classes.jar and libhermes.so aliases
tmp_patched_aar = os.path.join(os.getcwd(), "_tmp_patched_aar.aar")
with zipfile.ZipFile(aar_path, 'r') as zin, zipfile.ZipFile(tmp_patched_aar, 'w', zipfile.ZIP_DEFLATED) as zout:
    existing_entries = set(all_aar_entries)
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
                    print(f"Created native library alias: {alias_name}")

shutil.move(tmp_patched_aar, aar_path)
print("SUCCESSFULLY PATCHED AAR!")

# 3. Clear stale transform caches
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
