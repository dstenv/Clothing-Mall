var express = require('express');
var router = express.Router();
var cors = require('cors')
var connection = require('../db/sql.js')
const userSql = require('../db/UserSql.js')
const jwt_decode = require('jwt-decode')

// 引入支付宝沙箱配置
const alipaySdk = require('../db/alipay.js')
const AlipayFormData = require('alipay-sdk/lib/form').default

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

let whiteList = [
	"http://localhost:8080",
	"http://192.168.41.24:8080",
	"http://172.17.15.68:8080",
	"http://192.168.41.44:8080",
	"http://192.168.41.64:8080"
]

router.all('*', function(req,res,next) {
	if(whiteList.includes(req.headers.origin)) {
		res.header('Access-Control-Allow-Origin', req.headers.origin);
		//Access-Control-Allow-Headers ,可根据浏览器的F12查看,把对应的粘贴在这里就行
		res.header('Access-Control-Allow-Headers', 'Content-Type');
		// 解决前端传递token跨域问题
		res.setHeader("Access-Control-Allow-Headers","*")
		res.header('Access-Control-Allow-Methods', '*');
		res.header('Content-Type', 'application/json;charset=utf-8');
	}
	next();
})

let QueryDb = function(sql) {
	return new Promise((resolve,reject) => {
		connection.query(sql, function(err,results,fields) {
			if(err){
				reject(err)
			}
			resolve(results)
		})
	})
}

router.get('/api/test', function(req,res,next) {
	connection.query('select * from goods', function(err,results,fields) {
		if(err){
			throw err
		}
		res.send({
			"data": results
		})
	})
})

// 其他分类接口  /api/index_list/分类id/data/分页
router.get('/api/index_list/2/data',async function(req,res,next) {
	console.log(req.query.offset)
	// 通过这个offset做分页
	
	if(req.query.offset == 1) {
		let obj = {
			hotList: [],
			branks: [],
			commodList: []
		}
		obj.hotList = await QueryDb('select * from goods where hot=1')
		obj.branks = await QueryDb('select * from branks')
		for (let i = 0; i < obj.branks.length; i++) {
			obj.branks[i].data = await QueryDb(`select goods.id,imgUrl,name,pprice,oprice,discount,hot from brankGoods,goods where brankId=${obj.branks[i].id} and brankGoods.goodId=goods.id`)
		}
		obj.commodList = await QueryDb('select * from goods')
		res.send({
			"code": 200,
			data: [
				{
					type: "bannerList",
					imgUrl: "../../static/imgs/banner1.jpg"
				},
				{
					type: "iconList",
					data: [
						{imgUrl:"../../static/imgs/icons1.png", name: "运动户外"},
						{imgUrl:"../../static/imgs/icons2.png", name: "运动户外"},
						{imgUrl:"../../static/imgs/icons3.png", name: "运动户外"},
						{imgUrl:"../../static/imgs/icons4.png", name: "运动户外"},
						{imgUrl:"../../static/imgs/icons5.png", name: "运动户外"},
						{imgUrl:"../../static/imgs/icons6.png", name: "运动户外"},
						{imgUrl:"../../static/imgs/icons7.png", name: "运动户外"},
						{imgUrl:"../../static/imgs/icons8.png", name: "运动户外"},
					]
				},
				{
					type: 'hotList',
					data: obj.hotList
				},
				{
					type: "shopList",
					data: obj.branks
				},
				{
					type: "commodityList",
					data: obj.commodList
				}
			]
		})
		
	}else {
		connection.query('select * from goods', function(err,results,fields) {
			if(err){
				throw err
			}
			res.send({
				"code": 200,
				data: [
					{
						type: "commodityList",
						data: results
					}
				]
			})
		})
	}
})

