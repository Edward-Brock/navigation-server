const log4jsConfig = {
  appenders: {
    console: {
      type: "stdout", // 使用标准输出，会比 console 的性能高
      layout: { type: "messagePassThrough" }
    },
    access: {
      type: "dateFile", // 如果需要区分日期的，这个值可以改为 datefile
      filename: "logs/access.log", // 日志文件名，会命名为：access.当前时间.log
      maxLogSize: 1024 * 1024 * 50, // 日志文件的大小，我这里配置的是 50M
      encoding: "utf-8",
      backups: 100,
      compress: true, // 如果需要压缩，这个值改为 true，是的话，这里会得到 .gz 格式的日志
      alwaysIncludePattern: true,
      pattern: "yyyyMMdd", // 时间格式
      daysToKeep: 60,
      numBackups: 3,
      category: "http",
      keepFileExt: true // 是否保留文件后缀

    },
    app: {
      type: "dateFile",
      filename: "logs/app-out/app.log",
      alwaysIncludePattern: true,
      layout: {
        type: "pattern",
        pattern: "{\"date\":\"%d\",\"level\":\"%p\",\"category\":\"%c\",\"host\":\"%h\",\"pid\":\"%z\",\"data\":'%m'}"

      },
      //日志文件按日期切割
      pattern: "yyyyMMdd",
      daysToKeep: 60,
      numBackups: 3,
      keepFileExt: true
    },
    errorFile: {
      type: "dateFile",
      filename: "logs/errors/error.log",
      maxLogSize: 1024 * 1024 * 50,
      encoding: "utf-8",
      backups: 100,
      alwaysIncludePattern: true,
      layout: {
        type: "pattern",
        pattern: "{\"date\":\"%d\",\"level\":\"%p\",\"category\":\"%c\",\"host\":\"%h\",\"pid\":\"%z\",\"data\":'%m'}"
      },
      // 日志文件按日期切割
      pattern: "yyyyMMdd",
      daysToKeep: 60,
      numBackups: 3,
      keepFileExt: true
    },
    errors: {
      type: "logLevelFilter",
      level: "ERROR",
      appender: "errorFile"
    }
  },
  categories: {
    default: {
      appenders: ["console", "app", "errors"],
      level: "DEBUG"
    },
    info: { appenders: ["console", "app", "errors"], level: "info" },
    access: { appenders: ["console", "app", "errors"], level: "info" },
    http: { appenders: ["access"], level: "DEBUG" }
  },
  pm2: true, // 使用 pm2 来管理项目时打开
  pm2InstanceVar: "INSTANCE_ID" // 会根据 pm2 分配的 id 进行区分，以免各进程在写日志时造成冲突
};
export default log4jsConfig;