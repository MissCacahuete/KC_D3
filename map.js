const windowWidth = window.innerWidth;
const windowHeight = window.innerHeight;

d3.json('https://gist.githubusercontent.com/miguepiscy/2d431ec3bc101ef62ff8ddd0e476177f/raw/2482274db871e60195b7196c602700226bdd3a44/practica.json')
    .then((featureCollection) => {
        drawMap(featureCollection);
    })


function drawMap(featureCollection) {
    const width = windowWidth / 1.8;
    const height = windowHeight;


    const svg = d3.select('#mapapractica')
        .append('svg')
        .attr('width', width)
        .attr('height', height);

    const features = featureCollection.features;

    const priceMax = d3.max(features, d => d.properties.avgprice);

    const center = d3.geoCentroid(featureCollection);
    const projection = d3.geoMercator()
        .fitSize([width / 2, height / 2], featureCollection)
        .center(center)
        .translate([width / 2, height / 3]);

    const path = d3.geoPath().projection(projection);

    feature = svg.selectAll('.feature')
        .data(features)
        .enter()
        .append('path')
        .attr('class', 'feature');

    feature
        .attr('d', path)
        .attr('fill', fillColor);


    const legend = svg.append('g');

    const numberOfLegends = 6;
    const scaleLegend = d3.scaleLinear()
        .domain([0, numberOfLegends * 2])
        .range([0, width]);

    for (let index = 0; index < numberOfLegends * 2; index += 2) {
        const posX = scaleLegend(index);

        const legendBar = index / (numberOfLegends * 2 - 2);

        const widthLegendGroup = (width / numberOfLegends) - 2;

        const legendGroup = legend
            .append('g')
            .attr('transform', `translate(${posX}, 0)`);

        legendGroup
            .append('rect')
            .attr('width', widthLegendGroup)
            .attr('height', 10)
            .attr('fill', d3.interpolateRainbow(legendBar))

        legendGroup
            .append('text')
            .text(`${priceMax * legendBar} euros/m2`)
            // Es necesario usar function y  no arrow function, por que necesitamos el this
            .attr('transform', function(d) {
                const textLength = this.getComputedTextLength();
                const middle = widthLegendGroup / 2;
                return `translate(${middle - textLength / 2}, 30)`;
            });
    }

    function fillColor(d) {
        const price = d.properties.avgprice || 0;
        return d3.interpolateRainbow(price / priceMax);
    }
}
