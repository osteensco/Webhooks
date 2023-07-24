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
        aws_secret_access_key=os.environ['AWS_SECRET_ACCESS_KEY']
    )
    table_name = 'pwr_5_teams'

    conf = request.args.get('conference', default=None, type=str).lower()

    try:
        table = dynamodb.Table(table_name)

        if conf == 'all':
            response = table.scan()
        elif conf == 'conferences':
            response = table.scan(ProjectionExpression="Conference")
        else:
            response = table.query(
                KeyConditionExpression=boto3.dynamodb.conditions.Key('Conference').eq(conf)
            )

        data = response['Items']

    except ClientError as e:
        return {"error": "An error occurred while accessing DynamoDB"}, 500

    return json.dumps(data)


