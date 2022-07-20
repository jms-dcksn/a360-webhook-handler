//const request = require('request')
const axios = require('axios')

const auth = async (url, userName, password) => {
  url = url + 'v1/authentication'
  try{
  const { data } = await axios(
    {
      method: 'post',
      url: url,
      data: {
        username: userName,
        password: password
      },
      headers : {
        "Content-Type": "application/json",
      }
    });
    if(data.message){
      const message = data.message
      return [message, undefined]
    }
    const token = data.token
    return [undefined, token]
  } catch (error) {
    return [error.response.data.message, undefined]
  }
}
//Authenticates with the Control Room and returns the JWT

// const auth = (crURL, userName, apiKey, callback) => {
//     const url = crURL + 'v1/authentication'
//     request({
//         url : url,
//         method :"POST",
//         headers : {
//           "content-type": "application/json",
//         },
//         body: {
//           'username':userName,
//           'password':apiKey
//         },
//         json: true
//       }, (e, r, body)=>{
//         if(e){
//             callback('Authorization failed. Please try again. ' + e, undefined)
//         } else if (r.body.message){
//             callback('message: ', body.message, 'error: ', e, undefined)
//         } else{
//             callback(undefined, {
//                 token: r.body.token
//             })
//         }
//     })
// }

module.exports = auth