import JWTDecode from 'jwt-decode'
import cookieparser from 'cookieparser'
// import { fireAuth } from '@/plugins/firebase.js'

// export const strict = false

// export const state = () => ({
//   user: null
// })

// export const mutations = {
//   SET_USER(state, payload) {
//     state.user = payload
//   }
// }

export const actions = {
  // signOut({ commit }) {
  //   fireAuth
  //     .signOut()
  //     .then(() => {
  //       commit('setUser', null)
  //     })
  //     .catch(err => alert(err))
  // },
  // setUser({ commit }, user) {
  //   commit('SET_USER', user)
  // },
  // addProfile({ commit }, payload) {},

  // Use cookies
  nuxtServerInit({ commit }, { req }) {
    if (process.server && process.static) return
    if (!req.headers.cookie) return

    const parsed = cookieparser.parse(req.headers.cookie)
    const accessTokenCookie = parsed.access_token

    if (!accessTokenCookie) return

    const decoded = JWTDecode(accessTokenCookie)

    if (decoded) {
      // console.log('Decoded cookie : ', decoded)
      commit('users/SET_USER', {
        uid: decoded.user_id,
        email: decoded.email
      })
    }
  }
}
