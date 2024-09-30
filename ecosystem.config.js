module.exports = {
  apps : [
    {
      name: "Primarias 2024",
      script: "./primarias2024/build/index.js",
      env: {
        NODE_ENV: "development",
      },
      env_production: {
        NODE_ENV: "production",
        PORT:"3050",
        FTP_USER:"servel",
        FTP_PASS:"Servel2020Copesa",
        FTP_HOST:"18.229.47.184",
        FTP_PATH:"/srv/servel/",
        DATA_PATH:"/home/carlos/programing/copesa/elecciones/",
        NODE_ENV:"develop",
        CORS:"http://localhost,https://interactivo.latercera.com/anapolis-2023/"
      }
    },{
      name:"crontab unzip",
      script: "./primarias2024/build/subscribers/checkFTP.js"
    }
  ]
}