let partits = [
    {
        name: "ERC",
        votes: 0,
        logo: "img/erc.jpg",
        color: "rgba(247,219,16,0.7)",
        bgColor: "rgba(247,219,16,1)"
    },
    {
        name: "PSC",
        votes: 0,
        logo: "img/psc.svg",
        color: "rgba(219,8,21,0.7)",
        bgColor: "rgba(219,8,21,1)"
    },
{
        name: "Nul",
        votes: 0,
        logo: "img/psc.svg",
        color: "rgba(219,8,21,0.7)",
        bgColor: "rgba(219,8,21,1)"
    },

{
        name: "blanc",
        votes: 0,
        logo: "img/psc.svg",
        color: "rgba(219,8,21,0.7)",
        bgColor: "rgba(219,8,21,1)"
    },

    {
        name: "ADA",
        votes: 0,
        logo: "img/ada.png",
        color: "rgba(17,15,114,1)",
        bgColor: "rgba(17,15,114,1)"
    },
    {
        name: "Comuns",
        votes: 0,
        logo: "img/pdem.png",
        color: "rgba(169,35,92,0.7)",
        bgColor: "rgba(169,35,92,1)"
    },
    {
        name: "Cs",
        votes: 0,
        logo: "img/cs.jpg",
        color: "rgba(242,78,0,0.7)",
        bgColor: "rgba(242,78,0,1)"
    },
    {
        name: "JuntsXCat",
        votes: 0,
        logo: "img/ciu.png",
        color: "rgba(220,3,70,0.7)",
        bgColor: "rgba(220,3,70,1)"
    },
    {
        name: "PP",
        votes: 0,
        logo: "img/pp.png",
        color: "rgba(0,158,219,0.7)",
        bgColor: "rgba(0,158,219,1)"
    },
];
let myChart;
let chart;
let cens = 0;
let votants = 0;
if (document.readyState !== 'loading') {
    eventHandler();
} else {
    document.addEventListener('DOMContentLoaded', eventHandler);
}

function eventHandler() {
    flagger = getFromCookie()
    if (flagger != false) {
        partits = flagger;
        votants = partits.reduce((a, b) => +a + +b.votes, 0);
        updateVotants(0);
    }
    // let chart = createChart();
    cens = getCensFromCookie();
    mountTable(chart);
    chart = createChart();
    mountSelect();
}

function mountTable(chart) {
    let tableBody = '';
    const tBody = document.getElementById("tbody");
    for (let partit of partits) {
        tableBody += `<tr>`;
        tableBody += `<td>`;
        tableBody += `<img src="${partit.logo}" alt="logo${partit.name}" class = "logo">`;
        tableBody += `</td>`;
        tableBody += `<td>`;
        tableBody += `${partit.name}`;
        tableBody += `</td>`;
        tableBody += `<td>`;
        tableBody += `${partit.votes}`;
        tableBody += `</td>`;
        tableBody += `<td>`;
        tableBody += `<button class = 'btn btn-primary plusOne' onClick = 'clickBTN(1, "${partit.name}")'>+1</button>`;
        tableBody += `</td>`;
        tableBody += `<td>`;
        tableBody += `<button class = 'btn btn-danger minusOne' onClick = 'clickBTN(-1, "${partit.name}")'>-1</button>`;
        tableBody += `</td>`;
        tableBody += `<td>`;
        tableBody += `<button class = 'btn btn-primary plus100' onClick = 'clickBTN(100, "${partit.name}")'>+100</button>`;
        tableBody += `</td>`;
        tableBody += `<td>`;
        tableBody += `<button class = 'btn btn-danger minus100' onClick = 'clickBTN(-100, "${partit.name}")'>-100</button>`;
        tableBody += `</td>`;

        tableBody += `</tr>`;
    }
    tBody.innerHTML = tableBody;
}

function clickBTN(votesTo, name) {    
    manageVotes(name, votesTo);
}

function manageVotes(name, votesTo) {
    for (let partit of partits) {        
        if (partit.name == name && partit.votes + votesTo >= 0) {
            partit.votes = partit.votes + votesTo;
            mountTable();
            saveToCookie();
            myChart.data.datasets[0].data =  partits.map(a => a.votes);
            myChart.update();
            updateVotants(votesTo);

            return false;
        }
    }
}

function saveToCookie() {
    Cookies.set('partits', JSON.stringify(partits));
}
function getFromCookie() {
    try {
        let partits = Cookies.get('partits');
        
        return JSON.parse(partits);
    } catch (error) {
        return false;
    }
}

function saveCensToCookie() {
    
    Cookies.set('cens', cens);
}

function getCensFromCookie() {
    try {
        cens = Cookies.get('cens');
        if (cens == undefined) {
            cens = 0;
        }
        document.getElementById('cens').innerHTML = cens;
        return cens;
    } catch (error) {
        
        return null;
    }
}

function deleteCookie() {
    Cookies.remove('partits');
    Cookies.remove('cens');
    location.reload();
}


function createChart() {
        myChart = new Chart('chart', {
        type: 'pie',
        data: {
            labels: partits.map(a => a.name),
            datasets: [{
                label: "Municipals",
                backgroundColor: partits.map(a => a.color),
                borderColor: partits.map(a => a.bgColor),
                data: partits.map(a => a.votes)
            }]
        },
    });
    return myChart;
}

function guardarCens() {
    cens = document.getElementById("censInput").value;
    document.getElementById("percentatge").innerHTML = updatePercentatge();
    document.getElementById("cens").innerHTML = cens;
    $('#modalCens').modal('hide')
    saveCensToCookie();
}

function updateVotants(votesTo) {
    votants = votants + votesTo;
    document.getElementById("votants").innerHTML = votants
    document.getElementById("percentatge").innerHTML = updatePercentatge();
}
function updatePercentatge() {
    return (votants*100)/cens;
}

function mountSelect() {
    let select = document.getElementById('selectPartits');
    for (let partit of partits) {
        select.options[select.options.length] = new Option(partit.name, partit.name);
    }
}

function getValueFromManual() {
    let votsManual = document.getElementById("votsInput").value;
    let selectManual = document.getElementById("selectPartits").value;
    $('#votManualModal').modal('hide')
    manageVotes(selectManual, Number(votsManual));
    
}
