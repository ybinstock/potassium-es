
/**
A list of {Declaration}s
*/
class DeclarationList {
	constructor(declarations){
		this._declarations = declarations
	}

}

DeclarationList.prototype[Symbol.iterator] = function*(){
	for(let declaration of this._declarations) yield declaration
}

/**
A KSS declaration with a property, value, and importance.

Example serialized declarations:

- font-size: 12em !important;
- background-color: var(--super-green)

*/
class Declaration {
	constructor(rawDeclaration){
		this._property = rawDeclaration.property
		this._value = rawDeclaration.value
		this._important = rawDeclaration.important === true
	}

	get property(){ return this._property }
	get value(){ return this._value }
	get important(){ return this._important }

	reset(property, value, important=false){
		this._property = property
		this._value = value
		this._important = important
	}
}

export default Declaration

export {
	Declaration,
	DeclarationList
}