//Aqui define o banco de dados com o nome 'carbon_footprint'
const db = new PouchDB('carbon_footprint');

//Função para salvar os dados do formulário no banco de dados
function saveData(formData) {
    return db.put({
        _id: new Date().toISOString(), //coloca cada id dos registros como a data atual
        formData: formData //A gente salva os dados do formulário aqui
    });
}

//Essa função ela coloca os dados salvos no banco de dados na tela
function displaySavedData() {
    db.allDocs({ include_docs: true, descending: true }) //Aqui buscar por todas as 
        .then(function (result) {
            const savedDataDiv = document.getElementById('savedData'); //Acha onde a gente vai mostrar os dados na tela
            savedDataDiv.innerHTML = '<h2 class="text-xl font-semibold text-gray-800">Dados Salvos</h2>';
            const table = document.createElement('table'); //Cria uma tabela para mostrar os dados
            table.classList.add('mt-4', 'w-full', 'border', 'border-gray-200', 'divide-y', 'divide-gray-200'); //Adiciona algumas classes para estilizar a tabela

            const tableHeader = document.createElement('thead'); //Cria o cabeçalho da tabela
            const headerRow = document.createElement('tr'); //Cria uma linha para o cabeçalho da tabela
            const header1 = document.createElement('th'); //Cria a primeira coluna do cabeçalho
            header1.textContent = 'Data'; //Define o texto da primeira coluna como 'Data'
            const header2 = document.createElement('th'); 
            header2.textContent = 'Combustível (litros)'; 
            const header3 = document.createElement('th'); 
            header3.textContent = 'Tipo de Combustível';
            const header4 = document.createElement('th'); 
            header4.textContent = 'Distância Percorrida (km)';

            //Adiciona as colunas ao cabeçalho
            headerRow.appendChild(header1); 
            headerRow.appendChild(header2); 
            headerRow.appendChild(header3); 
            headerRow.appendChild(header4); 
            tableHeader.appendChild(headerRow); 
            table.appendChild(tableHeader); //Adiciona o cabeçalho à tabela

            const tableBody = document.createElement('tbody'); //Cria o corpo da tabela onde os dados serão exibidos
            result.rows.forEach(function (row) { // Para cada linha de dados retornada do banco de dados, utilizando forEach para iterar sobre cada elemento
                const doc = row.doc; //Aqui pega o documento da linha atual
                const dataRow = document.createElement('tr'); //Cria uma nova linha para os dados
                const dateCell = document.createElement('td'); //Cria uma linha da tabela para a data
                dateCell.textContent = new Date(doc._id).toLocaleString(); //Converte o id (data) para uma string legível
                const formData = doc.formData; //Pega os dados do formulário salvos no documento
                const fuelCell = document.createElement('td');
                fuelCell.textContent = formData.fuel; 
                const fuelTypeCell = document.createElement('td');
                fuelTypeCell.textContent = formData.fuelType;
                const distanceCell = document.createElement('td');
                distanceCell.textContent = formData.distance;

                //Adiciona as linhas da tabela
                dataRow.appendChild(dateCell); 
                dataRow.appendChild(fuelCell); 
                dataRow.appendChild(fuelTypeCell);
                dataRow.appendChild(distanceCell); 
                tableBody.appendChild(dataRow); // Adiciona a linha de dados ao corpo da tabela
            });
            table.appendChild(tableBody); //Adiciona o corpo da tabela à tabela
            savedDataDiv.appendChild(table); //Adiciona a tabela ao div onde os dados serão exibidos
        }).catch(function (err) { //Caso ocorra algum erro ao buscar os dados
            console.log(err); //Exibe o erro no console
        });
}

document.getElementById('carbonForm').addEventListener('submit', function (event) { //Adiciona um evento de submit ao formulário
    event.preventDefault(); //Previne o comportamento padrão do formulário
    const formData = { //Coleta os dados do formulário
        fuel: parseFloat(document.getElementById('fuel').value),
        fuelType: document.getElementById('fuelType').value,
        distance: parseFloat(document.getElementById('distance').value)
    };
    saveData(formData).then(function () { //Chama a função para salvar os dados no banco de dados
        displaySavedData(); // Exibe os dados salvos na tela
    }).catch(function (err) { //Caso ocorra algum erro ao salvar os dados
        console.log(err); //Exibe o erro no console
    });
});

document.getElementById('saveDataBtn').addEventListener('click', function () { //Adiciona um evento de click ao botão de salvar dados
    const formData = { //Coleta os dados do formulário
        fuel: parseFloat(document.getElementById('fuel').value), // Converte o valor do combustível para um número
        fuelType: document.getElementById('fuelType').value, // Pega o tipo de combustível selecionado
        distance: parseFloat(document.getElementById('distance').value) // Converte a distância percorrida para um número
    };
    saveData(formData).then(function () { //Chama a função para salvar os dados no banco de dados
        alert('Dados salvos com sucesso!'); // Exibe um alerta de sucesso
    }).catch(function (err) { //Caso ocorra algum erro ao salvar os dados
        console.log(err); //Exibe o erro no console
    });
});

document.getElementById('loadTableBtn').addEventListener('click', function () { //Adiciona um evento de click ao botão de carregar tabela
    displaySavedData(); // Chama a função para exibir os dados salvos na tela
});