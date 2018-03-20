var columns = 1;
var rows = 1;

$(document).ready(function () {
    initialize();
    newTable();
})

function addRow() {
    let newRow = $('<tr/>').insertAfter($('#myTable tr:last'));
    rows++;

    let ids = [];
    for (let i = 0; i < columns; i++) {
        ids[i] = 'r' + rows + 'c' + (i + 1);
    }

    $(ids).each(function (collIndex) {
        newRow.append($('<td/>').append($('<input type="text" id="' + this + '" class="cell">')));
    });
}

function addColumn() {
    columns++;
    let ids = [];
    for (let i = 0; i < rows; i++) {
        ids[i] = 'r' + (i + 1) + 'c' + columns;
    }
    let i = 0;
    let tableRows = $('#myTable tr').each(function () {
        $(this).find('td').last().after('<td><input type="text" id="' + ids[i] + '" class="cell"></td>');
        i++;
    });
}

function save() {
    let result = {table: $('#tableName').val(), content: ""};
    let content = {rows: rows, cols: columns, data: {}};
    $('.cell').each(function () {
        content.data[$(this).attr('id')] = $(this).val();
    });

    result.content = JSON.stringify(content);

    var xhr = new XMLHttpRequest();
    xhr.open("POST", 'http://localhost:8080/api', true);

    xhr.setRequestHeader("Content-type", "application/json");

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            alert('Table saved!');
            let exits = false;
            $('#savedTables li').each(function () {
                exits = $(this).text() === result.table;
            })

            if (!exits) {
                let li = $('<li/>');
                li.click(function () {
                    loadTable(result.table);
                });
                li.text(result.table);
                $('#savedTables').append(li);
            }
        }
    }
    xhr.send(JSON.stringify(result));

    console.log(JSON.stringify(result));

}

function newTable() {
    $('#tableName').val('');
    $('#myTable').empty();
    $('#myTable').append($('<tr/>'));
    $('#myTable tr:last').append($('<td><input type="text" id="r1c1" class="cell"></td>'));

    columns = 1;
    rows = 1;
}

function initialize() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:8080/api', true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            if (xhr.responseText.length != 0) {
                let responseTables = JSON.parse(xhr.responseText);
                for (let table in responseTables) {
                    let li = $('<li/>');
                    let tableName = responseTables[table];
                    li.click(function () {
                        loadTable(tableName);
                    });
                    li.text(tableName);
                    $('#savedTables').append(li);
                }
            }
        }
    }
    xhr.send();
}

function loadTable(tableName) {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", 'http://localhost:8080/api?table=' + tableName, true);

    xhr.onreadystatechange = function () {
        if (xhr.readyState == XMLHttpRequest.DONE && xhr.status == 200) {
            let responseTable = JSON.parse(xhr.responseText);

            newTable();
            $('#tableName').val(tableName);
            let currentRows = rows;
            for (let i = 0; i < responseTable.rows - currentRows; i++)
                addRow();
            let currentCols = columns;
            for (let i = 0; i < responseTable.cols - currentCols; i++)
                addColumn();


            $('.cell').each(function () {
                $(this).val(responseTable.data[$(this).attr('id')]);
            });

            result.data = JSON.stringify(data);
        }
    }
    xhr.send();
}