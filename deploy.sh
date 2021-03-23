ssh root@49.235.82.163 "rm -rf /opt/wbn/*"
echo 'deleted /opt/wbn'
scp -r ./wbn/* root@49.235.82.163:/opt/wbn/
echo 'sync complete'