router.get('/api/index_list/3/data', async function(req,res,next) {
	// 通过这个offset做分页
	console.log(req.query.offset)
	
	if(req.query.offset == 1) {
		let obj = {
			hotList: [],
			branks: [],
			commodList: []
		}
		obj.hotList = await QueryDb('select * from goods where hot=1')
		obj.branks = await QueryDb('select * from branks')
		for (let i = 0; i < obj.branks.length; i++) {
			obj.branks[i].data = await QueryDb(`select goods.id,imgUrl,name,pprice,oprice,discount,hot from brankGoods,goods where brankId=${obj.branks[i].id} and brankGoods.goodId=goods.id`)
		}
		obj.commodList = await QueryDb('select * from goods')
		res.send({
			"code": 200,
			data: [
				{
					type: "bannerList",
					imgUrl: "../../static/imgs/banner1.jpg"
				},
				{
					type: "iconList",
					data: [
						{imgUrl:"../../static/imgs/icons1.png", name: "服饰内衣"},
						{imgUrl:"../../static/imgs/icons2.png", name: "服饰内衣"},
						{imgUrl:"../../static/imgs/icons3.png", name: "服饰内衣"},
						{imgUrl:"../../static/imgs/icons4.png", name: "服饰内衣"},
						{imgUrl:"../../static/imgs/icons5.png", name: "服饰内衣"},
						{imgUrl:"../../static/imgs/icons6.png", name: "服饰内衣"},
						{imgUrl:"../../static/imgs/icons7.png", name: "服饰内衣"},
						{imgUrl:"../../static/imgs/icons8.png", name: "服饰内衣"},
					]
				},
				{
					type: 'hotList',
					data: obj.hotList
				},
				{
					type: "shopList",
					data: obj.branks
				},
				{
					type: "commodityList",
					data: obj.commodList
				}
			]
		})
		
	}else {
		connection.query('select * from goods', function(err,results,fields) {
			if(err){
				throw err
			}
			res.send({
				"code": 200,
				data: [
					{
						type: "commodityList",
						data: results
					}
				]
			})
		})
	}
})


// 首页接口
router.get('/api/index_list/data',function(req,res,next) {
	console.log(req.headers.origin,'首页')
	
	let commocData = []
	connection.query('select * from goods', function(err,results,fields) {
		if(err){
			throw err
		}
		commocData = results
		res.send({
			"code": 200,
			"data": {
				topBar: [
					{id:1, name:"推荐"},
					{id:2, name:"运动户外"},
					{id:3, name:"服饰内衣"},
					{id:4, name:"鞋靴箱包"},
					{id:5, name:"美妆个护"},
					{id:6, name:"家居数码"},
					{id:7, name:"食品母婴"}
				],
				data: [
					{
						type: "swiperList",
						data: [
							{imgUrl: "../../static/imgs/swiper1.jpg"},
							{imgUrl: "../../static/imgs/swiper2.jpg"},
							{imgUrl: "../../static/imgs/swiper3.jpg"}
						]
					},
					{
						type: "recommendList",
						data: [
							{
								bigUrl: "../../static/imgs/Children.jpg",
								data: [
									{imgUrl: "../../static/imgs/Children1.jpg"},
									{imgUrl: "../../static/imgs/Children2.jpg"},
									{imgUrl: "../../static/imgs/Children3.jpg"}
								]
							},
							{
								bigUrl: "../../static/imgs/Furnishing.jpg",
								data: [
									{imgUrl: "../../static/imgs/Furnishing1.jpg"},
									{imgUrl: "../../static/imgs/Furnishing2.jpg"},
									{imgUrl: "../../static/imgs/Furnishing3.jpg"}
								]
							},
						]
					},
					{
						type: "commodityList",
						data: commocData
					}
				]
			}
		})
	})
	
})

// 首页触底接口
router.get('/api/index_list/1/data',async function(req,res,next) {
	
	/*  根据offset做分页
		let offset = req.query.offset
	*/
	connection.query('select * from goods', function(err,results,fields) {
		if(err){
			throw err
		}
		res.send({
			"code": 200,
			data: [
				{
					type: "commodityList",
					data: results
				}
			]
		})
	})
})


// 热门搜索接口
router.get('/api/search/hot', function(req,res,next) {
	
	connection.query('select * from hotKey', function(err,result,fields) {
		res.send({
			"code": 200,
			data: {
				type: "hotSearchList",
				data: result
			}
		})
	})
})


// 搜索接口 传递参数keyword：string, type(排序类型,pprice或者discount): string, orderType(排序方式): string
router.get('/api/goods/search', async function(req,res,next) {
	
	let keyword = req.query.keyword
	let type = req.query.type
	let orderType = req.query.orderType
	let searchRes = await QueryDb('select * from goods where name like "%' + keyword +  '%" order by ' + type + ' ' + orderType)
	// console.log(searchRes)
	res.send({
		"code": 200,
		data: searchRes
	})
})


// 分类列表接口
router.get('/api/goods/types', function(req,res,next) {
	
	connection.query('select * from goodsType', function(err,result,fields) {
		res.send({
			"code": 200,
			data: {
				type: "goodsType",
				data: result
			}
		})
	})
})

