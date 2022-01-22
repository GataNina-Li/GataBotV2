/**
 * @module API
 */

import processOptions from './options';

import http from 'http';
import https from 'https';

import { version, } from '../package.json';
import Search from './search';
import Book from './book';
import Tag from './tag';
import Image from './image';

/**
 * API arguments
 * @typedef {object} APIArgs
 * @property {string}   host    API host.
 * @property {Function} apiPath API endpoint URL path generator.
 */

/**
 * Class used for building URL paths to nHentai API endpoints.
 * This class is internal and has only static methods.
 * @class
 */
class APIPath {
	/**
	 * Search by query endpoint.
	 * @param {string} query    Search query.
	 * @param {number} [page=1] Page ID.
	 * @returns {string} URL path.
	 */
	static search(query, page = 1) {
		return `/api/galleries/search?query=${query}&page=${page}`;
	}

	/**
	 * Search by tag endpoint.
	 * @param {number} tagID    Tag ID.
	 * @param {number} [page=1] Page ID.
	 * @returns {string} URL path.
	 */
	static searchTagged(tagID, page = 1) {
		return `/api/galleries/tagged?tag_id=${tagID}&page=${page}`;
	}

	/**
	 * Search alike endpoint.
	 * @param {number} bookID Book ID.
	 * @returns {string} URL path.
	 */
	static searchAlike(bookID) {
		return `/api/gallery/${bookID}/related`;
	}

	/**
	 * Book content endpoint.
	 * @param {number} bookID Book ID.
	 * @returns {string} URL path.
	 */
	static book(bookID) {
		return `/api/gallery/${bookID}`;
	}

	/**
	 * Book's cover image endpoint.
	 * @param {number} mediaID   Media ID.
	 * @param {string} extension Image extension.
	 * @returns {string} URL path.
	 */
	static bookCover(mediaID, extension) {
		return `/galleries/${mediaID}/cover.${extension}`;
	}

	/**
	 * Book's page image endpoint.
	 * @param {number} mediaID   Media ID.
	 * @param {number} page      Page ID.
	 * @param {string} extension Image extension.
	 * @returns {string} URL path.
	 */
	static bookPage(mediaID, page, extension) {
		return `/galleries/${mediaID}/${page}.${extension}`;
	}

	/**
	 * Book's page's thumbnail image endpoint.
	 * @param {number} mediaID   Media ID.
	 * @param {number} page      Page ID.
	 * @param {string} extension Image extension.
	 * @returns {string} URL path.
	 */
	static bookThumb(mediaID, page, extension) {
		return `/galleries/${mediaID}/${page}t.${extension}`;
	}
}

/**
 * Class used for interaction with nHentai API.
 * @class
 */
class API {
	/**
	 * API path class
	 * @type {APIPath}
	 * @static
	 * @private
	 */
	static APIPath = APIPath;

	/**
	 * Applies provided options on top of defaults.
	 * @param {nHentaiOptions} options Options to apply.
	 */
	constructor(options = {}) {
		let params = processOptions(options);

		Object.assign(this, params);
	}

	/**
	 * Get http(s) module depending on `options.ssl`.
	 * @type {https|http}
	 */
	get net() {
		return this.ssl
			? https
			: http;
	}

	/**
	 * JSON get request.
	 * @param {object} options      HTTP(S) request options.
	 * @param {string} options.host Host.
	 * @param {string} options.path Path.
	 * @returns {Promise<object>} Parsed JSON.
	 */
	request(options) {
		let {
			net,
			agent,
		} = this;
		return new Promise((resolve, reject) => {
			Object.assign(options, {
				agent,
				headers: {
					'User-Agent': `nhentai-api-client/${version} Node.js/${process.versions.node}`,
				},
			});

			net.get(options, response => {
				const
					{ statusCode, } = response,
					contentType = response.headers['content-type'];

				let error;
				if (statusCode !== 200)
					error = new Error(`Request failed with status code ${statusCode}`);
				else if (!(/^application\/json/).test(contentType))
					error = new Error(`Invalid content-type - expected application/json but received ${contentType}`);

				if (error) {
					response.resume();
					reject(error);
					return;
				}

				response.setEncoding('utf8');
				let rawData = '';
				response.on('data', (chunk) => rawData += chunk);
				response.on('end', () => {
					try {
						resolve(JSON.parse(rawData));
					} catch (error) {
						reject(error);
					}
				});
			}).on('error', error => reject(error));
		});
	}

