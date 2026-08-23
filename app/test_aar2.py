import zipfile
import os

aar_path = r"C:\Users\Prasanna\.gradle\caches\modules-2\files-2.1\com.facebook.hermes\hermes-android\250829098.0.14\d86fa5d7fca49bddc3fe4343899ea72809d32593\hermes-android-250829098.0.14-release.aar"

with zipfile.ZipFile(aar_path, 'r') as z:
    print("Entries:", len(z.namelist()))
    for name in z.namelist():
        if "libhermes" in name:
            print("Found native lib entry:", name)