// 根据分类列表获取商品数据
router.get('/api/goods/goodByType', async function(req,res,next) {
	
	let typeid = req.query.typeid
	let result = await QueryDb(`select * from goodsByType where typeid=${typeid}`)
	let labels = [...new Set(result.map(res => res.label))]
	let resArr = labels.map(label => ({
		type: label,
		data: result.filter(res => res.label == label)
	}))
	console.log(resArr)
	res.send({
		code: 200,
		data: resArr
	})
})


// 商品详情
router.get('/api/good/detail', async function(req,res,next) {
	let goodid = req.query.goodid
	let detail = await QueryDb(`select * from goods where id=${goodid}`)
	let brank = await QueryDb(`select branks.id,branks.name,branks.logo from brankgoods,branks where goodId=${goodid} and branks.id=brankgoods.brankID`)
	let length = await QueryDb(`select * from brankgoods where brankId=${brank[0].id}`)
	length = length.length
	res.send({
		code: 200,
		data: {
			good: detail[0],
			brank: {
				...brank[0],
				length
			}
		}
	})
})

router.get('/api/brank/detail', async function(req,res,next) {
	
	let id = req.query.id
	let brank = await QueryDb(`select * from branks where id=${id}`)
	let goods = await QueryDb(`select goods.* from brankgoods,goods where brankId=${id} and brankgoods.goodId=goods.id`)
	// console.log(brank,goods)
	res.send({
		code: 200,
		data: {
			brank: brank[0],
			goods,
		}
	})
})


// 查找购物车的商品
async function findCartsGood (uid) {
	let carts = await QueryDb(`select * from cart where userId=${uid}`)
	let result = []
	for (let i = 0; i < carts.length; i++){
		let g = await QueryDb('select goods.imgUrl,goods.name,goods.pprice from cart,goods where cart.goodid=goods.id and goods.id=' + carts[i].goodid)
		let o = {
			id: carts[i].id,
			gid: carts[i].goodid,
			checked: false,
			name: g[0].name,
			label: '颜色:' + carts[i].color,
			imgUrl: g[0].imgUrl,
			pprice: g[0].pprice,
			count: carts[i].count
		}
		result.push(o)
	}
	console.log(result)
	return result
}
 
// 获取购物车商品  需要使用token验证
router.get('/api/cart/find', async function(req,res,next) {
	const { uid } = req.query
	let result = await findCartsGood(uid)
	res.send({
		code: 200,
		data: result
	})
})

// 添加商品到购物车 需要使用token验证
router.post('/api/cart/add', async function(req,res,next) {
	const { token } = req.headers
	const { uid,color,count,id,price } = req.body
	// 按照用户id去添加,传过来的userid
	console.log(`insert into cart values(null,${uid},${id},${count},${price},"` + color + '")')
	connection.query(`insert into cart values(null,${uid},${id},${count},${price},"` + color + '")', function(err,results,fields) {
		console.log(results)
	})
	res.send({
		code: 200,
		data: 'success'
	})
})

// 从购物车删除商品
router.post('/api/cart/delete', async function(req,res,next) {
	const { uid,deleteArr } = req.body
	console.log(deleteArr)
	let deleteList = deleteArr.split(',')
	console.log(uid,deleteList)
	deleteList.forEach( async (d)=> {
		await QueryDb(`delete from cart where id=${d}`)
	})
	let result = await findCartsGood(uid)
	res.send({
		code: 200,
		data: result
	})
})

// 修改购物车多项的数量
router.post('/api/cart/update/count', async function(req,res,next) {
	let { uid,updateArr } = req.body
	updateArr = JSON.parse(updateArr)
	updateArr.forEach(async (v) => {
		console.log(`update cart set count=${v.count} where id=${v.id}`)
		await QueryDb(`update cart set count=${v.count} where id=${v.id}`)
	})
	// let result = await findCartsGood(uid)
	// res.send({
	// 	code: 200,
	// 	data: result
	// })
	res.send({
		code: 200,
		data: 'success'
	})
})

// 根据用户id获取地址
router.get('/api/address/find', function(req,res,next) {
	const { uid } = req.query
	QueryDb(`select * from useraddress where uid=${uid}`)
	.then(result => {
		res.send({
			code: 200,
			data: result
		})
	})
})

// 根据用户id获取默认地址,如果没有则获取第一个地址
router.get('/api/address/default', async function(req,res,next) {
	const { uid } = req.query
	const userPath = await QueryDb(`select * from useraddress where uid=${uid}`)
	const defaultPath = userPath.filter(u => u.isdefault == 1)
	if(defaultPath.length > 0) {
		res.send({
			code: 200,
			data: defaultPath[0]
		})
	}else {
		res.send({
			code: 200,
			data: userPath[0]
		})
	}
})

