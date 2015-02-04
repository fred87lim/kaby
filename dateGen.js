var log                 = require('./app/log')(module);
var mongoose = require('mongoose');
var config = require('./config/config');
var PrivacySetting  = require('./app/models/privacy_setting');
var Tag  = require('./app/models/tag');
var Category = require('./app/models/category');
var City = require('./app/models/city');
var Country = require('./app/models/country');

/* Establish mongoose connection */
mongoose.connect(config.db['development']);
var db = mongoose.connection;
db.on('error', function (err) {
    log.error('connection error:', err.message);
});
db.once('open', function callback () {
    log.info("Connected to DB!");
});

{
	var privacy = new PrivacySetting();
	privacy.name = 'PUBLIC';
	privacy.value = 1;
	privacy.description = 'Everyone can see';

	privacy.save(function (err) {
		if (err) {
			log.error(err);
		}
	});
}

{
	var privacy = new PrivacySetting();
	privacy.name = 'Employers';
	privacy.value = 2;
	privacy.description = 'My employer and the ones I apply for job';

	privacy.save(function (err) {
		if (err) {
			log.error(err);
		}
	});
}

{
	var privacy = new PrivacySetting();
	privacy.name = 'Friends';
	privacy.value = 3;
	privacy.description = 'My friends';

	privacy.save(function (err) {
		if (err) {
			log.error(err);
		}
	});
}

{
	var privacy = new PrivacySetting();
	privacy.name = 'Only Me';
	privacy.value = 4;
	privacy.description = 'Only me';

	privacy.save(function (err) {
		if (err) {
			log.error(err);
		}
	});
}

{
	var tag = new Tag();
	tag.name = 'NodeJS';
	tag.slug = 'nodejs';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var tag = new Tag();
	tag.name = 'Java';
	tag.slug = 'java';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var tag = new Tag();
	tag.name = 'Javascript';
	tag.slug = 'javascript';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var tag = new Tag();
	tag.name = 'Android';
	tag.slug = 'android';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var tag = new Tag();
	tag.name = 'Google Maps';
	tag.slug = 'google-maps';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var tag = new Tag();
	tag.name = 'NodeJS';
	tag.slug = 'nodejs';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var tag = new Tag();
	tag.name = 'Startup';
	tag.slug = 'startup';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var tag = new Tag();
	tag.name = 'eCommerce';
	tag.slug = 'ecommerce';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var tag = new Tag();
	tag.name = 'Mobile';
	tag.slug = 'mobile';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var tag = new Tag();
	tag.name = 'Enterprise';
	tag.slug = 'enterprise';
	tag.save(function (err) {
		if (err) { }
	});
}
{
	var category = new Category();
	category.name = 'General';
	category.slug = 'general';
	category.save(function (err) {
		if (err) { }
	})
}
{
	var sg = new Country();
	sg.name = 'Singapore';
	sg.code = 65;
	sg.iso = 'SG';
	sg.save(function (err) {
		if (!err) {
			{
				var sing = new City();
				sing.name = 'Singapore';
				sing.country = sg;
				sing.save(function (err) {
					if (err) { }
				});
			}
		}
	});
}

{
	var us = new Country();
	us.name = 'United States';
	us.code = 1;
	us.iso = 'US';
	us.save(function (err) {
		if (!err) {
			{
				var city = new City();
				city.name = 'Boston';
				city.country = us;
				city.save(function (err) {
					if (err) { }
				});
			}
			{
				var city = new City();
				city.name = 'Chicago';
				city.country = us;
				city.save(function (err) {
					if (err) { }
				});
			}
			{
				var city = new City();
				city.name = 'San Diego';
				city.country = us;
				city.save(function (err) {
					if (err) { }
				});
			}
			{
				var city = new City();
				city.name = 'San Francisco';
				city.country = us;
				city.save(function (err) {
					if (err) { }
				});
			}
		}
	});
}

setTimeout(function() {
    mongoose.disconnect();
}, 3000);