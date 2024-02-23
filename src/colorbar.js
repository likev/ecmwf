/*
//css
.colorbar {
    max-width: 800px;
    margin: 50px 0 50px 100px;
}

.colorbar-title-container {
    padding-top: 5px;
    text-align: center;
}

.colorbar-labels-container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    padding-bottom: 5px;
}

.colorbar-container {
    display: flex;
    width: 100%;
    height: 50px;
}

.colorbar-segment {
    flex-grow: 1;
    height: 100%;
    position: relative;
}

.colorbar-label {
    flex-grow: 1;
    text-align: left;
    box-sizing: border-box;
    flex-basis: 50px;
}
*/

/*
//html
<div id="colorbar-labels-container"></div>
<div id="colorbar-container"></div>
*/

const data = {
    "entries": [
        {
            "min-range": "0.5",
            "colour": "RGBA(0,255,255,1)",
            "max-range": "2"
        },
        {
            "min-range": "2",
            "colour": "RGBA(0,127,255,1)",
            "max-range": "4"
        },
        {
            "min-range": "4",
            "colour": "RGBA(0,0,255,1)",
            "max-range": "10"
        },
        {
            "min-range": "10",
            "colour": "RGBA(217,0,255,1)",
            "max-range": "25"
        },
        {
            "min-range": "25",
            "colour": "RGBA(255,0,255,1)",
            "max-range": "50"
        },
        {
            "min-range": "50",
            "colour": "RGBA(255,127,0,1)",
            "max-range": "100"
        },
        {
            "min-range": "100",
            "colour": "RGBA(255,0,0,1)",
            "max-range": "250"
        }
    ],
    "type": "colorbar",
    "number": 7,
    "title": "Experimental: FuXi ML model: Total precipitation (mm)"
}

function addColorBar(div, data) {

    const titleContainer = $('<div class="colorbar-title-container"></div>');
    const labelsContainer = $('<div class="colorbar-labels-container"></div>');
    const colorbarContainer = $('<div class="colorbar-container"></div>');

    titleContainer.text(data.title);

    data.entries.forEach((entry, index) => {
        // Create colorbar segment
        const segment = $('<div>').addClass('colorbar-segment').css('background-color',entry.colour);
        colorbarContainer.append(segment);

        
        // Create label for the segment
        const label = $('<div>').addClass('colorbar-label').text(entry['min-range']);

        const rightmost = $('<div>').css('float','right').text(entry['max-range']);
        if(index === data.number - 1) label.append(rightmost);

        labelsContainer.append(label)
    });
    

    $(div)
        .empty()
        .append(labelsContainer)
        .append(colorbarContainer)
        .append(titleContainer);

    return div;

}

export { addColorBar };