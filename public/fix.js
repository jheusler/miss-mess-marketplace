const fs = require("fs");
const path = "/Users/jessicaheusler/Desktop/miss-mess-marketplace/src/App.jsx";
let code = fs.readFileSync(path, "utf8");

// Replace the useEffect block that uses gateways with one that fetches sales.json
const oldBlock = `  useEffect(() => {
    if (userLat === null || userLng === null) return;
    setSalesLoading(true);
    setSales([]);
    const gateways = generateGatewaySales(userLat, userLng, locationLabel);
    fetchThriftAndAntiques(userLat, userLng, radius)
      .then(thrift => {
        const all = [...gateways, ...thrift].sort((a, b) => a.distance - b.distance);
        setSales(all);
        setSalesSources({ thrift: thrift.length, garage: 2, estate: 1 });
      })
      .catch(() => {
        setSales(gateways);
        setSalesSources({ thrift: 0, garage: 2, estate: 1 });
      })
      .finally(() => setSalesLoading(false));
  }, [userLat, userLng, radius, locationLabel]);`;

const newBlock = `  useEffect(() => {
    if (userLat === null || userLng === null) return;
    setSalesLoading(true);
    setSales([]);
    // Fetch real scraped estate sales from public/sales.json + thrift stores from Overpass
    Promise.all([
      fetch('./sales.json').then(r => r.json()).catch(() => []),
      fetchThriftAndAntiques(userLat, userLng, radius).catch(() => [])
    ]).then(([estateSales, thrift]) => {
      // Add distance to estate sales using Haversine formula
      const withDist = estateSales.map(s => {
        const R = 3958.8;
        const dLat = (s.latitude - userLat) * Math.PI / 180;
        const dLng = (s.longitude - userLng) * Math.PI / 180;
        const a = Math.sin(dLat/2)**2 + Math.cos(userLat*Math.PI/180)*Math.cos(s.latitude*Math.PI/180)*Math.sin(dLng/2)**2;
        s.distance = R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        return s;
      });
      const all = [...withDist, ...thrift].sort((a, b) => a.distance - b.distance);
      setSales(all);
      setSalesSources({ thrift: thrift.length, garage: 0, estate: withDist.length });
    }).finally(() => setSalesLoading(false));
  }, [userLat, userLng, radius, locationLabel]);`;

if (!code.includes(oldBlock)) {
  console.log("ERROR: Could not find target block to replace");
  process.exit(1);
}

code = code.replace(oldBlock, newBlock);
fs.writeFileSync(path, code);
console.log("Done - App.jsx updated");
