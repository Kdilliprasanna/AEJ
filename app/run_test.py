import zipfile
import io

p = r"C:\Users\Prasanna\.gradle\caches\modules-2\files-2.1\com.facebook.hermes\hermes-android\250829098.0.14\d86fa5d7fca49bddc3fe4343899ea72809d32593\hermes-android-250829098.0.14-release.aar"

with open(p, 'rb') as f:
    data = f.read()

print("Read data length:", len(data))
z = zipfile.ZipFile(io.BytesIO(data))
print("Zip entries:", len(z.namelist()))

classes_data = z.read('classes.jar')
print("classes.jar length:", len(classes_data))

cz = zipfile.ZipFile(io.BytesIO(classes_data))
print("classes.jar entries:", len(cz.namelist()))
