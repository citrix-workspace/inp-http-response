import {encodeContent} from 'inp-commons'

const applicationJsonHeader = {'content-type': 'application/json'}

interface InPHeader {
	name: string,
	value: string,
}

export class HttpResponse {

    private static encode(content) {
        return encodeContent(content)
    }

    private static convertHeaders(inputHeaders): InPHeader[] {
        if (Array.isArray(inputHeaders)) {
            return inputHeaders
        } else {
            return Object.entries(inputHeaders).map(([name, value]) => ({name, value})) as InPHeader[]
        }
    }

	  public statusCode: number
	  public headers: any[]
	  public body: string


    /**
     *
     * @param args statusCode, headers, body or object {statusCode, headers, body}
		 */
		public constructor(...args) {
        let statusCode, headers, body
        if (typeof args[0] === 'object') {
            ({statusCode, headers, body} = args[0])
        } else {
            ([statusCode, headers, body] = args)
        }
        this.statusCode = statusCode || 200
        this.headers = HttpResponse.convertHeaders(headers || {})
        this.body = HttpResponse.encode(body || '')
    }
}

export function ok(body, headers = {}) {
    return new HttpResponse({statusCode: 200, body, headers})
}

export function okJson(body: any): HttpResponse {
	return ok(typeof body === 'string' ? body : JSON.stringify(body), {'Content-Type': 'application/json'})
}

export function created(body, headers = {}) {
    return new HttpResponse({statusCode: 201, body, headers})
}

export function accepted(body, headers = {}) {
    return new HttpResponse({statusCode: 202, body, headers})
}

export function noContent(headers = {}) {
    return new HttpResponse({statusCode: 204, headers})
}

export function badRequest(body) {
    return new HttpResponse({statusCode: 400, body})
}

export function unauthorized(body) {
    return new HttpResponse({statusCode: 401, body})
}

export function internalError(body) {
    return new HttpResponse({statusCode: 500, body})
}

export function apiError(type, detail, parameters, statusCode = 400) {
    return new HttpResponse({statusCode, body: JSON.stringify({type, detail, parameters})})
}

export function processUnauthorizedResponse(response) {
	if (response.status === 401) {
		return response.text()
			// FIXME copy headers? content-type etc?
			.then(unauthorized)
			.then(error => {
				throw error
			})
	} else {
		return response
	}
}

function buildSuccessResponse(result) {
    if (result instanceof HttpResponse) {
        return result
    } else {
        return new HttpResponse({body: result, statusCode: 200})
    }
}

function buildErrorFromCaughtError(error) {
	if (error == null) {
		return {message: 'Caught unexpected error with no context'}
	} else if (typeof error === 'string') {
		return {message: error}
	} else if (error instanceof Error || error.message || error.stack) {
		if (process?.env?.NODE_ENV === 'development' && error.stack) {
			return ({message: error.message, exception: `${error.message}\n${error.stack}`})
		} else {
			return ({message: error.message})
		}
	} else {
		// Handling caught Graal proxy object
		const body = JSON.stringify(error)
		if (body === '{}') {
			return {message: String(error)}
		} else {
			return {message: body}
		}
	}
}

function buildApiErrorFromCaughtError(error) {
	const {message, exception} = buildErrorFromCaughtError(error)
	return {type: 'https://errors-api.cloud.com/integration-script/unexpected-error', detail: message, exception}
}

function handleUnexpectedError(error, statusCode = 500) {
    if (error instanceof HttpResponse) {
        return error
    }
    return new HttpResponse(statusCode, applicationJsonHeader, JSON.stringify(buildApiErrorFromCaughtError(error)))
}

export function withHttpResponse(fn) {
	return (...args) => {
		try {
			const result = fn(...args)
			if (result instanceof HttpResponse) {
				return result
			} else if (result instanceof Promise) {
				return result
					.then(buildSuccessResponse)
					.catch(error => {
						console.error(`Caught unexpected error in withHttpResponse wrapper: ${error instanceof String} ${error instanceof Error} ${error} ${buildApiErrorFromCaughtError(error)}`)
						return handleUnexpectedError(error)
					})
			} else {
				return Promise.resolve(buildSuccessResponse(result))
			}
		} catch (error) {
			console.error(`Caught unexpected error in withHttpResponse wrapper: ${buildApiErrorFromCaughtError(error)}`)
			return Promise.resolve(handleUnexpectedError(error))
		}
	}
}
