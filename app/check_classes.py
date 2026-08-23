import zipfile
import io

p = r"C:\Users\Prasanna\.gradle\caches\modules-2\files-2.1\com.facebook.hermes\hermes-android\250829098.0.14\d86fa5d7fca49bddc3fe4343899ea72809d32593\hermes-android-250829098.0.14-release.aar"

with zipfile.ZipFile(p, 'r') as z:
    classes_bytes = z.read('classes.jar')
    with zipfile.ZipFile(io.BytesIO(classes_bytes), 'r') as cz:
        print("classes.jar OK, entries:", len(cz.namelist()))
        for name in cz.namelist():
            try:
                cdata = cz.read(name)
            except Exception as e:
                print("Error reading class entry", name, ":", e)
