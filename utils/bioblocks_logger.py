from datetime import datetime

logfile_title = datetime.utcnow().strftime('%Y-%m-%d')


def bioblocks_log(msg):
    with open('bioblocks_cron_log_{}.txt'.format(logfile_title), 'a+') as file:
        timestamp = datetime.utcnow()
        full_msg = 'BIOBLOCKS_CRON {} : {}'.format(timestamp.strftime('%Y-%m-%d %H:%M:%S'), msg)
        file.write('{}\n'.format(full_msg))
        print(full_msg)
