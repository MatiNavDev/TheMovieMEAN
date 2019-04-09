const request = require('supertest');
const expect = require('expect');
const _ = require('lodash');
const path = require('path');

const s3Service = require('../../services/s3/index');
const { refreshDB } = require('../../db/testDB-setter');
const { app } = require('../../index');
const User = require('../../model/user');
const tokenSrvc = require('../../services/token/token');
const { checkIfError, assertNoAuthenticated } = require('../assertion');

const invalidToken =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOiI1YmQzOGEyY2M1ZmU2NzNiMWE0ZDkyMDEiLCJ1c2VybmFtZSI6InVzZXJUd28iLCJpYXQiOjE1NDA2ODQ4NzMsImV4cCI6MTU0MDY4ODQ3M30.7fe4dBigiP1hl8W31jsH8Z31eyefbUZkyWRBoI8pl3E';

/**
 * Limpia todas las imagenes almacenadas en el s3 bucket y Refresca la base de datos
 * @param {*} params
 */
function cleanImagesAndBD() {
  beforeEach(done => {
    Promise.all([s3Service.imageDelete(), refreshDB()])
      .then(() => done())
      .catch(e => done(e));
  });
}

describe('IMAGE-UPLOAD TEST: /api/v1/image-upload', () => {
  cleanImagesAndBD();

  it('should update correctly an image', done => {
    const imagePath = path.join(__dirname, '..', '..', '/assets/test/Image.jpg');

    User.findOne()
      .then(user => {
        const token = tokenSrvc.makeToken(user);

        request(app)
          .post('/api/v1/image-upload')
          .set('Authorization', `Bearer ${token}`)
          .attach('image', imagePath)
          .expect(200)
          .expect(res => {
            const { user: userReceived } = res.body.result;
            expect(userReceived).toBeTruthy();
            expect(_.isString(userReceived.image)).toBeTruthy();
          })
          .end(err => checkIfError(err, done));
      })
      .catch(e => done(e));
  }).timeout(10000);

  it('should reject with not authorized error', done => {
    assertNoAuthenticated('/api/v1/image-upload', invalidToken, done, 'post');
  });
});
