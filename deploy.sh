ssh root@49.235.82.163 "rm -rf /opt/www/html/*"
echo 'deleted /opt/www/html'
scp -r ./lbac/* root@49.235.82.163:/opt/www/html/
echo 'sync complete'
