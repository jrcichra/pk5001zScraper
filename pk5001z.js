const puppeteer = require('puppeteer-core');
const args = require('args');
const shell = require('shelljs');
require('console-stamp')(console, { pattern: 'dd/mm/yyyy HH:MM:ss.l' });

args
	.option('hostname', 'hostname (or ip) of the modem', '10.0.0.1')
	.option('username', 'modem username', 'admin')
	.option('password', 'modem password')
	.option('headless', true)
	.option('dbhostname', 'hostname for the db')
	.option('dbusername', 'username for the db account')
	.option('dbpassword', 'password for the db account')
	.option('dbdatabase', 'database in the database')

const flags = args.parse(process.argv, {
	mri: {
		boolean: ['headless']
	}
});
const timeout = 60 * 1000;

(async () => {
	//Load the browser 
	const browser = await puppeteer.launch({ headless: flags.headless, args: ['--start-maximized'], devtools: false, executablePath: 'chromium-browser' });
	const page = await browser.newPage();
	await page.setViewport({ width: 1920, height: 1080 });
	await page.setDefaultNavigationTimeout(timeout);
	if (flags.password != undefined) {
		//Try to login
		await page.goto('http://' + flags.hostname + '/login.cgi', {
			waitUntil: 'networkidle2'
		});
		//Type in the credentials and click login
		await page.evaluate((u, p) => {
			document.getElementById('admin_username').value = u;
			document.getElementById('admin_password').value = p;
			document.querySelector('#content_right_contentarea > form > div:nth-child(3) > a').click();
		}, flags.username, flags.password);
		//Wait for the page to load
		await page.waitForNavigation({ timeout: timeout });
		//click the modem status button
		await page.evaluate(() => {
			document.querySelector('#navigation > li.modemstatus > a').click();
		});
		//Wait for the click to process
		await page.waitForNavigation({ timeout: timeout });
		//Give it a moment to populate the javascript data
		await page.waitForSelector('#broadband > font > strong');
		//Get the data on this page
		let o = new Object();
		o = await page.evaluate((o) => {
			o.dsl_status = document.querySelector('#broadband > font > strong').innerText.trim();
			o.internet_status = document.querySelector('#ISPSTATS > font > strong').innerText.trim();
			o.firmware = document.querySelector('#content_right_contentarea > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > font > strong').innerText.trim();
			o.down_speed = document.querySelector('#dspeed').innerText.trim();
			o.up_speed = document.querySelector('#uspeed').innerText.trim();
			o.model_number = document.querySelector('#content_right_contentarea > div:nth-child(3) > table > tbody > tr:nth-child(3) > td:nth-child(2) > div').innerText.trim();
			o.hardware_revision = document.querySelector('#content_right_contentarea > div:nth-child(3) > table > tbody > tr:nth-child(4) > td:nth-child(2) > div').innerText.trim();
			o.serial_number = document.querySelector('#content_right_contentarea > div:nth-child(3) > table > tbody > tr:nth-child(5) > td:nth-child(2) > div').innerText.trim();
			o.isp_protocol = document.querySelector('#ISPTYPE').innerText.trim();
			o.ipv4_address = document.querySelector('#ModemIP > font > strong').innerText.trim();
			o.dnsv4_address_1 = document.querySelector('#ModemDNS1').innerText.trim();
			o.dnsv4_address_2 = document.querySelector('#ModemDNS2').innerText.trim();
			o.ipv6_address = document.querySelector('#ModemIPv6addr').innerText.trim();
			o.dnsv6_address_1 = document.querySelector('#ModemIPv6DNS1').innerText.trim();
			o.dnsv6_address_2 = document.querySelector('#ModemIPv6DNS2').innerText.trim().replace('\n', '');
			return o;
		}, o);
		//go to the DSL Status page
		await page.evaluate(() => {
			document.querySelector('#subnav > li:nth-child(3) > a').click();
		});
		//Wait for the click to process
		await page.waitForNavigation({ timeout: timeout });
		//Give it a moment to populate the javascript data
		await page.waitForSelector('#DSLMODE');
		//Get more data
		o = await page.evaluate((o) => {
			o.broadband_mode_setting = document.querySelector('#DSLMODE').innerText.trim();
			o.broadband_mode_detected = document.querySelector('#DSLMODEDECT').innerText.trim();
			o.link_uptime = document.querySelector('#DSLUPTIME').innerText.trim();
			o.retrains = document.querySelector('#RETRAINS').innerText.trim();
			o.retrains_24hr = document.querySelector('#RETRAINS24HR').innerText.trim();
			o.loss_of_power_link_failures = document.querySelector('#linkFailLPR').innerText.trim();
			o.loss_of_signal_link_failures = document.querySelector('#linkFailLOS').innerText.trim();
			o.link_train_errors = document.querySelector('#linkTrainErr').innerText.trim();
			o.unavailable_seconds = document.querySelector('#DSLUAS').innerText.trim();
			o.vpi = document.querySelector('#VPIVCI').innerText.split('/')[0].trim();
			o.vci = document.querySelector('#VPIVCI').innerText.split('/')[1].trim();
			o.priority = document.querySelector('#PRIORITY').innerText.trim();
			o.service_type = document.querySelector('#SERVICETYPE').innerText.trim();
			o.snr_down = document.querySelector('#DSLSNRDOWN').innerText.trim();
			o.snr_up = document.querySelector('#DSLSNRUP').innerText.trim();
			o.attenuation_down = document.querySelector('#DSLATTENDOWN').innerText.trim();
			o.attenuation_up = document.querySelector('#DSLATTENUP').innerText.trim();
			o.power_down = document.querySelector('#DSLPOWERDOWN').innerText.trim();
			o.power_up = document.querySelector('#DSLPOWERUP').innerText.trim();
			o.downstream_packets = document.querySelector('#dsldpkt').innerText.trim();
			o.upstream_packets = document.querySelector('#dslupkt').innerText.trim();
			o.downstream_error_packets = document.querySelector('#dslderrpkt').innerText.trim();
			o.upstream_error_packets = document.querySelector('#dsluerrpkt').innerText.trim();
			o.downstream_24hr_usage = document.querySelector('#dsldbyte24hr').innerText.trim();
			o.upstream_24hr_usage = document.querySelector('#dslubyte24hr').innerText.trim();
			o.downstream_total_usage = document.querySelector('#dsldbyteTotal').innerText.trim();
			o.upstream_total_usage = document.querySelector('#dslubyteTotal').innerText.trim();
			o.nearend_channel_type = document.querySelector('#CHANNELTYPE_NEAR').innerText.trim();
			o.farend_channel_type = document.querySelector('#CHANNELTYPE_FAR').innerText.trim();
			o.nearend_crc_errors = document.querySelector('#CRC_NEAR').innerText.trim();
			o.farend_crc_errors = document.querySelector('#CRC_FAR').innerText.trim();
			o.nearend_15min_crc = document.querySelector('#CRC_NEAR15M').innerText.trim();
			o.farend_15min_crc = document.querySelector('#CRC_FAR15M').innerText.trim();
			o.nearend_rs_crc = document.querySelector('#FEC_NEAR').innerText.trim();
			o.farend_rs_crc = document.querySelector('#FEC_FAR').innerText.trim();
			o.nearend_15min_fec = document.querySelector('#FEC_NEAR15M').innerText.trim();
			o.farend_15min_fec = document.querySelector('#FEC_FAR15M').innerText.trim();
			return o;
		}, o);
		//Click the logout button
		await page.evaluate(() => {
			document.querySelector('#logout_btn').click();
		});
		//Wait for the click to process
		await page.waitForNavigation({ timeout: timeout });
		//Make a syscall to get modem uptime via ssh
		o.uptime = shell.exec(`sshpass -p '${flags.password}' ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 ${flags.username}@${flags.hostname} uptime`).stdout;
		//Make another syscall to get ps info via ssh (for zombie parsing)
		o.ps = shell.exec(`sshpass -p '${flags.password}' ssh -oKexAlgorithms=+diffie-hellman-group1-sha1 ${flags.username}@${flags.hostname} ps`).stdout;
		//Insert the results into the database
		const options = {
			client: 'mysql2',
			connection: {
				host: flags.dbhostname,
				user: flags.dbusername,
				password: flags.dbpassword,
				database: flags.dbdatabase
			}
		};
		const knex = require('knex')(options);

		let sql = "insert into pk5001z(" + Object.keys(o).join(",") + ") values ('" + Object.keys(o).map(function (e) { return o[e] }).join("','") + "')\n";
		// console.log(sql)

		await knex.raw(sql).then(
			() => console.log(`Inserted a row`)
		).catch((err) => { console.log(err); throw err })
			.finally(() => {
				knex.destroy();
			});
	} else {
		console.error("Please enter a password to pk5001scraper!");
	}
	process.exit(0);
})();
