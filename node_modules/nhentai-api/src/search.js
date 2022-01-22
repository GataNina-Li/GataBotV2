/**
 * @module Search
 */

import Book from './book';

/**
 * Search object from API.
 * @global
 * @typedef {object} APISearch
 * @property {APIBook[]}     result    Search results.
 * @property {number|string} num_pages Number of search pages available.
 * @property {number|string} per_page  Number of books per page.
 */

class Search {
	/**
	 * Parse search object into class instance.
	 * @param {APISearch} search Search object.
	 */
	static parse(search) {
		return new this({
			pages: search.num_pages
				? +search.num_pages
				: 1,
			perPage: search.per_page
				? +search.per_page
				: search.result.length,
			books: search.result.map(Book.parse.bind(Book)),
		});
	}

	/**
	 * Page ID.
	 * @type {number}
	 */
	page = 1;

	/**
	 * Books per page.
	 * @type {number}
	 */
	perPage = 0;

	/**
	 * Books array.
	 * @type {Book[]}
	 */
	books = [];

	/**
	 * Pages count.
	 * @type {number}
	 */
	pages = 1;

	/**
	 * Create search.
	 * @param {object} [params]           Search parameters.
	 * @param {number} [params.page=1]    Search page ID.
	 * @param {number} [params.pages=1]   Search pages count.
	 * @param {number} [params.perPage=0] Search books per page.
	 * @param {Book[]} [params.books=[]]  Books array.
	 */
	constructor({
		page    = 1,
		pages   = 1,
		perPage = 0,
		books   = [],
	}) {
		if (Array.isArray(books))
			books.forEach(this.pushBook.bind(this));

		Object.assign(this, {
			page,
			pages,
			perPage,
		});
	}

	/**
	 * Push book to books array.
	 * @private
	 * @param {Book} book Book.
	 * @returns {boolean} Whatever was book added or not.
	 */
	pushBook(book) {
		if (book instanceof Book) {
			this.books.push(book);
			return true;
		}
		return false;
	}
}

export default Search;
