@echo off
REM Generate client commands (assuming generate_client_commands.go produces correct output)
go run generate_client_commands.go > commands.txt

REM Run the commands in separate windows
for /f "tokens=*" %%a in (commands.txt) do (
  start cmd /k "%%a"
)
echo All client commands launched.  Close the client windows when done.