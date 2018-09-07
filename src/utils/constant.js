// 申请状态
const ApplyStateMapping = {
  0: '通过',
  1: '拒绝',
  2: '申请中',
  3: '已撤回'
}

// 申请状态对应颜色
const typeMapping = {
  0: 'success',
  1: 'danger',
  2: 'warning',
  3: 'info'
}

// 模板类型
const templateTypeMapping = {
  0: '系统模板',
  1: '应用模板',
  2: '数据库模板',
  3: '中间件模板'
}

export {
  ApplyStateMapping,
  typeMapping,
  templateTypeMapping
}
