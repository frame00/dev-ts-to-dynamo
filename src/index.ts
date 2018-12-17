// tslint:disable:no-expression-statement
// tslint:disable:no-if-statement
import { app } from './app'

app()
	.then(res => {
		if (res instanceof Error) {
			throw res
		}
		console.info('succeeded')
		console.log(res)
	})
	.catch(err => {
		console.info('failed')
		console.error(err)
	})
