#!/bin/sh
* * * * * echo "HOLA machucado" >> /home/app/data/logs/test.log 2>&1
* * * * * ts-node -e /home/app/src/subscribers/checkFTP.ts '/home/app/' >> /home/app/data/logs/ftpChecker.log 2>&1