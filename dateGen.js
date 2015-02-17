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
				s.name = "Farming";
				s.slug = "farming";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Ranching";
				s.slug = "ranching";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Dairy";
				s.slug = "dairy";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Fishery";
				s.slug = "fishery";
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
			if (err) {

			}

			{
				var s = new Industry();
				s.name = "Music";
				s.slug = "music";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Arts and Crafts";
				s.slug = "arts_crafts";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Photography";
				s.slug = "photography";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Graphic Design";
				s.slug = "graphic_design";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Museums & Institutions";
				s.slug = "museums_institutions";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Performing Arts";
				s.slug = "performing_arts";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Fine Art";
				s.slug = "fine_art";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Motion Pictures & Film";
				s.slug = "motion_pictures_film";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Design";
				s.slug = "design";
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
		i.name = "Construction";
		i.slug = "construction";
		i.save(function (err) {
			if (err) {

			}
			{
				var s = new Industry();
				s.name = "Architecture & Planning";
				s.slug = "architecture_planning";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Civil Engineering";
				s.slug = "civil_engineering";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Building Material";
				s.slug = "building_material";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Construction";
				s.slug = "construction_sub";
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
		i.name = "Consumer Goods";
		i.slug = "comsumer_goods";
		i.save(function (err) {
			if (err) {

			}

			{
				var s = new Industry();
				s.name = "Import and Export";
				s.slug = "import_export";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Wholesale";
				s.slug = "wholesale";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Wine and Spirits";
				s.slug = "wine_spirits";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Luxury Goods & Jewelry";
				s.slug = "luxury_goods_jewelry";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Retail";
				s.slug = "retail";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Furniture";
				s.slug = "furniture";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Consumer Electronics";
				s.slug = "consumer_electronics";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Food Production";
				s.slug = "food_production";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Supermarkets";
				s.slug = "supermarkets";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Tobacco";
				s.slug = "tobacco";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Cosmetics";
				s.slug = "cosmetics";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Apparel & Fashion";
				s.slug = "apparel_fashion";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Sporting Goods";
				s.slug = "sporting_goods";
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
		i.name = "Corporate";
		i.slug = "corporate";
		i.save(function (err) {
			if (err) {

			}

			{
				var s = new Industry();
				s.name = "Staffing & Recruiting";
				s.slug = "staffing_recruiting";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Professional Training & Coaching";
				s.slug = "professional_training_coaching";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Security & Investigations";
				s.slug = "security_investigations";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Outsourcing/Offshoring";
				s.slug = "outsourcing_offshoring";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Facilities Services";
				s.slug = "facilities_services";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Business Supplies and Equipment";
				s.slug = "business_supplies_equipment";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Human Resources";
				s.slug = "human_resources ";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Marketing and Advertising";
				s.slug = "marketing_advertising";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Public Relations and Communications";
				s.slug = "public_relations_communications";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Market Research";
				s.slug = "market_research";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Management Consulting";
				s.slug = "management_consulting";
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
		i.name = "Educational";
		i.slug = "educational";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "E-Learning";
				s.slug = "elearning";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Research";
				s.slug = "research";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Education Managemen";
				s.slug = "education_managemen";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Primary/Secondary Education";
				s.slug = "primary_secondary_education";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Higher Education";
				s.slug = "higher_education";
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
		i.name = "Government";
		i.slug = "government";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Venture Capital & Private Equity";
				s.slug = "venture_capital_private_equity";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Capital Markets";
				s.slug = "capital_markets";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Commercial Real Estate";
				s.slug = "commercial_real_estate";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Banking";
				s.slug = "banking";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Insurance";
				s.slug = "insurance";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Investment Management";
				s.slug = "investment_management";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Investment Banking";
				s.slug = "investment_banking";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Real Estate";
				s.slug = "real_estate";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Financial Services";
				s.slug = "financial_services";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Accounting";
				s.slug = "accounting";
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
		i.name = "Government";
		i.slug = "government";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Political Organization";
				s.slug = "political_organization";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Government Relations";
				s.slug = "government_relations";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Executive Office";
				s.slug = "executive_office";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Law Enforcement";
				s.slug = "law_enforcement";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Public Safety";
				s.slug = "public_safety";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Public Policy";
				s.slug = "public_policy";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Government Administration";
				s.slug = "government_administration";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "International Affairs";
				s.slug = "international_affairs";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Judiciary";
				s.slug = "judiciary";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Legislative Office";
				s.slug = "legislative_office";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Military";
				s.slug = "military";
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
		i.name = "High Tech";
		i.slug = "hightech";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Computer & Network Security";
				s.slug = "computer_network_security";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Nanotechnology";
				s.slug = "nanotechnology";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Wireless";
				s.slug = "wireless";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Defense & Space";
				s.slug = "defense_space";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Computer Hardware";
				s.slug = "computer_hardware";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Computer Software";
				s.slug = "computer_software";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Computer Networking";
				s.slug = "computer_networking";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Internet";
				s.slug = "internet";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Semiconductors";
				s.slug = "semiconductors";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Telecommunications";
				s.slug = "telecommunications";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Information Technology and Services";
				s.slug = "information_technology_services";
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
		i.name = "Legal";
		i.slug = "legal";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Alternative Dispute Resolution";
				s.slug = "alternative_dispute_resolution";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Law Practice";
				s.slug = "law_practice";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Legal Services";
				s.slug = "legal_services";
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
		i.name = "Manufacturing";
		i.slug = "manufacturing";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Plastics";
				s.slug = "plastics";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Electrical/Electronic Manufacturing";
				s.slug = "electrical_electronic_manufacturing";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Mechanical or Industrial Engineering";
				s.slug = "mechanical_industrial_engineering";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Industrial Automation";
				s.slug = "industrial_automation";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Packaging and Containers";
				s.slug = "packaging_containers";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Glass, Ceramics & Concrete";
				s.slug = "glass_ceramics_concrete";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Renewables & Environment";
				s.slug = "renewables_environment";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Textiles";
				s.slug = "textiles";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Paper & Forest Products";
				s.slug = "paper_forest_products";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Railroad Manufacture";
				s.slug = "railroad_manufacture";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Machinery";
				s.slug = "machinery";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Chemicals";
				s.slug = "chemicals";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Oil & Energy";
				s.slug = "oil_energy";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Mining & Metals";
				s.slug = "mining_metals";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Utilities";
				s.slug = "utilities";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Shipbuilding";
				s.slug = "shipbuilding";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Aviation & Aerospace";
				s.slug = "aviation_aerospace";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Automotive";
				s.slug = "automotive";
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
		i.name = "Media";
		i.slug = "media";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Writing and Editing";
				s.slug = "writing_editing";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Online Media";
				s.slug = "online_media";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Animation";
				s.slug = "animation";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Media Production";
				s.slug = "media_production";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Broadcast Media";
				s.slug = "broadcast_media";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Printing";
				s.slug = "printing";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Publishing";
				s.slug = "publishing";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Newpapers";
				s.slug = "newpapers";
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
		i.name = "Medical";
		i.slug = "medical";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Alternative Medicine";
				s.slug = "alternative_medicine";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Health, Wellness and Fitness";
				s.slug = "health_wellness_fitness";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Mental Health Care";
				s.slug = "mental_health_care";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Veterinary";
				s.slug = "veterinary";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Medical Devices";
				s.slug = "medical_devices";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Hospital & Health Care";
				s.slug = "hospital_health_care";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Pharmaceuticals";
				s.slug = "pharmaceuticals";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Biotechnology";
				s.slug = "biotechnology";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Medical Practice";
				s.slug = "medical_practice";
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
		i.name = "Non-profit";
		i.slug = "nonprofit";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Program Development";
				s.slug = "program_development";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Nonprofit Organization Management";
				s.slug = "nonprofit_organization_management";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Fund-Raising";
				s.slug = "fund_raising";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Think Tanks";
				s.slug = "think_tanks";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Philanthropy";
				s.slug = "philanthropy";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "International Trade and Development";
				s.slug = "international_trade_development ";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Consumer Services";
				s.slug = "consumer_services";
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
		i.name = "Recreational";
		i.slug = "recreational";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Computer Games";
				s.slug = "computer_games";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Events Services";
				s.slug = "events_services";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Recreational Facilities and Services";
				s.slug = "recreational_facilities_services";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Sports";
				s.slug = "sports";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Restaurants";
				s.slug = "restaurants";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Food & Beverages";
				s.slug = "food_feverages";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Leisure, Travel & Tourism";
				s.slug = "leisure_travel_tourism";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Entertainment";
				s.slug = "entertainment";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Gambling & Casinos";
				s.slug = "gambling_casinos";
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
		i.name = "Service";
		i.slug = "service";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Translation and Localization";
				s.slug = "translation_localization";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Information Services";
				s.slug = "information_services";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Environmental Services";
				s.slug = "environmental_services";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Libraries";
				s.slug = "libraries";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Civic & Social Organization";
				s.slug = "civic_social_organization";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Religious Institutions";
				s.slug = "religious_institutions";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Individual & Family Services";
				s.slug = "individual_family_services";
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
		i.name = "Transportation";
		i.slug = "transportation";
		i.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Logistics and Supply Chain";
				s.slug = "logistics_supply_chain";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Warehousing";
				s.slug = "warehousing";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Transportation/Trucking/Railroad";
				s.slug = "transportation_trucking_railroad";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Maritime";
				s.slug = "maritime";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Airlines/Aviation";
				s.slug = "airlines_aviation";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Package/Freight Delivery";
				s.slug = "package/freight_delivery";
				s.parent = i;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
}

setTimeout(function() {
    mongoose.disconnect();
}, 3000);