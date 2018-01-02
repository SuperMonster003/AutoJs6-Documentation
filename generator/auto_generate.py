import os
import os.path
import sys

in_dir = r'..\api'
out_dir = r'..\docs'
template = r'..\template.html'
version = '3.0.0'


def process(in_file, out_file):
    os.system(
        "node generate.js --template={0} --out={1} --node-version={2} {3}".format(template, out_file, version, in_file))


def processAll():    
    for file in os.listdir(in_dir):
        if not file.endswith('.md'):
            continue
        name = os.path.splitext(file)[0]
        if name != 'all':
            process(os.path.join(in_dir, file), os.path.join(out_dir, name + ".html"))
    processModule("all")
    index = os.path.join(out_dir, "index.html")        
    if os.path.exists(index):
        os.remove(index)
    os.rename(os.path.join(out_dir, "_toc.html"), index)

def processModule(module):
    process(os.path.join(in_dir, module + ".md"), os.path.join(out_dir, module + ".html"))

if __name__ == '__main__':
    if len(sys.argv) > 1:
        print(sys.argv)
        for module in sys.argv[1:]:
            processModule(module)
        processModule("all")
    else:
        processAll()




