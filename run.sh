#!/bin/bash
cd /root
export QT_QPA_PLATFORM=offscreen
echo $(date)
touch /tmp/modem.txt
/usr/bin/casperjs modem.js "$(sshpass -p '[yourmodempasword]' ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 admin@[yourmodemip] uptime)" "$(cat /tmp/modem.txt;cat /dev/null > /tmp/modem.txt)"| grep -v TypeError | /usr/bin/node db.js
