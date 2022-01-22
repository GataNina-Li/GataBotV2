/**
 * @module Image
 */

import Book from './book';

/**
 * Image object from API.
 * @global
 * @typedef {object} APIImage
 * @property {string}        t Image type.
 * @property {number|string} w Image width.
 * @property {number|string} h Image height.
 */

/**
 * @typedef {object} ImageTypes
 * @property {TagType} JPEG JPEG image type.
 * @property {TagType} PNG  PNG image type.
 */

/**
 * Class representing image type.
 * @class
 */
class ImageType {
	/**
	 * @type {ImageTypes}
	 * @static
	 */
	static knownTypes = {};

	/**
	 * Image type name.
	 * @type {?string}
	 */
	type = null;

	/**
	 * Image type extension.
	 * @type {?string}
	 */
	extension = null;

	/**
	 * Create image type.
	 * @param {string} type      Image type name.
	 * @param {string} extension Image type extension.
	 */
	constructor(type, extension) {
		if (type) {
			this.type = type;
			this.constructor.knownTypes[type] = this;
		}
		this.extension = extension;
	}

	/**
	 * Whatever this tag type is unknown.
	 * @type {boolean}
	 */
	get isKnown() {
		return !(this instanceof UnknownImageType);
	}
}

/**
 * Class representing unknown image type.
 * @class
 * @extends ImageType
 */
class UnknownImageType extends ImageType {
	/**
	 * Create unknown image type.
	 * @param {string} type      Unknown image type name.
	 * @param {string} extension Unknown image type extension.
	 */
	constructor(type, extension) {
		super(null, extension);
		this.type = type;
	}
}

/**
 * Class representing image.
 * @class
 */
class Image {
	/**
	 * Image types.
	 * @type {ImageTypes}
	 * @static
	 */
	static types = {
		JPEG: new ImageType('jpeg', 'jpg'),
		PNG : new ImageType('png', 'png'),

		/**
		 * Known image types.
		 * @type {ImageType}
		 */
		known: ImageType.knownTypes,

		/**
		 * Get image type class instance by name.
		 * @param {string} type Image type.
		 * @returns {ImageType|UnknownImageType} Image type class instance.
		 */
		get(type) {
			let known;
			if ('string' === typeof type) {
				type = type.toLowerCase();
				switch (type) {
					case 'j':
					case 'jpg':
					case 'jpeg':
						type = 'jpeg';
						break;
					case 'p':
					case 'png':
						type = 'png';
						break;
				}
			}
			return ((known = this.known[type])) ? known : new UnknownImageType(type);
		},
	};

	/**
	 * Parse pure image object from API into class instance.
	 * @param {APIImage} image  Image object
	 * @param {number}   [id=0] Image id (a.k.a. page number).
	 * @returns {Image} Image instance.
	 * @static
	 */
	static parse(image, id = 0) {
		let {
			t: type,
			w: width,
			h: height,
		} = image;

		return new this({
			type,
			width : +width,
			height: +height,
			id,
		});
	}

	/**
	 * Image ID.
	 * @type {number}
	 */
	id = 0;

	/**
	 * Image width.
	 * @type {number}
	 */
	width = 0;

	/**
	 * Image height.
	 * @type {number}
	 */
	height = 0;

	/**
	 * Image type.
	 * @type {ImageType}
	 */
	type = this.constructor.types.JPEG;

	/**
	 * Image parent book.
	 * @type {Book}
	 */
	book = Book.Unknown;

	/**
	 * Create image.
	 * @param {object}           [params]                      Image parameters.
	 * @param {number}           [params.id=0]                 Image ID.
	 * @param {number}           [params.width=0]              Image width.
	 * @param {number}           [params.height=0]             Image height.
	 * @param {string|ImageType} [params.type=ImageTypes.JPEG] Image type.
	 * @param {Book}             [params.book=Book.Unknown]    Image's Book.
	 */
	constructor({
		id     = 0,
		width  = 0,
		height = 0,
		type   = this.constructor.types.JPEG,
		book   = Book.Unknown,
	} = {}) {
		Object.assign(this, {
			id: 'number' === typeof id
				? id < 1 ? 0 : id
				: 0,
			width,
			height,
			type: type instanceof ImageType
				? type
				: this.constructor.types.get(type),
			book: book instanceof Book
				? book
				: Book.Unknown,
		});
	}

	/**
	 * Whatever this image is book cover.
	 * @type {boolean}
	 */
	get isCover() {
		return this.id < 1;
	}

	/**
	 * Image filename.
	 * @type {string}
	 */
	get filename() {
		return `${this.isCover ? 'cover' : this.id}.${this.type.extension}`;
	}
}

export default Image;
