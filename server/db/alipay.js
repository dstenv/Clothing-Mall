const AlipaySdk = require('alipay-sdk').default
const fs = require('fs')
const path = require('path')

// 普通公钥模式
const alipaySdk = new AlipaySdk({
  // 参考下方 SDK 配置
  appId: '2021000121696076',
  // 签名算法
  signType:'RSA2',
  // 支付宝网关
  gateway: 'https://openapi.alipaydev.com/gateway.do',
  // 支付宝公钥
  alipayPublicKey: "MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAmua4P4UXnHP+vlQbHXwbwtjR/uC9WeQ8Nv1q4phTwILMZZpuxsoYAxwlKDobXy6p1nGLIT1ZayixTW1xhrVC5FEmWKALJU1eQbt4c40Us8X745lzM1JAw18GppTdn4qlhqaUIFbcZ+tKtt9SZdb1wUgy24Om6A7vmAskoF9beo5bnJpNSR+5JAmseBYr38S1N8eYxokj0950UU8555Jn6zbDfV/MPid5/KfohRCD5CNsmwyhDFwBgMZQXQRhlAkTa0IUWt4OKxPnKhw8jqlk4ahckmgTgp8dvpvMMQl7pYMLYzcYyQtkj3xwcCCrD+GlPctFVNK43o5MV6PaFpZPRQIDAQAB",
  // 应用私钥 
  // 重要：苹果电脑在生成密钥可以选择PKCS1格式，windows电脑需要生成后在“格式转换”那里转成PKCS1格式
  privateKey: "MIIEpQIBAAKCAQEAqjTCOTxnpl25QSk6MNLJMqPjH1Gx98TcQBfJEgWNGd6un5Y9uHqcn2QGrMu63OqTeitvwuo/aVGOpUScbosfgvVWLaGA0ZPq+z6db2NCeA3LBm7Vcv5qHv0s8BXsAF6x+TFqTwm7Vowf/NjfwBpsIXNGoHZCMU3BSy4XS2ljJXOmwySYOrLXL1Z+ndzNRWdG0C8okfBCrRdgR4Qv8oXn9nUDIZIVAoo8atU3w6DU/Ugv+GoMEwPqu+0c+4qHlBUeOLjW4Lx41+qILZPjOsDc7Wkf4JCa/wMqbuVY/oTSCcd1qPdwKFU4Ua2yG2UChfQCX7mp2lV9FD6Yr9TABhyivwIDAQABAoIBABephALfAe3gA7wqVhupgi0XGaEmA17VsGT8qYhm2ynoilBHW8dEzHdgOYlWPWEu/1exqDTpye0DWJhjRHgdwUC8iMGJPVZlgPpyxwJQQ1JbYIlBaU02T1yFh/TMp2WZxJZHJ2dbi/7JNj05jUmwoq23z+7I4gTmsWOZQcXLHex7wA4oYBub+bKdS9f8eFFKwVv97cOH1kT3Wqz6bRLidFWE8osYixLarIHPUs0/ggm6ic33/J+83QrYVjQdEt/TcMFWbs8U8e2FAZy+CEVNWzxlq4lyd27fFyeVLYEIap7A4ebr6yFMZaBVHKOPphaglVwl0yAGcMdSUBdD3o9pOMECgYEA6/7t+74Ez/6U59P6dkG3nAW/B4yPDAapRiu7I2QNP9y1X7eUhOSD2NjYcxAtlf4CRKHT+dNn5rONssWKm92B+4KtVeBTL+WUB09JXhPBFkw4unXMgJqQMLuHnCaoHf1QqfpfNojotoJYRGPXmBHW0ZKu/vAfPv7p0Xc9FiTiuh8CgYEAuKIz6Arv6Lc7oikK/TEstm4vOs1Ouw2PWhP/1qfw9zmajB6hJOmhJF1O/mXkKdxjLqy2T589soAzGmZ19dv+CCMA2cbKFPsFokim0kWNUWmAa7xcu/lTQItuAQC3/TX6hz2zyaWBnFeIFwQccaq+3cd5HOJbTyU7ZOsZexbCQ2ECgYEAmioC1P0gr68jHv5/E1mC1E18qTXNDJIdalWO/mORtDI92bVXNCkDaFjfrOrYnK8+VA9TJlRP/4kz+6DIF2HwU5jeGsdcEGHs/Ylx6B8Hd8V7GXNykGBn6S3YPM2T7WNZmnCQWlO9kdw8RRDj+ddNecJUxv2dq81ieQ9nvFuEMQkCgYEAoDx9Sdv8G/6x7WkrVVPRFz6HFMRLmMEK8UU8GuJDmXvPqd2HQs7UAAhO3zA0lTPkjARucKml1P233CiiJU7Yp90hBt+kUBMO76mXxhOAsvAZ+OZPoP+gBfs76/jgtQucsrSVDOLrmnDI9himSuvBnB5a+Ptl/Uk1w77ZrV6yF+ECgYEAoL/fvw9BhI5IrfFFnmRQHZQHkTjtOh2QNcKiWdcAL3euwDJDFbp3EYgdXzSDKabQb354TZW1x/2507W4RYmicJ6eBu9O6QrTuGQhe8fUx0nXFmH/fMY4V2QSFHCPpTXpzP9j4+S4l3fQkvbHxlxcgw4lc5HUJiqc8lFfHvZTmLo="
});

module.exports = alipaySdk