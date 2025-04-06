class Repository {

	constructor(name, env, wait) {
		this.name = name;
		this.env = env;
		this.wait = wait;
	}
}

class Environment {

    constructor(name, path, ignoreRc, findRc, params, revert) {
        this.name = name;
        this.path = path;
        this.ignoreRc = ignoreRc;
        this.findRc = findRc;
        this.params = params;
        this.revert = revert;
    }
}

class Param {

	constructor(type, name, value) {
		this.type = type;
		this.name = name;
		this.value = value;
	}

	static of(type, name, value) {
		return new Param(type, name, value);
	}

}