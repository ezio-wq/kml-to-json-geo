const kmlToJsonGeo = require('kml-to-json-geo');

const kmlFilePath = './path/to/your/file.kml';
kmlToJsonGeo(kmlFilePath)
  .then(result => {
    console.log(result);
    // You can also write the result to a file or use it as needed
  })
  .catch(error => {
    console.error('Error converting KML to JSON:', error);
  });

