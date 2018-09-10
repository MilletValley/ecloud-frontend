import isEqual from 'lodash/isEqual'

const applyModalMixin = {
  data () {
    var validateTime = (rule, value, callback) => {
      if (new Date(value).getTime() <= new Date(this.nowDate).getTime()) {
        callback(new Error('到期时间不能小于当前时间'))
      } else {
        callback()
      }
    }
    return {
      rules: {
        instanceName: [
          { required: true, message: '请输入实例名称', trigger: 'blur' }
        ],
        cpuNumber: [
          { required: true, message: '请输入CPU内核数', trigger: 'blur' },
          { type: 'number', message: 'CPU内核数必须为数字值', trigger: 'blur' }
        ],
        cpuSpeed: [
          { required: true, message: '请输入CPU主频', trigger: 'blur' },
          { type: 'number', message: 'CPU主频必须为数字值', trigger: 'blur' }
        ],
        memory: [
          { required: true, message: '请输入内存大小', trigger: 'blur' },
          { type: 'number', message: '内存必须为数字值', trigger: 'blur' }
        ],
        dueTime: [
          { required: true, message: '请输入到期时间', trigger: 'blur' },
          { validator: validateTime, trigger: 'blur' }
        ]
      },
      dataDisk: {
        id: -1,
        storageName: 'DATADISK',
        storageSize: ''
      },
      templateTypeMapping: {
        0: '系统模板',
        1: '应用模板',
        2: '数据库模板',
        3: '中间件模板'
      },
      addStorage: false,
      activeNames: ['1', '2', '3', '4']
    }
  },
  computed: {
    dialogVisible: {
      get () {
        return this.visible
      },
      set (value) {
        if (!value) {
          this.$emit('update:visible', value)
        }
      }
    },
    // 获取当前时间，yyyy-mm-dd hh-mm-ss
    nowDate () {
      return new Date().toLocaleDateString().replace(/\//g, '-') + ' ' + new Date().toTimeString().substr(0, 8)
    }
  },
  methods: {
    // 关闭前确认
    beforeClose (done) {
      if (isEqual(this.formData, this.originFormData)) {
        done()
      } else {
        this.$confirm('有未保存的修改，是否退出？', {
          type: 'warning',
          confirmButtonText: '确定',
          cancelButtonText: '取消'
        })
          .then(() => {
            done()
          })
          .catch(() => {})
      }
    }
  }
}

export {
  applyModalMixin
}
