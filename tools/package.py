"""Build a Chrome-loadable directory and a ZIP with manifest.json at its root."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'extension'
DEST = ROOT / 'artifacts' / 'hike-helper'
ZIP = ROOT / 'artifacts' / 'hike-helper.zip'
FILES = sorted(path for path in SOURCE.iterdir() if path.is_file())
manifest = json.loads((SOURCE / 'manifest.json').read_text(encoding='utf-8'))
package_json = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
assert manifest['version'] == package_json['version'], 'Extension and project versions must match'
for script in manifest['content_scripts'][0]['js']:
    assert (SOURCE / script).is_file(), script
assert (SOURCE / manifest['action']['default_popup']).is_file()
popup_html = (SOURCE / manifest['action']['default_popup']).read_text(encoding='utf-8')
for asset in re.findall(r'(?:src|href)="([^"]+)"', popup_html):
    assert (SOURCE / asset).is_file(), f'Missing popup asset: {asset}'
DEST.mkdir(parents=True, exist_ok=True)
for path in FILES:
    shutil.copyfile(path, DEST / path.name)
with ZipFile(ZIP, 'w', ZIP_DEFLATED) as package:
    for path in FILES:
        package.write(path, path.name)
with ZipFile(ZIP) as package:
    assert package.testzip() is None
    assert 'manifest.json' in package.namelist()
    assert 'extension/manifest.json' not in package.namelist()
    assert json.loads(package.read('manifest.json'))['version'] == manifest['version']
    for asset in re.findall(r'(?:src|href)="([^"]+)"', popup_html):
        assert asset in package.namelist(), f'Missing packaged asset: {asset}'
print(f'Load directory: {DEST}')
print(f'ZIP: {ZIP}')
print(f'Validated: root manifest.json, {len(FILES)} extension files, version {manifest["version"]}')
