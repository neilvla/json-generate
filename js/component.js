const jobsCert = [];
const jobsProd = [];

$(function () {    
    ajaxCall(RevertProperties.domainCert + 'api/json', jobsCert);
    $("#txtComponentCert").autocomplete({
        source: jobsCert,
        minLength: 2,
        select: function( event, ui ) {
            console.log( "Selected: " + ui.item.value + " aka " + ui.item.id );
          }
      });
    ajaxCall('http://localhost:8081/job/NVLL-PROD/api/json', jobsProd);
    $("#txtComponentProd").autocomplete({
        source: jobsProd,
        minLength: 2
      });      
});

function ajaxCall(url, jobs) {
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
                    //console.log(job.url.split('/job', 5));
                    console.log((job.url.split('/job', 5)).slice(1).join(""));                    
                }
                if (job._class.includes('folder')) {
                    ajaxCall(job.url.replace("/jenkins", "") + "api/json", jobs);                    
                }
            });
        },
        error: function (error) {
            console.log(`Mi Error ${JSON.stringify(error)}`);
        }
    });
}