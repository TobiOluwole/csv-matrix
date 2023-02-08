const chai = require('chai')
const expect = chai.expect;
const app = ('../index') //.js
const request = require('supertest')

describe('Matrix Testing', ()=>{
  it('test the api is alive', () =>{
    return request(app)
      .post('/api/create-matrix')
      .then((res) => {
        expect(res.status).to.equal(200)
      })
  })
})