	/**
	 * Get API arguments.
	 * This is internal method.
	 * @param {string} hostType Host type.
	 * @param {string} api      Endpoint type.
	 * @returns {APIArgs} API arguments.
	 * @private
	 */
	getAPIArgs(hostType, api) {
		let {
			hosts: {
				[hostType]: host,
			},
			constructor: {
				APIPath: {
					[api]: apiPath,
				},
			},
		} = this;

		return {
			host,
			apiPath,
		};
	}

	/**
	 * Search by query.
	 * @param {string} query    Query.
	 * @param {number} [page=1] Page ID.
	 * @returns {Promise<Search>} Search instance.
	 * @async
	 */
	async search(query, page = 1) {
		let { host, apiPath, } = this.getAPIArgs('api', 'search'),
			search = Search.parse(
				await this.request({
					host,
					path: apiPath(query, page),
				})
			);

		search.page = page;

		return search;
	}

	/**
	 * Search related books.
	 * @param {number|Book} book Book instance or Book ID.
	 * @returns {Promise<Search>} Search instance.
	 * @async
	 */
	async searchAlike(book) {
		let { host, apiPath, } = this.getAPIArgs('api', 'searchAlike');

		return Search.parse(
			await this.request({
				host,
				path: apiPath(
					book instanceof Book
						? book.id
						: +book
				),
			})
		);
	}

	/**
	 * Search by tag id.
	 * @param {number|Tag} tag      Tag or Tag ID.
	 * @param {number}     [page=1] Page ID.
	 * @returns {Promise<Search>} Search instance.
	 * @async
	 */
	async searchTagged(tag, page = 1) {
		let { host, apiPath, } = this.getAPIArgs('api', 'searchTagged'),
			search = Search.parse(
				await this.request({
					host,
					path: apiPath(
						tag instanceof Tag
							? tag.id
							: +tag,
						page
					),
				})
			);

		search.page = page;

		return search;
	}

	/**
	 * Get book by id.
	 * @param {number} bookID Book ID.
	 * @returns {Promise<Book>} Book instance.
	 * @async
	 */
	async getBook(bookID) {
		let { host, apiPath, } = this.getAPIArgs('api', 'book');

		return Book.parse(
			await this.request({
				host,
				path: apiPath(bookID),
			})
		);
	}

	/**
	 * Get image URL.
	 * @param {Image} image Image.
	 * @returns {string} Image URL.
	 */
	getImageURL(image) {
		if (image instanceof Image) {
			let { host, apiPath, } = image.isCover
				? this.getAPIArgs('thumbs', 'bookCover')
				: this.getAPIArgs('images', 'bookPage');

			return `http${this.ssl ? 's' : ''}://${host}` + (image.isCover
				? apiPath(image.book.media, image.type.extension)
				: apiPath(image.book.media, image.id, image.type.extension));
		}
		throw new Error('image must be Image instance.');
	}

	/**
	 * Get image thumbnail URL.
	 * @param {Image} image Image.
	 * @returns {string} Image thumbnail URL.
	 */
	getThumbURL(image) {
		if (image instanceof Image && !image.isCover) {
			let { host, apiPath, } = this.getAPIArgs('thumbs', 'bookThumb');

			return `http${this.ssl ? 's' : ''}://${host}`
				+ apiPath(image.book.media, image.id, image.type.extension);
		}
		throw new Error('image must be Image instance and not book cover.');
	}
}

export default API;
