git pull origin main
npm run build
sudo cp -r build/* /var/www/html/
sudo systemctl restart nginx
serve -s build