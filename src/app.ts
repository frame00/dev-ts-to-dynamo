import { DynamoDB } from 'aws-sdk'
import { getPackages } from './lib/get-packages'
import { DistributionTarget } from 'dev-distribution/src/types'
import { chunk } from 'lodash'
import { sync } from 'promise-parallel-throttle'
import { config } from 'dotenv'
const { DocumentClient } = DynamoDB

// tslint:disable-next-line:no-expression-statement
config()
const {
	IAM_DYNAMO_ACCESS_KEY,
	IAM_DYNAMO_SECRET_ACCESS_KEY,
	DYNAMO_REGION,
	DYNAMO_TABLE
} = process.env

const dynamo = new DocumentClient({
	region: DYNAMO_REGION,
	accessKeyId: IAM_DYNAMO_ACCESS_KEY,
	secretAccessKey: IAM_DYNAMO_SECRET_ACCESS_KEY
})
const putRequest = (pkgs: ReadonlyArray<DistributionTarget>) =>
	pkgs.map(pkg => ({
		PutRequest: {
			Item: pkg
		}
	}))

export const app = async () => {
	const pkgs = await getPackages()
	const chunked = chunk(pkgs, 25)
	return DYNAMO_TABLE
		? sync(
				chunked.map(data => () =>
					dynamo
						.batchWrite({
							RequestItems: {
								[DYNAMO_TABLE]: putRequest(data)
							}
						})
						.promise()
				)
		  )
		: new Error('DYNAMO_TABLE is not set')
}
