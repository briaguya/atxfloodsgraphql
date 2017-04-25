const request = require('request');


module.exports = function(context, cb) {

  // console.log(context);

  const endpoint = 'https://api.graph.cool/simple/v1/cj1xwtydi30li0194txhhmjlz';
  const token = 'Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE0OTMxNTE0OTYsImNsaWVudElkIjoiY2oxbnV3MWx3aWUzcjAxOTlzM29hYWplaSIsInByb2plY3RJZCI6ImNqMXh3dHlkaTMwbGkwMTk0dHhoaG1qbHoiLCJwZXJtYW5lbnRBdXRoVG9rZW5JZCI6ImNqMXh6dWp5cjU2MDUwMTk0eW1oeDA3OTYifQ.S1jI2L8ge6Rk59B3xbjP8DLAta-_y1BAOQLYPm15qAU';

  const postId = context.data.createdNode.id;
  const tripledNumber = context.data.createdNode.number * 3;

  const mutation = `mutation {
      updatePost(id: "${postId}", numberTripled: ${tripledNumber}) {
        id
      }
    }`;

  request.post({
    url: endpoint,
    headers: {
      'Authorization' : token,
      'content-type': 'application/json',
    },
    body: JSON.stringify({query: mutation}),
  }).on('error', (e) => {
    console.log('Error updating post: ' + e.toString())
    cb(e, {})
  }).on('response', (response) => {
    console.log('Response ' + JSON.stringify(response))
    cb(null, 'success')
  });

}