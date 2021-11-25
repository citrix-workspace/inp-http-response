import {expect} from 'chai'
import {accepted, badRequest, created, HttpResponse, noContent, ok, okJson, withHttpResponse} from '../src'

describe('HttpResponse', () => {
    describe('HTTP headers', () => {
        [
            [
                'convert HTTP header to array',
                {'Content-Type': 'application/json'},
                [{
                    name: 'Content-Type',
                    value: 'application/json'
                }]
            ],
            [
                'take HTTP headers as array',
                [{
                    name: 'Content-Type',
                    value: 'application/json'
                }],
                [{name: 'Content-Type', value: 'application/json'}]
            ],
            [
                'no HTTP headers',
                undefined,
                []
            ],
            [
                'empty HTTP headers array',
                [],
                []
            ],
            [
                'empty HTTP headers object',
                {},
                []
            ]
        ]
            .forEach(([name, headers, expected]: any[]) => {
                it(name, () => {
                    const response = new HttpResponse(201, headers, '{"hello": "world"}')
                    expect(response.headers).to.be.deep.equal(expected)
                })
            })
    })
    describe('statusCode', () => {
        it('default value is 200', () => {
            expect(new HttpResponse().statusCode).to.be.equal(200)
        })
        it('positional argument', () => {
            expect(new HttpResponse(222).statusCode).to.be.equal(222)
        })
        it('named argument', () => {
            expect(new HttpResponse({statusCode: 333}).statusCode).to.be.equal(333)
        })
    })
    describe('body', () => {
        it('default value is empty string', () => {
            expect(new HttpResponse().body).to.be.equal('')
        })
        it('positional argument', () => {
            expect(new HttpResponse(200, undefined, 'hello').body).to.be.equal('aGVsbG8=')
        })
        it('named argument', () => {
            expect(new HttpResponse({body: 'world'}).body).to.be.equal('d29ybGQ=')
        })
    })
    describe('Factory methods', () => {

        function test(builder, body = undefined) {
            const fn = withHttpResponse(builder)
            return fn(body)
        }

        it('ok', () => {
            expect(test(ok, 'body')).to.be.deep.equal({
                "body": "Ym9keQ==",
                "headers": [],
                "statusCode": 200,
            })
        })
        it('okJson string', () => {
				  expect(test(okJson, '{"a": true}')).to.be.deep.equal({
					  body: "eyJhIjogdHJ1ZX0=",
					  headers: [{name: 'Content-Type', value: 'application/json'}],
					  statusCode: 200,
				  })
			  })
  			it('okJson object', () => {
			  	expect(test(okJson, {a: true})).to.be.deep.equal({
				  	body: "eyJhIjp0cnVlfQ==",
					  headers: [{name: 'Content-Type', value: 'application/json'}],
					  statusCode: 200,
		  		})
	  		})
		    it('okJson number', () => {
				  expect(test(okJson, 123)).to.be.deep.equal({
					  body: "MTIz",
  					headers: [{name: 'Content-Type', value: 'application/json'}],
	  				statusCode: 200,
				  })
			  })
        it('created', () => {
            expect(test(created, 'body')).to.be.deep.equal({
                "body": "Ym9keQ==",
                "headers": [],
                "statusCode": 201,
            })
        })
        it('noContent', () => {
            expect(test(noContent)).to.be.deep.equal({
                "body": "",
                "headers": [],
                "statusCode": 204,
            })
        })
        it('accepted', () => {
            expect(test(accepted, 'body')).to.be.deep.equal({
                "body": "Ym9keQ==",
                "headers": [],
                "statusCode": 202,
            })
        })
        it('badRequest', () => {
            expect(test(badRequest, 'body')).to.be.deep.equal({
                "body": "Ym9keQ==",
                "headers": [],
                "statusCode": 400,
            })
        })
    })
    describe('test JSON serialization', () => {
        it('HTTP ok with content', () => {
            expect(JSON.stringify(ok('body'))).to.be.equal('{"statusCode":200,"headers":[],"body":"Ym9keQ=="}')
        })
    })
})
