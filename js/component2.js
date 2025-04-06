const groups = [
    { "label": "MBBK" },
    { "label": "BADI" },
    { "label": "COSMOS" }
];

const components = [
    { "group": "MBBK", "value": "MBBK-CERT/API-UX-CERT/CHANNEL-MBBK-CARD-PIN-MANAGEMENT/CHANNEL-MBBK-CARD-PIN-MANAGEMENT-V1", "description": "channel-mbbk-card-pin-management-v1" },
    { "group": "MBBK", "value": "MBBK-CERT/API-UX-CERT/CHANNEL-MBBK-CUSTOMIZE-CUSTOMER/CHANNEL-MBBK-CUSTOMIZE-CUSTOMER-V1", "description": "channel-mbbk-customize-customer-card-v1" },
    { "group": "MBBK", "value": "MBBK-CERT/API-UX-CERT/CHANNEL-MBBK-CREDIT-CARD-LOAN/CHANNEL-MBBK-CREDIT-CARD-LOAN-V1", "description": "channel-mbbk-credit-card-loan-v1" }
];

jobs = [];

$(function () {
    addComponents();
    $("#load-api").on("click", function () {
        ajaxCall('http://localhost:8081/job/NVLL-CERT/api/json');

        //console.log("JOBS: " + JSON.stringify(jobs));
        //console.log("Total de job: " + jobs.length);

        $("#txtComponent").autocomplete({
            source: jobs
          });
    });
});

function addComponents() {

    $('#selectApi').append($('<option>', { value: "", text: '--- Select option ---' }));

    $.each(groups, function (i, group) {
        $('#selectApi').append($('<optgroup>', {
            label: group.label
        }));
        $.each(components, function (i, component) {
            if (group.label === component.group) {
                $('#selectApi').append($('<option>', {
                    value: component.value,
                    text: component.description
                }));
            }
        });
    });
}

function ajaxCall(url) {
    $.ajax({
        url: url,
        type: "GET",
        async: false,
        headers: {
            'Authorization': 'Basic ' + btoa("neilvla:1153faf19b9155f7a42d71142b63e4e390")
        },
        success: function (data) {            
            $.each(data.jobs, function (i, job) {
                if (job._class.includes('job')) {
                    jobs.push(job.url.replace("/jenkins", ""));
                }
                if (job._class.includes('folder')) {
                    ajaxCall(job.url.replace("/jenkins", "") + "api/json");
                }
            });
        },
        error: function (error) {
            console.log(`Mi Error ${JSON.stringify(error)}`);
        }
    });
}

/*function ajaxCall() {

    let myHeaders = new Headers({
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json'
    });
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Access-Control-Allow-Methods", "POST, GET, OPTIONS");
    myHeaders.append("Access-Control-Allow-Headers", "X-PINGOTHER");
    myHeaders.append("Access-Control-Max-Age", "1728000");
    myHeaders.append("Authorization", "Basic 1153faf19b9155f7a42d71142b63e4e390");

    let requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow',
        mode: 'cors',
        credentials: 'include'
    };

    fetch("http://localhost:8081/job/NVLL-CERT/api/json", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));

}*/