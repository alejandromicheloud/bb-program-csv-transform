const fs = require('fs');
const Papa = require('papaparse');

// Leer el archivo CSV
const csvFile = fs.readFileSync('files/input.csv', 'utf8');

/* 
{
  unit_order: '12',
  unit: 'Estatística e probabilidade',
  lesson_order: '4',
  lesson: 'Noção de acaso',
  lo_guid: 'OC-ES-001_M1-EyP-4a',
  lo_name: 'Classificar eventos do acaso, tais como "com certeza ocorrerá", "talvez ocorra" e "é impossível ocorrer" em situações cotidianas',
  kc_name: 'Classificação de eventos do acaso, tais como "com certeza ocorrerá", "talvez ocorra" e "é impossível ocorrer" em situações cotidianas'
}
*/

// Parsear el archivo CSV
Papa.parse(csvFile, {
    header: true,
    complete: function (results) {
        // Transformar los datos
        const newRows = [];
        let currentUnit = '';
        let currentLesson = '';
        results.data.forEach(row => {
            if (row?.unit_order) {
                if (row.unit !== currentUnit) {
                    if (currentUnit !== '') {
                        newRows.push([]);
                    }
                    currentUnit = row.unit;
                    newRows.push(['UNIDAD', row.unit_order, row.unit]);
                }
                if (row.lesson !== currentLesson) {
                    currentLesson = row.lesson;
                    newRows.push(['LECCION', `${row.unit_order}.${row.lesson_order}`, row.lesson]);
                }
                newRows.push(['', row.lo_guid, row.lo_name, row.kc_name]);
            }
        });

        // // Convertir los datos transformados a CSV
        const csv = Papa.unparse(newRows);

        // Escribir los datos transformados a un nuevo archivo CSV
        fs.writeFileSync('files/output.csv', csv);
    }
});