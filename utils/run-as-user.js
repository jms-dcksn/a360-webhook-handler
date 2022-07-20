const axios = require('axios')

//Return the run as user ID to be used in the bot deployment API

const runAsUser = async (url, token, userName) => {
  url = url + 'v1/devices/runasusers/list'
  try{
  const { data } = await axios(
    {
      method: 'post',
      url: url,
      data: {
        //json body to filter based on user name provided
          'sort':[
              {
                'field':'username',
                'direction':'asc'
              }
          ],
          'filter':{
              'operator': 'eq',
              'field': 'username',
              'value': userName
          },
          'fields':[],
          'page':{
              'length':1,
              'offset':0
          }
        },
      headers : {
        "Content-Type": "application/json",
        "X-Authorization": token
      }
    });
    if(data.message){
      const message = data.message
      return [message, undefined]
    }
    if(data.list.length===0){
      return ["Username not found.", undefined]
    }
    const userId = data.list[0].id
    return [undefined, userId]
  } catch (error) {
      return [error.response.data.message, undefined]
    
  }
}

// const runAsUser = (crURL, token, userName, callback) => {
//     const url = crURL + 'v1/devices/runasusers/list'
//     request({
//         url : url,
//         method :"POST",
//         headers : {
//           "content-type": "application/json",
//           "X-Authorization": token
//         },
//         body: {
//           //json body to filter based on user name provided
//             'sort':[
//               {
//                 'field':'username',
//                 'direction':'asc'
//               }
//             ],
//             'filter':{
//               'operator': 'eq',
//               'field': 'username',
//               'value': userName
//             },
//             'fields':[],
//             'page':{
//               'length':1,
//               'offset':0
//             }
//         },
//         json: true
//       }, (e, r, body)=>{
//         if(e){
//             callback('Connection with control room failed. Please try again.', undefined)
//         } else if (r.body.message){
//             callback(body.message, undefined)
//         } else if (body.list.length===0) {
//           callback('Username not found. Please try again.', undefined)
//         }else{
//             callback(undefined, {
//                 userId: r.body.list[0].id,
//                 device: r.body.list[0].device
//             })
//         }
//     })
// }

module.exports = runAsUser
