"""Build the unpacked Chrome extension and a ZIP with manifest.json at its root."""
from pathlib import Path
from zipfile import ZipFile, ZIP_DEFLATED
import json
import re
import shutil

ROOT = Path(__file__).resolve().parents[1]
SOURCE = ROOT / 'extension'
DEST = ROOT / 'artifacts/hike-helper'
ZIP = ROOT / 'artifacts/hike-helper.zip'
JQUERY = ROOT / 'node_modules/jquery'


def build():
    manifest = json.loads((SOURCE / 'manifest.json').read_text(encoding='utf-8'))
    package = json.loads((ROOT / 'package.json').read_text(encoding='utf-8'))
    assert manifest['version'] == package['version'], 'Project and extension versions must match'
    files = {path.relative_to(SOURCE).as_posix(): path for path in SOURCE.rglob('*') if path.is_file()}
    files.update({
        'vendor/jquery.min.js': JQUERY / 'dist/jquery.min.js',
        'vendor/jquery-LICENSE.txt': JQUERY / 'LICENSE.txt',
    })
    for path in files.values():
        if not path.is_file():
            raise SystemExit(f'Missing dependency {path.name}; run npm ci first.')

    # Remove only obsolete generated files; keep the fixed output inside this project.
    destination = DEST.resolve()
    assert destination.is_relative_to(ROOT.resolve()) and destination != ROOT.resolve()
    if destination.exists():
        for path in destination.rglob('*'):
            if path.is_file() and path.relative_to(destination).as_posix() not in files:
                path.unlink()
    for relative, source in files.items():
        target = destination / relative
        target.parent.mkdir(parents=True, exist_ok=True)
        shutil.copyfile(source, target)

    for html in ('popup.html', 'player/index.html'):
        for asset in re.findall(r'(?:src|href)="([^"]+)"', (destination / html).read_text(encoding='utf-8')):
            assert (destination / html).parent.joinpath(asset).is_file(), f'Missing asset: {asset}'
    for relative in [*manifest['icons'].values(), manifest['background']['service_worker'],
                     *manifest['content_scripts'][0]['js']]:
        assert relative in files, f'Missing manifest resource: {relative}'
    with ZipFile(ZIP, 'w', ZIP_DEFLATED) as archive:
        for relative in sorted(files):
            archive.write(destination / relative, relative)
    with ZipFile(ZIP) as archive:
        assert archive.testzip() is None
        assert set(archive.namelist()) == set(files)
        assert 'manifest.json' in archive.namelist()
    print(f'Load unpacked: {destination}')
    print(f'ZIP: {ZIP}')
    print(f'Validated {len(files)} files, version {manifest["version"]}')


if __name__ == '__main__':
    build()
