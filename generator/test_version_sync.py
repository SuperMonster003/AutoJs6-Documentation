"""Version transaction regression tests; all fixtures live outside the repositories."""
import importlib.util
import json
from pathlib import Path
import sys
import tempfile
import unittest
from unittest.mock import patch

SPEC = importlib.util.spec_from_file_location('docs_generator', Path(__file__).with_name('auto-generate.py'))
GENERATOR = importlib.util.module_from_spec(SPEC)
sys.modules[SPEC.name] = GENERATOR
SPEC.loader.exec_module(GENERATOR)


class VersionSyncTest(unittest.TestCase):
    def setUp(self):
        self.temporary = tempfile.TemporaryDirectory()
        self.addCleanup(self.temporary.cleanup)
        self.root = Path(self.temporary.name)
        self.plugin = self.root / 'plugin'
        self.config = {'versionName': '6.7.0', 'versionCode': 63, 'targetAutoJs6Version': '6.8.0'}
        self.project_path = self.root / 'project.json'
        self.project_path.write_text(json.dumps(self.config), encoding='utf-8')
        self.write('version.properties', 'VERSION_NAME=6.8.1\nVERSION_BUILD=32\n')
        self.write('app/build.gradle.kts', 'val offlineDocsContentVersion = "6.8.0"\n')
        for path in ['SOURCE_PROVENANCE.md', 'app/src/main/assets/licenses/docs/SOURCE_PROVENANCE.md']:
            self.write(path, '- Documentation version: `6.8.0`\n')

    def write(self, relative, text):
        path = self.plugin / relative
        path.parent.mkdir(parents=True, exist_ok=True)
        path.write_text(text, encoding='utf-8', newline='\n')

    def test_transaction_preserves_binary_fix_version_and_updates_content(self):
        with patch.object(GENERATOR, 'PROJECT_CONFIG_PATH', self.project_path):
            plan = GENERATOR.prepare_version_update_plan(self.config, self.plugin, '6.9.0')
        mutations = {item.path: item.updated.decode('utf-8') for item in plan.mutations}
        self.assertEqual('VERSION_NAME=6.8.1\nVERSION_BUILD=33\n', mutations[self.plugin / 'version.properties'])
        self.assertEqual('6.9.0', json.loads(mutations[self.project_path])['versionName'])
        self.assertEqual(64, json.loads(mutations[self.project_path])['versionCode'])
        self.assertIn('"6.9.0"', mutations[self.plugin / 'app/build.gradle.kts'])
        self.assertIn('`6.9.0`', mutations[self.plugin / 'SOURCE_PROVENANCE.md'])
        self.assertIn('`6.9.0`', mutations[self.plugin / 'app/src/main/assets/licenses/docs/SOURCE_PROVENANCE.md'])
        self.assertEqual('VERSION_NAME=6.8.1\nVERSION_BUILD=32\n', (self.plugin / 'version.properties').read_text())

    def test_content_validation_accepts_independent_plugin_release(self):
        GENERATOR.validate_offline_metadata(self.plugin, '6.8.0')

    def test_content_validation_still_rejects_each_stale_content_identity(self):
        paths = ['app/build.gradle.kts', 'SOURCE_PROVENANCE.md',
                 'app/src/main/assets/licenses/docs/SOURCE_PROVENANCE.md']
        for relative in paths:
            with self.subTest(path=relative):
                path = self.plugin / relative
                original = path.read_text(encoding='utf-8')
                self.write(relative, original.replace('6.8.0', '6.7.0'))
                with self.assertRaises(GENERATOR.AutomationError):
                    GENERATOR.validate_offline_metadata(self.plugin, '6.8.0')
                self.write(relative, original)


if __name__ == '__main__':
    unittest.main()
