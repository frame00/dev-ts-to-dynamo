import { DistributionTarget } from 'dev-distribution/src/types'
import * as requestPromise from 'request-promise'

export const getPackages = async (): Promise<
	ReadonlyArray<DistributionTarget>
> =>
	requestPromise({
		uri: 'https://dev-distribution.now.sh/config/packages',
		json: true
	})