// 添加地址
router.post('/api/address/add', async function(req,res,next) {
	let { uid,recieveName,phone,isdefault,address,detailPath } = req.body
	// console.log(uid,recieveName,phone,isdefault,address)
	// console.log(isdefault, typeof isdefault)
	isdefault = parseInt(isdefault)
	if(isdefault == 1) {
		await QueryDb('update useraddress set isdefault=0 where isdefault=1')
	}
	// console.log(`null,${uid},"` + recieveName + `",${phone},${isdefault},"` + address + '"')
	QueryDb(`insert into useraddress values(null,${uid},"` + recieveName + `",${phone},${isdefault},"` + address + '","' + detailPath + '")')
	.then(() => {
		res.send({
			code: 200,
			data: 'success'
		})
	})
})

// 根据地址id查询地址
router.get('/api/address/find/one', function(req,res,next) {
	const { id } = req.query
	QueryDb('select * from useraddress where id=' + id).then(result => {
		// console.log(result)
		res.send({
			code: 200,
			data: result[0]
		})
	})
})

// 根据地址id修改某一项地址的数据
router.post('/api/address/update/one', async function(req,res,next) {
	let { id,recieveName,phone,isdefault,address,detailPath } = req.body
	// console.log(id,recieveName,phone,isdefault,address)
	// console.log('update useraddress set recievename="' + recieveName + '",phone=' + phone + ',isdefault=' + isdefault + ',address="' + address + '" where id=' + id)
	isdefault = parseInt(isdefault)
	if(isdefault == 1) {
		await QueryDb('update useraddress set isdefault=0 where isdefault=1')
	}
	QueryDb('update useraddress set recievename="' + recieveName + '",phone=' + phone + ',isdefault=' + isdefault + ',address="' + address + '",detailaddress="' + detailPath + '" where id=' + id)
	.then(() => {
		res.send({
			code: 200,
			data: 'success'
		})
	})
})

// 删除地址的某一项
router.get('/api/address/delete/one', function(req,res,next) {
	const { id } = req.query
	QueryDb('delete from useraddress where id=' + id).then(() => {
		res.send({
			code: 200,
			data: 'success'
		})
	})
})


// 用户登录
router.post('/api/login', async function(req,res,next) {
	// let { username,userpwd } = req.body
	const findUserName = await QueryDb(userSql.queryUserName(req.body))
	if(findUserName.length > 0) {
		const findUser = await QueryDb(userSql.queryUser(req.body))
		if(findUser.length > 0) {
			res.send({
				code: 200,
				data: {
					success: 'success',
					msg: '登录成功',
					data: findUser[0]
				}
			})
		}else {
			res.send({
				code: 402,
				data: {
					success: 'fail',
					msg: '密码错误'
				}
			})
		}
	}else {
		res.send({
			code: 401,
			data: {
				success: 'fail',
				msg: '用户名或手机号不存在'
			}
		})
	}
})

// 验证手机号是否存在 传递参数userName: 手机号
router.post('/api/register/phone', async function(req,res,next) {
	const findUserName = await QueryDb(userSql.queryUserName(req.body))
	if(findUserName.length > 0) {
		res.send({
			code: 410,
			data: {
				success: 'fail',
				msg: '手机号已存在'
			}
		})
	}else {
		res.send({
			code: 200,
			data: {
				success:'success',
				msg: '可以注册'
			}
		})
	}
})

// 发送验证码
let code
router.post('/api/register/code', function(req,res,next) {
	const { phone } = req.body
	// 随机返回一个短信
	code = Math.floor(Math.random() * (9999-1000) + 1000)
	res.send({
		code: 200,
		data: {
			code
		}
	})
})

// 验证验证码
router.post('/api/code/validate', function(req,res,next) {
	if(code == req.body.code) {
		res.send({
			code: 200,
			data: 'success'
		})
	}else {
		res.send({
			code: 404,
			data: 'fail'
		})
	}
})

// 添加用户信息
router.post('/api/register/user',async function(req,res,next) {
	QueryDb(userSql.addUser(req.body)).then(() => {
		// 查找新添加的用户并返回
		QueryDb(userSql.queryUserName({userName: req.body.phone}))
		.then(result => {
			const findUser = result
			// console.log(findUser)
			res.send({
				code: 200,
				data: findUser[0]
			})
		})
	})
})



