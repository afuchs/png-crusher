var fs = require('fs');
var walk = require('walk');
var PngCrush = require('pngcrush');

var args = process.argv.slice(2);
if (args.length == 0) {
	return console.log('Oops! You forgot a path.');
}

var dir = args[0];
var idx = dir.indexOf('/');

if (dir.indexOf('.') != 0) {
	if (idx > 0 || idx < 0) {
		dir = '/' + dir;
	}
}
if (dir.lastIndexOf('/') != dir.length - 1) {
	dir = dir + '/';
}

console.log('reading ' + dir);

fs.readdir(dir, function(err, files) {
	files.forEach(function(file) {
		var idx = file.indexOf('.png');
	 	if (idx > 0 && idx == file.length - 4) {
	 		var path = dir + file;
	 		crush(path);
	 	}
	});
})

function crush(path) {
	var idx = path.lastIndexOf('/');
	var dir = null;

	if (idx < 0) {
		dir = './crushed/';
	} else {
		dir = path.substring(0, idx) + '/crushed/' ;
	}

	// make sure /crushed exists
	fs.mkdir(dir);

	var newFilename = dir + path.substring(idx + 1, path.length);

	var pngCrush = new PngCrush(['-rem alla', '-brute', '-reduce']);
	var chunks = [];

	console.log('crushing...');

	var writeStream = fs.createWriteStream(newFilename);
	fs.createReadStream(path)
		.pipe(pngCrush)
		.pipe(writeStream);
}

return;