import json
import boto3
from botocore.exceptions import ClientError
import os






def power5teamsAPI(request):
    if request.method != 'GET':
        return {"error": "Method Not Allowed"}, 405

    dynamodb = boto3.resource(
        'dynamodb',
        aws_access_key_id=os.environ['AWS_ACCESS_KEY_ID'],
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY'],
        region_name='us-east-2'
    )
    table_name = 'pwr_5_teams'

    conf = request.args.get('conference', default=None, type=str)

    try:
        table = dynamodb.Table(table_name)

        if conf == 'all':
            response = table.scan()
        elif conf == 'conferences':

            response = table.scan(ProjectionExpression="Conference")
            
            included_dict = {}
            unique_values = []
            
            for item in response['Items']:
                item_key = tuple(item.items())
                if item_key not in included_dict:
                    included_dict[item_key] = True
                    unique_values.append(item)

            response['Items'] = unique_values

        else:
            response = table.query(
                KeyConditionExpression=boto3.dynamodb.conditions.Key('Conference').eq(conf)
            )

        data = response['Items']

        return json.dumps(data)

    except ClientError as e:
        return {"error": "An error occurred while accessing DynamoDB"}, 500




