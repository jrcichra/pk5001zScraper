var casper = require('casper').create({
	viewportSize: {
		width: 1920,
		height: 1080,
	}
});
const system = require('system');
const ip = '10.0.0.1';
const addr = 'http://' + ip;

casper.start(addr+'/login.cgi',function(){
	//Increase all timeouts on waits
	this.options.waitTimeout = 60 * 1000;
	//login
	this.thenEvaluate(function(){
		var username = document.getElementById('admin_username');
		username.value = 'admin';
		var password = document.getElementById('admin_password');
		password.value = 'passwordhere';
	});
	//click the login button
	this.then(function(){
		this.click('#content_right_contentarea > form > div:nth-child(3) > a');
	});
	//wait for the bubble page
	this.waitForUrl(addr+'/index.cgi', function () {

		//click the modem status button
		this.then(function(){
			this.click('#navigation > li.modemstatus > a');
		});
		//wait for the modem status page to populate with the javascript it runs
		this.waitForSelector('#broadband > font > strong', function () {
			//Get the data
			//this.echo(this.getHTML());
			var o = new Object();
			o.dsl_status = this.getElementInfo('#broadband > font > strong').text.trim();
			o.internet_status = this.getElementInfo('#ISPSTATS > font > strong').text.trim();
			o.firmware = this.getElementInfo('#content_right_contentarea > div:nth-child(3) > table > tbody > tr:nth-child(2) > td:nth-child(2) > div > font > strong').text.trim();
			o.down_speed = this.getElementInfo('#dspeed').text.trim();
			o.up_speed = this.getElementInfo('#uspeed').text.trim();
			o.model_number = this.getElementInfo('#content_right_contentarea > div:nth-child(3) > table > tbody > tr:nth-child(3) > td:nth-child(2) > div').text.trim();
			o.hardware_revision = this.getElementInfo('#content_right_contentarea > div:nth-child(3) > table > tbody > tr:nth-child(4) > td:nth-child(2) > div').text.trim();
			o.serial_number = this.getElementInfo('#content_right_contentarea > div:nth-child(3) > table > tbody > tr:nth-child(5) > td:nth-child(2) > div').text.trim();
			o.isp_protocol = this.getElementInfo('#ISPTYPE').text.trim();
			o.ipv4_address = this.getElementInfo('#ModemIP > font > strong').text.trim();
			o.dnsv4_address_1 = this.getElementInfo('#ModemDNS1').text.trim();
			o.dnsv4_address_2 = this.getElementInfo('#ModemDNS2').text.trim();
			o.ipv6_address = this.getElementInfo('#ModemIPv6addr').text.trim();
			o.dnsv6_address_1 = this.getElementInfo('#ModemIPv6DNS1').text.trim();
			o.dnsv6_address_2 = this.getElementInfo('#ModemIPv6DNS2').text.trim().replace('\n','');
			//go to the DSL Status page
			this.then(function(){
				this.click('#subnav > li:nth-child(3) > a');
			});
			//wait for the DSL Status page
			this.waitForSelector('#DSLMODE',function(){
				o.broadband_mode_setting = this.getElementInfo('#DSLMODE').text.trim();
				o.broadband_mode_detected = this.getElementInfo('#DSLMODEDECT').text.trim();
				o.link_uptime = this.getElementInfo('#DSLUPTIME').text.trim();
				o.retrains = this.getElementInfo('#RETRAINS').text.trim();
				o.retrains_24hr = this.getElementInfo('#RETRAINS24HR').text.trim();
				o.loss_of_power_link_failures = this.getElementInfo('#linkFailLPR').text.trim();
				o.loss_of_signal_link_failures = this.getElementInfo('#linkFailLOS').text.trim();
				o.link_train_errors = this.getElementInfo('#linkTrainErr').text.trim();
				o.unavailable_seconds = this.getElementInfo('#DSLUAS').text.trim();
				o.vpi = this.getElementInfo('#VPIVCI').text.split('/')[0].trim();
				o.vci = this.getElementInfo('#VPIVCI').text.split('/')[1].trim();
				o.priority = this.getElementInfo('#PRIORITY').text.trim();
				o.service_type = this.getElementInfo('#SERVICETYPE').text.trim();
				o.snr_down = this.getElementInfo('#DSLSNRDOWN').text.trim();
				o.snr_up = this.getElementInfo('#DSLSNRUP').text.trim();
				o.attenuation_down = this.getElementInfo('#DSLATTENDOWN').text.trim();
				o.attenuation_up = this.getElementInfo('#DSLATTENUP').text.trim();
				o.power_down = this.getElementInfo('#DSLPOWERDOWN').text.trim();
				o.power_up = this.getElementInfo('#DSLPOWERUP').text.trim();
				o.downstream_packets = this.getElementInfo('#dsldpkt').text.trim();
				o.upstream_packets = this.getElementInfo('#dslupkt').text.trim();
				o.downstream_error_packets = this.getElementInfo('#dslderrpkt').text.trim();
				o.upstream_error_packets = this.getElementInfo('#dsluerrpkt').text.trim();
				o.downstream_24hr_usage = this.getElementInfo('#dsldbyte24hr').text.trim();
				o.upstream_24hr_usage = this.getElementInfo('#dslubyte24hr').text.trim();
				o.downstream_total_usage = this.getElementInfo('#dsldbyteTotal').text.trim();
				o.upstream_total_usage = this.getElementInfo('#dslubyteTotal').text.trim();
				o.nearend_channel_type = this.getElementInfo('#CHANNELTYPE_NEAR').text.trim();
				o.farend_channel_type = this.getElementInfo('#CHANNELTYPE_FAR').text.trim();
				o.nearend_crc_errors = this.getElementInfo('#CRC_NEAR').text.trim();
				o.farend_crc_errors = this.getElementInfo('#CRC_FAR').text.trim();
				o.nearend_15min_crc = this.getElementInfo('#CRC_NEAR15M').text.trim();
				o.farend_15min_crc = this.getElementInfo('#CRC_FAR15M').text.trim();
				o.nearend_rs_crc = this.getElementInfo('#FEC_NEAR').text.trim();
				o.farend_rs_crc = this.getElementInfo('#FEC_FAR').text.trim();
				o.nearend_15min_fec = this.getElementInfo('#FEC_NEAR15M').text.trim();
				o.farend_15min_fec = this.getElementInfo('#FEC_FAR15M').text.trim();
				o.uptime = casper.cli.args[0].trim();
				if(casper.cli.args[1] != ""){
					o.comment = casper.cli.args[1].trim();
				}

				//require('utils').dump(o);
				//system.stdout.write(JSON.stringify(o,null,2));
				//insert statement to be sent to the db.js (convert javascript object to insert statement)
				system.stdout.write("insert into pk5001z(" + Object.keys(o).join(",") + ") values ('" + Object.keys(o).map(function(e){return o[e]}).join("','") + "')\n");
				//build the table
				//this.echo('\n' + 'create table snapshot (' + Object.keys(o).join(' varchar(255),\n') + ');');
				this.then(function(){
					this.click('#logout_btn');
				});
			});
		});
	});
});
casper.run();
