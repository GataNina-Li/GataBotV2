import { Chat } from './Chat';

interface ModInfo {
	type: string,
	modList: {
		modid: string,
		version: string
	}[]
}

interface RawStatusResponse {
	version?: {
		name?: string,
		protocol?: number
	},
	players?: {
		max?: number,
		online?: number,
		sample?: {
			name: string,
			id: string
		}[]
	},
	description?: Chat | string,
	favicon?: string,
	modinfo?: ModInfo
}

export { RawStatusResponse, ModInfo };