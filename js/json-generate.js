repos = [];
env = [];

const content = new Object();
content.nameOcdRc = "RC-AUTOGENERADO";
content.repos = repos;

$("#area").text(JSON.stringify(content, undefined, 2));

$("#btnGenerate").click(function () {

	if ($("#selectApi option:selected").val() !== "") {

		const found_api = repos.some(r => r.name === $("#selectApi option:selected").text().trim().toString());

		if (!found_api) {
			resetData();

			const objRepo = new Repository();
			objRepo.name = $("#selectApi option:selected").text().trim();
			console.log("ver radio: " + $('input[name="revert"]:checked').val());
			objRepo.env = addEnvElement($('input[name="revert"]:checked').val());
			objRepo.wait = true;

			repos.push(objRepo);

			content.repos = repos;

			$("#area").text(JSON.stringify(content, undefined, 2));

			$("#tableComponent tbody").append("<tr>" +
				"<td>" + $("#selectApi option:selected").text() + "</td>" +
				"<td><button type='button' class='btn btn-danger'><i class='bi bi-trash'></i> </button></td>" +
				"</tr>");

			$("#selectApi").prop('selectedIndex', 0);
			$("#txtVersion").val('');
			$("#txtVersion").attr("disabled", true);
			$('input[name="revert"]').attr("disabled", false);
			$('input[name="revert"]').prop("checked", false);

		} else {
			setTextAlert("El API ya fue agregado");
			$("div#warning-text").removeClass("visually-hidden");
			setTimeout(function () {
				$("div#warning-text").addClass("visually-hidden");
			}, 2000);
		}
	} else {
		setTextAlert("Seleccione un componente");
		$("div#warning-text").removeClass("visually-hidden");
		setTimeout(function () {
			$("div#warning-text").addClass("visually-hidden");
		}, 2000);
	}
});

$("#chkRollback").on("change", function () {
	if (this.checked) {
		$("#txtVersion").attr("disabled", false);
		$("#chkRelease").prop("checked", false);
	} else {
		$("#txtVersion").attr("disabled", true);
	}
});

$("#chkRelease").on("change", function () {
	if (this.checked) {
		$("#chkRollback").prop("checked", false);
		$("#txtVersion").attr("disabled", true);
	}
});

/*$("#btnClean").click(function () {
	if ($("#selectApi option:selected").val() !== "") {
		repos = repos.filter(r => r.name !== $("#selectApi option:selected").text().trim().toString());
		content.repos = repos;
		$("#area").text(JSON.stringify(content, undefined, 2));
		$("#selectApi").prop('selectedIndex', 0);
		$('input[name="revert"]').prop("checked", false);
	} else {
		setTextAlert("Seleccione un componente");
		$("div#warning-text").removeClass("visually-hidden");
		setTimeout(function () {
			$("div#warning-text").addClass("visually-hidden");
		}, 2000);
	}
});*/

$("#btnClean").click(function () {
	$("#selectApi").prop('selectedIndex', 0);
	$('input[name="revert"]').attr("disabled", false);
	$('input[name="revert"]').prop("checked", false);
	$("#txtVersion").val('');
});

$("#selectApi").on("change", function () {
	if ($("#selectApi option:selected").attr("name") === "COSMOS") {
		$("#chkRelease").attr("disabled", false);
		$("#chkRollback").attr("disabled", true);
		$("#chkRollback").prop("checked", false);
	} else {
		$('input[name="revert"]').attr("disabled", false);
		$('input[name="revert"]').prop("checked", false);
	}
});

function addEnvElement(revertType) {
	const objApiCert = new Environment();
	objApiCert.name = "cert";
	objApiCert.path = $("#selectApi option:selected").val();

	if (revertType !== undefined) {
		if (revertType === 'release') {
			const objRevertCert = new Object();
			objRevertCert.path = $("#selectApi option:selected").val();
			objRevertCert.ignoreRc = false;
			objRevertCert.findRc = true;
			objApiCert.revert = objRevertCert;
		}

		if (revertType === 'rollback') {
			const objRevertCert = new Object();
			objRevertCert.path = $("#selectApi option:selected").val().concat('-ROLLOUT');
			objRevertCert.params = revertParams("cer");
			objApiCert.revert = objRevertCert;
		}
	}

	env.push(objApiCert);

	const objApiProd = new Object();
	objApiProd.name = "prod";
	var pathProd = $("#selectApi option:selected").val().replaceAll("CERT", "PROD");
	objApiProd.path = pathProd;

	params = [];
	params.push(Param.of("git", "RELEASE_TAG_NAME", "RC-AUTOGENERADO"));
	params.push(Param.of("boolean", "FORCE_RELEASE", true));
	objApiProd.params = params;

	if (revertType !== undefined) {
		if (revertType === 'release') {
			const objRevertProd = new Object();
			objRevertProd.path = pathProd;
			objRevertProd.params = params;
			objApiProd.revert = objRevertProd;
		}

		if (revertType === 'rollback') {
			const objRevertProd = new Object();
			objRevertProd.path = $("#selectApi option:selected").val().replaceAll("CERT", "PROD").concat('-ROLLOUT');
			objRevertProd.params = revertParams("pro");
			objApiProd.revert = objRevertProd;
		}
	}

	env.push(objApiProd);

	return env;

}

function resetData() {
	env = [];
	$("#area").text('');
}

function setTextAlert(message) {
	$("div#warning-text > div").text(message);
}

function revertParams(stage) {

	params = [];
	params.push(Param.of("choice", "DELIVERY_IN_AKS", "MBBK"));
	params.push(Param.of("choice", "hosted", "aks"));
	params.push(Param.of("string", "aksSubscriptionId", RevertProperties.subscriptionId));
	params.push(Param.of("string", "aksRG", stage == "cer" ? RevertProperties.resourceGroupCert : RevertProperties.resourceGroupProd));
	params.push(Param.of("string", "aksCluster", stage == "cer" ? RevertProperties.aksClusterCert : RevertProperties.aksClusterProd));
	params.push(Param.of("string", "rollbackToGitOpsVersion", $("#txtVersion").val()));
	params.push(Param.of("string", "rollbackToKubernetesRevision", ""));
	params.push(Param.of("boolean", "rollbackFirstDeployment", false));

	return params;

}






