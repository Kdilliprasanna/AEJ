import zipfile

p = r"C:\Users\Prasanna\.gradle\caches\modules-2\files-2.1\com.facebook.hermes\hermes-android\250829098.0.14\d86fa5d7fca49bddc3fe4343899ea72809d32593\hermes-android-250829098.0.14-release.aar"

try:
    with zipfile.ZipFile(p, 'r') as z:
        print("AAR OK, entry count:", len(z.namelist()))
        for name in z.namelist():
            try:
                data = z.read(name)
            except Exception as e:
                print("Error reading entry", name, ":", e)
except Exception as e:
    print("Error opening AAR:", e)
