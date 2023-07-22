from google.cloud import bigquery
import json
import os





def power5teamsAPI(request):

    client = bigquery.Client()

    TABLE_PATH = os.environ.get('TABLE_PATH')

    conference = request.args.get('conference', default=None, type=str).lower()

    if conference == 'all':
        query = f"""
            SELECT * FROM {TABLE_PATH}
        """
    else:
        query = f"""
            SELECT *
            FROM {TABLE_PATH}
            WHERE LOWER(GameID) = @conference
        """

    query_job = client.query(query, conference=conference)
    results = query_job.result()

    data = [dict(row) for row in results]

    return json.dumps(data)


