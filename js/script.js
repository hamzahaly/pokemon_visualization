$(function() {
    d3.csv('data/Pokemon.csv', function(error, data) {
        console.log(data);

        //Margin object
        var margin = {
            top: 50,
            right: 50,
            bottom: 100,
            left: 70
        };

        //Height and Width variables for the svg element (total area)
        var height = 600;
        var width = 800;

        //Height and width variables for the drawing space 
        var drawHeight = height - margin.bottom - margin.top;
        var drawWidth = width - margin.left - margin.right;

        //This variable is either the elemental stat or base stat name
        var type = 'all';
        var selection = 'Types';

        //svg element to work with entire viz
        var svg = d3.select('#viz')
            .append('svg')
            .attr('width', width)
            .attr('height', height)

        //g element to work with bars and axes, translates with margins to give room on left and top parts of the svg
        var g = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('width', drawWidth)
            .attr('height', drawHeight)

        //Creates a regions array with the name of the region for the domain of the x-scale
        var generations = data.map(function(d) {
                return d.Generation;
            });
        console.log(generations);

        var regions = [];
        generations.forEach(function(element) {
            switch (element) {
                case '1':
                    regions.push('Kanto');
                    break;
                case '2':
                    regions.push('Johto');
                    break;
                case '3':
                    regions.push('Hoenn');
                    break;
                case '4':
                    regions.push('Sinnoh');
                    break;
                case '5':
                    regions.push('Unova');
                    break;
                case '6':
                    regions.push('Kalos');
                    break;
                default:
                    break;
            }
        }, this);
        console.log(regions);

        /* 
        Calculates a count of the number of pokemon in each region. Megas are included in the region where the original pokemon originates. Additionally, counts different forms for pokemon i.e. pumpkaboo sizes, etc.
        */
        var typeFilter = function() {
            var filteredData = data.filter(function(d) {
                return d['Type 1'] == type || d['Type 2'] == type;
            });
            return filteredData;
        };

        var aggregate = function(data) {
            var aggregatedPokemon = d3.nest()
            .key(function(d) {
                //Returns the name of the region based on the Generation value in the data to help with the domain 
                switch (d.Generation) {
                    case '1':
                    return 'Kanto';
                    break;
                case '2':
                    return 'Johto';
                    break;
                case '3':
                    return 'Hoenn';
                    break;
                case '4':
                    return 'Sinnoh';
                    break;
                case '5':
                    return 'Unova';
                    break;
                case '6':
                    return 'Kalos';
                    break;
                default:
                    return null;
                    break;
                }
            })
            .rollup(function(d) {
                return d.length;
            }).entries(data);
            console.log(aggregatedPokemon);
            return aggregatedPokemon;
        };

        var aggregateBaseStats = function() {
            var aggregatedPokemon = d3.nest()
            .key(function(d) {
                //Returns the name of the region based on the Generation value in the data to help with the domain 
                switch (d.Generation) {
                    case '1':
                    return 'Kanto';
                    break;
                case '2':
                    return 'Johto';
                    break;
                case '3':
                    return 'Hoenn';
                    break;
                case '4':
                    return 'Sinnoh';
                    break;
                case '5':
                    return 'Unova';
                    break;
                case '6':
                    return 'Kalos';
                    break;
                default:
                    return null;
                    break;
                }
            })
            .rollup(function(leaves) {
                return d3.mean(leaves, function(d) {
                    return +d[type];
                });
            }).entries(data);
            console.log(aggregatedPokemon);
            return aggregatedPokemon;
        };

        var numberPokemonPerRegion = d3.nest()
            .key(function(d) {
                //Returns the name of the region based on the Generation value in the data to help with the domain 
                switch (d.Generation) {
                    case '1':
                    return 'Kanto';
                    break;
                case '2':
                    return 'Johto';
                    break;
                case '3':
                    return 'Hoenn';
                    break;
                case '4':
                    return 'Sinnoh';
                    break;
                case '5':
                    return 'Unova';
                    break;
                case '6':
                    return 'Kalos';
                    break;
                default:
                    return null;
                    break;
                }
            })
            .rollup(function(d) {
                return d.length;
            }).entries(data);
        console.log(numberPokemonPerRegion);
        
        //g element that will draw the x axis that is appended to the svg
        var xAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + (drawHeight + margin.top) + ')')
            .attr('class', 'axis');

        //g element that will draw the y axis that is appended to the svg
        var yAxisLabel = svg.append('g')
            .attr('transform', 'translate(' + margin.left + ',' + margin.top + ')')
            .attr('class', 'axis');

        //text element for x axis label
        var xAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left + drawWidth) / 2 + ',' + (margin.top + drawHeight + 40) + ')')
            .attr('class', 'title');

        //text element for y axis label  
        var yAxisText = svg.append('text')
            .attr('transform', 'translate(' + (margin.left - 40) + ',' + (margin.top + drawHeight) / 2 + ') rotate(-90)')
            .attr('class', 'title');

        var xAxis = d3.axisBottom();
        var yAxis = d3.axisLeft();
        var xScale = d3.scaleBand();
        var yScale = d3.scaleLinear();

        //Gives specific colors to each Pokemon region
        var regionalColors = ['crimson', 'blue', 'green', 'purple', 'grey', 'orange'];

        var colorScale = d3.scaleOrdinal()
            .domain(regions)
            .range(regionalColors);
        
        //Sets the scale based on the data passed in
        var setScales = function(data) {
            var yMin = d3.min(data, function(d) {
                return +d.value;
            });

            var yMax = d3.max(data, function(d) {
                return +d.value
            });
            console.log(yMax);

            xScale.range([0, drawWidth])
                .domain(regions)
                .padding(0.1);

            yScale.range([drawHeight, 0])
                .domain([0, yMax]);

        };

        //Sets the axes
        var setAxes = function() {
            xAxis.scale(xScale);

            yAxis.scale(yScale);

            xAxisLabel.transition().duration(1000).call(xAxis);

            yAxisLabel.transition().duration(1000).call(yAxis);

            xAxisText.text('Regions');
            if (selection == 'Types') {
                yAxisText.text('Number of Pokemon')
            } else {
                yAxisText.text("Average " + type + " Stat")
            }
        };


        //Draws the viz based on the data passed in
        var draw = function(data) {
            setScales(data);

            setAxes();

            var bars = g.selectAll('rect').data(data);

            //Tips
            var tip = d3.tip()
                .attr('class', 'd3-tip')
                .offset([-10, 0])
                .html(function(d) {
                    return Math.round(d.value * 100) / 100;
            });
            g.call(tip);

            bars.enter().append('rect')
                .attr('x', function(d) {
                    return xScale(d.key);
                })
                .attr('y', function(d) {
                    return drawHeight;
                })
                .attr('height', 0)
                .attr('class', 'bar')
                .on('mouseover', tip.show)
                .on('mouseout', tip.hide)
                .merge(bars)
                .transition()
                .duration(750)
                .delay(function(d, i) {
                    return 50 * i;
                })
                .attr('width', xScale.bandwidth())
                .attr('y', function(d) {
                    return yScale(d.value);
                })
                .attr('height', function(d) {
                    return drawHeight - yScale(d.value);            
                })
                .attr('fill', function(d) {
                    return colorScale(d.key)
                });

            bars.exit().remove();
        };

        $("button").on("click", function() {
            var val = $(this).val();
            var className = $(this).attr('class');
            
            $("h6").text(val).attr('class', className);
            type = val;

            var filteredData = typeFilter();
            
            if (selection == 'Types') {
                draw(aggregate(filteredData));

            } else if (selection == 'Base Stats') {
                draw(aggregateBaseStats(numberPokemonPerRegion));
            }

            if (type == 'all') {
                draw(numberPokemonPerRegion);
            }

            // var thing = aggregateBaseStats()
            // console.log(thing);
        });

        $(document).ready(function() {
            $(".dropdown-button").on('change', function() {
            var val = $("#mySelect").val();
            console.log(val);
            selection = val;

            //$(".btn-group").replaceWith();

            if (selection == 'Base Stats') {
                console.log("basestats selected");
                $("#stats").show();
                $("#types").hide();
            } else if (selection == 'Types') {
                console.log("types selected");
                $('#types').show();
                $("#stats").hide();
            }
        }).dropdown({
            inDuration: 300,
            outDuration: 225,
            constrainWidth: false, // Does not change width of dropdown to that of the activator
            hover: false, // Activate on hover
            gutter: 0, // Spacing from edge
            belowOrigin: false, // Displays dropdown below the button
            alignment: 'left', // Displays dropdown with edge aligned to the left of button
            stopPropagation: false // Stops event propagation
        }); 
        });

        draw(numberPokemonPerRegion)

    });

});