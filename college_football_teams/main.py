from google.cloud import bigquery
import json
import os





def power5teamsAPI(request):

    client = bigquery.Client()

    TABLE_PATH = os.environ.get('TABLE_PATH')

    conf = request.args.get('conference', default=None, type=str).lower()

    if conf == 'all':
        query = f"""
            SELECT * FROM {TABLE_PATH}
        """
    else:
        query = f"""
            SELECT *
            FROM {TABLE_PATH}
            WHERE LOWER(GameID) = @conference
        """

    job_config = bigquery.QueryJobConfig(
        query_parameters=[
            bigquery.ScalarQueryParameter("conference", "STRING", conf)
        ]
    )

    query_job = client.query(query, job_config=job_config)
    results = query_job.result()

    data = [dict(row) for row in results]

    return json.dumps(data)


