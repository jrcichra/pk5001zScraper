# pk5001zScraper
Get the data from your zyxel pk5001z modem and collect it!

(See the rpi branch for a pi compatible modification of master)

## Usage (use long flags)
```bash
Usage: pk5001z.js [options] [command]
  
  Commands:
    help     Display help
    version  Display version
  
  Options:
    -D, --dbdatabase        database in the database
    -d, --dbhostname        hostname for the db
    -D, --dbpassword        password for the db account
    -D, --dbusername        username for the db account
    -H, --headless          true
    -H, --help              Output usage information
    -h, --hostname [value]  hostname (or ip) of the modem (defaults to "10.0.0.1")
    -p, --password          modem password
    -u, --username [value]  modem username (defaults to "admin")
    -v, --version           Output the version number
```
