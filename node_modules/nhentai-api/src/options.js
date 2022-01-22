import { Agent, } from 'http';
import { Agent as SSLAgent, } from 'https';

/**
 * Agent-like object or Agent class or it's instance.
 * @global
 * @typedef {object|Agent|SSLAgent} httpAgent
 */

/**
 * Common nHentai API hosts object.
 * @global
 * @typedef {object} nHentaiHosts
 * @property {?string} api    Main API host.
 * @property {?string} images Media API host.
 * @property {?string} thumbs Media thumbnails API host.
 */

/**
 * Common nHentai options object.
 * @global
 * @typedef {object} nHentaiOptions
 * @property {?nHentaiHosts} hosts Hosts.
 * @property {?boolean}      ssl   Prefer HTTPS over HTTP.
 * @property {?httpAgent}    agent HTTP(S) agent.
 */

/**
 * Applies provided options on top of defaults.
 * @param {nHentaiOptions} options Options to apply.
 * @returns {nHentaiOptions} Unified options.
 */
function processOptions({
	hosts: {
		api    = 'nhentai.net',
		images = 'i.nhentai.net',
		thumbs = 't.nhentai.net',
	} = {},
	ssl   = true,
	agent = null,
} = {}) {
	if (!agent)
		agent = ssl
			? SSLAgent
			: Agent;

	if (agent.constructor.name === 'Function')
		agent = new agent();

	return {
		hosts: {
			api,
			images,
			thumbs,
		},
		ssl,
		agent,
	};
}

export default processOptions;
