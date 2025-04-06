repos = [];
env = [];
params = [];

const content = new Object();
content.nameOcdRc = "RC-AUTOGENERADO";
content.repos = repos;

$("#area").text(JSON.stringify(content, undefined, 2));

$("#add-api").click(function () {

    console.log("viendo: " + $("#selectApi option:selected").val());

    if ($("#selectApi option:selected").val() !== "") {

        const found_api = repos.some(r => r.name === $("#selectApi option:selected").text().trim().toString());

        if (!found_api) {
            init();

            const objRepo = new Object();
            objRepo.name = $("#selectApi option:selected").text().trim();
            objRepo.env = addEnvElement();
            objRepo.wait = true;

            repos.push(objRepo);

            content.repos = repos;

            $("#area").text(JSON.stringify(content, undefined, 2));

            $("#selectApi").prop('selectedIndex', 0);
        } else {
            setTextAlert("El API ya fue agregado");
            $("div#warning-text").removeClass("visually-hidden");
            setTimeout(function () {
                $("div#warning-text").addClass("visually-hidden");
            }, 2000);
        }
    } else {
        setTextAlert("Seleccione un API");
        $("div#warning-text").removeClass("visually-hidden");
        setTimeout(function () {
            $("div#warning-text").addClass("visually-hidden");
        }, 2000);
    }
});

$("#remove-api").click(function () {
    if ($("#selectApi option:selected").val() !== "") {
        repos = repos.filter(r => r.name !== $("#selectApi option:selected").text().trim().toString());
        content.repos = repos;
        $("#area").text(JSON.stringify(content, undefined, 2));
    } else {
        setTextAlert("Seleccione un API");
        $("div#warning-text").removeClass("visually-hidden");
        setTimeout(function () {
            $("div#warning-text").addClass("visually-hidden");
        }, 2000);
    }

});

function addEnvElement() {
    const objApiCert = new Object();
    objApiCert.name = "cert";
    objApiCert.path = $("#selectApi option:selected").val();
    env.push(objApiCert);

    const objApiProd = new Object();
    objApiProd.name = "prod";
    objApiProd.path = $("#selectApi option:selected").val().replaceAll("CERT", "PROD");

    addParams("git", "RELEASE_TAG_NAME", "RC-AUTOGENERADO");
    addParams("boolean", "FORCE_RELEASE", "true");
    objApiProd.params = params;
    env.push(objApiProd);

    return env;

}

function addParams(type, name, value) {
    const objParam = new Object();
    objParam.type = type;
    objParam.name = name;
    objParam.value = value;

    params.push(objParam);

}

function init() {
    env = [];
    params = [];
    $("#area").text('');
}

function setTextAlert(message) {
    $("div#warning-text > div").text(message);
}