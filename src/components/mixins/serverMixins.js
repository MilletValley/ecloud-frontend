const serverMixin = {
  data () {
    return {
      items: [],
      originItems: [],
      currentPage: 1,
      pagesize: 10,
      searchValue: '',
      searchItem: ''
    }
  },
  created () {
    this.fetchData()
  },
  watch: {
    searchValue (newVal, oldVal) {
      if (newVal === '') {
        this.items = this.originItems
        this.currentPage = 1
      }
    }
  },
  methods: {
    searchByName () {
      if (!this.searchItem) {
        this.$message.warning('请选择查询项')
      } else if (!this.searchValue) {
        this.$message.warning('请输入查询条件')
      } else {
        this.currentPage = 1
        this.items = this.originItems.filter((item, index) => {
          if (this.searchItem in item) { // 一层对象 实例名、状态、操作系统
            if (this.searchItem === 'instanceState') { // 如果按状态查找,运行中-0，已停止-1
              const isLoading = '运行中'
              const stoped = '已停止'
              if (isLoading.includes(this.searchValue)) {
                return item.instanceState === 0
              } else if (stoped.includes(this.searchValue)) {
                return item.instanceState === 1
              }
            } else {
              return item[this.searchItem].toLowerCase().includes(this.searchValue.toLowerCase())
            }
          } else { // 两层对象，按内存、CPU查找
            return item.detailInfo[this.searchItem] === Number(this.searchValue)
          }
        })
      }
    },
    handleSizeChange (size) {
      this.pagesize = size
    },
    handleCurrentChange (currentPage) {
      this.currentPage = currentPage
    }
  }
}

export { serverMixin }
