/**
 * @module Tag
 */

/**
 * Tag object from API.
 * @global
 * @typedef {object} APITag
 * @property {number|string} id    Tag id.
 * @property {string}        type  Tag type.
 * @property {string}        name  Tag name.
 * @property {number|string} count Tagged books count.
 * @property {string}        url   Tag URL.
 */

/**
 * @typedef {object} TagTypes
 * @property {UnknownTagType} Unknown   Unknown tag type.
 * @property {TagType}        Tag       Tag tag type.
 * @property {TagType}        Category  Category tag type.
 * @property {TagType}        Artist    Artist tag type.
 * @property {TagType}        Parody    Parody tag type.
 * @property {TagType}        Character Character tag type.
 * @property {TagType}        Group     Group tag type.
 * @property {TagType}        Language  Language tag type.
 */

/**
 * Class representing tag type.
 * @class
 */
class TagType {
	/**
	 * @type {TagTypes}
	 * @static
	 */
	static knownTypes = {};

	/**
	 * Tag type name.
	 * @type {?string}
	 * @default null
	 */
	type = null;

	/**
	 * Create tag type.
	 * @param {string} type Tag type.
	 */
	constructor(type) {
		if (type) {
			this.type = type;
			this.constructor.knownTypes[type] = this;
		}
	}

	/**
	 * Check if this tag type is unknown.
	 * @type {boolean}
	 */
	get isKnown() {
		return !(this instanceof UnknownTagType);
	}
}

/**
 * Class representing unknown tag type.
 * @class
 * @extends TagType
 */
class UnknownTagType extends TagType {
	/**
	 * Create unknown tag type.
	 * @param {string} [type="unknown"] Unknown tag type name.
	 */
	constructor(type = 'unknown') {
		super(null);
		this.type = type;
	}
}

/**
 * Class representing tag.
 * @class
 */
class Tag {
	/**
	 * Tag types.
	 * @type {TagTypes}
	 * @static
	 */
	static types = {
		Unknown  : new UnknownTagType(), // Symbol('unknown')
		Tag      : new TagType('tag'),
		Category : new TagType('category'),
		Artist   : new TagType('artist'),
		Parody   : new TagType('parody'),
		Character: new TagType('character'),
		Group    : new TagType('group'),
		Language : new TagType('language'),

		/**
		 * Known tag types.
		 * @type {TagTypes}
		 */
		known: TagType.knownTypes,

		/**
		 * Get tag type class instance by name.
		 * @param {string} type Tag type.
		 * @returns {TagType|UnknownTagType} Tag type class instance.
		 */
		get(type) {
			let known;
			if ('string' === typeof type)
				type = type.toLowerCase();
			return ((known = this.known[type])) ? known : new UnknownTagType(type);
		},
	};

	/**
	 * Warp tag object with Tag class instance.
	 * @param {APITag|Tag} tag Tag to wrap.
	 * @returns {Tag} Tag.
	 * @static
	 */
	static get(tag) {
		if (!(tag instanceof this))
			tag = new this({
				id   : +tag.id,
				type : tag.type,
				name : tag.name,
				count: +tag.count,
				url  : tag.url,
			});
		return tag;
	}

	/**
	 * Create tag.
	 * @param {object}         [params]                       Tag parameters.
	 * @param {number}         [params.id=0]                  Tag id.
	 * @param {string|TagType} [params.type=TagTypes.Unknown] Tag type.
	 * @param {string}         [params.name=""]               Tag name.
	 * @param {number}         [params.count=0]               Tagged books count.
	 * @param {string}         [params.url=""]                Tag URL.
	 */
	constructor({
		id    = 0,
		type  = this.constructor.types.Unknown,
		name  = '',
		count = 0,
		url   = '',
	} = {}) {
		Object.assign(this, {
			id,
			type: type instanceof TagType
				? type
				: this.constructor.types.get(type),
			name,
			count,
			url,
		});
	}

	/**
	 * Compare this to given one.
	 * @param {string|Tag} tag            Tag to compare with.
	 * @param {boolean}    [strict=false] Whatever all parameters must be the same.
	 * @returns {boolean} Whatever tags are equal.
	 */
	compare(tag, strict = false) {
		tag = this.constructor.get(tag);

		return !![
			'id',
			'type',
			'name',
			'count',
			'url',
		].map(
			prop => tag[prop] === this[prop]
		).reduce(
			(accum, current) => strict
				? accum * current
				: accum + current
		);
	}
}

export default Tag;
