#!/bin/bash
set -x

export HOME=/root

/usr/local/bin/pm2 start /volume1/site_admin/libreoffice/scripts/runScriptDocker.sh --name loop_APISite