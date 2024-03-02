const fs = require('fs');
const xml2js = require('xml2js');
const parser = new xml2js.Parser();

async function kmlToPolygons(kmlFilePath) {
  const kml = fs.readFileSync(kmlFilePath, 'utf8');
  try {
    const result = await parser.parseStringPromise(kml);
    const placemarks = result.kml.Document[0].Placemark;
    const polygonsInfo = placemarks.map((placemark) => {
      const name = placemark.name[0];
      const [namePart, region] = name.split(' ');
      const lookat = placemark.LookAt[0];
      const lat = parseFloat(lookat.latitude[0]);
      const lon = parseFloat(lookat.longitude[0]);

      const coordinatesText = placemark.Polygon[0].outerBoundaryIs[0].LinearRing[0].coordinates[0].trim();
      const coordinates = coordinatesText.split(' ');
      const polygon = coordinates.map((coordinate) => {
        const [polygonLon, polygonLat] = coordinate.split(',').map(Number);
        return [polygonLat, polygonLon];
      });

      return {
        name: namePart,
        lat,
        lon,
        region,
        polygon,
      };
    });

    return JSON.stringify(polygonsInfo, null, 2);
  } catch (err) {
    console.error(err);
  }
}

// Example usage
const kmlFilePath = './Polygon.kml';
kmlToPolygons(kmlFilePath).then((result) => {
  console.log(result);
  fs.writeFileSync('regions.json', result);
});

