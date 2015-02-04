var paypal = require('paypal-rest-sdk');
var config = {};
 
/*
 * GET home page.
 */
 
exports.index = function(req, res){
  res.render('index', { title: 'Express' });
};

exports.create = function (req, res) {
	var method = req.param('method');

	var payment = {
		"intent": "sale",
		"payer": {
		},
		"transactions": [{
			"amount": {
				"currency": req.param('currency'),
				"total": req.param('amount')
			},
			"description": req.param('description')
		}]
	};

	if (method === 'paypal') {
		payment.payer.payment_method = 'paypal';
		payment.redirect_urls = {
			"return_url": "http://localhost:5000/paypal/execute",
			"cancel_url": "http://localhost:5000/paypal/cancel"
		};
	} else if (method === 'credit_card') {
		var funding_instruments = [
			{
				"credit_card": {
					"type": req.param('type').toLowerCase(),
					"number": req.param('number'),
					"expire_month": req.param('expire_month'),
					"expire_year": req.param('expire_year'),
					"first_name": req.param('first_name'),
					"last_name": req.param('last_name')
				}
			}
		];
		payment.payer.payment_method = 'credit_card';
		payment.payer.funding_instruments = funding_instruments;
	}

	paypal.payment.create(payment, function (error, payment) {
		if (error) {
			console.log(error);
			res.render('error', { 'error': error });
		} else {

			// save payment id to session for later use
			req.session.paymentId = payment.id;
			
			res.render('create', { 'payment': payment });
		}
	});
};

exports.execute = function (req, res) {
	var paymentId = req.session.paymentId;
	var payerId = req.param('PayerID');

	var details = { "payer_id": payerId };
	var payment = paypal.payment.execute(paymentId, details, function (error, payment) {
		if (error) {
			console.log(error);
			res.render('error', { 'error': error });
		} else {
			res.render('execute', { 'payment': payment });
		}
	});
};

exports.cancel = function (req, res) {
  res.render('cancel');
};

/*
 * SDK configuration
 */
 
exports.init = function(c){
  config = c;
  paypal.configure(c.api);
}