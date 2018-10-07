
/**
ComputedStyles holds the previous and computed declarations for a single Object3D
*/
class ComputedStyles {
	constructor(){
		/** @type {Map<string, StyleInfo>} property -> style */
		this._previousStyles = new Map()
		/** @type {Map<string, StyleInfo>} property -> style */
		this._currentStyles = new Map()
		/** @type {StyleInfo[]} */
		this._changes = []
	}

	/**
	Compute the final styles for a node:
	- apply local styles
	- apply inherited styles that aren't overriden

	@todo handle inherited --variables
	@todo calculate relative units like `em`
	@todo handle the 'inherit' and 'reset' style values
	@todo handle inherited sub values like `border-top: 10px` inherited on top of `border: 0`
	@todo handle value methods like `calc()`
	*/
	computeStyles(localStyles, parentalComputedStyles=null){
		// Swap the previous and current maps
		const holdingVariable = this._previousStyles
		this._previousStyles = this._currentStyles
		this._currentStyles = holdingVariable
		this._currentStyles.clear()
		// Empty the change list
		this._changes.splice(0, this._changes.length)

		// Assign the local styles
		for(let styleInfo of localStyles){
			this._currentStyles.set(styleInfo.property, styleInfo)
		}

		// If there are parental styles then add the inheritable ones for which there is not a local style
		if(parentalComputedStyles !== null){
			for(let styleInfo of parentalComputedStyles){
				// Skip if this is not a variable and not an inherited property
				if(
					styleInfo.property.startsWith('--') === false &&
					InheritedProperties.includes(styleInfo.property) === false
				) continue
				// Skip if there is a local style that overrides the inherited property
				if(this._currentStyles.has(styleInfo.property)) continue
				// Ok, this is a cascaded style!
				this._currentStyles.set(styleInfo.property, styleInfo)
			}
		}

		//Recalculate the changes list
		for(let [property, value] of this._currentStyles){
			let previousValue = this._previousStyles.get(property)
			if(previousValue !== value) this._changes.push(property)
		}
		for(let [property, previousValue] of this._previousStyles){
			if(!this._currentStyles.has(property)) this._changes.push(property)
		}
	}

	/**
	changes is used by the Stylist to know which styles need to be updated on the Three.Object3D
	@return {Array<property{string}>} the declarations that changed since the last update
	*/
	get changes(){ return this._changes }

	/** Iterate over the current declarations */
	*[Symbol.iterator](){
		for(let [property, styleInfo] of this._currentStyles) yield styleInfo
	}
}

/**
The name of properties that are inherited during the cascade.

Don't forget that --variables are also inherited!
*/
const InheritedProperties = [
	'border-collapse',
	'border-spacing',
	'caption-side',
	'color',
	'cursor',
	'direction',
	'empty-cells',
	'font-family',
	'font-size',
	'font-style',
	'font-variant',
	'font-weight',
	'font-size-adjust',
	'font-stretch',
	'font',
	'letter-spacing',
	'line-height',
	'list-style-image',
	'list-style-position',
	'list-style-type',
	'list-style',
	'orphans',
	'quotes',
	'tab-size',
	'text-align',
	'text-align-last',
	'text-decoration-color',
	'text-indent',
	'text-justify',
	'text-shadow',
	'text-transform',
	'visibility',
	'white-space',
	'widows',
	'word-break',
	'word-spacing',
	'word-wrap'
]

export default ComputedStyles
export { ComputedStyles, InheritedProperties }
