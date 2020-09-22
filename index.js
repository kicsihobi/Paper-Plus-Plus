var fs = require("fs");
var Handlebars = require("handlebars");
var countries = require('./resources/countryCodes.json');

function render(resume) {
	var template = fs.readFileSync(__dirname + "/resume.template", "utf-8");

	var printCSS = fs.readFileSync(__dirname + "/css/print.css", "utf-8");
	var standardCSS = fs.readFileSync(__dirname + "/css/style.css", "utf-8");
	var screenCSS = fs.readFileSync(__dirname + "/css/screen.css", "utf-8");

	// Get a country from the country code
	resume.basics.location.country = countries[resume.basics.location.countryCode];

	// Remove http and www from url
	Handlebars.registerHelper('no-http', function(options) {
		this.url = this.url.replace(/(https?:\/\/)?(www\.)?/, "");
		return options.fn(this);
	});

  Handlebars.registerHelper('dateMonth', function(options) {
    var d = new Date();
		if ( this.startDate !== "undefined" ) {
      d = new Date(this.startDate);
      this.startDate = (d.getMonth()<9?'0':'') +(d.getMonth()+1) +"/"+d.getFullYear();
    }
    if ( this.endDate !== "undefined" ) {
      d = new Date(this.endDate);
      if( d.getTime() > Date.now() ) {
        this.endDate = "Ongoing";
      } else {
        this.endDate = (d.getMonth()<9?'0':'') +(d.getMonth()+1) +"/"+d.getFullYear();
      }
    }
    if ( this.releaseDate !== "undefined" ) {
      d = new Date(this.releaseDate);
      if( d.getTime() > Date.now() ) {
        this.releaseDate= "Ongoing";
      } else {
        this.releaseDate = (d.getMonth()<9?'0':'') +(d.getMonth()+1) +"/"+d.getFullYear();
      }
    }
		return options.fn(this);
	});

	// Get a font awsome class from a name
	Handlebars.registerHelper('fontAwesome', function(str) {
		return "fa-" + str.toLowerCase() + "-square";
	});

	// http://stackoverflow.com/a/31632215/838789
	Handlebars.registerHelper({
			and: function (v1, v2) {
					return v1 && v2;
			},
			or: function (v1, v2) {
					return v1 || v2;
			},
      eq: function(arg1, arg2, options) {
        return (arg1 == arg2);
      }
	});

	// http://stackoverflow.com/a/18831911
	Handlebars.registerHelper('commalist', function(items, options) {
		return options.fn(items.join(', '));
	});

	// Send all necessary resources to the handlebars template and compile it
	return Handlebars.compile(template)({
		resume: resume,
		standardCSS: standardCSS,
		printCSS: printCSS,
		screenCSS: screenCSS
	});
}

module.exports = {
	render: render
};
