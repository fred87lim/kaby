var log                 = require('./app/log')(module);
var mongoose = require('mongoose');
var config = require('./config/config');
var PrivacySetting  = require('./app/models/privacy_setting');
var Tag  = require('./app/models/tag');
var Category = require('./app/models/category');
var City = require('./app/models/city');
var Country = require('./app/models/country');
var JobFunction = require('./app/models/job_function');
var Industry = require('./app/models/settings/industry');

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

// Job Function
{
	{
		var jf = new JobFunction();
		jf.name = "Accounting";
		jf.slug = "accounting";
		jf.save(function (err) {
			if (err) { }
		});
	}

	{
		var jf = new JobFunction();
		jf.name = "Administrative";
		jf.slug = "administrative";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Arts and Design";
		jf.slug = "arts";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Business Development";
		jf.slug = "bizdev";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Community and Social Services";
		jf.slug = "comsocial";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Consulting";
		jf.slug = "consulting";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Education";
		jf.slug = "education";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Engineering";
		jf.slug = "engineering";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Entrepreneurship";
		jf.slug = "entrepreneurship";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Finance";
		jf.slug = "finance";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Healthcare Services";
		jf.slug = "healthcare";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Human Resources";
		jf.slug = "humanresource";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Information Technology";
		jf.slug = "it";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Legal";
		jf.slug = "legal";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Marketing";
		jf.slug = "marketing";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Media and Communication";
		jf.slug = "mediacomm";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Military and Protective Services";
		jf.slug = "military";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Operations";
		jf.slug = "operations";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Product Management";
		jf.slug = "productmanagement";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Program and Project Management";
		jf.slug = "projectmanagement";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Purchasing";
		jf.slug = "purchasing";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Quality Assurance";
		jf.slug = "qualityassurance";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Real Estate";
		jf.slug = "realestate";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Research";
		jf.slug = "research";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Sales";
		jf.slug = "sales";
		jf.save(function (err) {
			if (err) { }
		});
	}
	{
		var jf = new JobFunction();
		jf.name = "Support";
		jf.slug = "support";
		jf.save(function (err) {
			if (err) { }
		});
	}
}

// Industry
{
	{
		var i = new Industry();
		i.name = "Agriculture";
		i.slug = "agriculture";
		i.save(function (err) {
			if (err) { 

			}

			{
				var s = new Industry();
				s.name = "";
				s.slug = "";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var i = new Industry();
		i.name = "Arts";
		i.slug = "arts";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Construction";
		i.slug = "construction";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Consumer Goods";
		i.slug = "comsumer";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Corporate";
		i.slug = "corporate";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Educational";
		i.slug = "educational";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Construction";
		i.slug = "construction";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Finance";
		i.slug = "finance";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Government";
		i.slug = "government";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Government";
		i.slug = "government";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Government";
		i.slug = "government";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "High Tech";
		i.slug = "hightech";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Legal";
		i.slug = "legal";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Manufacturing";
		i.slug = "manufacturing";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Media";
		i.slug = "media";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Medical";
		i.slug = "medical";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Non-profit";
		i.slug = "nonprofit";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Recreational";
		i.slug = "recreational";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Service";
		i.slug = "service";
		i.save(function (err) {
			if (err) { }
		});
	}
	{
		var i = new Industry();
		i.name = "Transportation";
		i.slug = "transportation";
		i.save(function (err) {
			if (err) { }
		});
	}
}

setTimeout(function() {
    mongoose.disconnect();
}, 3000);