// 生成订单
router.post('/api/order/create', async function(req,res,next) {
	let token = jwt_decode(req.headers.token)
	// console.log(token)
	// 订单号
	const orderId = +new Date() + Math.round(Math.random() * 10000)
	const goodList = JSON.parse(req.body.goodList)
	
	const user = await QueryDb(`select * from user where name="${token.name}"`)
	
	let goodsName = []
	let goodsid = []
	let goodLabel = []
	let goodsPrice = 0
	let goodsNum = []
	goodList.forEach(g => {
		goodLabel.push(g.label)
		goodsid.push(g.gid)
		goodsName.push(g.name)
		goodsNum.push(g.count)
		goodsPrice += parseInt(g.count) * g.pprice
	})
	
	QueryDb(`insert into db_order values(null,${user[0].id},${orderId},"${goodsName.join(',')}",${goodsPrice},"${goodsNum.join(',')}",'1',null,"${goodsid.join(',')}","${goodLabel.join(',')}")`)
	.then(() => {
		QueryDb(`select * from db_order where uid=${user[0].id} and order_id=${orderId}`)
		.then(result => {
			res.send({
				code: 200,
				data: result[0]
			})
		})
	})
	
})

/*
	修改订单状态 移出该用户购物车中相应的商品 添加地址id
	1(订单生成) 2(待支付) 3(支付成功,待发货) 4(待收货) 5(待评价)
*/
router.post('/api/order/update', async function(req,res,next) {
	const { orderId,addressId } = req.body
	let token = jwt_decode(req.headers.token)
	const goodIds = JSON.parse(req.body.goodIds)
	const user = await QueryDb(`select * from user where name="${token.name}"`)
	
	// 修改订单状态
	const updateOrder = await QueryDb(`update db_order set order_status=2,addressid=${addressId} where uid=${user[0].id} and order_id=${orderId}`)
	
	// 移除该用户购物车对应的商品
	goodIds.forEach(id => {
		QueryDb(`delete from cart where id=${id}`).then(() => {
		})
	})
	
	res.send({
		code: 200,
		data: 'success'
	})
})

// 沙箱支付 支付宝
router.post('/api/pay/alipay', async function(req,res,next) {
	let { oid,price,nameList } = req.body
	nameList = JSON.parse(nameList)
	
	const formData = new AlipayFormData();
	// 调用get方法
	formData.setMethod('get')
	
	formData.addField('bizContent', {
	  outTradeNo: oid, // 订单号
	  productCode: 'FAST_INSTANT_TRADE_PAY', // 写死
	  totalAmount: price, // 金额
	  subject:nameList.join(',') // 商品名称
	});
	
	// 支付成功或者失败打开的页面 地址需要根据ip改变而更改
	formData.addField('returnUrl', 'http://192.168.41.64:8080/#/pages/pay-success/pay-success?status=1&oid=' + oid + '');
	
	
	const result = await alipaySdk.exec(
	  'alipay.trade.page.pay',
	  {},
	  { formData: formData },
	);
	
	res.send({
		code: 200,
		data: {
			status: 'success',
			payUrl: result
		}
	})
})

// 沙箱支付 微信
router.post('/api/pay/wxpay', async function(req,res,next) {
	let { oid,price,nameList } = req.body
	nameList = JSON.parse(nameList)
})

// 修改订单支付状态
router.post('/api/order/paystatus', async function(req,res,next) {
	let token = jwt_decode(req.headers.token)
	const user = await QueryDb(`select * from user where name="${token.name}"`)
	const { oid } = req.body
	QueryDb(`update db_order set order_status=3 where uid=${user[0].id} and order_id=${oid}`)
	.then(() => {
		res.send({
			code: 200,
			data: 'success'
		})
	})
})

// 查询用户订单
router.get('/api/order/find', async function(req,res,next) {
	let token = jwt_decode(req.headers.token)
	const user = await QueryDb(`select * from user where name="${token.name}"`)
	let orderRes = await QueryDb(`select * from db_order where uid=${user[0].id}`)
	for (let i = 0; i < orderRes.length; i++) {
		orderRes[i].goods_id = orderRes[i].goods_id.split(',')
		orderRes[i].goodList = []
		for (let j = 0; j < orderRes[i].goods_id.length; j++) {
			let good = await QueryDb(`select * from goods where id=${orderRes[i].goods_id[j]}`)
			// console.log(orderRes[i].color.split(','),orderRes[i].color.split(',')[j])
			good[0].label = orderRes[i].color.split(',')[j]
			good[0].count = orderRes[i].goods_num.split(',')[j]
			orderRes[i].goodList.push(good[0])
			console.log(orderRes[i])
		}
		
	}
	res.send({
		code: 200,
		data: orderRes
	})
})

module.exports = router;
	