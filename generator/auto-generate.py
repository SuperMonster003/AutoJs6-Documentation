import os
import os.path
import sys

in_dir = os.path.join('..', 'api')
out_dir = os.path.join('..', 'docs')
json_out_dir = os.path.join('..', 'json')
template = os.path.join('..', 'template.html')
version = '6.2.0'


def process(in_file, out_file, fmt="html"):
    os.system("node generate.js --template={0} --out={1} --node-version={2} {3} --format={4}"
              .format(template, out_file, version, in_file, fmt))


def process_all():
    for file in os.listdir(in_dir):
        if not file.endswith('.md'):
            continue
        name = os.path.splitext(file)[0]
        if name != 'all':
            process_module(name)
    process_module("all")
    index = os.path.join(out_dir, "index.html")
    if os.path.exists(index):
        os.remove(index)
    os.rename(os.path.join(out_dir, "_toc.html"), index)


def process_module(module_name):
    process(os.path.join(in_dir, module_name + ".md"), os.path.join(out_dir, module_name + ".html"))
    process(os.path.join(in_dir, module_name + ".md"), os.path.join(json_out_dir, module_name + ".json"), "json")


if __name__ == '__main__':
    if len(sys.argv) > 1:
        processed_all = True
        for module in sys.argv[1:]:
            process_module(module)
            if module == "all":
                processed_all = False
        if processed_all:
            process_module("all")
    else:
        process_all()
