let User = {
	// 根据用户名或手机号查询
	queryUserName({userName}) {
		return `select * from user where name="${userName}" or phone="${userName}"`
	},
	// 验证用户名和密码
	queryUser({userName,userPwd}) {
		console.log(userName,userPwd)
		return `select * from user where (name="${userName}" or phone="${userName}") and pwd=${userPwd}`
	},
	// 添加用户数据
	addUser({userName,userPwd,phone,nikename,head}) {
		
		const jwt = require('jsonwebtoken')
		const payload = {name: userName} // 加密条件 用户名
		const secret = 'dstenv' // 口令
		const token = jwt.sign(payload,secret)
		
		return `insert into user values(null,"${userName}",${userPwd},${phone},"${nikename}",'../../static/imgs/logo.jpg',"${token}")`
	}
}

exports = module.exports = User