import * as abab from 'abab'
import * as lodash from 'lodash'
import * as buffer from 'buffer'

global.library = {
	load: function (name: string) {
		switch (name) {
			default:
				throw new Error(`Unsupported library to load: '${name}'`)
			case 'abab':
				return abab
			case 'lodash':
				return lodash
			case 'buffer':
				return buffer
		}
	}
};
