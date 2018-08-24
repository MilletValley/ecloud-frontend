import types from '../../store/type'

const state = {
  breadcrumb: []
}

const mutations = {
  [types.SET_BREADCRUMB] (state, breadcrumb) {
    if (breadcrumb) {
      state.breadcrumb = breadcrumb
    } else {
      state.breadcrumb = []
    }
  }
}

export default {
  state,
  mutations
}
