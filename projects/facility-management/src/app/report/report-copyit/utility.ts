/** Return chart options */
export function chartOptions(vAxisTitle: string): any {

    const chartOption: any = {
        // title: 'Title of Chart',
        // curveType: 'function',
        height: 'auto',
        width: 'auto',
        pointSize: 5,
        legend: {
            position: 'bottom',
            maxLines: 2
        },
        fontName: 'Poppins',
        fontSize: 13,
        chartArea: {
            height: '70%',
            width: '80%',
            left: '15%',
            top: '10%'
        },
        hAxis: {
            title: 'MONTHS',
            titleTextStyle: {
                bold: true,
                italic: false
            },
        },
        vAxis: {
            title: vAxisTitle,
            titleTextStyle: {
                bold: true,
                italic: false
            }
        },
        series: {
            0: { color: '#c4c6d1' },
            1: { color: '#5b616d' },
            2: { color: '#DA2028' }
        }
    };

    return chartOption;
}