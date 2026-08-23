import zipfile
import io

aar_path = r"C:\Users\Prasanna\.gradle\caches\modules-2\files-2.1\com.facebook.hermes\hermes-android\250829098.0.14\d86fa5d7fca49bddc3fe4343899ea72809d32593\hermes-android-250829098.0.14-release.aar"

with open(aar_path, 'rb') as f:
    aar_bytes = f.read()

zin_aar = zipfile.ZipFile(io.BytesIO(aar_bytes), 'r')
for info in zin_aar.infolist():
    if info.filename.endswith('classes.jar') or 'classes' in info.filename:
        print("Found entry:", info.filename, "Size:", info.file_size, "Compress size:", info.compress_size)
        data = zin_aar.read(info.filename)
        print("First 16 bytes:", data[:16].hex())
