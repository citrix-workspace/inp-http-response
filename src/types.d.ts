export interface LibBuffer {
 Buffer: BufferConstructor
}

interface LibUuid {
	v4: () => string
}

export type LoadLibrary = (name: 'buffer' | 'uuid') => LibBuffer | LibUuid

export interface Library {
	load: LoadLibrary
}

export {}

declare global {
	var library: Library
}
