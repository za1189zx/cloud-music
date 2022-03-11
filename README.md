# cloudMusicDemo

vue3 + tailwindcss + antD + vant，响应式兼容 640px 及以上

# 前言

该项目基于 [binaryify](https://github.com/Binaryify)/[NeteaseCloudMusicApi](https://github.com/Binaryify/NeteaseCloudMusicApi) 提供的接口开发，作为个人训练项目使用，目前功能暂时有限，仅可从发现页选择歌单、歌曲、专辑进行播放

# 使用说明

先安装 [binaryify](https://github.com/Binaryify) 大佬的接口项目（由于 vercel 部署请求过慢且存在数据丢失的情况，使用的是本地部署的方案）

```git
$ git clone git@github.com:Binaryify/NeteaseCloudMusicApi.git
$ cd NeteaseCloudMusicApi
$ npm i
$ npm run start
```

再安装本项目

```git
$ git clone git@gitee.com:za1189zx/cloud-music.git
$ cd cloud-music
$ npm i
$ npm run serve
```

再打开 http://localhost:8080
