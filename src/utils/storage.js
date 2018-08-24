import Cookies from 'js-cookie'

const TOKEN = 'TOKEN'

const userToken = {
  save (token, expires) {
    Cookies.set(TOKEN, token, { expires })
  },
  get () {
    return Cookies.get(TOKEN)
  },
  remove () {
    Cookies.remove(TOKEN)
  }
}

export { userToken }
