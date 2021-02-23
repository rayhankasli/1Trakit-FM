/**
 * This funcation return the chart option for stcked column chart
 * @param graphType - Type of graph month or date wise
 * @param vAxisTitle Get the title of vAxis
 * @param maxYAxis Get the max value for the Y axis
 * @param isZoom Get the wether zoom or not
 */
export function stackedChartOption(
    graphType: number, vAxisTitle: string,
    maxYAxis: number, isZoom?: boolean
): Object {

    const chartOptions: Object = {
        height: 350,
        width: '100%',
        isStacked: true,
        fontName: 'Poppins',
        fontSize: 13,
        legend: {
            position: 'none',
        },
        chartArea: {
            width: '100%',
            left: isZoom ? 50 : 40,
        },
        bar: {
            groupWidth: 0.175
        },
        hAxis: {
            title: graphType === 1 ? 'Date' : 'Months',
            titleTextStyle: {
                bold: true,
                italic: false,
                fontSize: 13,
                fontName: 'Poppins',
                color: '#444444'
            },
            maxAlternation: 1,
            maxTextLines: 2,
            showTextEvery: 1,
            viewWindowMode: 'maximized',
            viewWindow: { min: 0, max: 7 }
        },
        vAxis: {
            title: vAxisTitle,
            titleTextStyle: {
                bold: true,
                italic: false,
                fontSize: 13,
                fontName: 'Poppins',
                color: '#444444'
            },
            scaleType: 'mirrorLog',
            viewWindow: {
                min: 0,
                max: maxYAxis
            },
        },
        hAxes: {
            0: {
                textStyle: { color: '#444444' }
            }
        },
        vAxes: {
            0: { textStyle: { color: '#444444' } },
            1: { label: '', textStyle: { color: '#fff' } }
        }
    };

    return chartOptions;
}