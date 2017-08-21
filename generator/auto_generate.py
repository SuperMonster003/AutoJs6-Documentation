import os
import os.path

in_dir = '../api'
out_dir = '../'
template = '../template.html'


def process(in_file, out_file):
    os.system("node generate.js --template={0} --out={1} {2}".format(template, out_file, in_file))

for file in os.listdir(in_dir):
    if not file.endswith('.md'):
        continue
    name = os.path.splitext(file)[0]
    process(os.path.join(in_dir, file), os.path.join(out_dir, name + ".html"))
