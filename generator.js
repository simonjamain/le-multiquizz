const express = require('express')
const path = require('path');
const opener = require("opener")
const ejs = require('ejs')
const app = express()

app.use(express.static('public'));

app.get('/', function (req, res) {
	console.log("appel")
	ejs.renderFile(path.join(__dirname,"index.html.ejs"), {}, {}, function(err, str){
		console.log(err)
		console.log(str)
		res.send(str)
	});
})

// auto available port, cf. https://stackoverflow.com/a/54464386 
const server = app.listen(0, () => {
	console.log('Listening on port:', server.address().port)
	opener(`http://localhost:${server.address().port}`)
  });

  //https://github.com/vercel/pkg/issues/245