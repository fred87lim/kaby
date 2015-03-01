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
var JobTitle = require('./app/models/settings/title');

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
		var it = new JobFunction();
		it.name = "Information Technology";
		it.slug = "information_technology";
		it.save(function (err) {
			if (err) { 

			}

			var title = new JobTitle();
			title.name = 'Application Developer';
			title.slug = 'application_developer';
			title.jobFunction = it;
			title.save(function (err) {
				if (err) {

				}
			});

			var title = new JobTitle();
			title.name = 'Database Administrator';
			title.slug = 'database_aministrator';
			title.jobFunction = it;
			title.save(function (err) {
				if (err) {

				}
			});

			var title = new JobTitle();
			title.name = 'Software Engineer';
			title.slug = 'software_engineer';
			title.jobFunction = it;
			title.save(function (err) {
				if (err) {

				}
			});

			var title = new JobTitle();
			title.name = 'System Engineer';
			title.slug = 'system_engineer';
			title.jobFunction = it;
			title.save(function (err) {
				if (err) {

				}
			});


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
		var agriculture = new Industry();
		agriculture.name = "Agriculture";
		agriculture.slug = "agriculture";
		agriculture.save(function (err) {
			if (err) { 

			}

			{
				var s = new Industry();
				s.name = "Farming";
				s.slug = "farming";
				s.parent = agriculture;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Ranching";
				s.slug = "ranching";
				s.parent = agriculture;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Dairy";
				s.slug = "dairy";
				s.parent = agriculture;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Fishery";
				s.slug = "fishery";
				s.parent = agriculture;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var arts = new Industry();
		arts.name = "Arts";
		arts.slug = "arts";
		arts.save(function (err) {
			if (err) {

			}

			{
				var s = new Industry();
				s.name = "Music";
				s.slug = "music";
				s.parent = arts;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Arts and Crafts";
				s.slug = "arts_crafts";
				s.parent = arts;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Photography";
				s.slug = "photography";
				s.parent = arts;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Graphic Design";
				s.slug = "graphic_design";
				s.parent = arts;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Museums & Institutions";
				s.slug = "museums_institutions";
				s.parent = arts;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Performing Arts";
				s.slug = "performing_arts";
				s.parent = arts;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Fine Art";
				s.slug = "fine_art";
				s.parent = arts;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Motion Pictures & Film";
				s.slug = "motion_pictures_film";
				s.parent = arts;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Design";
				s.slug = "design";
				s.parent = arts;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var construction = new Industry();
		construction.name = "Construction";
		construction.slug = "construction";
		construction.save(function (err) {
			if (err) {

			}
			{
				var s = new Industry();
				s.name = "Architecture & Planning";
				s.slug = "architecture_planning";
				s.parent = construction;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Civil Engineering";
				s.slug = "civil_engineering";
				s.parent = construction;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Building Material";
				s.slug = "building_material";
				s.parent = construction;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Construction";
				s.slug = "construction_sub";
				s.parent = construction;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var comsumer_goods = new Industry();
		comsumer_goods.name = "Consumer Goods";
		comsumer_goods.slug = "comsumer_goods";
		comsumer_goods.save(function (err) {
			if (err) {

			}

			{
				var s = new Industry();
				s.name = "Import and Export";
				s.slug = "import_export";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Wholesale";
				s.slug = "wholesale";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Wine and Spirits";
				s.slug = "wine_spirits";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Luxury Goods & Jewelry";
				s.slug = "luxury_goods_jewelry";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Retail";
				s.slug = "retail";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Furniture";
				s.slug = "furniture";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Consumer Electronics";
				s.slug = "consumer_electronics";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Food Production";
				s.slug = "food_production";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Supermarkets";
				s.slug = "supermarkets";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Tobacco";
				s.slug = "tobacco";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Cosmetics";
				s.slug = "cosmetics";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Apparel & Fashion";
				s.slug = "apparel_fashion";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Sporting Goods";
				s.slug = "sporting_goods";
				s.parent = comsumer_goods;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var corporate = new Industry();
		corporate.name = "Corporate";
		corporate.slug = "corporate";
		corporate.save(function (err) {
			if (err) {

			}

			{
				var s = new Industry();
				s.name = "Staffing & Recruiting";
				s.slug = "staffing_recruiting";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Professional Training & Coaching";
				s.slug = "professional_training_coaching";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Security & Investigations";
				s.slug = "security_investigations";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Outsourcing/Offshoring";
				s.slug = "outsourcing_offshoring";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Facilities Services";
				s.slug = "facilities_services";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Business Supplies and Equipment";
				s.slug = "business_supplies_equipment";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Human Resources";
				s.slug = "human_resources ";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Marketing and Advertising";
				s.slug = "marketing_advertising";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Public Relations and Communications";
				s.slug = "public_relations_communications";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Market Research";
				s.slug = "market_research";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Management Consulting";
				s.slug = "management_consulting";
				s.parent = corporate;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var educational = new Industry();
		educational.name = "Educational";
		educational.slug = "educational";
		educational.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "E-Learning";
				s.slug = "elearning";
				s.parent = educational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Research";
				s.slug = "research";
				s.parent = educational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Education Managemen";
				s.slug = "education_managemen";
				s.parent = educational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Primary/Secondary Education";
				s.slug = "primary_secondary_education";
				s.parent = educational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Higher Education";
				s.slug = "higher_education";
				s.parent = educational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			
		});
	}
	{
		var finance = new Industry();
		finance.name = "Finance";
		finance.slug = "finance";
		finance.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Venture Capital & Private Equity";
				s.slug = "venture_capital_private_equity";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Capital Markets";
				s.slug = "capital_markets";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Commercial Real Estate";
				s.slug = "commercial_real_estate";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Banking";
				s.slug = "banking";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Insurance";
				s.slug = "insurance";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Investment Management";
				s.slug = "investment_management";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Investment Banking";
				s.slug = "investment_banking";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Real Estate";
				s.slug = "real_estate";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Financial Services";
				s.slug = "financial_services";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Accounting";
				s.slug = "accounting";
				s.parent = finance;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			
		});
	}
	{
		var government = new Industry();
		government.name = "Government";
		government.slug = "government";
		government.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Political Organization";
				s.slug = "political_organization";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Government Relations";
				s.slug = "government_relations";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Executive Office";
				s.slug = "executive_office";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Law Enforcement";
				s.slug = "law_enforcement";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Public Safety";
				s.slug = "public_safety";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Public Policy";
				s.slug = "public_policy";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Government Administration";
				s.slug = "government_administration";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "International Affairs";
				s.slug = "international_affairs";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Judiciary";
				s.slug = "judiciary";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Legislative Office";
				s.slug = "legislative_office";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Military";
				s.slug = "military";
				s.parent = government;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			
		});
	}
	{
		var hightech = new Industry();
		hightech.name = "High Tech";
		hightech.slug = "hightech";
		hightech.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Computer & Network Security";
				s.slug = "computer_network_security";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Nanotechnology";
				s.slug = "nanotechnology";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Wireless";
				s.slug = "wireless";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Defense & Space";
				s.slug = "defense_space";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Computer Hardware";
				s.slug = "computer_hardware";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Computer Software";
				s.slug = "computer_software";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Computer Networking";
				s.slug = "computer_networking";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Internet";
				s.slug = "internet";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Semiconductors";
				s.slug = "semiconductors";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Telecommunications";
				s.slug = "telecommunications";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Information Technology and Services";
				s.slug = "information_technology_services";
				s.parent = hightech;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			
		});
	}
	{
		var legal = new Industry();
		legal.name = "Legal";
		legal.slug = "legal";
		legal.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Alternative Dispute Resolution";
				s.slug = "alternative_dispute_resolution";
				s.parent = legal;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Law Practice";
				s.slug = "law_practice";
				s.parent = legal;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Legal Services";
				s.slug = "legal_services";
				s.parent = legal;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var manufacturing = new Industry();
		manufacturing.name = "Manufacturing";
		manufacturing.slug = "manufacturing";
		manufacturing.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Plastics";
				s.slug = "plastics";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Electrical/Electronic Manufacturing";
				s.slug = "electrical_electronic_manufacturing";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Mechanical or Industrial Engineering";
				s.slug = "mechanical_industrial_engineering";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Industrial Automation";
				s.slug = "industrial_automation";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Packaging and Containers";
				s.slug = "packaging_containers";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Glass, Ceramics & Concrete";
				s.slug = "glass_ceramics_concrete";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Renewables & Environment";
				s.slug = "renewables_environment";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Textiles";
				s.slug = "textiles";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Paper & Forest Products";
				s.slug = "paper_forest_products";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Railroad Manufacture";
				s.slug = "railroad_manufacture";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Machinery";
				s.slug = "machinery";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Chemicals";
				s.slug = "chemicals";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Oil & Energy";
				s.slug = "oil_energy";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Mining & Metals";
				s.slug = "mining_metals";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Utilities";
				s.slug = "utilities";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Shipbuilding";
				s.slug = "shipbuilding";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Aviation & Aerospace";
				s.slug = "aviation_aerospace";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Automotive";
				s.slug = "automotive";
				s.parent = manufacturing;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			
		});
	}
	{
		var media = new Industry();
		media.name = "Media";
		media.slug = "media";
		media.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Writing and Editing";
				s.slug = "writing_editing";
				s.parent = media;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Online Media";
				s.slug = "online_media";
				s.parent = media;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Animation";
				s.slug = "animation";
				s.parent = media;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Media Production";
				s.slug = "media_production";
				s.parent = media;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Broadcast Media";
				s.slug = "broadcast_media";
				s.parent = media;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Printing";
				s.slug = "printing";
				s.parent = media;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Publishing";
				s.slug = "publishing";
				s.parent = media;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Newpapers";
				s.slug = "newpapers";
				s.parent = media;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var medical = new Industry();
		medical.name = "Medical";
		medical.slug = "medical";
		medical.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Alternative Medicine";
				s.slug = "alternative_medicine";
				s.parent = medical;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Health, Wellness and Fitness";
				s.slug = "health_wellness_fitness";
				s.parent = medical;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Mental Health Care";
				s.slug = "mental_health_care";
				s.parent = medical;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Veterinary";
				s.slug = "veterinary";
				s.parent = medical;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Medical Devices";
				s.slug = "medical_devices";
				s.parent = medical;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Hospital & Health Care";
				s.slug = "hospital_health_care";
				s.parent = medical;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Pharmaceuticals";
				s.slug = "pharmaceuticals";
				s.parent = medical;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Biotechnology";
				s.slug = "biotechnology";
				s.parent = medical;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}{
				var s = new Industry();
				s.name = "Medical Practice";
				s.slug = "medical_practice";
				s.parent = medical;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var nonprofit = new Industry();
		nonprofit.name = "Non-profit";
		nonprofit.slug = "nonprofit";
		nonprofit.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Program Development";
				s.slug = "program_development";
				s.parent = nonprofit;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Nonprofit Organization Management";
				s.slug = "nonprofit_organization_management";
				s.parent = nonprofit;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Fund-Raising";
				s.slug = "fund_raising";
				s.parent = nonprofit;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Think Tanks";
				s.slug = "think_tanks";
				s.parent = nonprofit;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Philanthropy";
				s.slug = "philanthropy";
				s.parent = nonprofit;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "International Trade and Development";
				s.slug = "international_trade_development ";
				s.parent = nonprofit;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Consumer Services";
				s.slug = "consumer_services";
				s.parent = nonprofit;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var recreational = new Industry();
		recreational.name = "Recreational";
		recreational.slug = "recreational";
		recreational.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Computer Games";
				s.slug = "computer_games";
				s.parent = recreational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Events Services";
				s.slug = "events_services";
				s.parent = recreational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Recreational Facilities and Services";
				s.slug = "recreational_facilities_services";
				s.parent = recreational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Sports";
				s.slug = "sports";
				s.parent = recreational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Restaurants";
				s.slug = "restaurants";
				s.parent = recreational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Food & Beverages";
				s.slug = "food_feverages";
				s.parent = recreational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Leisure, Travel & Tourism";
				s.slug = "leisure_travel_tourism";
				s.parent = recreational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Entertainment";
				s.slug = "entertainment";
				s.parent = recreational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Gambling & Casinos";
				s.slug = "gambling_casinos";
				s.parent = recreational;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var service = new Industry();
		service.name = "Service";
		service.slug = "service";
		service.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Translation and Localization";
				s.slug = "translation_localization";
				s.parent = service;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Information Services";
				s.slug = "information_services";
				s.parent = service;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Environmental Services";
				s.slug = "environmental_services";
				s.parent = service;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Libraries";
				s.slug = "libraries";
				s.parent = service;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Civic & Social Organization";
				s.slug = "civic_social_organization";
				s.parent = service;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Religious Institutions";
				s.slug = "religious_institutions";
				s.parent = service;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Individual & Family Services";
				s.slug = "individual_family_services";
				s.parent = service;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
		});
	}
	{
		var transportation = new Industry();
		transportation.name = "Transportation";
		transportation.slug = "transportation";
		transportation.save(function (err) {
			if (err) { }

			{
				var s = new Industry();
				s.name = "Logistics and Supply Chain";
				s.slug = "logistics_supply_chain";
				s.parent = transportation;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Warehousing";
				s.slug = "warehousing";
				s.parent = transportation;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Transportation/Trucking/Railroad";
				s.slug = "transportation_trucking_railroad";
				s.parent = transportation;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Maritime";
				s.slug = "maritime";
				s.parent = transportation;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Airlines/Aviation";
				s.slug = "airlines_aviation";
				s.parent = transportation;
				s.save(function (err) {
					if (err) {
						
					}
				});
			}
			{
				var s = new Industry();
				s.name = "Package/Freight Delivery";
				s.slug = "package/freight_delivery";
				s.parent = transportation;
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









// Accounting Job Titles

// Accounting Clerk
// Accounting Clerk Leader
// Accounting Director
// Accounting Manager
// Accounting Supervisor
// Accounting Vice President
// Accounts Supervisor
// Assistant Director of Finance
// Assistant Director of Financial Operations
// Audit Supervisor
// Auditor
// Bookkeeper
// Budget Analyst
// Budget Manager
// Bursar
// Certified Public Accountant
// Chief Accounting Officer
// Chief Financial Officer
// Compliance Auditor
// Contracts and Financial Compliance Manager
// Controller
// Corporate Accountant
// Ads
// Marie France Bodyline
// www.mariefrance.com.sg
// Win up to $500 treatment vouchers with our Sure-Win Ang Bao Draw!
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// accounting&payroll POLAND
// www.macaccounting.pl
// we ensure full compliance with Polish requirements - ltd & plc
// Job Cost Accounting
// I Need a New Job
// Finance Manager
// Accounting CPA
// Actuary Jobs
// Cost Accountant
// Director of Financial Operations
// E - L

// Environmental Auditor
// External Auditor
// Financial Analyst
// Financial Assurance Manager
// Financial Assurance Specialist
// Forensic Accountant
// Gift Administration Specialist
// Gift Assurance Officer
// Government Accountant
// Government Auditor
// Grants and Contracts Assistant
// Grants and Contracts Specialist
// Industrial Accountant
// Information Technology Audit Manager
// Information Technology Auditor
// Internal Auditor
// M - R

// Management Accountant
// Managerial Accountant
// Payroll Manager
// Payroll Services Analyst
// Private Accountant
// Public Accountant
// Revenue Cycle Administrator
// Revenue Cycle Manager
// Revenue Cycle Supervisor
// S - Z

// Senior Auditor
// Senior Budget Analyst
// Senior Cash Management Analyst
// Senior Financial Analyst
// Senior General Audit Manager
// Senior Gift Assurance Officer
// Senior Grants and Contracts Specialist
// Senior Strategic Planner
// Staff Accountant
// Staff Auditor
// Strategic Planner
// Strategic Planning and Institutional Analysis Manager
// Strategic Program Planning Advisor
// Tax Accountant
// Tax Specialist



// Administrative Job Titles

// A - D

// Administrative Assistant
// Administrative Coordinator
// Administrative Director
// Administrative Manager
// Administrative Services Manager
// Administrative Services Officer
// Administrative Specialist
// Administrative Support Manager
// Administrative Support Supervisor
// Administrator
// Assistant Director
// Billing Clerk
// Billing Coordinator
// Bookkeeper
// Client Relations Manager
// Contract Administrator
// Credit Clerk
// Data Entry
// E - M

// Executive Assistant
// Executive Services Administrator
// Facility Manager
// File Clerk
// General Office Clerk
// Human Resources Administrator
// Information Clerk
// Legal Secretary
// Mail Clerk
// Mail Clerk Leader
// Mail Equipment Operator
// Medical Secretary
// Ads
// Apply to SUTD now
// www.sutd.edu.sg
// Find out more - 7-8 Mar SUTD Open House
// Marie France Bodyline
// www.mariefrance.com.sg
// Win up to $500 treatment vouchers with our Sure-Win Ang Bao Draw!
// Job Vacancy
// monster.com.sg
// Immediate Requirement. Submit CV to Apply Now!
// I Need a New Job
// Office Administration
// FedEx Jobs
// UPS Jobs
// Graduate Jobs
// N - R

// Office Assistant
// Office Clerk
// Office Manager
// Office Support Manager
// Office Support Supervisor
// Program Manager
// Receptionist
// Records Management Analyst
// Secretary
// Senior Administrative Analyst
// Senior Administrative Coordinator
// Senior Administrative Services Officer
// Senior Coordinator
// Senior Executive Assistant
// Senior Special Events Coordinator
// Senior Support Assistant
// Senior Support Specialist
// Special Events Coordinator
// Special Programs Coordinator
// Staff Assistant
// Support Assistant
// Support Specialist
// T - Z

// Typist
// Virtual Assistant
// Virtual Receptionist
// Word Processor

// Advertising Job Titles

// A - C

// Account Associate
// Account Coordinator
// Account Director
// Account Manager
// Account Specialist
// Account Representative
// Account Supervisor
// Advertising Assistant
// Advertising Buyer
// Advertising Campaign Manager
// Advertising Coordinator
// Advertising Copywriter
// Advertising Manager
// Advertising Sales Director
// Advertising Sales Representative
// Advertising Specialist
// Agency Account Coordinator
// Art Director
// Assistant Account Executive
// Assistant Buyer
// Assistant Media Planner
// Ads
// Interactive Media Display
// www.trinaxgroup.com/media
// Fully customized, automated and engaging for your target audience.
// Marie France Bodyline
// www.mariefrance.com.sg
// Win up to $500 treatment vouchers with our Sure-Win Ang Bao Draw!
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// Marketing Executive
// Marketing Manager
// Executive Sales Positions
// Advertising
// Sales Job Description
// Broadcast Account Manager
// Client Strategist
// Client Support Specialist
// Communications Coordinator
// Copy Associate
// Copy Editor
// Copywriter
// Creative Director
// D - M

// Digital Media Planner
// Digital Advertising Specialist
// Digital Advertising Sales Manager
// Director, Advertising
// Interactive Media Buyer
// Interactive Media Planner
// Internet Advertising Buyer
// Major Account Manager
// Manager, Advertising Traffic
// Manager, Digital Advertising
// Marketing Coordinator
// Media Coordinator
// Media Director
// Media Planner
// Media Research Analyst
// Media Specialist
// Multi Media Sales Manager
// Multi Media Advertising Sales Manager
// N - S

// National Account Coordinator
// Online Advertising Coordinator
// Online Advertising Director
// Online Advertising Manager
// Online Advertising Specialist
// Interactive Media Buyer
// Interactive Media Planner
// Preprint Analyst
// Print Traffic Coordinator
// Print Traffic Director
// Print Traffic Manager
// Sales Planner
// Social Media Advertising Manager
// Senior Account Director
// T - Z

// Target Marketing Strategist
// Traffic Manager


// Account Executive
// Agent
// Aircraft Avionics Technician
// Aircraft Cleaning Supervisor
// Aircraft Sheet Metal Mechanic
// Aircraft Structures Mechanic
// Airline IT Product Specialist
// Analyst
// Assistant Manager Events
// Attorney
// Auditor
// Aviation Inside Sales
// Aviation Safety Staff Engineer
// Aviation Security Intelligence Inspector
// Baggage Handler
// Base Specialty Electrician
// Business Consultant
// Business Systems Analyst
// C - E

// Captain
// Cargo Agent
// Catering Account Manger
// Club Representative
// Co-Pilot
// Commercial Airline Refueler
// Corporate Relations Manager
// Corporate Reservations Agent
// Corporate Travel Agent
// Crew Schedulers
// Crew Scheduling Manager
// Crew Scheduling Supervisor
// Crew Scheduling Trainee
// Cruise Pilot
// Customer Service Agent
// Customer Service Manager
// Director, Pilot Training
// Dispatcher
// Event Coordinator
// Export Receiving Agent
// Ads
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// Italy Trip Planner
// www.routeperfect.com/Italy
// A free tool that helps you easily Plan Your Trip to Italy. Try Now!
// Search Flights Like a Pro
// travelcodex.com
// Learn to use ITA Matrix to find the exact itinerary you want!
// FedEx Jobs
// Airline Jobs
// I Need a New Job
// UPS Jobs
// Actuary Jobs
 

// F - M

// Financial Analyst
// First Officer
// Flight Attendant
// Flight Coordinator
// Flight Instructor
// Food and Equipment Handler
// Gate Agent
// Ground Service Agent
// Ground Service Crew
// Ground Support Equipment Mechanic
// Human Resources Manager
// In-Flight Training Manager
// Infrastructure Manager
// Instructor
// Logistics Manager
// Manager
// Manager of Aircraft Appearance and Operations
// Marketing Communications Specialist
// Mechanic
// Multilingual Flight Attendant
// O - W

// Operations Agent
// Operations Manager
// Passenger Service Agent
// Pilot
// Principal Service Engineer
// Program Manager
// Project Manager
// Provisioning Agents
// Quality Assurance Agent
// Quality Assurance Coordinator
// Quality Assurance Manager
// Ramp Agents
// Ramp Operator
// Recruiter
// Reservations Agent
// Sales Agent
// Sales Manager
// Senior Analyst Airport Services
// Senior Avionics Engineer
// Senior Manager Yield and Revenue Management
// Specialist - Metrics and Reporting
// Staff Assistant - Accounting
// Station Agent
// Supervisor - Airline Passenger Service
// Supervisor Aircraft Maintenance
// Technology - Solution Architect
// Technology Manager, Asset and Configuration
// Technology Manager, Change/Deployment Manager
// Ticket Agent
// Trainee Flight Attendant
// Transport Pilot
// Travel Agent
// Travel Consultant
// Utility Specialist
// Warehouse/Equipment Agent
// Wheelchair agent


// Animal Job Titles

// A - C

// Admissions Coordinator
// Animal Care Assistant
// Animal Care Courier
// Animal Caregiver
// Animal Caretaker 
// Animal Care Technician
// Animal Control Supervisor
// Animal Health Technician
// Animal Husbandry Technician
// Animal Keeper
// Animal Management Apprenticeship
// Animal Resource Center Trainee
// Animal Rights Attorney
// Assistant Dog Trainer
// Assistant Farm Manager
// Assistant Trainer
// Barn Manager
// Barn Supervisor
// Biological Science Technician Bird Department Zookeeper
// Cashier
// Ads
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// Better Jobs for All
// www.e2i.com.sg
// Get Training & Earn Higher Wages. Heavily Funded for Singaporeans/PR.
// Hire 8000+ Interns Today
// www.glints.com/employer
// Attract & hire interns. Post your job for free.
// Animal Vet Services
// Animal Control Wildlife
// Animal Veterinarians
// I Pet Vet
// Animal Hospital Of
// Client Experience Specialist
// Client Service Representative
// Conservation Grazing Assistant
// D - K

// Director of Animal Operations
// Doggie Daycare Attendant
// Dog Handler
// Dog Trainer
// Dog Walker
// Farm Sanctuary Intern
// Field Assistant
// Fish and Wildlife Biologist
// Fish and Wildlife Technician
// Fundraiser
// Groom
// Groomer
// Grooming Assistant
// Hospital Attendant
// Kennel Assistant
// Kennel Attendant
// L - P

// Large Animal Care/Imaging Restraint Technician
// Large Animal Veterinary Technician
// Lobbyist
// Manager, Farm Animal Welfare Campaign
// Manager of Pet Services
// Marine Biologist
// Naturalist
// Nuisance Wildlife Specialist
// Nutrition Associate
// Park Ranger
// Pet Care Attendant
// Pet Sitter
// Pet Store Associate
// Pet Store Manager
// R - Z

// Rehabilitation Therapist
// Registrar
// Shelter Veterinarian Assistant
// Shift Manager
// Trainer
// Veterinarian
// Veterinary Assistant
// Veterinary Receptionist
// Veterinary Technician
// Wildlife Educator
// Wildlife Rehabilitator
// Zoo Curator
// Zoo Keeper
// Zoo Laborer
// Zoologist



// Alternative Energy Job Titles

// A - D

// Account Manager - Alternative Fuels
// Account Manager - Green Energy
// Alternative Energy Sales Agent 
// Alternative Energy Technician
// Biomass Plant Manager
// Business Analyst - Wind
// Business Development Associate
// Campaign and Policy Representative
// Clean Energy Outreach Coordinator
// Communications Associate
// Communications Manager
// Compensation Analyst
// Corporate Communications Specialist
// Development Officer
// Director of Commercial Programs
// Director of Marketing
// Down Turbine Lead Fulfillment
// Ads
// Solar power for your home
// www.rezeca.com
// Appointed partner of Yingli Solar. 100% financing available today!
// Renewable Solar Energy
// www.ditrolic-solar.com
// Get The Best Return On Investment Financing Package Avl, Call Us Now!
// Energy svcs Consultancy
// www.inventapartners.ltd.uk
// Advice and assistance in financing low carbon & renewable energy
// Alternative Energy Source
// Wind Energy Jobs
// Renewable Energy Careers
// FedEx Jobs
// Ops Manager Jobs
// E - L

// Electrical Engineer - Renewables
// Energy Efficiency and Technology Project Leader
// Energy Engineer
// Energy Manager
// Energy Project Manager
// Energy Solutions Engineer
// Field Service Manager
// Field Service Representative
// Fuel Cell Test Support Technician
// H2 Fueling Engineer
// Human Resources Generalist
// Inside Sales Representative - Solar Sales
// Inventory Coordinator 
// Laboratory Program Manager - Geothermal Technologies
// Lead Generator
// Logistics Operation Planner
// M - R

// Marketing Assistant
// Mechanical Engineer – Wind
// Offshore Energy Analyst
// Operations Technician
// Outside Solar Sales Consultant
// Portfolio Optimization - Biomass Advisor
// Process Engineer - Waste to Energy
// Production Assembler
// Production Supervisor 
// Program Assistant
// Project Assistant
// Project Manager - Turbine Support
// Public Relations Specialist
// Quality Assurance Manager
// Regional Accounts Manager
// Renewable Energy Advisor
// Renewable Energy Turbine Lead Fulfillment Specialist
// Renewable Energy Policy Analyst
// Research Analyst - Wind Energy Association
// Research Assistant
// Resource Energy Manager
// Ads
// Hire 8000+ Interns Today
// www.glints.com/employer
// Attract & hire interns. Post your job for free.
// Executive Jobs in SG
// www.regionup.com
// Advance your career. Jobs for Singapore's $100K Talent.
// S - W

// Sales Assistant
// Senior Analyst - Alternative Energy
// Senior Climate and Energy Campaigner
// Senior Consultant -  Energy and Environmental Resources
// Service Technician
// Site Manager
// Solar Alternative Energy Sales Engineer Solar Panel Alternative Energy Engineer
// Strategic Purchaser
// Towers and Foundations - Assistant Lead Engineer
// Transaction Specialist - Alternative Energy
// Turbine Equipment Specialist
// Wind Applications Engineer
// Wind Facility Manager
// Wind Plant Technician
// Wind Technician
// Wind Turbine Electrical Engineer
// Wind Turbine Technician



// Auction House Job Titles

// A - B

// Account Manager, eCommerce
// Administrative Assistant
// Administrator, American Paintings, Drawings and Sculpture
// Administrator, Antiquities
// Administrator, Handbags and Accessories
// Administrator, Jewelry
// Appraisal Coordinator
// Appraisals Assistant
// Art Handler
// Assistant Marketing Manager
// Associate Specialist
// Auctioneer
// Audience Acquisition Manager
// Bid Coordinator
// Business Analyst, Solutions Delivery
// Business Coordinator, Business Development
// Business Coordinator, International Commercial Office
// Ads
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// Assistant
// www.freelancer.com/hire/Assistant
// Over 13,000,000 Skilled Freelancers Get a Free Quote Today!
// Job Vacancy
// monster.com.sg
// Immediate Requirement. Submit CV to Apply Now!
// I Need a New Job
// FedEx Jobs
// UPS Jobs
// Finance Manager
// Ops Manager Jobs
// Business Intelligence Manager
// Business Manager - Luxury Group
// Business Support Supervisor, Sales Coordination
// C - F

 
// Cataloger, Decorative Arts
// Client Relationship Assistant Manager
// Client Service Officer
// Collections Clerk
// Commercial Accounts Manager
// Coordinator, Regional
// Decorative Arts Appraiser 
// Digital Designer
// Director of Corporate Affairs
// eCommerce Project Manager
// Executive Assistant to CIO
// Features Writer, Business Development
// Finance Business Partner
// G - I

// Global Compensation Manager
// Head of Department, Valuations
// Head of Gallery Operations
// Human Resource Generalist
// Human Resources Advisor
// Intern, American Furniture
// Intern, American Paintings
// Intern, Antiquities
// Intern, Asian Art
// Intern, Books And Manuscripts
// Intern, Decorative Arts
// Intern, Impressionist and Modern Art
// Intern, Jewelry
// Intern, Post War and Contemporary Art
// International Commercial Director
// Inventory Coordinator 
// J - Z

// Junior Researcher, Impressionist and Modern Art
// Junior Specialist, Drawings and Watercolors
// Junior Specialist, Watches
// Manager, eCommerce, PR and Audience Acquisition Strategy
// Manager of Special Events
// Marketing Designer
// Marketing Manager
// Photographer
// Private Sales Commissions Analyst
// Project Director
// Public Relations Associate
// Recruitment Manager
// Registrar
// Risk and Audit Manager
// Sales Director
// Security Officer
// Senior Manager, Strategic Partnerships and Education
// Writer/Researcher



// Banking Job Titles

// Agricultural Lender
// Analyst, Bankruptcy Support
// Anti-Money Laundering Auditor
// Assistant Branch Manager
// Assistant Trust Administrator
// Audit Manager
// Bank Examiner
// Bankruptcy/Foreclosure Coordinator
// Bilingual Client Services Representative
// Branch Manager
// Business Banking Loan Administration Manager
// Business Banking Officer
// Business Intelligence Manager
// Client Service Manager
// Collector
// Commercial Relationship Management Assistant
// Common Trust Fund Accountant
// Consumer Credit Analyst
// Ads
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// Better Jobs for All
// www.e2i.com.sg
// Get Training & Earn Higher Wages. Heavily Funded for Singaporeans/PR.
// Part Time Jobs for Cash
// www.sg.surveycompare.net/Survey
// Earn Up To S$100 For Your Opinion. It's Free and Easy - Start Now!
// I Need a New Job
// Banking Careers
// Actuary Jobs
// Teller Jobs
// FedEx Jobs
// Consumer Finance Assistant Manager
// Consumer Loans Processor
// Consumer Loan Underwriter
// Custody Investment Specialist
// Customer Service Representative
// Default Specialist
// Escrow Manager
// eServices Quality Analyst
// Head Teller
// Internal Auditor
// Investment Accounting Analyst
// Investment Management Operations Analyst
// Investment Management Specialist
// Investment Planner
// Junior Analyst - Asset Management
// Lead Business Consultant, Banking Innovation Center
// Lead Syndication Specialist
// Lending Manager
// Loan Officer Trainee
// Loan Representative
// Loan Support Specialist
// Lock Box Clerk
// Loss Recovery Manager
// Mortgage Consultant
// Mortgage Operations Support Technician
// New Accounts Banker
// Online Customer Service Representative
// Origination Loan Officer
// Personal Banker
// Phone Banker
// Premier Banker
// Regulatory Compliance Analyst
// Relationship Manager, Commercial Lending
// Senior Financial Analyst
// Senior Investment Analyst
// Senior Teller
// Senior Trust Consultant
// Ads
// Job Vacancy
// monster.com.sg
// Immediate Requirement. Submit CV to Apply!
// Get Paid Doing Surveys
// panelplace.com/free_registration
// Earn Extra Money By Participating In Online Surveys That Really Pay.
// Technology Risk Manager
// Teller
// Trust Asset Manager
// Trust Assistant
// Wire Department Manager



// Biotechnology Job Titles

// A - F

// Affiliate Process Training Advisor
// Antibody Engineering Research Associate
// Associate Director, Portfolio Management and Operations
// Bioprocess Technician
// Clinical Science Associate
// Clinical Specialist, Franchise Sales
// Clinical Specialist, Lung
// Compensation Manager
// Competitive Intelligence Manager
// Computational Biologist
// Country Study Specialist
// Director of Local Government Affairs
// Fermentation Biotechnologist
// Forecast Systems Manager
// Ads
// Find A Executive
// www.freelancer.com/hire/Assistant
// Assistant from $30 Get a Free Quote Today!
// Job Vacancy
// monster.com.sg
// Immediate Requirement. Submit CV to Apply!
// Earn Money From Home
// www.sg.surveycompare.net
// With paid online surveys. Register for free & see who pays the most!
// FedEx Jobs
// I Need a New Job
// UPS Jobs
// Graduate Jobs
// Jobs Website
// G - M

 

// Global Head of Development
// Group Manager, Field Data Operations
// Human Resources Partner, Business Development
// Key Account Specialist
// Laboratory Assistant
// Laboratory Sales Consultant
// Leader, Global Medical Information
// Line Manager, Study Start-Up
// Managed Care and Customer Operations
// Management Associate
// Manufacturing Specialist
// Marketing Operations Analyst
// Marketing Science Manager
// Market Planning Manager, Ophthalmology Pipeline
// Medical Science Liaison, Oncology
// P - R

// Patent Attorney
// Principal Systems Architect
// Project Manager
// QA Product Technical Manager
// Quality Associate/Validation
// Quality Control Associate
// Regulatory Affairs Specialist
// Research Affairs Coordinator
// Research and Development Staff Scientist
// Research Assistant - Bioprocessing
// Research Associate
// Research Associate, Oncology Biomarker Development
// Rheumatology Clinical Coordinator

//  S - Z

// Safety Scientist, Immunology
// Sales Compensation Administration Manager
// Sales Operations Manager
// Scientific Recruiter
// Scientist, Immunoassay  Development
// Scientist - Rare Disease Research Unit
// Senior Global Project Manager
// Senior Manager, Product Public Relations
// Senior Manager of Industry Analytics
// Senior Manager of Clinical Operations
// Senior Product Manager
// Senior Research Associate
// Software Developer
// Sponsored Research Administrator
// Strategy Manager, New Product Commercialization
// Study Start-Up Specialist
// Therapeutic Area Leader
// Thought Leader Liaison, Hematology


// Business Job Titles

// Actuary
// Administrative Manager
// Assessor
// Benefits Officer
// Branch Manager
// Budget Analyst
// Business Analyst
// Business Office Manager
// Business Manager
// Cash Manager
// Certified Financial Planner
// Chartered Wealth Manager
// Chief Executive Officer
// Chief Financial Officer
// Claims Adjuster
// Commercial Appraiser
// Commercial Real Estate Agent
// Commercial Real Estate Broker
// Controller
// Credit Analyst
// Credit Manager
// Damage Appraiser
// Financial Analyst
// Hedge Fund Manager
// Hedge Fund Principal
// Ads
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// Job Vacancy
// monster.com.sg
// Immediate Requirement. Submit CV to Apply!
// B2b Supplier
// www.hktdc.com
// Connect with over 120,000 suppliers from Hong Kong, China and Taiwan
// I Need a New Job
// Job Advisor
// Job Searching Agencies
// Rig Job
// FedEx Jobs
// Hedge Fund Trader
// Insurance Adjuster
// Insurance Agent
// Insurance Appraiser
// Insurance Broker
// Insurance Claims Examiner
// Insurance Investigator
// Investment Advisor
// Investment Banker
// Investor Relations Officer
// Leveraged Buyout Investor
// Loan Officer
// Loss Control Specialist
// Mortgage Banker
// Mutual Fund Analyst
// Office Manager
// Portfolio Management Marketing
// Portfolio Manager
// Ratings Analyst
// Real Estate Appraiser
// Real Estate Officer
// Residential Appraiser
// Residential Real Estate Agent
// Residential Real Estate Broker
// Risk Manager
// Service Representative
// Stockbroker
// Treasurer
// Trust Officer
// Underwriter


// Business Intelligence Job Titles

// A - C

// Advanced Business Intelligence Analyst/Project Manager
// Application Technical Specialist
// Associate Director Social Business Intelligence and Big Data
// Business Intelligence Analyst
// Business Intelligence and Foundation Services Leader
// Business Intelligence and Reporting Analyst
// Business intelligence Business Analyst
// Business Intelligence Developer
// Business Intelligence Director
// Business Intelligence Engineer
// Business Intelligence Solutions Developer
// Business Objects Architect
// Ads
// Irisys Retail Analytics
// www.irisys.net
// Generate actionable, living intelligence with Irisys
// Marketing Mix Modeling
// www.analyticpartners.com
// Analytic Partners - the leader in econometric modeling and ROI
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// Business Intelligence
// Bi Reporting
// Bi Dashboard
// I Need a New Job
// Bi Analytics
// Cognos Business Development Architect
// Cognos Business Intelligence Developer
// Consumer Insight Manager
// Cyber Intelligence Watch Officer
// D - I

// Data Analyst - Business Intelligence
// Data Architect
// Data Warehouse and Business Intelligence Developer
// Director of Business Intelligence and Data Warehouse
// Enterprise Account Executive - Predictive Intelligence
// Enterprise Intelligence Reporting Architect
// Ethics Office Business Intelligence Officer
// Federal - Business Intelligence Lead
// Healthcare Business Intelligence Manager
// Informatica Extract Transform Load (ETL) Developer
// Information Delivery, Data Analyst
// Information Technology Business Intelligence Platform Product Manager
// Institutional Research Business Intelligence Systems Analyst
// Integration/Business Intelligence Technical Lead
// J - R

// Java Developer - Big Data/Business Intelligence
// Lead Analytics Engineer
// Lead Business Intelligence Developer
// Manager, Business Intelligence 
// Manager, Business Metrics/Analytics
// Microstrategy Dashboard Developer and Architect
// Oracle Technical Lead
// PeopleSoft Business Analyst
// Project Manager
// Project Support, Business Intelligence and Fraud Agents
// Report and Visualization Developer, Business Intelligence
// S - W

// SAP Business Intelligence Consultant
// Senior Analyst, Retail Analytics and Reporting
// Senior Competitive Intelligence Manager
// Senior Developer with Pentaho Business Intelligence Suite
// Senior Engineer Information Technology - Business intelligence Reporting
// Senior Manager, Product Intelligence and Cost Analytics
// Senior Market Intelligence Analyst
// Senior Technical Consultant - Business Intelligence
// Service Market Intelligence Manager
// Social Media and Analytics Associate
// Software Engineer - Data Warehouse/Business Intelligence
// Solution Architect, Business Intelligence
// Solutions Designer, Business Intelligence
// SQL Business Intelligence and data Warehouse Manager
// Strategic Business Manager
// Subject Matter Expert - Business Intelligence Tools
// Supply Chain Business Intelligence - Senior Consultant
// Tableau Data Analytics Platform Lead
// Threat Intelligence Analyst


// IT Job Titles

// A - D

// Application Developer
// Application Support Analyst
// Applications Engineer
// Associate Developer
// Chief Technology Officer
// Chief Information Officer
// Computer and Information Systems Manager
// Computer Systems Manager
// Customer Support Administrator
// Customer Support Specialist
// Data Center Support Specialist
// Data Quality Manager
// Database Administrator
// Desktop Support Manager
// Desktop Support Specialist
// Developer
// Director of Technology
// E - N

// Front End Developer
// Help Desk Specialist
// Help Desk Technician
// Information Technology Coordinator
// Information Technology Director
// Information Technology Manager
// IT Support Manager
// IT Support Specialist
// IT Systems Administrator
// Java Developer
// Junior Software Engineer
// Management Information Systems Director
// .NET Developer
// Network Architect
// Network Engineer
// Network Systems Administrator
// Ads
// Affordable IT support
// www.care.net.sg/it-support
// Certified IT experts in Singapore. Guarantee best price IT support.
// Apply to SUTD now
// www.sutd.edu.sg
// Find out more - 7-8 Mar SUTD Open House
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// FedEx Jobs
// I Need a New Job
// UPS Jobs
// Graduate Jobs
// Jobs Website
// P - S

// Programmer
// Programmer Analyst
// Security Specialist
// Senior Applications Engineer
// Senior Database Administrator
// Senior Network Architect
// Senior Network Engineer
// Senior Network System Administrator
// Senior Programmer
// Senior Programmer Analyst
// Senior Security Specialist
// Senior Software Engineer
// Senior Support Specialist
// Senior System Administrator
// Senior System Analyst
// Senior System Architect
// Senior System Designer
// Senior Systems Analyst
// Senior Systems Software Engineer
// Senior Web Administrator
// Senior Web Developer
// Software Architech
// Software Engineer
// Software Quality Assurance Analyst
// Support Specialist
// Systems Administrator
// Systems Analyst
// System Architect
// Systems Designer
// Systems Software Engineer
// T - Z

// Technical Operations Officer
// Technical Support Engineer
// Technical Support Specialist
// Technical Specialist
// Telecommunications Specialist
// Web Administrator
// Web Developer
// Webmaster



// International Business Job Titles

// A - F

// Account Executive
// Analyst, International Treasury
// Analyst, Logistics
// Analyst - International Benefits
// Assistant Manager, International Marketing Services
// Bilingual Customer Service Representative
// Bilingual Sales Representative
// Business Development Associate
// Business Engagement Director
// Cocoa Trader Trainee
// Director of International Growth
// European Markets Team Lead
// Export Specialist
// Financial Analyst - Global Implementation Team
// Foreign Banking Compliance Officer
// Ads
// Executive Jobs in SG
// www.regionup.com
// The Best Jobs for the Best Talent. 100K+ Jobs for 100K+ Talent.
// Job Vacancy
// monster.com.sg
// Immediate Requirement. Submit CV to Apply!
// Territory Account Manager
// ch.tbe.taleo.net
// Mentor Graphics seeks skilled Sales Professional to join our team.
// I Need a New Job
// Financial Sales Jobs
// Ops Manager Jobs
// UPS Jobs
// FedEx Jobs
// Foreign Currency Sales Representative
// Foreign Trade Zone Administrator
// G - I

// Global Account Manager
// Global Business Administrator
// Global Business Analysis Director
// Global Commodity Manager
// Global Internal Communication Specialist
// Global Product Manager
// Global Supply Manager
// Import/Export Specialist
// Incident Analyst
// International Assignment Specialist
// International Banking Coordinator
// International Business Analyst
// International Business Development Director
// International Business Meeting Planner
// International Business Operations Associate
// I - J

// International Business Specialist
// International Claims Manager 
// International Division Project Coordinator
// International Logistics Coordinator
// International Manager, Marketing and Communications
// International Market Coordinator
// International Operations Accelerated Development Program
// International Pricing, Process and Administration Analyst
// International Retail Operations Consulting Manager
// International Retirement Leader
// International Sales Director
// International Technical Coordinator
// International Trade Specialist
// International Travel Counselor
// International Traveling Recruiter
// Junior Business Development Manager
// Ads
// Import China
// www.hktdc.com
// Connect with suppliers & exporters from China & Asia. Free Service.
// Job Fairs by e2i
// www.e2i.com.sg/Job-Fairs
// Register for upcoming job fairs. In hospitality to finance sector
// L - Z

// Manager, Global Sales and Marketing Operations
// Manager International Business Development
// Manager of Contracts
// Marketing Manager Asia
// Mid-Level International Associate (Attorney)
// Middle East Business Development Manager
// Principal International Products Manager
// Purchasing and Planning Analyst
// Purchasing Coordinator - International
// Rotational International Integration Director
// Sales Manager, International Content Sales
// SEO/SEM Analyst - International
// Technical Associate Country Manager
// Technical Program Manager - International Expansion Team
// Trade Assistant - International
// Trade Compliance Analyst
// Trade Compliance Leader
// Vice President of Global Data and Platform



// nvestment Banking Job Titles

// A - D

// Accountant
// Administrative Assistant, Investment Banking
// Analyst 1st Year, Corporate Client Banking
// Analyst 2nd Year, Corporate Client Banking
// Asset Management Analyst
// Associate, Tech Mergers and Acquisitions
// Associate Mergers and Acquisitions
// Attorney
// Business Development Associate
// Capital Markets Business Manager
// Capitol Advisors Manager
// CIB Analyst
// Client Relationship Specialist
// Control Room Compliance Officer
// Credit Derivatives Trade Capture Analyst
// Derivative Products Operations Associate
// Ads
// Kotak Bank Exchange Rate
// kotak.com/Money-Transfer
// Today's Exchange Rate 1SGD=₹49.61. Send Money from Singapore at 0 fee.
// Part Time Jobs for Cash
// www.sg.surveycompare.net/Survey
// Earn Up To S$100 For Your Opinion. It's Free and Easy - Start Now!
// Better Jobs for All
// www.e2i.com.sg
// Get Training & Earn Higher Wages. Heavily Funded for Singaporeans/PR.
// I Need a New Job
// Financial Sales Jobs
// Finance Internship
// Finance Career
// Hedge Fund Research
// Derivatives Control Associate
// Desk Assistant, Trading Services 
// E - I

// Emerging Markets Trader
// Equity Research Analyst
// Equity Trade Support Analyst
// Executive Assistant to Managing Director of Investment Banking 
// Financial Analyst
// Fixed Income Data Analyst
// Fixed Income Surveillance, Vice President
// Futures Electronic Trader
// Futures Margin Associate
// Head of Global Investment Technology
// Healthcare Investment Banking Associate
// Internal Auditor
// Investment Banking/Valuation Analyst 
// Investment Banking Analyst in Corporate Advisory
// Investment Banking Associate
// Investment Banking Business Analyst
// Investor Relations Associate
// L - R

// Leveraged Finance Director
// Managing Director
// Mergers and Acquisitions Analyst
// Middle Office Analyst
// Natural Resources Analyst
// Oil and Gas Investment Banking Analyst
// Operations Analyst
// Paralegal 
// Product Controller
// Public Finance Analyst
// Quantitative Analyst, Equity Research
// Real Estate Post Closing Coordinator 
// Relationship Manager
// Research Analyst
// Research Assistant
// Restructuring Analyst
// Ads
// What Will Be Your Future?
// sky-request.com/Future
// Enter Your Birth Date & I will Tell Your Future. First Reading Now Free
// Trading Jobs Available
// top-banker.com
// Jobs in Banking and Trading. Apply Here Today
// S - Z

// Sales and Trading Analyst
// Senior Analyst - Healthcare
// Senior Associate - Consumer
// Senior Auditor
// Senior Consumer Investment Banker
// Senior Digital Media Investment Banker
// Strategic Mergers and Acquisitions Analyst
// Strategic Recruiter
// Structured Products Group, Senior Associate
// Swap Trader
// Tax Operations Business Analyst
// Trading Assistant
// Treasury Services Analyst
// Vice President, Investment Banking


// Legal Job Titles

// Administrative Assistant
// Arbitrator
// Attorney
// Case Manager
// Clerk
// Conciliator
// Conflict Resolution Specialist
// Consultant
// Contract Administrator
// Contract Analyst
// Contract Drafting Legal Specialist
// Copy Center Professional
// Counselor
// Corrections Officer
// Court Advocate
// Court Messenger
// Court Reporter
// Court Representative
// Court Transcriptionist
// Document Coder
// E-discovery Specialist
// File Clerk
// Judge
// Jury Consultant
// Law Firm Administrator
// Lawyer
// Legal Aide/Assistant
// Ads
// Freelance Admin Assistant
// www.freelancer.sg/hire/Assistant
// Admin Starting at $30 or $5/Hour. Find an Assistant Today For Free!
// Vacancy
// monster.com.sg
// Immediate Requirement. Submit CV to Apply Now!
// Executive Jobs in SG
// www.regionup.com
// Advance your career. Jobs for Singapore's $100K Talent.
// I Need a New Job
// FedEx Jobs
// UPS Jobs
// Graduate Jobs
// Jobs Website
// Legal Analyst
// Legal Nurse Consultant
// Legal Records Manager
// Legal Secretary
// Legal Services Director
// Litigation Docket Manager
// Litigation Support Director
// Magistrate
// Mailroom Personnel
// Mediator
// Paralegal
// Regulatory Affairs Director
// Right of Way Agent
// Software Consultant


// Management Job Titles

// A - D

// Accounting Manager 
// Account Management, Manager
// Advertising Manager 
// Affiliate Management Associate
// Assistant Manager
// Associate Manager
// Assistant Manager - Category Management
// Automotive Manager
// Branch Manager
// Brand Manager
// Budget Manager
// Business Development Manager
// Business Manager
// Care Manager
// Centralized Dispatch Manager
// Client Service and Underwriting Manager
// Clinical Management - RN Unit Manager
// Compensation Manager
// Compliance Manager
// Construction Manager
// Ads
// Project Management $5/hr
// www.freelancer.com/hire
// Over 13,000,000 Skilled Freelancers Find a Project Manager Today!
// Executive Jobs in SG
// www.regionup.com
// Advance your career in Singapore. 100K+ Jobs for 100K+ Talent.
// Job Vacancy
// monster.com.sg
// Immediate Requirement. Submit CV to Apply Now!
// Finance Manager
// Ops Manager Jobs
// I Need a New Job
// FedEx Jobs
// Project Management Job
// Customer Service Manager
// Disposal Operations Management Trainee
// District Fleet Manager
// District Sales Manager
// Division Manager - Resource Management
// E - L

// Employee Benefits Manager
// Employee Relations Manager
// Engineering Manager
// Financial Manager
// Grants Management Specialist
// Guest Services Manager
// Human Resource Manager
// Inside Sales Manager 
// Leasing Manager
// M - R

// Management Trainee
// Manager, Asset Management
// Manager, Decision Management
// Manager, Margin Management
// Manager, Process Management
// Manager, Risk Management
// Manager, Utilization Management
// Manager - Oilfield Services
// Manager - Organizational Change Management
// Manager Marketing - Change Management and Communication
// Manager Strategic Accounts
// Marketing Manager
// Merchandise Manager
// Office Manager
// Operations Management Trainee
// Plant Manager, Power Plant
// Portfolio Manager
// Practice Manager - Healthcare
// Product Manager
// Production Manager
// Program Management, Manager
// Project Manager
// Property Management/Assistant General Manager
// Purchasing Manager
// Quality Assurance Manager
// Restaurant Culinary Managers
// Restaurant Manager
// Route Manager
// Ads
// ASTA Powerproject
// www.crownsys.com.sg
// See how ASTA can perform functions other PM softwares can't!
// Get Paid Doing Surveys
// panelplace.com/free_registration
// Earn Extra Money By Participating In Online Surveys That Really Pay.
// S - Z

// Safety Manager
// Sales and Catering Manager
// Senior Manager, Product Management
// Senior Manager, Space Management
// Senior Quality Manager
// Senior Manager, Realty Management
// Shift Manager
// Store Manager
// Strategic Sourcing Manager
// Student Loan Collection Manager
// Territory Manager
// Training and Development Manager
// Transportation Manager
// Warehouse and Inventory Control Manager

