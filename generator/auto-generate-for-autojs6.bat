@SET "GEN_PATH=D:\webstorm-projects\AutoJs6-Documentation\generator\auto-generate.py"
@SET "SRC_PATH=D:\webstorm-projects\AutoJs6-Documentation\docs\"
@SET "DST_PATH=D:\idea-projects\AutoJs6\app\src\main\assets-app\docs\"

CMD /C %GEN_PATH%

RMDIR %DST_PATH%  /S /Q
XCOPY %SRC_PATH% %DST_PATH% /E /Y /Q